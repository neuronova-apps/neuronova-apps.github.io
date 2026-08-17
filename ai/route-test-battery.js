import { buildDirectRuntimeAnswer } from './direct-answer.js';

const BATTERY_VERSION = '1.0';

const CASES = Object.freeze([
  { id: 'L01', expected: 'local', prompt: 'Hola' },
  { id: 'L02', expected: 'local', prompt: '¿Qué es el Braille?' },
  { id: 'L03', expected: 'local', prompt: '¿Cómo funciona el Braille?' },
  { id: 'L04', expected: 'local', prompt: '¿Cuántos puntos tiene la celda Braille?' },
  { id: 'L05', expected: 'local', prompt: '¿Cuántas combinaciones tiene una celda Braille?' },
  { id: 'L06', expected: 'local', prompt: '¿Para qué sirve el Braille?' },
  { id: 'L07', expected: 'local', prompt: '¿Cómo puedo aprender Braille?' },
  { id: 'L08', expected: 'local', prompt: '¿Cómo aprender el alfabeto Braille?' },
  { id: 'L09', expected: 'local', prompt: '¿Cómo aprender los números Braille?' },
  { id: 'L10', expected: 'local', prompt: '¿Cómo se lee el Braille?' },
  { id: 'L11', expected: 'local', prompt: '¿Qué puntos tiene la M?' },
  { id: 'L12', expected: 'local', prompt: '¿Qué puntos tiene la Ñ?' },
  { id: 'L13', expected: 'local', prompt: '¿Cómo se escribe 7 en Braille?' },
  { id: 'L14', expected: 'local', prompt: '¿Qué puntos tiene el signo de número?' },
  { id: 'L15', expected: 'local', prompt: '¿Qué puntos tiene el signo de mayúscula?' },
  { id: 'L16', expected: 'local', prompt: '¿Qué puntos usa la W?' },
  { id: 'L17', expected: 'local', prompt: '¿Qué es el quiz de Brailux?' },
  { id: 'L18', expected: 'local', prompt: '¿Qué es el conversor de Brailux?' },
  { id: 'L19', expected: 'local', prompt: '¿Dónde se guarda el progreso en Brailux?' },
  { id: 'L20', expected: 'local', prompt: '¿Brailux sustituye el aprendizaje táctil?' },
  { id: 'L21', expected: 'local', prompt: '¿Quién creó el Braille?' },
  { id: 'L22', expected: 'local', prompt: '¿Qué son las líneas Braille refrescables?' },
  { id: 'L23', expected: 'local', prompt: '¿Qué ejercicio sirve para reconocer las posiciones de la celda?' },
  { id: 'L24', expected: 'local', prompt: '¿Qué herramientas tiene Brailux web?' },
  { id: 'G01', expected: 'gemini', prompt: 'Explícame por qué la M usa esos puntos.' },
  { id: 'G02', expected: 'gemini', prompt: 'Dame un ejemplo para entender la serie K-T.' },
  { id: 'G03', expected: 'gemini', prompt: 'Crea una práctica de cinco preguntas sobre números Braille.' },
  { id: 'G04', expected: 'gemini', prompt: 'Compara la lectura y la escritura Braille con un ejemplo sencillo.' },
  { id: 'G05', expected: 'gemini', prompt: 'Explícame de otra manera cómo funciona el Braille.' },
  { id: 'G06', expected: 'gemini', prompt: 'Hazme un ejercicio personalizado con las letras A-J.' }
]);

const loadRuntimeApps = async () => {
  const url = new URL('./runtime/apps.json', import.meta.url);
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`No se pudo cargar apps.json (${response.status})`);
  const data = await response.json();
  if (!Array.isArray(data?.apps) || data.apps.length !== 7) {
    throw new Error('apps.json no supera la validación mínima para la batería.');
  }
  return { apps: data.apps };
};

const summarize = (results) => {
  const passed = results.filter((item) => item.pass).length;
  const unexpectedGemini = results.filter((item) => item.expected === 'local' && item.actual === 'gemini');
  const unexpectedLocal = results.filter((item) => item.expected === 'gemini' && item.actual === 'local');
  return {
    total: results.length,
    passed,
    failed: results.length - passed,
    localExpected: results.filter((item) => item.expected === 'local').length,
    generativeExpected: results.filter((item) => item.expected === 'gemini').length,
    unexpectedGemini: unexpectedGemini.map((item) => item.id),
    unexpectedLocal: unexpectedLocal.map((item) => item.id),
    estimatedGeminiCallsForBattery: results.filter((item) => item.actual === 'gemini').length
  };
};

export const runBrailuxRouteBattery = async () => {
  const isBrailux = globalThis.location?.pathname?.toLowerCase().startsWith('/brailux-app/') ?? false;
  if (!isBrailux) {
    return {
      version: BATTERY_VERSION,
      status: 'skipped',
      reason: 'La batería de Brailux solo se ejecuta dentro de /brailux-app/.',
      geminiRequestsSent: 0
    };
  }

  const runtime = await loadRuntimeApps();
  const results = CASES.map((test) => {
    const answer = buildDirectRuntimeAnswer(test.prompt, runtime);
    const actual = answer ? 'local' : 'gemini';
    return {
      id: test.id,
      expected: test.expected,
      actual,
      pass: actual === test.expected,
      prompt: test.prompt
    };
  });

  const report = {
    version: BATTERY_VERSION,
    status: results.every((item) => item.pass) ? 'APTO' : 'REVISAR',
    scope: 'Brailux web / simulación local de rutas',
    geminiRequestsSent: 0,
    summary: summarize(results),
    results
  };

  globalThis.__novaAiRouteBatteryLastResult = report;
  console.info('[NeuroNova] Batería local de rutas IA:', report);
  console.table(results.map(({ id, expected, actual, pass }) => ({ id, expected, actual, pass })));
  return report;
};

export const BRAILUX_ROUTE_BATTERY = CASES;
