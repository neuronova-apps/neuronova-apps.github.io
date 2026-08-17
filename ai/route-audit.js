// Auditoría local y privada del flujo del chatbot web.
// Solo registra contadores de ruta en sessionStorage; nunca guarda preguntas ni respuestas.

const AUDIT_VERSION = '1.0';
const STORAGE_KEY = 'neuronova.ai.routeAudit.v1';

const COUNTER_KEYS = [
  'userQueries',
  'geminiAttempts',
  'geminiHttpSuccess',
  'geminiHttpError',
  'gemini429',
  'geminiFetchError',
  'blockedDuplicate',
  'blockedSessionLimit',
  'blockedDailyQuota',
  'blockedRateLimit',
  'possibleLocalMisses'
];

const emptyCounters = () => Object.fromEntries(COUNTER_KEYS.map((key) => [key, 0]));

const safeRead = () => {
  try {
    const raw = globalThis.sessionStorage?.getItem(STORAGE_KEY);
    if (!raw) return emptyCounters();
    const parsed = JSON.parse(raw);
    return Object.fromEntries(COUNTER_KEYS.map((key) => [
      key,
      Number.isFinite(parsed?.[key]) && parsed[key] >= 0 ? parsed[key] : 0
    ]));
  } catch {
    return emptyCounters();
  }
};

let counters = safeRead();

const persist = () => {
  try {
    globalThis.sessionStorage?.setItem(STORAGE_KEY, JSON.stringify(counters));
  } catch {
    // Si sessionStorage no está disponible, los contadores continúan en memoria.
  }
};

export const recordAiRoute = (event) => {
  if (!COUNTER_KEYS.includes(event)) return;
  counters[event] += 1;
  persist();
};

const blockedBeforeRequest = () => counters.blockedDuplicate
  + counters.blockedSessionLimit
  + counters.blockedDailyQuota
  + counters.blockedRateLimit;

const snapshot = () => {
  const blocked = blockedBeforeRequest();
  const noGeminiRequestObserved = Math.max(0, counters.userQueries - counters.geminiAttempts - blocked);
  const denominator = counters.userQueries || 1;

  return {
    version: AUDIT_VERSION,
    scope: 'session',
    privacy: 'Solo contadores; no almacena texto de consultas ni respuestas.',
    counters: { ...counters },
    derived: {
      noGeminiRequestObserved,
      blockedBeforeRequest: blocked,
      geminiRequestShare: Number((counters.geminiAttempts / denominator).toFixed(3)),
      noGeminiRequestShare: Number((noGeminiRequestObserved / denominator).toFixed(3))
    }
  };
};

const reset = () => {
  counters = emptyCounters();
  persist();
  return snapshot();
};

const markUserMessages = () => {
  document.querySelectorAll('.nova-ai-message[data-role="user"]:not([data-route-audit-seen])')
    .forEach((message) => {
      message.dataset.routeAuditSeen = 'true';
      recordAiRoute('userQueries');
    });
};

const installUserQueryObserver = () => {
  const start = () => {
    markUserMessages();
    const observer = new MutationObserver(markUserMessages);
    observer.observe(document.documentElement, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
};

globalThis.__novaAiRouteAudit = Object.freeze({
  version: AUDIT_VERSION,
  snapshot,
  reset
});

installUserQueryObserver();
