(() => {
  const originalLoadRepository = window.loadRepository;
  const CATHOLIC_PARTS = [
    'data/c01.csv.gz.b64',
    'data/c02plus.csv.gz.b64'
  ];
  const CATHOLIC_FIX_VERSION = '20260811-14';

  async function fetchBase64Text(url) {
    const res = await fetch(`${url}?v=${CATHOLIC_FIX_VERSION}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    const text = (await res.text()).replace(/\s+/g, '');
    if (!text) throw new Error(`${url}: archivo vacío`);
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

  async function loadCatholicJoined() {
    setSource('loading', 'Leyendo Católica: parte 1 de 2…');
    const first = await fetchBase64Text(CATHOLIC_PARTS[0]);

    setSource('loading', 'Leyendo Católica: parte 2 de 2…');
    const second = await fetchBase64Text(CATHOLIC_PARTS[1]);

    // c01 y c02plus son dos fragmentos del MISMO flujo base64/gzip.
    // No deben descomprimirse por separado: primero se unen y luego se decodifican.
    const joined = first + second;
    const label = 'copia católica unificada';
    const text = await gunzipText(decodeBase64Bytes(joined, label), label);
    const rows = parseCSV(text);

    validateRows(rows, label);
    headers = [];
    return rowsToObjects(rows, true);
  }

  async function loadCatholicRepository() {
    setSource('loading', 'Leyendo Católica desde la copia web estable…');
    const loadButton = document.getElementById('loadLive');
    loadButton.disabled = true;

    try {
      const all = await loadCatholicJoined();

      if (all.length !== 1100) {
        throw new Error(`Se esperaban 1100 registros y se cargaron ${all.length}`);
      }

      loadData(all);
      setSource(
        'ok',
        `Católica: ${all.length.toLocaleString('es-PE')} preguntas cargadas desde la copia web estable.`
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

  // El listener original de "Recargar banco" conserva la referencia a la
  // función anterior. En Católica lo interceptamos en fase de captura para
  // garantizar que use el cargador corregido.
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