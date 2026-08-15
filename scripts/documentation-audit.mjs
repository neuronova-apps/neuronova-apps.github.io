const repositories = [
  {
    name: 'Neuronova Apps',
    repo: 'neuronova-apps.github.io',
    profile: 'matrix'
  },
  { name: 'Quiz Bible', repo: 'quizbible-app', profile: 'app' },
  { name: 'Mi Momento', repo: 'mimomento-app', profile: 'app' },
  { name: 'Brailux', repo: 'brailux-app', profile: 'app' },
  { name: 'English Fast', repo: 'englishfast-app', profile: 'app' },
  { name: 'Sudolux', repo: 'sudolux-app', profile: 'app' },
  { name: 'Crucilux', repo: 'crucilux-app', profile: 'app' },
  { name: 'Motiva', repo: 'motiva-app', profile: 'app' }
];

const required = {
  matrix: [
    '## Estado',
    '## Alcance actual',
    '## Arquitectura',
    '## Accesibilidad',
    '## Gobernanza documental',
    '## Limitaciones conocidas',
    '## Roadmap',
    '## Repositorios de aplicaciones',
    '## Sitio principal',
    '## Autoría',
    '## Última revisión'
  ],
  app: [
    '## Estado del proyecto',
    '## Alcance actual',
    '## Funciones disponibles',
    '## Tecnología',
    '## Accesibilidad',
    '## Privacidad',
    '## Limitaciones conocidas',
    '## Roadmap',
    '## Desarrollo local',
    '## Estructura principal',
    '## Enlaces',
    '## Neuronova Apps',
    '## Autoría',
    '## Última revisión'
  ]
};

const results = [];
let failures = 0;

for (const item of repositories) {
  const url = `https://raw.githubusercontent.com/neuronova-apps/${item.repo}/main/README.md`;
  const response = await fetch(url, {
    headers: { 'user-agent': 'neuronova-documentation-audit' }
  });

  if (!response.ok) {
    failures += 1;
    results.push({
      project: item.name,
      status: 'error',
      missing: ['README no disponible'],
      lastReviewed: null
    });
    continue;
  }

  const content = await response.text();
  const missing = required[item.profile].filter((heading) => !content.includes(`${heading}\n`));
  const reviewMatch = content.match(/## Última revisión\s+\n\s*(\d{4}-\d{2}-\d{2})/m);
  const lastReviewed = reviewMatch?.[1] ?? null;
  const validDate = lastReviewed && !Number.isNaN(Date.parse(`${lastReviewed}T00:00:00Z`));

  if (!validDate) {
    missing.push('fecha de última revisión válida');
  }

  if (missing.length > 0) {
    failures += 1;
  }

  results.push({
    project: item.name,
    status: missing.length === 0 ? 'ok' : 'fail',
    missing,
    lastReviewed
  });
}

console.table(results.map((result) => ({
  project: result.project,
  status: result.status,
  lastReviewed: result.lastReviewed ?? '-',
  missing: result.missing.length
})));

for (const result of results.filter((item) => item.missing.length > 0)) {
  console.error(`\n${result.project}: ${result.missing.join(', ')}`);
}

if (failures > 0) {
  console.error(`\nEstándar documental incumplido en ${failures} proyecto(s).`);
  process.exitCode = 1;
} else {
  console.log('\nLos ocho README cumplen la estructura documental mínima de Neuronova Apps.');
}
