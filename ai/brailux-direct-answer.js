const SPECIALIST_URL = new URL('./runtime/brailux-specialist.json', import.meta.url);

let specialistPromise = null;

const isBrailuxPath = (pathname = '') => pathname.toLowerCase().startsWith('/brailux-app/');

const loadSpecialist = () => {
  if (specialistPromise) return specialistPromise;
  specialistPromise = fetch(SPECIALIST_URL, { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error(`Brailux specialist HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => (data?.app === 'Brailux' && Array.isArray(data?.records) ? data : null))
    .catch((error) => {
      console.warn('Brailux direct specialist:', error);
      return null;
    });
  return specialistPromise;
};

const normalize = (value = '') => value
  .toString()
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9ñü\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const extractLetter = (prompt = '') => {
  const original = prompt.toLowerCase();
  const explicit = original.match(/\bletra\s+([a-záéíóúüñ])\b/i);
  if (explicit) return explicit[1].toUpperCase();

  const contextual = original.match(/\b(?:la|una)\s+([a-záéíóúüñ])\s+(?:en\s+)?braille\b/i);
  if (contextual) return contextual[1].toUpperCase();

  const text = normalize(prompt);
  const short = text.match(/\b(?:puntos?\s+(?:tiene|usa)\s+(?:la\s+)?|como\s+se\s+escribe\s+(?:la\s+)?)([a-zñü])\b/i);
  return short ? short[1].toUpperCase() : null;
};

const findLetterFact = (specialist, letter) => specialist.records
  .filter((record) => record.category === 'alfabeto_mapa')
  .flatMap((record) => record.facts || [])
  .find((fact) => fact.toUpperCase().startsWith(`${letter}:`));

const answerLetter = (fact, letter) => {
  const match = fact.match(/puntos?\s+([0-9-]+)/i);
  if (!match) return null;
  const points = match[1];
  return points.includes('-')
    ? `La letra ${letter} en Braille se representa con los puntos ${points}.`
    : `La letra ${letter} en Braille se representa con el punto ${points}.`;
};

const answerIndicator = (prompt, specialist) => {
  const text = normalize(prompt);
  const wantsNumber = text.includes('signo de numero') || text.includes('indicador numerico');
  const wantsUppercase = text.includes('signo de mayuscula') || text.includes('indicador de mayuscula');
  if (!wantsNumber && !wantsUppercase) return null;

  const record = specialist.records.find((item) => item.id === 'BRSP0012');
  const facts = record?.facts || [];
  const fact = wantsNumber
    ? facts.find((item) => item.toLowerCase().startsWith('signo de número'))
    : facts.find((item) => item.toLowerCase().startsWith('signo de mayúscula'));
  if (!fact) return null;

  const match = fact.match(/puntos?\s+([0-9-]+)/i);
  if (!match) return null;
  return wantsNumber
    ? `El signo de número en Braille se representa con los puntos ${match[1]}.`
    : `El signo de mayúscula en Braille se representa con los puntos ${match[1]}.`;
};

export const buildBrailuxDirectAnswer = async (prompt, pathname = '') => {
  if (!isBrailuxPath(pathname)) return null;

  const specialist = await loadSpecialist();
  if (!specialist) return null;

  const indicatorAnswer = answerIndicator(prompt, specialist);
  if (indicatorAnswer) return indicatorAnswer;

  const letter = extractLetter(prompt);
  if (!letter) return null;

  const fact = findLetterFact(specialist, letter);
  return fact ? answerLetter(fact, letter) : null;
};
