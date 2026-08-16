// Respuestas deterministas para consultas cerradas del Banco Maestro.
// Se usan cuando una respuesta puede derivarse directamente del runtime sin necesidad de generación.

const normalizeText = (value = '') => value
  .toString()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, ' ')
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

export const buildDirectRuntimeAnswer = (prompt, runtime) => {
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
