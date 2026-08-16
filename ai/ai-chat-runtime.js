import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js';
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider
} from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-app-check.js';
import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend
} from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-ai.js';

import { firebaseConfig, AI_RUNTIME_CONFIG } from './ai-config.js';
import { buildRuntimeSelection, currentAppFromPath } from './runtime-selector.js';
import { RESPONSE_STYLE_INSTRUCTION } from './response-style.js';
import { buildDirectRuntimeAnswer } from './direct-answer.js';

const {
  modelName: MODEL_NAME,
  recaptchaEnterpriseSiteKey: RECAPTCHA_ENTERPRISE_SITE_KEY,
  runtimeManifestUrl: RUNTIME_MANIFEST_URL,
  chatStylesUrl: CHAT_STYLES_URL,
  maxInputLength: MAX_INPUT_LENGTH
} = AI_RUNTIME_CONFIG;

const systemInstruction = `Eres el Asistente NeuroNova, integrado en el ecosistema NeuroNova Apps.

FUENTE DE VERDAD
En cada consulta recibirás un bloque CONTEXTO_BANCO_NEURONOVA generado desde el Banco Maestro IA auditado. Para cualquier afirmación sobre NeuroNova, usa exclusivamente los registros incluidos en ese bloque.
No uses memoria general del modelo ni conocimiento externo para completar huecos sobre NeuroNova.
Si el dato solicitado no aparece en el contexto, aplica uno de los fallbacks incluidos y reconoce que no existe información confirmada suficiente.

PRIORIDAD
1. Seguridad y privacidad.
2. Reglas globales.
3. Intención detectada y resolutores.
4. Ficha de la aplicación o identidad.
5. Respuestas base.
6. Soporte o accesibilidad cuando correspondan.
7. Fallback.

NOMBRES OFICIALES
Las únicas aplicaciones oficiales son Sudolux, Brailux, Motiva, Crucilux, Quiz Bible, Mi Momento y English Fast.
No inventes nombres de aplicaciones, funciones, estados, cantidades, enlaces, fechas, canales de soporte ni disponibilidad.

ESTADOS
Distingue siempre entre web, banco maestro, Android/APK, beta y publicación en Google Play. No conviertas un elemento en desarrollo o no confirmado en algo disponible.

SEGURIDAD
Nunca solicites contraseñas, códigos de verificación, API keys, tokens, claves privadas ni datos sensibles innecesarios.

SOPORTE
Prioriza pasos simples, reversibles y que no borren datos. No afirmes haber ejecutado acciones que el sistema no haya confirmado.

ACCESIBILIDAD
Adapta la comunicación cuando sea útil, pero no atribuyas a una aplicación funciones de accesibilidad que no estén confirmadas en el contexto.

TRANSPARENCIA
Eres un asistente virtual. Responde en el idioma del usuario y mantén una comunicación clara, breve y precisa.

${RESPONSE_STYLE_INSTRUCTION}`;

let runtimeBankPromise = null;
let appCheckInitialized = false;

const RUNTIME_ARRAY_KEYS = [
  'globalInstructions',
  'identity',
  'apps',
  'intents',
  'baseResponses',
  'support',
  'accessibility',
  'securityPrivacy',
  'fallbacks',
  'resolvers'
];

const validateRuntimeCounts = (runtime, counts = {}) => {
  const expected = {
    globalInstructions: 30,
    identity: 20,
    apps: 7,
    intents: 30,
    baseResponses: 60,
    support: 25,
    accessibility: 25,
    securityPrivacy: 30,
    fallbacks: 25,
    resolvers: 9
  };

  return Object.entries(expected).every(([key, minimum]) => {
    const expectedCount = Number(counts[key] ?? minimum);
    return Array.isArray(runtime[key]) && runtime[key].length === expectedCount;
  });
};

export const mergeRuntimeChunks = (manifest, chunks) => {
  const runtime = {
    schemaVersion: manifest?.schemaVersion,
    bankVersion: manifest?.bankVersion,
    counts: manifest?.counts || {},
    globalInstructions: [],
    identity: [],
    apps: [],
    intents: [],
    baseResponses: [],
    support: [],
    accessibility: [],
    securityPrivacy: [],
    fallbacks: [],
    resolvers: []
  };

  chunks.forEach((chunk) => {
    if (!chunk || chunk.bankVersion !== manifest.bankVersion) {
      throw new Error('Un fragmento runtime no coincide con la versión del manifiesto.');
    }

    RUNTIME_ARRAY_KEYS.forEach((key) => {
      if (Array.isArray(chunk[key])) runtime[key].push(...chunk[key]);
    });
  });

  if (!validateRuntimeCounts(runtime, manifest.counts)) {
    throw new Error('El runtime combinado no coincide con los conteos auditados del manifiesto.');
  }

  return runtime;
};

const loadRuntimeBank = () => {
  if (runtimeBankPromise) return runtimeBankPromise;

  runtimeBankPromise = fetch(RUNTIME_MANIFEST_URL, { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error(`No se pudo cargar el manifiesto runtime (${response.status})`);
      return response.json();
    })
    .then(async (manifest) => {
      const validManifest = manifest?.bankVersion === '1.12'
        && Array.isArray(manifest?.chunks)
        && manifest.chunks.length === 12
        && manifest?.counts?.serializableElements === 261;

      if (!validManifest) {
        throw new Error('El manifiesto runtime no supera la validación mínima de estructura v1.12.');
      }

      const baseUrl = manifest.baseUrl || new URL('./', RUNTIME_MANIFEST_URL).href;
      const chunks = await Promise.all(manifest.chunks.map(async (chunkName) => {
        const chunkUrl = new URL(chunkName, baseUrl).href;
        const response = await fetch(chunkUrl, { cache: 'no-store' });
        if (!response.ok) throw new Error(`No se pudo cargar ${chunkName} (${response.status})`);
        return response.json();
      }));

      return mergeRuntimeChunks(manifest, chunks);
    })
    .catch((error) => {
      console.error('NeuroNova AI runtime:', error);
      return null;
    });

  return runtimeBankPromise;
};

const buildGroundedPrompt = async (prompt) => {
  const runtime = await loadRuntimeBank();
  const context = buildRuntimeSelection(runtime, prompt, window.location.pathname);

  return `[CONTEXTO_BANCO_NEURONOVA]\n${JSON.stringify(context)}\n[FIN_CONTEXTO_BANCO_NEURONOVA]\n\n[CONSULTA_USUARIO]\n${prompt}\n[FIN_CONSULTA_USUARIO]\n\nResponde primero con la conclusión concreta. Para cualquier hecho sobre NeuroNova usa únicamente el contexto autorizado. Si falta el dato, aplica fallback y no lo inventes. Conserva por separado web, banco de contenido, Android/APK, beta y Google Play cuando esa distinción sea relevante.`;
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
  if (document.querySelector('.nova-ai-launcher') || document.querySelector('#nova-ai-panel')) return null;

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
      <p class="nova-ai-note">Respuestas basadas en el Banco Maestro IA de NeuroNova. No compartas contraseñas, códigos, tokens ni datos sensibles.</p>
    </form>`;

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
  const firebaseApp = getApps()[0] || initializeApp(firebaseConfig);

  if (!appCheckInitialized) {
    initializeAppCheck(firebaseApp, {
      provider: new ReCaptchaEnterpriseProvider(RECAPTCHA_ENTERPRISE_SITE_KEY),
      isTokenAutoRefreshEnabled: true
    });
    appCheckInitialized = true;
  }

  const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });
  const model = getGenerativeModel(ai, { model: MODEL_NAME, systemInstruction });
  return model.startChat();
};

const initializeChat = () => {
  loadStyles();
  const ui = createInterface();
  if (!ui) return;

  let chat = null;
  let busy = false;
  const currentApp = currentAppFromPath(window.location.pathname);

  ui.messages.appendChild(createMessage(
    'assistant',
    currentApp
      ? `Hola. Soy el Asistente NeuroNova. Estás en ${currentApp}; puedo orientarte usando el Banco Maestro oficial del ecosistema.`
      : 'Hola. Soy el Asistente NeuroNova. Puedes preguntarme sobre NeuroNova y sus siete aplicaciones oficiales.'
  ));

  loadRuntimeBank();

  const scrollToLatest = () => { ui.messages.scrollTop = ui.messages.scrollHeight; };
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
    if (ui.panel.dataset.open === 'true') closePanel();
    else openPanel();
  });
  ui.closeButton.addEventListener('click', closePanel);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && ui.panel.dataset.open === 'true') closePanel();
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
      const runtime = await loadRuntimeBank();
      const directAnswer = buildDirectRuntimeAnswer(prompt, runtime);

      if (directAnswer) {
        typingMessage.remove();
        ui.messages.appendChild(createMessage('assistant', directAnswer));
        return;
      }

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
