const SPREADSHEET_ID = '1DTr0mw4bfpTSMrHtQYNIUUV4-XjsedSTmqNlZZWmIvE';
const SHEETS = { protestante: 'Banco_protestante', catolica: 'Banco_catolico' };
const LOG_SHEET = 'Registro_revision_humana';

function doGet() {
  return HtmlService.createHtmlOutput('Quiz Bible Review Endpoint: OK');
}

function doPost(e) {
  let result;
  try {
    const raw = e && e.parameter && e.parameter.payload ? e.parameter.payload : (e && e.postData ? e.postData.contents : '');
    const payload = JSON.parse(raw || '{}');
    result = processReview_(payload);
  } catch (err) {
    result = { ok: false, error: err && err.message ? err.message : String(err) };
  }
  return postMessageResponse_(result);
}

function processReview_(p) {
  const expectedSecret = PropertiesService.getScriptProperties().getProperty('REVIEW_SECRET');
  if (!expectedSecret) throw new Error('REVIEW_SECRET no está configurado en Script Properties.');
  if (!p.secret || p.secret !== expectedSecret) throw new Error('Clave de revisión inválida.');
  if (!SHEETS[p.tradition]) throw new Error('Tradición no válida.');
  if (!p.id) throw new Error('ID de pregunta requerido.');
  if (!['approve', 'correction'].includes(p.action)) throw new Error('Acción no válida.');
  if (!p.reviewer || !String(p.reviewer).trim()) throw new Error('Nombre del revisor requerido.');
  if (p.action === 'correction' && !String(p.observation || '').trim()) throw new Error('La observación es obligatoria para corrección.');

  if (p.action === 'approve') {
    const required = ['biblica','respuesta','claridad','dificultad','explicacion','editorial'];
    if (!p.criteria || required.some(k => p.criteria[k] !== true)) throw new Error('Los seis criterios deben estar aprobados.');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEETS[p.tradition]);
    if (!sheet) throw new Error('No se encontró la hoja del banco.');
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
    const map = headerMap_(headers);
    ['ID','Estado_QA','Revision_humana','Activa_app'].forEach(h => { if (!map[h]) throw new Error('Falta la columna ' + h); });

    const idRange = sheet.getRange(2, map.ID, Math.max(sheet.getLastRow() - 1, 1), 1);
    const match = idRange.createTextFinder(String(p.id)).matchEntireCell(true).findNext();
    if (!match) throw new Error('No se encontró ' + p.id + ' en ' + SHEETS[p.tradition]);
    const row = match.getRow();

    const estadoQA = p.action === 'approve' ? 'Verificado' : 'Revisar';
    const revisionHumana = p.action === 'approve' ? 'Si' : 'No';
    sheet.getRange(row, map.Estado_QA).setValue(estadoQA);
    sheet.getRange(row, map.Revision_humana).setValue(revisionHumana);
    sheet.getRange(row, map.Activa_app).setValue('No');

    appendReviewLog_(ss, p, estadoQA, revisionHumana);
    SpreadsheetApp.flush();

    return {
      ok: true,
      id: String(p.id),
      tradition: p.tradition,
      estado_qa: estadoQA,
      revision_humana: revisionHumana,
      activa_app: 'No',
      timestamp: new Date().toISOString()
    };
  } finally {
    lock.releaseLock();
  }
}

function headerMap_(headers) {
  const map = {};
  headers.forEach((h, i) => { if (h) map[String(h).trim()] = i + 1; });
  return map;
}

function appendReviewLog_(ss, p, estadoQA, revisionHumana) {
  let log = ss.getSheetByName(LOG_SHEET);
  if (!log) log = ss.insertSheet(LOG_SHEET);
  const wanted = ['Fecha_hora','Tradicion','ID','Libro','Referencia','Revisor','Resultado','Observacion','Criterios','Estado_QA_resultante','Revision_humana_resultante','Client_timestamp'];
  if (log.getLastRow() === 0 || !log.getRange(1,1).getDisplayValue()) log.getRange(1,1,1,wanted.length).setValues([wanted]);
  const criteria = Object.keys(p.criteria || {}).filter(k => p.criteria[k]).join(', ');
  log.appendRow([
    new Date(), p.tradition, p.id, p.book || '', p.reference || '', String(p.reviewer).trim(),
    p.action === 'approve' ? 'Aprobada' : 'Corrección requerida', p.observation || '', criteria,
    estadoQA, revisionHumana, p.clientTimestamp || ''
  ]);
}

function postMessageResponse_(result) {
  const json = JSON.stringify(result).replace(/</g, '\\u003c');
  const html = '<!doctype html><meta charset="utf-8"><script>parent.postMessage({source:"quizBibleReview",result:' + json + '},"*");<\/script>';
  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}