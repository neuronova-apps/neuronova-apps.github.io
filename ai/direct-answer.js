// Respuestas deterministas para consultas cerradas del Banco Maestro y del runtime especialista Brailux.
// Se usan cuando una respuesta puede derivarse directamente de una fuente autorizada sin generación.

const normalizeText = (value = '') => value
  .toString()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9ñü\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const joinSpanishList = (items) => {
  if (!items.length) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} y ${items[1]}`;
  return `${items.slice(0, -1).join(', ')} y ${items.at(-1)}`;
};

const asksForCatalog = (text) => [
  'que aplicaciones tiene',
  'cuales aplicaciones tiene',
  'que apps tiene',
  'cuales apps tiene',
  'aplicaciones de neuronova',
  'apps de neuronova',
  'lista de aplicaciones',
  'lista de apps'
].some((term) => text.includes(term));

const asksForCatalogCount = (text) => [
  'cuantas aplicaciones',
  'cuantas apps'
].some((term) => text.includes(term));

const asksForExtraDetail = (text) => [
  'estado',
  'disponib',
  'beta',
  'apk',
  'android',
  'google play',
  'publicad',
  'desarrollo',
  'funcion',
  'que hace',
  'para que sirve',
  'web',
  'banco',
  'detalle',
  'explica'
].some((term) => text.includes(term));

const isBrailuxSite = globalThis.location?.pathname?.toLowerCase().startsWith('/brailux-app/') ?? false;
let brailuxSpecialist = null;

if (isBrailuxSite) {
  try {
    const response = await fetch(new URL('./runtime/brailux-specialist.json', import.meta.url), { cache: 'no-store' });
    if (response.ok) {
      const data = await response.json();
      if (data?.app === 'Brailux' && Array.isArray(data?.records)) brailuxSpecialist = data;
    }
  } catch (error) {
    console.warn('Brailux direct runtime:', error);
  }
}

const extractBrailuxLetter = (prompt = '') => {
  const original = prompt.toLowerCase();
  const explicit = original.match(/\bletra\s+([a-záéíóúüñ])\b/i);
  if (explicit) return explicit[1].toUpperCase();

  const contextual = original.match(/\b(?:la|una)\s+([a-záéíóúüñ])\s+(?:en\s+)?braille\b/i);
  if (contextual) return contextual[1].toUpperCase();

  const text = normalizeText(prompt);
  const short = text.match(/\b(?:puntos?\s+(?:tiene|usa)\s+(?:la\s+)?|como\s+se\s+escribe\s+(?:la\s+)?)([a-zñü])\b/i);
  return short ? short[1].toUpperCase() : null;
};

const findBrailuxFact = (predicate) => brailuxSpecialist?.records
  ?.flatMap((record) => record.facts || [])
  .find(predicate);

const buildBrailuxDirectAnswer = (prompt) => {
  if (!brailuxSpecialist) return null;
  const text = normalizeText(prompt);

  if (text.includes('signo de numero') || text.includes('indicador numerico')) {
    const fact = findBrailuxFact((item) => item.toLowerCase().startsWith('signo de número'));
    const match = fact?.match(/puntos?\s+([0-9-]+)/i);
    return match ? `El signo de número en Braille se representa con los puntos ${match[1]}.` : null;
  }

  if (text.includes('signo de mayuscula') || text.includes('indicador de mayuscula')) {
    const fact = findBrailuxFact((item) => item.toLowerCase().startsWith('signo de mayúscula'));
    const match = fact?.match(/puntos?\s+([0-9-]+)/i);
    return match ? `El signo de mayúscula en Braille se representa con los puntos ${match[1]}.` : null;
  }

  const letter = extractBrailuxLetter(prompt);
  if (!letter) return null;

  const fact = brailuxSpecialist.records
    .filter((record) => record.category === 'alfabeto_mapa')
    .flatMap((record) => record.facts || [])
    .find((item) => item.toUpperCase().startsWith(`${letter}:`));
  const match = fact?.match(/puntos?\s+([0-9-]+)/i);
  if (!match) return null;

  return match[1].includes('-')
    ? `La letra ${letter} en Braille se representa con los puntos ${match[1]}.`
    : `La letra ${letter} en Braille se representa con el punto ${match[1]}.`;
};

export const buildDirectRuntimeAnswer = (prompt, runtime) => {
  const brailuxAnswer = buildBrailuxDirectAnswer(prompt);
  if (brailuxAnswer) return brailuxAnswer;

  if (!runtime || !Array.isArray(runtime.apps) || runtime.apps.length !== 7) return null;

  const text = normalizeText(prompt);
  const isNeuroNovaCatalog = text.includes('neuronova') && (asksForCatalog(text) || asksForCatalogCount(text));
  if (!isNeuroNovaCatalog || asksForExtraDetail(text)) return null;

  const names = runtime.apps.map((app) => app.app).filter(Boolean);
  if (names.length !== 7) return null;

  if (asksForCatalogCount(text)) {
    return `NeuroNova tiene siete aplicaciones oficiales: ${joinSpanishList(names)}.`;
  }

  return `Las aplicaciones oficiales de NeuroNova son ${joinSpanishList(names)}.`;
};
