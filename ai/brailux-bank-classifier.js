const normalize = (value = '') => value
  .toString()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9ñü\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const STOP_WORDS = new Set([
  'a', 'al', 'algo', 'como', 'con', 'cual', 'cuales', 'cuando', 'de', 'del', 'desde', 'donde', 'el', 'ella', 'en',
  'es', 'esta', 'este', 'esto', 'hay', 'la', 'las', 'lo', 'los', 'me', 'mi', 'para', 'por', 'que', 'quien', 'se',
  'si', 'su', 'sus', 'un', 'una', 'uno', 'y', 'ya', 'braille', 'brailux'
]);

const OPEN_GENERATIVE_TERMS = [
  'explica', 'explicame', 'por que', 'porque', 'con un ejemplo', 'dame un ejemplo', 'otro ejemplo',
  'otra manera', 'otra forma', 'crea', 'invent', 'personaliz', 'hazme', 'evalua', 'corrige', 'adapta',
  'comparame', 'compara', 'razona', 'justifica'
];

const CATEGORY_ALIASES = {
  fundamentos: ['definicion', 'sistema', 'idioma', 'origen', 'historia', 'louis', 'creador', 'creada', 'creado', 'creo'],
  celda: ['celda', 'posicion', 'posiciones', 'columna', 'columnas', 'estructura', 'combinacion', 'combinaciones', 'configuracion', 'configuraciones', 'patron', 'patrones'],
  alfabeto: ['alfabeto', 'serie', 'series', 'letra', 'letras'],
  espanol: ['espanol', 'ñ', 'acentuada', 'acentuadas', 'tilde', 'tildes', 'vocal', 'vocales'],
  numeros: ['numero', 'numeros', 'cifra', 'cifras', 'numerico', 'numerica'],
  aprendizaje: ['aprender', 'aprendizaje', 'empezar', 'comenzar', 'estudiar', 'ruta', 'memorizar'],
  limites: ['tactil', 'tactiles', 'sustituye', 'sustituir', 'reemplaza', 'reemplazar', 'formacion', 'especializada'],
  usos: ['uso', 'usos', 'utiliza', 'utilizar', 'sirve', 'senalizacion', 'documento', 'documentos', 'producto', 'productos', 'dispositivo', 'dispositivos', 'tecnologia', 'tecnologico', 'tecnologicos'],
  lectura_escritura: ['lectura', 'leer', 'escritura', 'escribir', 'regleta', 'punzon', 'pauta', 'reverso'],
  practica: ['practica', 'practicar', 'ejercicio', 'ejercicios', 'quiz', 'reto', 'reconocimiento'],
  herramientas: ['conversor', 'herramienta', 'herramientas', 'transcriptor'],
  funciones_web: ['funcion', 'funciones', 'web', 'progreso', 'navegador', 'resultado', 'resultados'],
  indicadores: ['indicador', 'indicadores', 'mayuscula', 'signo', 'signos']
};

const TOKEN_CANON = {
  usos: 'uso', utilizar: 'uso', utiliza: 'uso', usado: 'uso', usada: 'uso', sirve: 'uso',
  aprender: 'aprendizaje', aprende: 'aprendizaje', estudiar: 'aprendizaje', estudio: 'aprendizaje',
  ejercicios: 'ejercicio', practicar: 'practica', practicas: 'practica',
  numeros: 'numero', cifras: 'cifra',
  letras: 'letra', series: 'serie',
  posiciones: 'posicion', columnas: 'columna', combinaciones: 'combinacion', configuraciones: 'configuracion', patrones: 'patron',
  herramientas: 'herramienta', funciones: 'funcion', resultados: 'resultado', documentos: 'documento', dispositivos: 'dispositivo', productos: 'producto',
  tactiles: 'tactil', vocales: 'vocal', acentuadas: 'acentuada'
};

const canonicalToken = (token) => TOKEN_CANON[token] || token;

const tokenSet = (value) => new Set(
  normalize(value)
    .split(' ')
    .map(canonicalToken)
    .filter((token) => token.length >= 2 && !STOP_WORDS.has(token))
);

const includesAny = (text, terms) => terms.some((term) => text.includes(term));

const isOpenGenerative = (text) => includesAny(text, OPEN_GENERATIVE_TERMS);

const categoryBonus = (record, text) => {
  const aliases = CATEGORY_ALIASES[record.category] || [];
  return aliases.some((alias) => text.includes(alias)) ? 3 : 0;
};

const scoreRecord = (record, text, queryTokens, includeAlphabetMap = false) => {
  if (!record || !Array.isArray(record.facts)) return -Infinity;
  if (!includeAlphabetMap && record.category === 'alfabeto_mapa') return -Infinity;

  const title = normalize(record.title || '');
  const titleTokens = tokenSet(record.title || '');
  const factTokens = tokenSet(record.facts.join(' '));

  let score = categoryBonus(record, text);
  if (title && text.includes(title)) score += 5;

  for (const token of queryTokens) {
    if (titleTokens.has(token)) score += 3;
    else if (factTokens.has(token)) score += 2;
  }

  return score;
};

const factRelevance = (fact, queryTokens) => {
  const tokens = tokenSet(fact);
  let score = 0;
  for (const token of queryTokens) if (tokens.has(token)) score += 1;
  return score;
};

const maxFactsForRecord = (record) => {
  if (record?.id === 'BRSP0005') return 7;
  if (record?.id === 'BRSP0021') return 5;
  return 3;
};

const buildAnswerFromRecord = (record, queryTokens) => {
  const ranked = record.facts
    .map((fact, index) => ({ fact, index, score: factRelevance(fact, queryTokens) }))
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const limit = maxFactsForRecord(record);
  const relevant = ranked.filter((item) => item.score > 0);
  const selected = (relevant.length ? relevant : ranked).slice(0, limit).map((item) => item.fact.trim());
  return selected.join(' ');
};

const extractRequestedLetter = (value = '') => {
  const text = value.toString().toLowerCase();
  const patterns = [
    /\bletra\s+([a-záéíóúüñ])\b/i,
    /\bla\s+([a-záéíóúüñ])\b(?=.*\b(?:braille|punto|puntos)\b)/i,
    /\b([a-záéíóúüñ])\s+en\s+braille\b/i
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].toUpperCase();
  }
  return null;
};

const compactSpecialistRecord = (record, queryTokens, requestedLetter = null) => {
  let facts = record.facts || [];
  const exact = requestedLetter
    ? facts.find((fact) => fact.toUpperCase().startsWith(`${requestedLetter}:`))
    : null;

  if (exact) {
    facts = [exact];
  } else {
    const ranked = facts
      .map((fact, index) => ({ fact, index, score: factRelevance(fact, queryTokens) }))
      .sort((a, b) => b.score - a.score || a.index - b.index);
    const relevant = ranked.filter((item) => item.score > 0);
    facts = (relevant.length ? relevant : ranked).slice(0, 3).map((item) => item.fact);
  }

  if (!facts.length) return null;
  return { id: record.id, title: record.title, facts };
};

export const buildBrailuxPromptContext = (prompt, specialist) => {
  if (!specialist || specialist.app !== 'Brailux' || !Array.isArray(specialist.records)) return null;

  const text = normalize(prompt);
  const queryTokens = tokenSet(text);
  if (!text || !queryTokens.size) return null;

  const requestedLetter = extractRequestedLetter(prompt);
  const ranked = specialist.records
    .map((record) => {
      let score = scoreRecord(record, text, queryTokens, true);
      if (requestedLetter) {
        const containsLetter = (record.facts || []).some((fact) => fact.toUpperCase().startsWith(`${requestedLetter}:`));
        if (containsLetter) score = Math.max(score, 20);
      }
      return { record, score };
    })
    .filter((item) => Number.isFinite(item.score) && item.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  const records = ranked
    .map(({ record }) => compactSpecialistRecord(record, queryTokens, requestedLetter))
    .filter(Boolean);

  if (!records.length) return null;
  return { specialistVersion: specialist.specialistVersion, records };
};

export const buildBrailuxClassifiedBankAnswer = (prompt, specialist) => {
  if (!specialist || specialist.app !== 'Brailux' || !Array.isArray(specialist.records)) return null;

  const text = normalize(prompt);
  if (!text || isOpenGenerative(text)) return null;

  const queryTokens = tokenSet(text);
  if (!queryTokens.size) return null;

  const ranked = specialist.records
    .map((record) => ({ record, score: scoreRecord(record, text, queryTokens) }))
    .filter((item) => Number.isFinite(item.score))
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];
  const second = ranked[1];
  if (!best || best.score < 4) return null;
  if (second && second.score === best.score && best.score < 6) return null;

  return buildAnswerFromRecord(best.record, queryTokens) || null;
};
