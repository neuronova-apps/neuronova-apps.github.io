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

const safeAiErrorCode = (error) => {
  const explicitCode = [error?.code, error?.status, error?.statusCode]
    .find((value) => typeof value === 'string' || typeof value === 'number');

  if (explicitCode !== undefined) {
    const sanitized = String(explicitCode).replace(/[^a-z0-9_./:-]/gi, '').slice(0, 80);
    if (sanitized) return sanitized;
  }

  const message = String(error?.message || '').toLowerCase();
  if (message.includes('app check') || message.includes('appcheck')) return 'APP_CHECK';
  if (message.includes('quota') || message.includes('rate limit')) return 'QUOTA';
  if (message.includes('api key')) return 'API_KEY';
  if (message.includes('permission') || message.includes('forbidden')) return 'PERMISSION';
  if (message.includes('model') && message.includes('not found')) return 'MODEL_NOT_FOUND';

  const httpMatch = message.match(/\b(400|401|403|404|408|409|429|500|502|503|504)\b/);
  if (httpMatch) return `HTTP_${httpMatch[1]}`;

  const name = String(error?.name || 'UNKNOWN').replace(/[^a-z0-9_-]/gi, '').slice(0, 40);
  return name || 'UNKNOWN';
};

if (isBrailuxSite && !globalThis.__brailuxAiDiagnosticInstalled) {
  globalThis.__brailuxAiDiagnosticInstalled = true;
  const originalConsoleError = console.error.bind(console);

  console.error = (...args) => {
    originalConsoleError(...args);
    if (args[0] !== 'NeuroNova AI:') return;

    const diagnosticCode = safeAiErrorCode(args[1]);
    globalThis.setTimeout(() => {
      const messages = [...document.querySelectorAll('.nova-ai-message[data-state="error"]')];
      const target = messages.at(-1);
      if (!target || target.dataset.diagnosticApplied === 'true') return;

      target.dataset.diagnosticApplied = 'true';
      target.textContent = `${target.textContent} Código técnico: ${diagnosticCode}.`;
    }, 0);
  };
}

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

const asksHowToLearnBraille = (text) => [
  'como puedo aprender braille',
  'como aprender braille',
  'por donde empiezo a aprender braille',
  'por donde comenzar a aprender braille',
  'como empiezo con braille',
  'como comenzar con braille'
].some((term) => text.includes(term));

const buildLearningPathAnswer = () => {
  const record = brailuxSpecialist?.records?.find((item) => item.id === 'BRSP0007');
  const sequenceFact = record?.facts?.find((item) => item.toLowerCase().startsWith('la secuencia es:'));
  if (!sequenceFact) return null;

  const sequence = sequenceFact.replace(/^La secuencia es:\s*/i, '').replace(/\.$/, '');
  return `Para aprender Braille en Brailux, sigue esta ruta: ${sequence}.`;
};

const buildBrailuxDirectAnswer = (prompt) => {
  if (!brailuxSpecialist) return null;
  const text = normalizeText(prompt);

  if (asksHowToLearnBraille(text)) {
    return buildLearningPathAnswer();
  }

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
