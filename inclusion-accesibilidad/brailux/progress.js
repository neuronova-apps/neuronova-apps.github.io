const quizCellVisual = document.querySelector('#quizCell[aria-label]');
if (quizCellVisual && !quizCellVisual.hasAttribute('role')) quizCellVisual.setAttribute('role', 'img');

const BRAILUX_PROGRESS_KEY = 'brailux-progress-v1';
const BRAILUX_UNITS = [
  { id: 'conoce', name: 'Fundamentos' },
  { id: 'generador', name: 'Celda Braille' },
  { id: 'alfabeto', name: 'Alfabeto' },
  { id: 'lectura', name: 'Lectura y escritura' },
  { id: 'numeros', name: 'Números y signos' },
  { id: 'practica', name: 'Práctica' }
];

function emptyProgress() {
  return {
    version: 1,
    visitedUnits: [],
    completedUnits: [],
    quiz: { attempts: 0, correct: 0 },
    translatorUsed: false,
    lastUnit: null,
    lastActivity: null
  };
}

function normalizeProgress(value) {
  const base = emptyProgress();
  if (!value || typeof value !== 'object') return base;

  const validIds = new Set(BRAILUX_UNITS.map(unit => unit.id));
  const visitedUnits = Array.isArray(value.visitedUnits)
    ? value.visitedUnits.filter(id => validIds.has(id))
    : [];
  const completedUnits = Array.isArray(value.completedUnits)
    ? value.completedUnits.filter(id => validIds.has(id))
    : [];

  return {
    version: 1,
    visitedUnits: [...new Set(visitedUnits)],
    completedUnits: [...new Set(completedUnits)],
    quiz: {
      attempts: Math.max(0, Number(value.quiz?.attempts) || 0),
      correct: Math.max(0, Number(value.quiz?.correct) || 0)
    },
    translatorUsed: Boolean(value.translatorUsed),
    lastUnit: validIds.has(value.lastUnit) ? value.lastUnit : null,
    lastActivity: value.lastActivity && typeof value.lastActivity === 'object'
      ? { label: String(value.lastActivity.label || ''), at: String(value.lastActivity.at || '') }
      : null
  };
}

function loadProgress() {
  try {
    return normalizeProgress(JSON.parse(localStorage.getItem(BRAILUX_PROGRESS_KEY)));
  } catch {
    return emptyProgress();
  }
}

let progress = loadProgress();
let storageAvailable = true;
let translatorTrackedThisSession = false;

function saveProgress() {
  try {
    localStorage.setItem(BRAILUX_PROGRESS_KEY, JSON.stringify(progress));
    storageAvailable = true;
  } catch {
    storageAvailable = false;
  }
}

function unitById(id) {
  return BRAILUX_UNITS.find(unit => unit.id === id);
}

function touchActivity(label) {
  progress.lastActivity = {
    label,
    at: new Date().toISOString()
  };
  saveProgress();
}

function formatActivity(activity) {
  if (!activity?.label) return 'Sin actividad';
  if (!activity.at) return activity.label;

  const date = new Date(activity.at);
  if (Number.isNaN(date.getTime())) return activity.label;

  try {
    const formatted = new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
    return `${activity.label} · ${formatted}`;
  } catch {
    return activity.label;
  }
}

function buildProgressPanel() {
  const route = document.querySelector('.learning-route');
  if (!route || document.querySelector('#progreso-local')) return;

  const panel = document.createElement('section');
  panel.id = 'progreso-local';
  panel.className = 'progress-panel';
  panel.setAttribute('aria-labelledby', 'progressTitle');
  panel.innerHTML = `
    <div class="progress-head">
      <div>
        <h3 id="progressTitle">Tu progreso local</h3>
        <p>El avance se guarda únicamente en este navegador. No requiere cuenta y no se envía a un servidor.</p>
      </div>
      <button id="progressReset" class="progress-reset" type="button">Reiniciar progreso</button>
    </div>
    <div class="progress-summary" aria-label="Resumen del progreso">
      <div class="progress-metric"><strong id="progressCompleted">0 / 6</strong><span>unidades completadas</span></div>
      <div class="progress-metric"><strong id="progressVisited">0 / 6</strong><span>unidades visitadas</span></div>
      <div class="progress-metric"><strong id="progressQuiz">0 / 0</strong><span>aciertos en práctica</span></div>
      <div class="progress-metric"><strong id="progressLastUnit">—</strong><span>última unidad</span></div>
    </div>
    <div class="progress-track" role="progressbar" aria-label="Unidades completadas" aria-valuemin="0" aria-valuemax="6" aria-valuenow="0"><span id="progressTrackFill"></span></div>
    <div class="progress-footer">
      <p id="progressActivity">Última actividad: sin actividad.</p>
      <a id="progressContinue" class="progress-continue" href="#conoce">Empezar en Fundamentos <span aria-hidden="true">→</span></a>
    </div>
    <p id="progressStatus" aria-live="polite"></p>
  `;

  const note = document.querySelector('.route-note');
  if (note) note.insertAdjacentElement('afterend', panel);
  else route.insertAdjacentElement('afterend', panel);

  panel.querySelector('#progressReset')?.addEventListener('click', () => {
    progress = emptyProgress();
    saveProgress();
    translatorTrackedThisSession = false;
    updateProgressUI('Progreso reiniciado.');
  });
}

function ensureRouteStates() {
  document.querySelectorAll('.learning-step').forEach(step => {
    const unitId = step.getAttribute('href')?.replace('#', '');
    if (!unitById(unitId)) return;
    step.dataset.progressUnit = unitId;

    if (!step.querySelector('.learning-state')) {
      const state = document.createElement('span');
      state.className = 'learning-state';
      state.textContent = 'Pendiente';
      step.appendChild(state);
    }
  });
}

function ensureCompletionControls() {
  BRAILUX_UNITS.forEach(unit => {
    const section = document.querySelector(`#${unit.id}`);
    if (!section) return;
    section.dataset.progressUnit = unit.id;

    const footer = section.querySelector('.unit-next, .unit-complete');
    if (!footer || footer.querySelector('.progress-toggle')) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'progress-toggle';
    button.dataset.unitId = unit.id;
    button.setAttribute('aria-pressed', 'false');
    button.textContent = 'Marcar completada';

    const nextLink = footer.querySelector('a');
    if (nextLink) footer.insertBefore(button, nextLink);
    else footer.appendChild(button);

    button.addEventListener('click', () => {
      toggleUnitComplete(unit.id);
    });

    if (nextLink) {
      nextLink.addEventListener('click', () => {
        if (!progress.completedUnits.includes(unit.id)) {
          completeUnit(unit.id, false);
        }
      });
    }
  });
}

function markVisited(unitId) {
  if (!unitById(unitId)) return;
  let changed = false;

  if (!progress.visitedUnits.includes(unitId)) {
    progress.visitedUnits.push(unitId);
    changed = true;
  }
  if (progress.lastUnit !== unitId) {
    progress.lastUnit = unitId;
    changed = true;
  }

  if (changed) {
    saveProgress();
    updateProgressUI();
  }
}

function completeUnit(unitId, announce = true) {
  const unit = unitById(unitId);
  if (!unit) return;

  if (!progress.visitedUnits.includes(unitId)) progress.visitedUnits.push(unitId);
  if (!progress.completedUnits.includes(unitId)) progress.completedUnits.push(unitId);
  progress.lastUnit = unitId;
  progress.lastActivity = { label: `Unidad completada: ${unit.name}`, at: new Date().toISOString() };
  saveProgress();
  updateProgressUI(announce ? `${unit.name} marcada como completada.` : '');
}

function toggleUnitComplete(unitId) {
  const unit = unitById(unitId);
  if (!unit) return;

  if (progress.completedUnits.includes(unitId)) {
    progress.completedUnits = progress.completedUnits.filter(id => id !== unitId);
    progress.lastActivity = { label: `Unidad reabierta: ${unit.name}`, at: new Date().toISOString() };
    saveProgress();
    updateProgressUI(`${unit.name} volvió a estado pendiente.`);
  } else {
    completeUnit(unitId, true);
  }
}

function updateProgressUI(message = '') {
  const completed = progress.completedUnits.length;
  const visited = progress.visitedUnits.length;
  const lastUnit = unitById(progress.lastUnit);

  const completedEl = document.querySelector('#progressCompleted');
  const visitedEl = document.querySelector('#progressVisited');
  const quizEl = document.querySelector('#progressQuiz');
  const lastUnitEl = document.querySelector('#progressLastUnit');
  const activityEl = document.querySelector('#progressActivity');
  const track = document.querySelector('.progress-track');
  const fill = document.querySelector('#progressTrackFill');
  const continueLink = document.querySelector('#progressContinue');
  const status = document.querySelector('#progressStatus');

  if (completedEl) completedEl.textContent = `${completed} / ${BRAILUX_UNITS.length}`;
  if (visitedEl) visitedEl.textContent = `${visited} / ${BRAILUX_UNITS.length}`;
  if (quizEl) quizEl.textContent = `${progress.quiz.correct} / ${progress.quiz.attempts}`;
  if (lastUnitEl) lastUnitEl.textContent = lastUnit?.name || '—';
  if (activityEl) activityEl.textContent = `Última actividad: ${formatActivity(progress.lastActivity)}.`;
  if (track) track.setAttribute('aria-valuenow', String(completed));
  if (fill) fill.style.width = `${(completed / BRAILUX_UNITS.length) * 100}%`;

  const firstIncomplete = BRAILUX_UNITS.find(unit => !progress.completedUnits.includes(unit.id));
  if (continueLink) {
    if (firstIncomplete) {
      continueLink.href = `#${firstIncomplete.id}`;
      continueLink.innerHTML = `${completed ? 'Continuar' : 'Empezar'}: ${firstIncomplete.name} <span aria-hidden="true">→</span>`;
    } else {
      continueLink.href = '#practica';
      continueLink.innerHTML = 'Ruta completada · Revisar práctica <span aria-hidden="true">→</span>';
    }
  }

  document.querySelectorAll('.learning-step[data-progress-unit]').forEach(step => {
    const unitId = step.dataset.progressUnit;
    const isComplete = progress.completedUnits.includes(unitId);
    const isVisited = progress.visitedUnits.includes(unitId);
    step.classList.toggle('is-complete', isComplete);
    step.classList.toggle('is-visited', isVisited);
    const state = step.querySelector('.learning-state');
    if (state) state.textContent = isComplete ? 'Completada' : isVisited ? 'Visitada' : 'Pendiente';
  });

  document.querySelectorAll('.progress-toggle[data-unit-id]').forEach(button => {
    const unitId = button.dataset.unitId;
    const isComplete = progress.completedUnits.includes(unitId);
    button.setAttribute('aria-pressed', String(isComplete));
    button.textContent = isComplete ? 'Completada ✓' : 'Marcar completada';
  });

  const quizScore = document.querySelector('#quizScore');
  if (quizScore) quizScore.textContent = `${progress.quiz.correct} / ${progress.quiz.attempts}`;

  if (!storageAvailable && activityEl) {
    activityEl.textContent = 'El navegador no permite guardar el progreso local en esta sesión.';
  }

  if (status && message) status.textContent = message;
}

function observeUnits() {
  const sections = BRAILUX_UNITS
    .map(unit => document.querySelector(`#${unit.id}`))
    .filter(Boolean);

  if (!('IntersectionObserver' in window)) {
    const hashUnit = location.hash.replace('#', '');
    if (unitById(hashUnit)) markVisited(hashUnit);
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) markVisited(entry.target.id);
    });
  }, { threshold: 0.3 });

  sections.forEach(section => observer.observe(section));
}

function trackPractice() {
  document.addEventListener('click', event => {
    const quizOption = event.target.closest('.quiz-option');
    if (quizOption && !quizOption.dataset.progressCounted) {
      quizOption.dataset.progressCounted = 'true';
      progress.quiz.attempts += 1;
      if (quizOption.classList.contains('correct')) progress.quiz.correct += 1;
      progress.lastUnit = 'practica';
      progress.lastActivity = { label: 'Práctica de reconocimiento', at: new Date().toISOString() };
      if (!progress.visitedUnits.includes('practica')) progress.visitedUnits.push('practica');
      saveProgress();
      updateProgressUI('Resultado de práctica guardado localmente.');
      return;
    }

    if (event.target.closest('.dot-button')) {
      touchActivity('Constructor de celda');
      updateProgressUI();
      return;
    }

    if (event.target.closest('.series-tab')) {
      touchActivity('Exploración del alfabeto');
      updateProgressUI();
      return;
    }

    if (event.target.closest('.mode-button')) {
      touchActivity('Lectura y escritura');
      updateProgressUI();
    }
  });

  const translator = document.querySelector('#translatorInput');
  translator?.addEventListener('input', () => {
    if (!translator.value.trim() || translatorTrackedThisSession) return;
    translatorTrackedThisSession = true;
    progress.translatorUsed = true;
    progress.lastUnit = 'practica';
    progress.lastActivity = { label: 'Conversor didáctico', at: new Date().toISOString() };
    if (!progress.visitedUnits.includes('practica')) progress.visitedUnits.push('practica');
    saveProgress();
    updateProgressUI('Uso del conversor registrado localmente.');
  });
}

buildProgressPanel();
ensureRouteStates();
ensureCompletionControls();
observeUnits();
trackPractice();
updateProgressUI();
