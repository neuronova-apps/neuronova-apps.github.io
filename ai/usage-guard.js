import { recordAiRoute } from './route-audit.js';

// Guardia de consumo para el chatbot web de NeuroNova.
// Reduce llamadas accidentales a Firebase AI/Gemini sin afectar respuestas locales del banco.

const MAX_GENERATIVE_REQUESTS_PER_SESSION = 5;
const DUPLICATE_WINDOW_MS = 12000;
const TRANSIENT_RATE_LIMIT_MS = 60000;

const SESSION_COUNT_KEY = 'neuronova.ai.generativeCount.v1';
const SESSION_DAILY_QUOTA_KEY = 'neuronova.ai.dailyQuotaBlocked.v1';

const state = {
  clientBlock: null,
  providerBlock: null,
  rateBlockedUntil: 0,
  lastPrompt: '',
  lastPromptAt: 0
};

const safeSessionGet = (key) => {
  try {
    return globalThis.sessionStorage?.getItem(key) ?? null;
  } catch {
    return null;
  }
};

const safeSessionSet = (key, value) => {
  try {
    globalThis.sessionStorage?.setItem(key, value);
  } catch {
    // El control sigue funcionando en memoria si sessionStorage no está disponible.
  }
};

const getSessionCount = () => {
  const stored = Number.parseInt(safeSessionGet(SESSION_COUNT_KEY) || '0', 10);
  return Number.isFinite(stored) && stored >= 0 ? stored : 0;
};

const incrementSessionCount = () => {
  const next = getSessionCount() + 1;
  safeSessionSet(SESSION_COUNT_KEY, String(next));
  return next;
};

if (safeSessionGet(SESSION_DAILY_QUOTA_KEY) === '1') {
  state.providerBlock = 'daily-quota';
}

const requestUrl = (input) => {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.href;
  if (typeof Request !== 'undefined' && input instanceof Request) return input.url;
  return String(input || '');
};

const isGenerativeEndpoint = (input) => {
  const url = requestUrl(input);
  if (!url) return false;
  return /googleapis\.com/i.test(url)
    && (url.includes(':generateContent') || url.includes(':streamGenerateContent'));
};

const bodyText = async (input, init) => {
  if (typeof init?.body === 'string') return init.body;
  if (typeof Request !== 'undefined' && input instanceof Request) {
    try {
      return await input.clone().text();
    } catch {
      return '';
    }
  }
  return '';
};

const findPromptMarker = (value) => {
  if (typeof value === 'string') {
    const match = value.match(/\[CONSULTA_USUARIO\]\s*([\s\S]*?)\s*\[FIN_CONSULTA_USUARIO\]/i);
    return match?.[1]?.trim() || '';
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findPromptMarker(item);
      if (found) return found;
    }
    return '';
  }

  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) {
      const found = findPromptMarker(item);
      if (found) return found;
    }
  }

  return '';
};

const extractUserPrompt = async (input, init) => {
  const raw = await bodyText(input, init);
  if (!raw) return '';

  try {
    return findPromptMarker(JSON.parse(raw));
  } catch {
    return findPromptMarker(raw);
  }
};

const looksLikePotentialLocalMiss = (prompt = '') => {
  const text = prompt
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) return false;

  const asksForGeneration = [
    'explica', 'explicame', 'por que', 'porque', 'ejemplo', 'crea', 'invent', 'personaliz',
    'hazme', 'evalua', 'corrige', 'adapta', 'compara', 'razona', 'justifica'
  ].some((term) => text.includes(term));
  if (asksForGeneration) return false;

  const looksClosed = /^(que|cual|cuantos|cuantas|donde|quien|como se|para que)\b/.test(text);
  if (!looksClosed) return false;

  return [
    'braille', 'brailux', 'celda', 'punto', 'alfabeto', 'letra', 'numero', 'cifra',
    'quiz', 'conversor', 'progreso', 'regleta', 'punzon', 'mayuscula', 'signo'
  ].some((term) => text.includes(term));
};

const setClientBlock = (reason) => {
  state.clientBlock = reason;
  globalThis.__novaAiUsageGuardState = state;
};

const clearClientBlock = () => {
  state.clientBlock = null;
  globalThis.__novaAiUsageGuardState = state;
};

const friendlyMessage = () => {
  if (state.clientBlock === 'session-limit') {
    return 'Alcanzaste el límite preventivo de consultas generativas de esta sesión. Las respuestas cubiertas por el banco local siguen disponibles sin consumir Gemini.';
  }
  if (state.clientBlock === 'duplicate') {
    return 'Esa consulta acaba de enviarse. Espera unos segundos antes de repetirla; así evitamos gastar otra solicitud de IA innecesariamente.';
  }
  if (state.providerBlock === 'daily-quota') {
    return 'La cuota gratuita diaria de IA está agotada por ahora. Puedes seguir usando las respuestas cubiertas por el banco local; las consultas generativas volverán a estar disponibles cuando se restablezca la cuota.';
  }
  if (state.providerBlock === 'rate-limit') {
    return 'La IA alcanzó un límite temporal de solicitudes. Espera un minuto e inténtalo nuevamente; las respuestas locales del banco siguen disponibles.';
  }
  return null;
};

const installFriendlyErrorObserver = () => {
  const applyFriendlyMessage = () => {
    const message = friendlyMessage();
    if (!message) return;

    const errors = [...document.querySelectorAll('.nova-ai-message[data-state="error"]')];
    const target = errors.at(-1);
    if (!target || target.dataset.usageGuardApplied === 'true') return;

    target.dataset.usageGuardApplied = 'true';
    target.dataset.state = 'limit';
    target.textContent = message;
  };

  const start = () => {
    const observer = new MutationObserver(applyFriendlyMessage);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    applyFriendlyMessage();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
};

const originalFetch = globalThis.fetch.bind(globalThis);

globalThis.fetch = async (input, init) => {
  if (!isGenerativeEndpoint(input)) {
    return originalFetch(input, init);
  }

  clearClientBlock();

  // Una limitación temporal vencida no debe contaminar errores posteriores.
  if (state.providerBlock === 'rate-limit' && state.rateBlockedUntil <= Date.now()) {
    state.providerBlock = null;
    state.rateBlockedUntil = 0;
  }

  if (state.providerBlock === 'daily-quota') {
    recordAiRoute('blockedDailyQuota');
    setClientBlock('provider-quota');
    throw new Error('NEURONOVA_DAILY_QUOTA_BLOCKED');
  }

  if (state.rateBlockedUntil > Date.now()) {
    state.providerBlock = 'rate-limit';
    recordAiRoute('blockedRateLimit');
    setClientBlock('provider-rate-limit');
    throw new Error('NEURONOVA_RATE_LIMIT_COOLDOWN');
  }

  if (getSessionCount() >= MAX_GENERATIVE_REQUESTS_PER_SESSION) {
    recordAiRoute('blockedSessionLimit');
    setClientBlock('session-limit');
    throw new Error('NEURONOVA_SESSION_GENERATIVE_LIMIT');
  }

  const prompt = await extractUserPrompt(input, init);
  const now = Date.now();
  if (prompt && prompt === state.lastPrompt && now - state.lastPromptAt < DUPLICATE_WINDOW_MS) {
    recordAiRoute('blockedDuplicate');
    setClientBlock('duplicate');
    throw new Error('NEURONOVA_DUPLICATE_GENERATIVE_REQUEST');
  }

  if (looksLikePotentialLocalMiss(prompt)) {
    recordAiRoute('possibleLocalMisses');
  }

  state.lastPrompt = prompt;
  state.lastPromptAt = now;
  incrementSessionCount();
  recordAiRoute('geminiAttempts');

  let response;
  try {
    response = await originalFetch(input, init);
  } catch (error) {
    recordAiRoute('geminiFetchError');
    throw error;
  }

  if (response.status === 429) {
    recordAiRoute('gemini429');
    let providerText = '';
    try {
      providerText = await response.clone().text();
    } catch {
      providerText = '';
    }

    const isDailyQuota = /GenerateRequestsPerDayPerProjectPerModel-FreeTier|PerDayPerProjectPerModel|daily quota/i.test(providerText);
    if (isDailyQuota) {
      state.providerBlock = 'daily-quota';
      safeSessionSet(SESSION_DAILY_QUOTA_KEY, '1');
    } else {
      state.providerBlock = 'rate-limit';
      state.rateBlockedUntil = Date.now() + TRANSIENT_RATE_LIMIT_MS;
    }
  } else if (response.ok) {
    recordAiRoute('geminiHttpSuccess');
    state.providerBlock = null;
  } else {
    recordAiRoute('geminiHttpError');
  }

  globalThis.__novaAiUsageGuardState = state;
  return response;
};

globalThis.__novaAiUsageGuardState = state;
installFriendlyErrorObserver();
