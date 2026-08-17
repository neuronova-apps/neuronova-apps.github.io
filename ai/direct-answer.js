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

const includesAny = (text, terms) => terms.some((term) => text.includes(term));

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

const getBrailuxRecord = (id) => brailuxSpecialist?.records?.find((item) => item.id === id) || null;
const getBrailuxFacts = (id) => getBrailuxRecord(id)?.facts || [];

const findBrailuxFact = (predicate) => brailuxSpecialist?.records
  ?.flatMap((record) => record.facts || [])
  .find(predicate);

const extractBrailuxLetter = (prompt = '') => {
  const original = prompt.toLowerCase();
  const explicit = original.match(/\bletra\s+([a-záéíóúüñ])\b/i);
  if (explicit) return explicit[1].toUpperCase();

  const contextual = original.match(/\b(?:la|una)\s+([a-záéíóúüñ])\s+(?:en\s+)?braille\b/i);
  if (contextual) return contextual[1].toUpperCase();

  const shortOriginal = original.match(/\b(?:puntos?\s+(?:tiene|usa)\s+(?:la\s+)?|como\s+se\s+escribe\s+(?:la\s+)?)([a-záéíóúüñ])\b/i);
  if (shortOriginal) return shortOriginal[1].toUpperCase();

  return null;
};

const extractBrailleDigit = (prompt = '') => {
  const original = prompt.toLowerCase();
  const patterns = [
    /\b(?:numero|número|cifra)\s+([0-9])\b/i,
    /\b(?:escribe|representa)\s+(?:el\s+)?([0-9])\s+(?:en\s+)?braille\b/i,
    /\b([0-9])\s+(?:en\s+)?braille\b/i
  ];

  for (const pattern of patterns) {
    const match = original.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const asksHowToLearnBraille = (text) => includesAny(text, [
  'como puedo aprender braille',
  'como aprender braille',
  'por donde empiezo a aprender braille',
  'por donde comenzar a aprender braille',
  'como empiezo con braille',
  'como comenzar con braille'
]);

const asksForOpenLetterExplanation = (text) => includesAny(text, [
  'por que',
  'porque',
  'explica',
  'explicame',
  'con un ejemplo',
  'otro ejemplo',
  'otra manera',
  'otra forma'
]);

const buildLearningPathAnswer = () => {
  const sequenceFact = getBrailuxFacts('BRSP0007')
    .find((item) => item.toLowerCase().startsWith('la secuencia es:'));
  if (!sequenceFact) return null;

  const sequence = sequenceFact.replace(/^La secuencia es:\s*/i, '').replace(/\.$/, '');
  return `Para aprender Braille en Brailux, sigue esta ruta: ${sequence}.`;
};

const buildLetterAnswer = (letter) => {
  if (!letter) return null;
  const fact = brailuxSpecialist?.records
    ?.filter((record) => record.category === 'alfabeto_mapa' || record.category === 'espanol')
    .flatMap((record) => record.facts || [])
    .find((item) => item.toUpperCase().startsWith(`${letter}:`));
  const match = fact?.match(/puntos?\s+([0-9-]+)/i);
  if (!match) return null;

  return match[1].includes('-')
    ? `La letra ${letter} en Braille se representa con los puntos ${match[1]}.`
    : `La letra ${letter} en Braille se representa con el punto ${match[1]}.`;
};

const buildDigitAnswer = (digit) => {
  if (digit === null) return null;
  const baseLetters = { '1': 'A', '2': 'B', '3': 'C', '4': 'D', '5': 'E', '6': 'F', '7': 'G', '8': 'H', '9': 'I', '0': 'J' };
  const letter = baseLetters[digit];
  const letterFact = brailuxSpecialist?.records
    ?.filter((record) => record.category === 'alfabeto_mapa')
    .flatMap((record) => record.facts || [])
    .find((item) => item.startsWith(`${letter}:`));
  const points = letterFact?.match(/puntos?\s+([0-9-]+)/i)?.[1];
  if (!letter || !points) return null;

  return `La cifra ${digit} en Braille se representa con el signo de número, puntos 3-4-5-6, seguido de la configuración de ${letter}, puntos ${points}.`;
};

const buildBrailuxDirectAnswer = (prompt) => {
  if (!brailuxSpecialist) return null;
  const text = normalizeText(prompt);

  if (['hola', 'hola asistente', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches'].includes(text)) {
    return 'Hola. Puedo ayudarte con Braille y con las funciones educativas disponibles en Brailux web.';
  }

  if (['gracias', 'muchas gracias', 'te agradezco'].includes(text)) {
    return 'De nada. Puedes seguir consultándome sobre Braille o sobre las herramientas educativas de Brailux web.';
  }

  if (includesAny(text, ['que es brailux', 'que es la web brailux', 'para que sirve brailux'])) {
    return 'Brailux web es un recurso educativo para comprender y practicar fundamentos del Braille. Incluye una celda interactiva, exploración del alfabeto, un quiz visual, un conversor didáctico y progreso básico guardado en el navegador.';
  }

  if (includesAny(text, ['que puedo hacer aqui', 'que puedo hacer en brailux', 'que funciones tiene brailux', 'funciones de brailux', 'herramientas de brailux'])) {
    return 'En Brailux web puedes explorar la celda de seis puntos, consultar letras y sus configuraciones, practicar con un quiz visual, usar un conversor didáctico y conservar progreso básico en el mismo navegador.';
  }

  if (includesAny(text, ['que es el braille', 'que es braille', 'definicion de braille', 'braille es un idioma', 'el braille es un idioma'])) {
    return 'El Braille es un sistema de lectoescritura basado en combinaciones de puntos en relieve. Representa letras, números y otros signos dentro de una celda y no es una lengua independiente.';
  }

  if (includesAny(text, ['como funciona el braille', 'como funciona braille'])) {
    return 'El Braille organiza la información mediante una celda de seis posiciones. En lectura, los puntos 1, 2 y 3 están a la izquierda y 4, 5 y 6 a la derecha; la combinación de puntos activos determina el signo que se interpreta.';
  }

  if (includesAny(text, ['que es la celda braille', 'como es la celda braille', 'como se distribuyen los puntos', 'donde estan los puntos braille', 'cuantos puntos tiene la celda'])) {
    return 'La celda Braille básica tiene seis posiciones en dos columnas de tres. En lectura, 1-2-3 están a la izquierda y 4-5-6 a la derecha.';
  }

  if (includesAny(text, ['cuantas combinaciones', '64 combinaciones', 'configuraciones posibles'])) {
    return 'La celda Braille de seis puntos permite 64 configuraciones posibles si se cuenta también la celda vacía.';
  }

  if (includesAny(text, ['para que sirve el braille', 'para que se usa el braille', 'donde se usa el braille', 'usos del braille'])) {
    return 'El Braille se utiliza para acceder a la palabra escrita y puede encontrarse en educación, señalización, productos, documentos y dispositivos tecnológicos.';
  }

  if (asksHowToLearnBraille(text)) {
    return buildLearningPathAnswer();
  }

  if (includesAny(text, ['como aprender el alfabeto braille', 'como aprender las letras braille', 'como memorizar el alfabeto braille', 'como estudiar el alfabeto braille'])) {
    return 'Brailux recomienda empezar por la serie A-J y después observar cómo cambian las configuraciones al incorporar los puntos 3 y 6. Así se aprenden relaciones entre series en lugar de memorizar cada letra de forma aislada.';
  }

  if (includesAny(text, ['como aprender los numeros braille', 'como aprender numeros braille', 'como estudiar los numeros braille'])) {
    return 'Para aprender los números, Brailux propone dominar primero A-J y luego añadir el signo de número. Las correspondencias son 1=A, 2=B, 3=C, 4=D, 5=E, 6=F, 7=G, 8=H, 9=I y 0=J.';
  }

  if (includesAny(text, ['como se representan los numeros en braille', 'como se escriben los numeros en braille', 'numeros en braille'])) {
    return 'Los números en Braille se representan anteponiendo el signo de número, puntos 3-4-5-6, a las configuraciones de la primera serie Braille A-J, que corresponden respectivamente a 1, 2, 3, 4, 5, 6, 7, 8, 9 y 0.';
  }

  if (includesAny(text, ['como se lee el braille', 'como se lee braille', 'lectura braille', 'diferencia entre lectura y escritura', 'como se escribe manualmente braille', 'regleta y punzon', 'pauta y punzon'])) {
    return 'La lectura Braille se realiza de izquierda a derecha. En la escritura manual con pauta o regleta negativa y punzón se trabaja desde el reverso del papel; otros dispositivos permiten escribir en el mismo sentido de lectura.';
  }

  if (includesAny(text, ['primera serie braille', 'serie a j', 'letras a j'])) {
    return 'La primera serie Braille A-J utiliza únicamente los puntos superiores 1, 2, 4 y 5 y sirve como base para varias letras posteriores.';
  }

  if (includesAny(text, ['serie k t', 'letras k t', 'como se forman las letras k a t', 'como se forma k a t'])) {
    return 'La serie K-T repite las formas de A-J y añade el punto 3. Por ejemplo, A se convierte en K al incorporar el punto 3.';
  }

  if (includesAny(text, ['serie u z', 'letras u z', 'letras finales braille', 'por que la w es diferente', 'w es una excepcion'])) {
    return 'Al añadir el punto 6 a formas de la segunda serie aparecen U, V, X, Y y Z. La W es una excepción histórica y se representa con los puntos 2-4-5-6.';
  }

  if (includesAny(text, ['signo de numero', 'indicador numerico'])) {
    const fact = findBrailuxFact((item) => item.toLowerCase().startsWith('signo de número'));
    const match = fact?.match(/puntos?\s+([0-9-]+)/i);
    return match ? `El signo de número en Braille se representa con los puntos ${match[1]}.` : null;
  }

  if (includesAny(text, ['signo de mayuscula', 'indicador de mayuscula'])) {
    const fact = findBrailuxFact((item) => item.toLowerCase().startsWith('signo de mayúscula'));
    const match = fact?.match(/puntos?\s+([0-9-]+)/i);
    return match ? `El signo de mayúscula en Braille se representa con los puntos ${match[1]}.` : null;
  }

  if (includesAny(text, ['dame un ejercicio de puntos', 'ejercicio de puntos braille', 'ejercicio para aprender los puntos', 'practicar posiciones'])) {
    return 'Ejercicio: identifica primero 1-2-3, después 4-5-6 y finalmente construye combinaciones mixtas como 1-4 o 2-4-5. El objetivo es reconocer cada posición sin depender de una letra concreta.';
  }

  if (includesAny(text, ['dame un ejercicio de letras', 'ejercicio de letras braille', 'practicar letras braille', 'relacionar letras y puntos'])) {
    return 'Ejercicio: selecciona una letra, identifica sus puntos y compárala con una letra de la serie siguiente para descubrir qué punto se añadió. Esta comparación ayuda a comprender las relaciones entre series.';
  }

  if (includesAny(text, ['que es el quiz', 'como funciona el quiz', 'quiz de braille', 'quiz visual'])) {
    return 'El quiz visual de Brailux muestra una celda Braille y ofrece cuatro opciones de respuesta. Sus resultados se guardan localmente en el navegador como parte del progreso básico.';
  }

  if (includesAny(text, ['que es el conversor', 'como funciona el conversor', 'que hace el conversor', 'que admite el conversor', 'conversor braille'])) {
    return 'El conversor didáctico de Brailux permite escribir palabras cortas o números y observar una representación Braille básica. Admite letras del alfabeto español, vocales acentuadas, ü, ñ y números; no sustituye un transcriptor Braille especializado.';
  }

  if (includesAny(text, ['guarda mi progreso', 'donde se guarda el progreso', 'como se guarda el progreso', 'progreso en brailux'])) {
    return 'Brailux web conserva progreso básico y resultados localmente en el mismo navegador.';
  }

  if (includesAny(text, ['sustituye el aprendizaje tactil', 'reemplaza el aprendizaje tactil', 'puedo aprender braille solo con brailux', 'brailux reemplaza una formacion'])) {
    return 'No. Las actividades digitales de Brailux son complementarias y no sustituyen el aprendizaje táctil ni la formación especializada cuando sea necesaria.';
  }

  const digit = extractBrailleDigit(prompt);
  if (digit !== null) {
    return buildDigitAnswer(digit);
  }

  const letter = extractBrailuxLetter(prompt);
  if (letter && !asksForOpenLetterExplanation(text)) {
    return buildLetterAnswer(letter);
  }

  return null;
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
