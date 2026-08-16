export const NEURONOVA_ROOT = 'https://neuronova-apps.github.io';

export const firebaseConfig = Object.freeze({
  apiKey: 'AIzaSyAoKv_JwVGFN--PrErQ0lCeJs0aE6Lbvvs',
  authDomain: 'brailux.firebaseapp.com',
  projectId: 'brailux',
  storageBucket: 'brailux.firebasestorage.app',
  messagingSenderId: '395715538994',
  appId: '1:395715538994:web:fce39c8b0c14bba15e4c2b',
  measurementId: 'G-Z3EBTYBSS2'
});

export const AI_RUNTIME_CONFIG = Object.freeze({
  backendStatus: 'ACTIVE_SHARED_PROVISIONAL',
  modelName: 'gemini-3.6-flash',
  recaptchaEnterpriseSiteKey: '6LdkTogtAAAAALAEqavcrDlzikG43X1RmnTvah_P',
  runtimeManifestUrl: `${NEURONOVA_ROOT}/ai/runtime/manifest.json`,
  brailuxSpecialistUrl: `${NEURONOVA_ROOT}/ai/runtime/brailux-specialist.json`,
  chatStylesUrl: `${NEURONOVA_ROOT}/ai-chat.css`,
  maxInputLength: 1200
});
