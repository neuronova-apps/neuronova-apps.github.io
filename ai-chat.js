import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app-check.js";
import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-ai.js";

const firebaseConfig = {
  apiKey: "AIzaSyAoKv_JwVGFN--PrErQ0lCeJs0aE6Lbvvs",
  authDomain: "brailux.firebaseapp.com",
  projectId: "brailux",
  storageBucket: "brailux.firebasestorage.app",
  messagingSenderId: "395715538994",
  appId: "1:395715538994:web:fce39c8b0c14bba15e4c2b",
  measurementId: "G-Z3EBTYBSS2"
};

const RECAPTCHA_ENTERPRISE_SITE_KEY = "6LdkTogtAAAAALAEqavcrDlzikG43X1RmnTvah_P";
const MODEL_NAME = "gemini-3.6-flash";
const MAX_INPUT_LENGTH = 1200;
const NEURONOVA_ROOT = "https://neuronova-apps.github.io";
const RUNTIME_BANK_URL = `${NEURONOVA_ROOT}/apps.json`;
const CHAT_STYLES_URL = `${NEURONOVA_ROOT}/ai-chat.css`;

const OFFICIAL_APP_NAMES = [
  "Sudolux",
  "Brailux",
  "Motiva",
  "Crucilux",
  "Quiz Bible",
  "Mi Momento",
  "English Fast"
];

const PATH_APP_MAP = new Map([
  ["/sudolux-app/", "Sudolux"],
  ["/brailux-app/", "Brailux"],
  ["/motiva-app/", "Motiva"],
  ["/crucilux-app/", "Crucilux"],
  ["/quizbible-app/", "Quiz Bible"],
  ["/mimomento-app/", "Mi Momento"],
  ["/englishfast-app/", "English Fast"]
]);

const APP_ALIASES = new Map([
  ["sudolux", "Sudolux"],
  ["sudoku", "Sudolux"],
  ["brailux", "Brailux"],
  ["braille", "Brailux"],
  ["motiva", "Motiva"],
  ["crucilux", "Crucilux"],
  ["crucigrama", "Crucilux"],
  ["crucigramas", "Crucilux"],
  ["quiz bible", "Quiz Bible"],
  ["quizbible", "Quiz Bible"],
  ["mi momento", "Mi Momento"],
  ["mimomento", "Mi Momento"],
  ["devocional", "Mi Momento"],
  ["devocionales", "Mi Momento"],
  ["english fast", "English Fast"],
  ["englishfast", "English Fast"]
]);

const systemInstruction = `Eres el Asistente NeuroNova, integrado en el ecosistema NeuroNova Apps.

ALCANCE
Tu función es orientar sobre NeuroNova, sus aplicaciones, disponibilidad, funciones confirmadas, soporte básico, accesibilidad y estado de desarrollo.

FUENTE DE VERDAD
En cada consulta recibirás un bloque llamado CONTEXTO_BANCO_NEURONOVA. Ese bloque es la única fuente autorizada para afirmar hechos sobre NeuroNova y sus productos.
No uses conocimiento general, memoria del modelo ni suposiciones para completar datos de NeuroNova.
Si el bloque indica bankAvailable=false o no contiene el dato solicitado, responde que no tienes información confirmada suficiente y no inventes.

NOMBRES OFICIALES
Las únicas aplicaciones oficiales actualmente registradas son: Sudolux, Brailux, Motiva, Crucilux, Quiz Bible, Mi Momento y English Fast.
Está prohibido crear o sugerir como reales otros nombres de aplicaciones de NeuroNova.

REGLAS
- Distingue siempre web, Android/APK, banco de contenido, beta y Google Play.
- No conviertas una función "en desarrollo" o "no confirmada" en una función disponible.
- No mezcles funciones entre aplicaciones.
- Si una ficha específica contradice una descripción general, prevalece la ficha específica incluida en el contexto.
- No inventes fechas, enlaces, cantidades, canales de soporte ni estados de publicación.
- No solicites contraseñas, códigos de verificación, API keys, tokens ni secretos.
- En soporte, prioriza pasos simples y reversibles antes de acciones que puedan borrar datos.
- No infieras diagnósticos, discapacidad ni condiciones personales.
- Responde en el idioma del usuario; en español, usa lenguaje claro y directo.
- Si la consulta queda fuera del alcance de NeuroNova, indícalo brevemente y ofrece ayuda sobre el ecosistema.

TRANSPARENCIA
Eres un asistente virtual. No finjas ser una persona ni afirmes haber ejecutado acciones que el sistema no haya confirmado.`;

let runtimeBankPromise = null;

const normalizeText = (value = "") => value
  .toString()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const getCurrentAppName = () => {
  const pathname = window.location.pathname.toLowerCase();

  for (const [pathPrefix, appName] of PATH_APP_MAP.entries()) {
    if (pathname.startsWith(pathPrefix)) return appName;
  }

  return null;
};

const detectMentionedApps = (prompt, apps) => {
  const normalizedPrompt = normalizeText(prompt);
  const detected = new Set();

  APP_ALIASES.forEach((appName, alias) => {
    if (normalizedPrompt.includes(normalizeText(alias))) {
      detected.add(appName);
    }
  });

  apps.forEach((app) => {
    if (normalizedPrompt.includes(normalizeText(app.name))) {
      detected.add(app.name);
    }
  });

  return [...detected];
};

const isCatalogQuery = (prompt) => {
  const text = normalizeText(prompt);
  return [
    "que apps",
    "que aplicaciones",
    "cuales apps",
    "cuales aplicaciones",
    "familia de apps",
    "ecosistema",
    "que proyectos",
    "disponibles",
    "recomienda",
    "recomiendas",
    "recomendacion"
  ].some((term) => text.includes(term));
};

const isNeuroNovaQuery = (prompt) => {
  const text = normalizeText(prompt);
  if (text.includes("neuronova") || text.includes("nn")) return true;
  return [...APP_ALIASES.keys()].some((alias) => text.includes(normalizeText(alias)));
};

const loadRuntimeBank = () => {
  if (runtimeBankPromise) return runtimeBankPromise;

  runtimeBankPromise = fetch(RUNTIME_BANK_URL, { cache: "no-store" })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`No se pudo cargar el banco runtime (${response.status})`);
      }
      return response.json();
    })
    .then((data) => {
      const apps = Array.isArray(data.apps) ? data.apps : [];
      const appNames = apps.map((app) => app.name).filter(Boolean);
      const hasCanonicalCatalog = OFFICIAL_APP_NAMES.every((name) => appNames.includes(name));

      if (!hasCanonicalCatalog) {
        throw new Error("El banco runtime no contiene el catálogo oficial completo de siete aplicaciones.");
      }

      return data;
    })
    .catch((error) => {
      console.error("NeuroNova AI bank:", error);
      return null;
    });

  return runtimeBankPromise;
};

const buildRuntimeContext = async (prompt) => {
  const bank = await loadRuntimeBank();
  const currentAppName = getCurrentAppName();

  if (!bank) {
    return {
      bankAvailable: false,
      bankVersion: null,
      currentSiteContext: currentAppName || "NeuroNova matriz",
      officialAppNames: OFFICIAL_APP_NAMES,
      selectedApps: [],
      rule: "No afirmar hechos sobre NeuroNova mientras el banco no esté disponible."
    };
  }

  const apps = Array.isArray(bank.apps) ? bank.apps : [];
  const mentionedApps = detectMentionedApps(prompt, apps);
  const selectedNames = new Set(mentionedApps);

  if (currentAppName) selectedNames.add(currentAppName);

  const catalogRequested = isCatalogQuery(prompt);
  const neuroNovaRequested = isNeuroNovaQuery(prompt) || catalogRequested || !currentAppName;

  let selectedApps = [];
  if (catalogRequested) {
    selectedApps = apps;
  } else if (selectedNames.size) {
    selectedApps = apps.filter((app) => selectedNames.has(app.name));
  }

  return {
    bankAvailable: true,
    schemaVersion: bank.schemaVersion,
    bankVersion: bank.bankVersion,
    lastReviewed: bank.lastReviewed,
    currentSiteContext: currentAppName || "NeuroNova matriz",
    queryScope: neuroNovaRequested ? "NeuroNova" : currentAppName || "NeuroNova",
    identity: {
      officialName: "NeuroNova",
      definition: "NeuroNova es el ecosistema matriz que reúne productos digitales con finalidades diferenciadas bajo una misma identidad.",
      mainWebsite: `${NEURONOVA_ROOT}/`,
      officialAppNames: OFFICIAL_APP_NAMES,
      rules: [
        "Cada aplicación conserva funciones y desarrollo propios.",
        "La web, la app Android, el banco de contenido, una beta y una publicación en Google Play son estados distintos.",
        "No afirmar funciones, estados, cantidades, enlaces o nombres de apps que no estén incluidos en el banco.",
        "Mi Momento es el nombre oficial del producto devocional."
      ]
    },
    selectedApps: selectedApps.map((app) => ({
      id: app.id,
      name: app.name,
      status: app.status,
      webStatus: app.webStatus,
      androidStatus: app.androidStatus,
      bankStatus: app.bankStatus,
      playStoreStatus: app.playStoreStatus,
      availableNow: app.availableNow,
      inDevelopment: app.inDevelopment,
      confirmedFunctions: app.confirmedFunctions,
      unconfirmedFunctions: app.unconfirmedFunctions,
      aiNotes: app.aiNotes,
      url: app.url,
      repository: app.repository
    })),
    fallback: "Si el dato solicitado no está en este contexto, indica que no hay información confirmada suficiente; no lo completes con conocimiento externo."
  };
};

const buildGroundedPrompt = async (prompt) => {
  const context = await buildRuntimeContext(prompt);

  return `[CONTEXTO_BANCO_NEURONOVA]\n${JSON.stringify(context)}\n[FIN_CONTEXTO_BANCO_NEURONOVA]\n\n[CONSULTA_USUARIO]\n${prompt}\n[FIN_CONSULTA_USUARIO]\n\nResponde usando las reglas del sistema y únicamente el contexto autorizado para cualquier afirmación sobre NeuroNova.`;
};

const loadStyles = () => {
  if (document.querySelector('link[data-nova-ai-styles]')) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = CHAT_STYLES_URL;
  link.dataset.novaAiStyles = 'true';
  document.head.appendChild(link);
};

const createMessage = (role, text, state = '') => {
  const message = document.createElement('div');
  message.className = 'nova-ai-message';
  message.dataset.role = role;
  if (state) message.dataset.state = state;
  message.textContent = text;
  return message;
};

const createTypingMessage = () => {
  const message = document.createElement('div');
  message.className = 'nova-ai-message';
  message.dataset.role = 'assistant';
  message.setAttribute('aria-label', 'El asistente está respondiendo');

  const typing = document.createElement('span');
  typing.className = 'nova-ai-typing';
  typing.setAttribute('aria-hidden', 'true');
  typing.innerHTML = '<i></i><i></i><i></i>';
  message.appendChild(typing);
  return message;
};

const createInterface = () => {
  const launcher = document.createElement('button');
  launcher.type = 'button';
  launcher.className = 'nova-ai-launcher';
  launcher.setAttribute('aria-label', 'Abrir Asistente NeuroNova');
  launcher.setAttribute('aria-controls', 'nova-ai-panel');
  launcher.setAttribute('aria-expanded', 'false');
  launcher.title = 'Asistente NeuroNova';
  launcher.textContent = 'IA';

  const panel = document.createElement('section');
  panel.id = 'nova-ai-panel';
  panel.className = 'nova-ai-panel';
  panel.dataset.open = 'false';
  panel.setAttribute('aria-label', 'Asistente NeuroNova');

  panel.innerHTML = `
    <header class="nova-ai-header">
      <div class="nova-ai-title">
        <span class="nova-ai-mark" aria-hidden="true">NN</span>
        <div>
          <strong>Asistente NeuroNova</strong>
          <span>Consultas con IA</span>
        </div>
      </div>
      <button class="nova-ai-close" type="button" aria-label="Cerrar asistente">×</button>
    </header>
    <div class="nova-ai-messages" role="log" aria-live="polite" aria-relevant="additions text"></div>
    <form class="nova-ai-form">
      <div class="nova-ai-input-row">
        <textarea class="nova-ai-input" rows="1" maxlength="${MAX_INPUT_LENGTH}" placeholder="Escribe tu consulta..." aria-label="Escribe tu consulta"></textarea>
        <button class="nova-ai-send" type="submit" aria-label="Enviar consulta">➤</button>
      </div>
      <p class="nova-ai-note">Respuestas basadas en el banco oficial de NeuroNova. Verifica la información importante.</p>
    </form>
  `;

  document.body.append(panel, launcher);

  return {
    launcher,
    panel,
    closeButton: panel.querySelector('.nova-ai-close'),
    messages: panel.querySelector('.nova-ai-messages'),
    form: panel.querySelector('.nova-ai-form'),
    input: panel.querySelector('.nova-ai-input'),
    sendButton: panel.querySelector('.nova-ai-send')
  };
};

const initializeFirebaseAI = () => {
  const firebaseApp = initializeApp(firebaseConfig);

  initializeAppCheck(firebaseApp, {
    provider: new ReCaptchaEnterpriseProvider(RECAPTCHA_ENTERPRISE_SITE_KEY),
    isTokenAutoRefreshEnabled: true
  });

  const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });
  const model = getGenerativeModel(ai, {
    model: MODEL_NAME,
    systemInstruction
  });

  return model.startChat();
};

const initializeChat = () => {
  loadStyles();
  const ui = createInterface();
  let chat = null;
  let busy = false;
  const currentAppName = getCurrentAppName();

  ui.messages.appendChild(createMessage(
    'assistant',
    currentAppName
      ? `Hola. Soy el Asistente NeuroNova. Estás en ${currentAppName}; puedo orientarte usando la información oficial disponible del ecosistema.`
      : 'Hola. Soy el Asistente NeuroNova. Puedes preguntarme sobre NeuroNova y las aplicaciones oficiales del ecosistema.'
  ));

  loadRuntimeBank();

  const scrollToLatest = () => {
    ui.messages.scrollTop = ui.messages.scrollHeight;
  };

  const setBusy = (value) => {
    busy = value;
    ui.input.disabled = value;
    ui.sendButton.disabled = value;
  };

  const openPanel = () => {
    ui.panel.dataset.open = 'true';
    ui.launcher.setAttribute('aria-expanded', 'true');
    window.setTimeout(() => ui.input.focus(), 40);
  };

  const closePanel = () => {
    ui.panel.dataset.open = 'false';
    ui.launcher.setAttribute('aria-expanded', 'false');
    ui.launcher.focus();
  };

  ui.launcher.addEventListener('click', () => {
    if (ui.panel.dataset.open === 'true') {
      closePanel();
    } else {
      openPanel();
    }
  });

  ui.closeButton.addEventListener('click', closePanel);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && ui.panel.dataset.open === 'true') {
      closePanel();
    }
  });

  ui.input.addEventListener('input', () => {
    ui.input.style.height = 'auto';
    ui.input.style.height = `${Math.min(ui.input.scrollHeight, 120)}px`;
  });

  ui.input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      ui.form.requestSubmit();
    }
  });

  ui.form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (busy) return;

    const prompt = ui.input.value.trim();
    if (!prompt) return;

    ui.messages.appendChild(createMessage('user', prompt));
    ui.input.value = '';
    ui.input.style.height = 'auto';
    scrollToLatest();

    const typingMessage = createTypingMessage();
    ui.messages.appendChild(typingMessage);
    scrollToLatest();
    setBusy(true);

    try {
      if (!chat) chat = initializeFirebaseAI();

      const groundedPrompt = await buildGroundedPrompt(prompt);
      const result = await chat.sendMessage(groundedPrompt);
      const responseText = result.response.text().trim();
      typingMessage.remove();
      ui.messages.appendChild(createMessage(
        'assistant',
        responseText || 'No recibí contenido para esa consulta. Intenta reformularla.'
      ));
    } catch (error) {
      console.error('NeuroNova AI:', error);
      typingMessage.remove();
      ui.messages.appendChild(createMessage(
        'assistant',
        'No pude completar la consulta en este momento. Revisa la conexión e inténtalo nuevamente.',
        'error'
      ));
    } finally {
      setBusy(false);
      scrollToLatest();
      ui.input.focus();
    }
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeChat, { once: true });
} else {
  initializeChat();
}
