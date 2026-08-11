(() => {
  const originalLoadRepository = window.loadRepository;

  async function fetchBase64Text(url) {
    const res = await fetch(`${url}?v=20260811-13`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    const text = (await res.text()).trim();
    if (!text) throw new Error(`${url}: archivo vacío`);
    return text;
  }

  function decodeBase64Bytes(b64, url) {
    const clean = b64.replace(/\s+/g, '');
    let binary;
    try {
      binary = atob(clean);
    } catch (e) {
      throw new Error(`${url}: base64 inválido`);
    }
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  async function gunzipText(bytes, url) {
    if (bytes.length < 2 || bytes[0] !== 0x1f || bytes[1] !== 0x8b) {
      throw new Error(`${url}: cabecera gzip inválida`);
    }

    if (window.pako && typeof window.pako.ungzip === 'function') {
      try {
        return window.pako.ungzip(bytes, { to: 'string' });
      } catch (e) {
        throw new Error(`${url}: gzip no se pudo descomprimir (${e && e.message ? e.message : e})`);
      }
    }

    if (typeof DecompressionStream !== 'undefined') {
      try {
        const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
        return await new Response(stream).text();
      } catch (e) {
        throw new Error(`${url}: gzip no se pudo descomprimir (${e && e.message ? e.message : e})`);
      }
    }

    throw new Error(`${url}: navegador sin soporte gzip`);
  }

  async function loadCatholicPart(url, setHeaders) {
    const b64 = await fetchBase64Text(url);
    const text = await gunzipText(decodeBase64Bytes(b64, url), url);
    const rows = parseCSV(text);
    if (!rows.length || !rows[0].includes('ID')) throw new Error(`${url}: CSV no válido`);
    return rowsToObjects(rows, setHeaders);
  }

  window.loadRepository = async function loadRepositoryPatched() {
    const tradition = document.getElementById('tradition').value;

    if (tradition !== 'catolica') {
      return originalLoadRepository();
    }

    setSource('loading', 'Leyendo Católica desde la copia web estable…');
    document.getElementById('loadLive').disabled = true;

    try {
      headers = [];
      const first = await loadCatholicPart('data/c01.csv.gz.b64', true);
      setSource('loading', 'Leyendo Católica: bloque 2 de 2…');
      const rest = await loadCatholicPart('data/c02plus.csv.gz.b64', false);
      const all = first.concat(rest);

      if (all.length !== 1100) {
        throw new Error(`Se esperaban 1100 registros y se cargaron ${all.length}`);
      }

      loadData(all);
      setSource('ok', `Católica: ${all.length.toLocaleString('es-PE')} preguntas cargadas desde la copia web estable.`);
    } catch (e) {
      const msg = errorText(e);
      console.error('Quiz Bible Catholic load error', e);
      setSource('error', `Error: ${msg}`);
      renderEmpty(`No se pudo cargar la copia católica: ${msg}`);
    } finally {
      document.getElementById('loadLive').disabled = false;
    }
  };
})();