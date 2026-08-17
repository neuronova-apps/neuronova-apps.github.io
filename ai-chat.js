import './ai/usage-guard.js';
import './ai/ai-chat-runtime.js';

const routeAuditEnabled = new URLSearchParams(globalThis.location?.search || '').get('ai-route-audit') === '1';

if (routeAuditEnabled) {
  import('./ai/route-test-battery.js')
    .then(({ runBrailuxRouteBattery }) => runBrailuxRouteBattery())
    .catch((error) => console.error('NeuroNova route battery:', error));
}
