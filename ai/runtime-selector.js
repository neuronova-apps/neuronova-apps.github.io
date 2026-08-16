const CORE_GLOBAL_IDS = [
  'NNAI0001', 'NNAI0002', 'NNAI0003', 'NNAI0004',
  'NNAI0011', 'NNAI0013', 'NNAI0027', 'NNAI0029', 'NNAI0030'
];

const SUPPORT_GLOBAL_IDS = ['NNAI0007', 'NNAI0008', 'NNAI0017', 'NNAI0025', 'NNAI0026'];
const SECURITY_GLOBAL_IDS = ['NNAI0018', 'NNAI0019', 'NNAI0020', 'NNAI0021'];
const ACCESSIBILITY_GLOBAL_IDS = ['NNAI0022', 'NNAI0023'];
const STATUS_GLOBAL_IDS = ['NNAI0010', 'NNAI0016'];

const OFFICIAL_APP_NAMES = new Set(['Sudolux','Brailux','Motiva','Crucilux','Quiz Bible','Mi Momento','English Fast']);

const APP_ALIASES = new Map([
  ['sudolux', 'Sudolux'], ['sudoku', 'Sudolux'],
  ['brailux', 'Brailux'], ['braille', 'Brailux'],
  ['motiva', 'Motiva'],
  ['crucilux', 'Crucilux'], ['crucigrama', 'Crucilux'], ['crucigramas', 'Crucilux'],
  ['quiz bible', 'Quiz Bible'], ['quizbible', 'Quiz Bible'],
  ['mi momento', 'Mi Momento'], ['mimomento', 'Mi Momento'], ['devocional', 'Mi Momento'], ['devocionales', 'Mi Momento'],
  ['english fast', 'English Fast'], ['englishfast', 'English Fast']
]);

export const PATH_APP_MAP = new Map([
  ['/sudolux-app/', 'Sudolux'],
  ['/brailux-app/', 'Brailux'],
  ['/motiva-app/', 'Motiva'],
  ['/crucilux-app/', 'Crucilux'],
  ['/quizbible-app/', 'Quiz Bible'],
  ['/mimomento-app/', 'Mi Momento'],
  ['/englishfast-app/', 'English Fast']
]);

export const normalizeText = (value = '') => value
  .toString()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const tokens = (value) => new Set(
  normalizeText(value)
    .split(' ')
    .filter((token) => token.length >= 3)
);

const overlapRatio = (left, right) => {
  if (!left.size || !right.size) return 0;
  let common = 0;
  left.forEach((token) => {
    if (right.has(token)) common += 1;
  });
  return common / Math.max(1, Math.min(left.size, right.size));
};

export const currentAppFromPath = (pathname = '/') => {
  const normalizedPath = pathname.toLowerCase();
  for (const [prefix, app] of PATH_APP_MAP.entries()) {
    if (normalizedPath.startsWith(prefix)) return app;
  }
  return null;
};

export const detectApps = (prompt, apps = []) => {
  const text = normalizeText(prompt);
  const names = new Set();
  APP_ALIASES.forEach((app, alias) => {
    if (text.includes(normalizeText(alias))) names.add(app);
  });
  apps.forEach((app) => {
    if (text.includes(normalizeText(app.app))) names.add(app.app);
  });
  return [...names];
};

const scoreIntent = (prompt, intent, mentionedApps, currentApp) => {
  const text = normalizeText(prompt);
  const promptTokens = tokens(prompt);
  let score = 0;

  (intent.keyEntities || []).forEach((entity) => {
    const term = normalizeText(entity);
    if (term && text.includes(term)) score += term.includes(' ') ? 6 : 4;
  });

  let bestExample = 0;
  (intent.userExamples || []).forEach((example) => {
    const n = normalizeText(example);
    if (n && (text.includes(n) || n.includes(text))) bestExample = Math.max(bestExample, 8);
    bestExample = Math.max(bestExample, overlapRatio(promptTokens, tokens(example)) * 6);
  });
  score += bestExample;

  score += overlapRatio(promptTokens, tokens(intent.description || '')) * 2;

  if (mentionedApps.includes(intent.area)) score += 6;
  if (mentionedApps.length && OFFICIAL_APP_NAMES.has(intent.area) && !mentionedApps.includes(intent.area)) score -= 8;
  if (!mentionedApps.length && currentApp && intent.area === currentApp) score += 4;
  if (!mentionedApps.length && currentApp && OFFICIAL_APP_NAMES.has(intent.area) && intent.area !== currentApp) score -= 5;
  if (!mentionedApps.length && !currentApp && OFFICIAL_APP_NAMES.has(intent.area)) score -= 2;
  if (intent.priority === 'Alta') score += 0.5;

  return score;
};

const uniqById = (items) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = item?.id || JSON.stringify(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const takeByIds = (items, ids) => {
  const wanted = new Set(ids);
  return items.filter((item) => wanted.has(item.id));
};

const isSupportPrompt = (prompt) => {
  const text = normalizeText(prompt);
  return ['error', 'falla', 'no abre', 'no funciona', 'cargando', 'congela', 'lento', 'instalar', 'actualizar', 'soporte', 'ayuda'].some((term) => text.includes(term));
};

const isSecurityPrompt = (prompt) => {
  const text = normalizeText(prompt);
  return ['privacidad', 'seguridad', 'contrasena', 'password', 'token', 'api key', 'apikey', 'credencial', 'permiso', 'datos', 'cuenta'].some((term) => text.includes(term));
};

const isAccessibilityPrompt = (prompt) => {
  const text = normalizeText(prompt);
  return ['accesibilidad', 'contraste', 'teclado', 'lector de pantalla', 'dislexia', 'texto grande', 'tamano de texto', 'navegacion'].some((term) => text.includes(term));
};

const isStatusPrompt = (prompt) => {
  const text = normalizeText(prompt);
  return ['estado', 'beta', 'apk', 'google play', 'publicad', 'disponible', 'version', 'cuando', 'terminad', 'revision'].some((term) => text.includes(term));
};

const resolveSymbolic = (symbol, runtime, selectedApps) => {
  const resolver = (runtime.resolvers || []).find((item) => item.id === symbol);
  const result = { resolver: resolver || { id: symbol }, records: {} };

  const apps = runtime.apps || [];
  switch (symbol) {
    case 'CATALOGO_APPS':
      result.records.apps = apps;
      break;
    case 'ESTADOS_APPS':
      result.records.apps = selectedApps.length ? selectedApps : apps;
      break;
    case 'FICHA_APP':
    case 'URL_WEB_APP':
    case 'ESTADO_DISTRIBUCION_APP':
    case 'REPOSITORIO_APP':
      result.records.apps = selectedApps;
      break;
    case 'SOPORTE_APP_GENERAL':
      result.records.support = (runtime.support || [])
        .filter((item) => item.app === 'General' || selectedApps.some((app) => app.app === item.app))
        .slice(0, 6);
      break;
    case 'SEGURIDAD_PRIVACIDAD_GENERAL':
      result.records.securityPrivacy = (runtime.securityPrivacy || []).slice(0, 8);
      break;
    case 'CONTACTO_SOPORTE':
      result.records.fallbacks = (runtime.fallbacks || []).filter((item) => ['NNFB0011', 'NNFB0001'].includes(item.id));
      break;
    default:
      break;
  }

  if (resolver?.fallbackIds?.length) {
    result.records.fallbacks = uniqById([
      ...(result.records.fallbacks || []),
      ...takeByIds(runtime.fallbacks || [], resolver.fallbackIds)
    ]);
  }

  return result;
};

export const buildRuntimeSelection = (runtime, prompt, pathname = '/') => {
  if (!runtime || !Array.isArray(runtime.intents)) {
    return { bankAvailable: false, fallback: 'Banco runtime no disponible.' };
  }

  const currentApp = currentAppFromPath(pathname);
  const mentionedApps = detectApps(prompt, runtime.apps || []);
  const appNames = new Set([...mentionedApps, ...(currentApp ? [currentApp] : [])]);
  const selectedApps = (runtime.apps || []).filter((app) => appNames.has(app.app));

  const ranked = runtime.intents
    .map((intent) => ({ intent, score: scoreIntent(prompt, intent, mentionedApps, currentApp) }))
    .sort((a, b) => b.score - a.score);

  const matched = [];
  if (ranked[0]?.score >= 4) matched.push(ranked[0]);

  const intentNames = matched.map(({ intent }) => intent.intent);
  const baseResponses = (runtime.baseResponses || []).filter((item) => intentNames.includes(item.intent));

  const directIds = [];
  const symbolicIds = [];
  matched.forEach(({ intent }) => {
    (intent.targetResponse || []).forEach((target) => {
      if (/^NN[A-Z]+\d+$/i.test(target)) directIds.push(target);
      else symbolicIds.push(target);
    });
  });

  const directRecords = {
    identity: takeByIds(runtime.identity || [], directIds),
    apps: takeByIds(runtime.apps || [], directIds),
    support: takeByIds(runtime.support || [], directIds),
    accessibility: takeByIds(runtime.accessibility || [], directIds),
    securityPrivacy: takeByIds(runtime.securityPrivacy || [], directIds),
    fallbacks: takeByIds(runtime.fallbacks || [], directIds)
  };

  directRecords.apps = uniqById([...directRecords.apps, ...selectedApps]);

  const symbolic = symbolicIds.filter(Boolean).map((id) => resolveSymbolic(id, runtime, directRecords.apps));
  symbolic.forEach((resolved) => {
    Object.entries(resolved.records).forEach(([section, items]) => {
      directRecords[section] = uniqById([...(directRecords[section] || []), ...(items || [])]);
    });
  });

  if (isSupportPrompt(prompt)) {
    directRecords.support = uniqById([
      ...directRecords.support,
      ...(runtime.support || []).filter((item) => item.app === 'General' || appNames.has(item.app)).slice(0, 6)
    ]);
  }

  if (isSecurityPrompt(prompt)) {
    directRecords.securityPrivacy = uniqById([
      ...directRecords.securityPrivacy,
      ...(runtime.securityPrivacy || []).slice(0, 8)
    ]);
  }

  if (isAccessibilityPrompt(prompt)) {
    directRecords.accessibility = uniqById([
      ...directRecords.accessibility,
      ...(runtime.accessibility || []).filter((item) => item.app === 'General' || appNames.has(item.app)).slice(0, 6)
    ]);
  }

  const globalIds = new Set(CORE_GLOBAL_IDS);
  if (isSupportPrompt(prompt)) SUPPORT_GLOBAL_IDS.forEach((id) => globalIds.add(id));
  if (isSecurityPrompt(prompt)) SECURITY_GLOBAL_IDS.forEach((id) => globalIds.add(id));
  if (isAccessibilityPrompt(prompt)) ACCESSIBILITY_GLOBAL_IDS.forEach((id) => globalIds.add(id));
  if (isStatusPrompt(prompt)) STATUS_GLOBAL_IDS.forEach((id) => globalIds.add(id));

  matched.forEach(({ intent }) => {
    (runtime.globalInstructions || []).forEach((rule) => {
      if (rule.intent === intent.intent) globalIds.add(rule.id);
    });
  });

  const fallbackIds = new Set(['NNFB0001']);
  symbolic.forEach((resolved) => (resolved.resolver?.fallbackIds || []).forEach((id) => fallbackIds.add(id)));
  if (!matched.length) fallbackIds.add('NNFB0025');

  return {
    bankAvailable: true,
    schemaVersion: runtime.schemaVersion,
    bankVersion: runtime.bankVersion,
    currentSiteContext: currentApp || 'NeuroNova matriz',
    mentionedApps,
    matchedIntents: matched.map(({ intent, score }) => ({
      id: intent.id,
      intent: intent.intent,
      area: intent.area,
      description: intent.description,
      requiresClarification: intent.requiresClarification,
      escalateSupport: intent.escalateSupport,
      score: Number(score.toFixed(2))
    })),
    globalInstructions: takeByIds(runtime.globalInstructions || [], [...globalIds]),
    identity: directRecords.identity,
    apps: directRecords.apps,
    baseResponses,
    support: directRecords.support.slice(0, 8),
    accessibility: directRecords.accessibility.slice(0, 8),
    securityPrivacy: directRecords.securityPrivacy.slice(0, 10),
    fallbacks: uniqById([
      ...directRecords.fallbacks,
      ...takeByIds(runtime.fallbacks || [], [...fallbackIds])
    ]).slice(0, 6),
    resolvers: symbolic.map((item) => item.resolver).filter(Boolean),
    groundingRule: 'Para hechos sobre NeuroNova, responde únicamente con los registros incluidos en este contexto. Si falta el dato, usa fallback y no completes con conocimiento externo.'
  };
};
