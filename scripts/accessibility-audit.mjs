import fs from 'node:fs';
import path from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';

const targets = [
  ['Neuronova Apps', 'https://neuronova-apps.github.io/'],
  ['Quiz Bible', 'https://neuronova-apps.github.io/quizbible-app/'],
  ['Mi Momento', 'https://neuronova-apps.github.io/mimomento-app/'],
  ['Brailux', 'https://neuronova-apps.github.io/brailux-app/'],
  ['English Fast', 'https://neuronova-apps.github.io/englishfast-app/'],
  ['Sudolux', 'https://neuronova-apps.github.io/sudolux-app/'],
  ['Crucilux', 'https://neuronova-apps.github.io/crucilux-app/'],
  ['Motiva', 'https://neuronova-apps.github.io/motiva-app/']
];

const outDir = path.resolve('artifacts/accessibility');
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];
let blockingFindings = 0;

for (const [name, url] of targets) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  let pageResult;

  try {
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    if (!response || !response.ok()) {
      throw new Error(`HTTP ${response?.status() ?? 'sin respuesta'}`);
    }

    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    const violations = axe.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact ?? 'unknown',
      help: violation.help,
      helpUrl: violation.helpUrl,
      tags: violation.tags,
      nodes: violation.nodes.map((node) => ({
        target: node.target,
        html: node.html,
        failureSummary: node.failureSummary
      }))
    }));

    const seriousOrCritical = violations.filter((item) =>
      item.impact === 'serious' || item.impact === 'critical'
    );

    blockingFindings += seriousOrCritical.length;
    pageResult = {
      name,
      url,
      checkedAt: new Date().toISOString(),
      status: 'audited',
      violations,
      totals: {
        violations: violations.length,
        seriousOrCritical: seriousOrCritical.length
      }
    };
  } catch (error) {
    blockingFindings += 1;
    pageResult = {
      name,
      url,
      checkedAt: new Date().toISOString(),
      status: 'error',
      error: String(error?.message ?? error),
      violations: [],
      totals: { violations: 0, seriousOrCritical: 1 }
    };
  } finally {
    await page.close();
  }

  results.push(pageResult);
}

await browser.close();

const payload = {
  standard: 'WCAG 2.x A/AA automated subset via axe-core',
  scope: 'Neuronova Apps matrix and seven public web applications',
  generatedAt: new Date().toISOString(),
  blockingPolicy: 'The workflow fails when axe reports serious/critical violations or a target cannot be audited.',
  note: 'Automated testing does not constitute WCAG certification and must be complemented with the manual protocol in docs/ACCESSIBILITY_AUDIT.md.',
  targets: results
};

fs.writeFileSync(path.join(outDir, 'axe-results.json'), JSON.stringify(payload, null, 2));

const lines = [
  '# Auditoría automática de accesibilidad',
  '',
  `Fecha UTC: ${payload.generatedAt}`,
  '',
  '| Superficie | Estado | Violaciones | Serias/críticas |',
  '|---|---:|---:|---:|'
];

for (const result of results) {
  lines.push(`| ${result.name} | ${result.status} | ${result.totals.violations} | ${result.totals.seriousOrCritical} |`);
}

lines.push('', 'La auditoría automática es una evidencia parcial. Debe complementarse con las pruebas manuales documentadas en `docs/ACCESSIBILITY_AUDIT.md`.');
fs.writeFileSync(path.join(outDir, 'summary.md'), `${lines.join('\n')}\n`);

console.table(results.map((result) => ({
  app: result.name,
  status: result.status,
  violations: result.totals.violations,
  seriousOrCritical: result.totals.seriousOrCritical
})));

if (blockingFindings > 0) {
  console.error(`Auditoría finalizada con ${blockingFindings} hallazgo(s) bloqueante(s).`);
  process.exitCode = 1;
} else {
  console.log('Auditoría finalizada sin violaciones serias/críticas detectadas por axe-core.');
}
