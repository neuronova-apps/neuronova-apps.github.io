(() => {
  const originalLoadRepository = window.loadRepository;

  const CATHOLIC_PARTS = [
    { url: 'data/c01.csv.gz.b64', type: 'gzip' },
    { url: 'data/c02.csv.gz.b64', type: 'gzip' },
    { url: 'data/c03.csv.gz.b64', type: 'gzip' },
    { url: 'data/c04.csv.gz.b64', type: 'gzip' },
    { url: 'data/c05.csv.gz.b64', type: 'gzip' },
    { url: 'data/c06.csv', type: 'plain' },
    { url: 'data/c07.csv.gz.b64', type: 'gzip' },
    { url: 'data/c08.csv', type: 'plain' },
    { url: 'data/c09.csv', type: 'plain' },
    { url: 'data/c10.csv', type: 'plain' },
    { url: 'data/c11.csv', type: 'plain' }
  ];

  const CATHOLIC_FIX_VERSION = '20260811-15';

  async function fetchTextNoCache(url) {
    const res = await fetch(`${url}?v=${CATHOLIC_FIX_VERSION}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    const text = await res.text();
    if (!text.trim()) throw new Error(`${url}: archivo vacío`);
    return text;
  }

  function decodeBase64Bytes(b64, label) {
    const clean = b64.replace(/\s+/g, '');
    if (!clean) throw new Error(`${label}: base64 vacío`);
    if (clean.length % 4 !== 0) {
      throw new Error(`${label}: base64 incompleto (${clean.length} caracteres)`);
    }

    let binary;
    try {
      binary = atob(clean);
    } catch (e) {
      throw new Error(`${label}: base64 inválido`);
    }

    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  async function gunzipText(bytes, label) {
    if (bytes.length < 2 || bytes[0] !== 0x1f || bytes[1] !== 0x8b) {
      throw new Error(`${label}: cabecera gzip inválida`);
    }

    if (window.pako && typeof window.pako.ungzip === 'function') {
      try {
        return window.pako.ungzip(bytes, { to: 'string' });
      } catch (e) {
        throw new Error(`${label}: gzip no se pudo descomprimir (${e && e.message ? e.message : e})`);
      }
    }

    if (typeof DecompressionStream !== 'undefined') {
      try {
        const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
        return await new Response(stream).text();
      } catch (e) {
        throw new Error(`${label}: gzip no se pudo descomprimir (${e && e.message ? e.message : e})`);
      }
    }

    throw new Error(`${label}: navegador sin soporte gzip`);
  }

  async function readCatholicPart(part, index) {
    setSource(
      'loading',
      `Leyendo Católica: bloque ${index + 1} de ${CATHOLIC_PARTS.length}…`
    );

    const raw = await fetchTextNoCache(part.url);
    let csvText = raw;

    if (part.type === 'gzip') {
      const bytes = decodeBase64Bytes(raw, part.url);
      csvText = await gunzipText(bytes, part.url);
    }

    const rows = parseCSV(csvText);
    validateRows(rows, part.url);
    return rowsToObjects(rows, index === 0);
  }

  async function loadCatholicRepository() {
    const loadButton = document.getElementById('loadLive');
    loadButton.disabled = true;
    setSource('loading', 'Leyendo Católica desde los 11 bloques validados…');

    try {
      headers = [];
      const all = [];

      for (let i = 0; i < CATHOLIC_PARTS.length; i++) {
        const rows = await readCatholicPart(CATHOLIC_PARTS[i], i);
        all.push(...rows);
      }

      if (all.length !== 1100) {
        throw new Error(`Se esperaban 1100 registros y se cargaron ${all.length}`);
      }

      loadData(all);
      setSource(
        'ok',
        `Católica: ${all.length.toLocaleString('es-PE')} preguntas cargadas correctamente desde los 11 bloques del repositorio.`
      );
    } catch (e) {
      const msg = errorText(e);
      console.error('Quiz Bible Catholic load error', e);
      resetUiAfterError();
      setSource('error', `Error: ${msg}`);
    } finally {
      loadButton.disabled = false;
    }
  }

  window.loadRepository = async function loadRepositoryPatched() {
    const tradition = document.getElementById('tradition').value;
    if (tradition === 'catolica') return loadCatholicRepository();
    return originalLoadRepository();
  };

  document.getElementById('loadLive').addEventListener(
    'click',
    event => {
      if (document.getElementById('tradition').value !== 'catolica') return;
      event.preventDefault();
      event.stopImmediatePropagation();
      loadCatholicRepository();
    },
    true
  );
})();