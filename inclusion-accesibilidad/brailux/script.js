const brailleMap = {
  a: [1], b: [1,2], c: [1,4], d: [1,4,5], e: [1,5],
  f: [1,2,4], g: [1,2,4,5], h: [1,2,5], i: [2,4], j: [2,4,5],
  k: [1,3], l: [1,2,3], m: [1,3,4], n: [1,3,4,5], o: [1,3,5],
  p: [1,2,3,4], q: [1,2,3,4,5], r: [1,2,3,5], s: [2,3,4], t: [2,3,4,5],
  u: [1,3,6], v: [1,2,3,6], w: [2,4,5,6], x: [1,3,4,6], y: [1,3,4,5,6], z: [1,3,5,6],
  ñ: [1,2,4,5,6], á: [1,2,3,5,6], é: [2,3,4,6], í: [3,4], ó: [3,4,6], ú: [2,3,4,5,6], ü: [1,2,5,6]
};

const indicators = {
  numero: [3,4,5,6],
  mayuscula: [4,6],
  completo: [1,2,3,4,5,6]
};

const seriesData = {
  1: {
    badge: 'Primera serie',
    title: 'Las diez primeras letras',
    text: 'A-J se forman combinando únicamente los cuatro puntos superiores: 1, 2, 4 y 5.',
    rule: 'Usa 1 · 2 · 4 · 5',
    items: ['a','b','c','d','e','f','g','h','i','j']
  },
  2: {
    badge: 'Segunda serie',
    title: 'La misma base con un punto añadido',
    text: 'K-T repiten las diez formas de la primera serie y añaden el punto 3, situado en la parte inferior izquierda de la celda.',
    rule: 'Serie 1 + punto 3',
    items: ['k','l','m','n','o','p','q','r','s','t']
  },
  3: {
    badge: 'Tercera serie',
    title: 'La segunda serie incorpora el punto 6',
    text: 'Al añadir el punto 6 a las formas de la segunda serie se obtienen otros diez signos. Entre ellos aparecen U, V, X, Y, Z y varios signos utilizados en distintas lenguas y en el español.',
    rule: 'Serie 2 + punto 6',
    items: ['u','v','x','y','z','ç','6 pts','á','é','ú']
  },
  4: {
    badge: 'Braille integral en español',
    title: 'Letras y signos que completan el uso básico',
    text: 'El español incorpora grafemas propios para Ñ, vocales acentuadas y Ü. La W tiene una configuración particular. Los signos de número y mayúscula modifican el significado de la combinación que los sigue.',
    rule: 'Grafemas + indicadores',
    items: ['w','ñ','ü','á','é','í','ó','ú','Nº','May.']
  }
};

function unicodeBraille(points = []) {
  const bitForDot = {1: 1, 2: 2, 3: 4, 4: 8, 5: 16, 6: 32};
  const value = points.reduce((sum, dot) => sum + bitForDot[dot], 0);
  return String.fromCodePoint(0x2800 + value);
}

function pointsKey(points) {
  return [...points].sort((a,b) => a-b).join('');
}

function displayName(value) {
  if (value === '6 pts') return '6 puntos';
  if (value === 'Nº') return 'Nº';
  if (value === 'May.') return 'May.';
  return value.toUpperCase();
}

function pointsForItem(item) {
  if (brailleMap[item]) return brailleMap[item];
  if (item === 'ç') return [1,2,3,4,6];
  if (item === '6 pts') return indicators.completo;
  if (item === 'Nº') return indicators.numero;
  if (item === 'May.') return indicators.mayuscula;
  return [];
}

const nameByPoints = new Map();
Object.entries(brailleMap).forEach(([char, points]) => nameByPoints.set(pointsKey(points), char.toUpperCase()));
nameByPoints.set(pointsKey([1,2,3,4,6]), 'Ç / signo de otras lenguas');
nameByPoints.set(pointsKey(indicators.numero), 'Signo de número');
nameByPoints.set(pointsKey(indicators.mayuscula), 'Signo de mayúscula');
nameByPoints.set(pointsKey(indicators.completo), 'Signo generador completo');

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const menuButton = document.querySelector('.menu-button');
const mainNav = document.querySelector('.main-nav');
if (menuButton && mainNav) {
  menuButton.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menú');
  }));
}

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => observer.observe(el));
} else {
  revealElements.forEach(el => el.classList.add('visible'));
}

// Constructor de celda
const builderButtons = [...document.querySelectorAll('.dot-button')];
const builderGlyph = document.querySelector('#builderGlyph');
const builderPoints = document.querySelector('#builderPoints');
const builderMatch = document.querySelector('#builderMatch');
const clearCell = document.querySelector('#clearCell');
let selectedDots = new Set();

function updateBuilder() {
  const points = [...selectedDots].sort((a,b) => a-b);
  if (builderGlyph) builderGlyph.textContent = unicodeBraille(points);
  if (builderPoints) builderPoints.textContent = points.length ? `Puntos ${points.join('-')}` : 'Sin puntos seleccionados';
  if (builderMatch) builderMatch.textContent = points.length ? (nameByPoints.get(pointsKey(points)) || 'Combinación válida de la celda') : 'Celda vacía';
}

builderButtons.forEach(button => {
  button.addEventListener('click', () => {
    const dot = Number(button.dataset.dot);
    if (selectedDots.has(dot)) selectedDots.delete(dot); else selectedDots.add(dot);
    const active = selectedDots.has(dot);
    button.setAttribute('aria-pressed', String(active));
    updateBuilder();
  });
});

if (clearCell) {
  clearCell.addEventListener('click', () => {
    selectedDots.clear();
    builderButtons.forEach(button => button.setAttribute('aria-pressed', 'false'));
    updateBuilder();
    builderButtons[0]?.focus();
  });
}

// Series del alfabeto: patrón de pestañas accesible con panel dinámico
const alphabetGrid = document.querySelector('#alphabetGrid');
const seriesNav = document.querySelector('.series-nav');
const seriesTabs = [...document.querySelectorAll('.series-tab')];
const seriesExplainer = document.querySelector('.series-explainer');
const seriesBadge = document.querySelector('#seriesBadge');
const seriesTitle = document.querySelector('#seriesTitle');
const seriesText = document.querySelector('#seriesText');
const seriesRule = document.querySelector('#seriesRule');
let seriesPanel = null;

function setupSeriesTabs() {
  if (!seriesNav || !seriesTabs.length || !seriesExplainer || !alphabetGrid) return;

  seriesNav.setAttribute('aria-orientation', 'horizontal');

  seriesPanel = document.createElement('div');
  seriesPanel.id = 'series-panel';
  seriesPanel.setAttribute('role', 'tabpanel');
  seriesPanel.setAttribute('tabindex', '0');

  seriesExplainer.parentNode.insertBefore(seriesPanel, seriesExplainer);
  seriesPanel.append(seriesExplainer, alphabetGrid);
  alphabetGrid.removeAttribute('aria-live');

  seriesTabs.forEach((tab, index) => {
    const active = index === 0;
    tab.id = `series-tab-${index + 1}`;
    tab.setAttribute('aria-controls', seriesPanel.id);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    tab.classList.toggle('active', active);
  });

  seriesPanel.setAttribute('aria-labelledby', seriesTabs[0].id);
}

function renderSeries(id = 1) {
  const data = seriesData[id];
  if (!data || !alphabetGrid) return;
  if (seriesBadge) seriesBadge.textContent = data.badge;
  if (seriesTitle) seriesTitle.textContent = data.title;
  if (seriesText) seriesText.textContent = data.text;
  if (seriesRule) seriesRule.textContent = data.rule;
  alphabetGrid.innerHTML = '';

  data.items.forEach(item => {
    const points = pointsForItem(item);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'letter-card';
    const glyph = unicodeBraille(points);
    const label = displayName(item);
    button.setAttribute('aria-label', `${label}: puntos ${points.join(', ')}`);
    button.innerHTML = `
      <span class="letter-top">
        <span class="letter-char">${label}</span>
        <span class="letter-glyph" aria-hidden="true">${glyph}</span>
      </span>
      <span class="letter-points">Puntos ${points.join('-')}</span>
    `;
    button.addEventListener('click', () => loadBuilder(points, label));
    alphabetGrid.appendChild(button);
  });
}

function loadBuilder(points, label) {
  selectedDots = new Set(points);
  builderButtons.forEach(button => {
    const dot = Number(button.dataset.dot);
    button.setAttribute('aria-pressed', String(selectedDots.has(dot)));
  });
  updateBuilder();
  if (builderMatch) builderMatch.textContent = label;
  document.querySelector('#generador')?.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
}

function activateSeriesTab(tab, moveFocus = false) {
  if (!tab || !seriesTabs.includes(tab)) return;

  seriesTabs.forEach(other => {
    const active = other === tab;
    other.classList.toggle('active', active);
    other.setAttribute('aria-selected', String(active));
    other.tabIndex = active ? 0 : -1;
  });

  if (seriesPanel) seriesPanel.setAttribute('aria-labelledby', tab.id);
  renderSeries(Number(tab.dataset.series));
  if (moveFocus) tab.focus();
}

setupSeriesTabs();

seriesTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateSeriesTab(tab));

  tab.addEventListener('keydown', event => {
    let nextIndex = null;

    if (event.key === 'ArrowRight') nextIndex = (index + 1) % seriesTabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + seriesTabs.length) % seriesTabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = seriesTabs.length - 1;

    if (nextIndex !== null) {
      event.preventDefault();
      activateSeriesTab(seriesTabs[nextIndex], true);
    }
  });
});
renderSeries(1);

// Comparador lectura / escritura
const modeButtons = [...document.querySelectorAll('.mode-button')];
const modeContent = document.querySelector('#modeContent');
const modeData = {
  read: {
    direction: 'Izquierda <b>→</b> derecha',
    cell: [1,4,2,5,3,6],
    text: 'En lectura, la columna izquierda corresponde a los puntos 1, 2 y 3; la derecha, a los puntos 4, 5 y 6.'
  },
  write: {
    direction: 'Derecha <b>←</b> izquierda',
    cell: [4,1,5,2,6,3],
    text: 'Con pauta o regleta negativa y punzón se trabaja por el reverso del papel. La disposición se observa en espejo y el punto 1 queda a la derecha.'
  },
  positive: {
    direction: 'Izquierda <b>→</b> derecha',
    cell: [1,4,2,5,3,6],
    text: 'En máquinas Braille, líneas Braille y regletas positivas, la escritura coincide con el sentido de lectura y no requiere invertir el papel para interpretar el resultado.'
  }
};

function renderMode(mode) {
  if (!modeContent || !modeData[mode]) return;
  const data = modeData[mode];
  modeContent.innerHTML = `
    <span class="direction">${data.direction}</span>
    <div class="mode-cell">${data.cell.map(n => `<span>${n}</span>`).join('')}</div>
    <p>${data.text}</p>
  `;
}

modeButtons.forEach(button => {
  button.addEventListener('click', () => {
    modeButtons.forEach(other => {
      const active = other === button;
      other.classList.toggle('active', active);
      other.setAttribute('aria-pressed', String(active));
    });
    renderMode(button.dataset.mode);
  });
});

// Números
const numberGrid = document.querySelector('#numberGrid');
if (numberGrid) {
  const numberLetters = ['a','b','c','d','e','f','g','h','i','j'];
  const digits = ['1','2','3','4','5','6','7','8','9','0'];
  digits.forEach((digit, index) => {
    const item = document.createElement('div');
    item.className = 'number-item';
    item.innerHTML = `<strong>${digit}</strong><span aria-hidden="true">${unicodeBraille(brailleMap[numberLetters[index]])}</span><small>${numberLetters[index].toUpperCase()}</small>`;
    numberGrid.appendChild(item);
  });
}

// Quiz de reconocimiento
const quizCharacters = 'abcdefghijklmnopqrstuvxyz'.split('');
const quizCell = document.querySelector('#quizCell');
const quizOptions = document.querySelector('#quizOptions');
const quizFeedback = document.querySelector('#quizFeedback');
const quizScore = document.querySelector('#quizScore');
const nextQuiz = document.querySelector('#nextQuiz');
let currentAnswer = 'a';
let attempts = 0;
let correctAnswers = 0;
let answered = false;

if (quizOptions) {
  quizOptions.setAttribute('role', 'group');
  quizOptions.setAttribute('aria-label', 'Opciones de respuesta del ejercicio');
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function renderQuiz() {
  if (!quizCell || !quizOptions) return;
  answered = false;
  currentAnswer = quizCharacters[Math.floor(Math.random() * quizCharacters.length)];
  const activePoints = new Set(brailleMap[currentAnswer]);
  const cellOrder = [1,4,2,5,3,6];
  quizCell.innerHTML = cellOrder.map(dot => `<span class="quiz-dot ${activePoints.has(dot) ? 'active' : ''}" aria-hidden="true"></span>`).join('');
  quizCell.setAttribute('aria-label', `Celda con puntos ${[...activePoints].sort((a,b)=>a-b).join(', ')}`);

  const distractors = shuffle(quizCharacters.filter(char => char !== currentAnswer)).slice(0,3);
  const options = shuffle([currentAnswer, ...distractors]);
  quizOptions.innerHTML = '';
  options.forEach(char => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'quiz-option';
    button.textContent = char.toUpperCase();
    button.addEventListener('click', () => answerQuiz(char, button));
    quizOptions.appendChild(button);
  });
  if (quizFeedback) quizFeedback.textContent = '';
}

function answerQuiz(char, button) {
  if (answered) return;
  answered = true;
  attempts += 1;
  const correct = char === currentAnswer;
  if (correct) correctAnswers += 1;
  button.classList.add(correct ? 'correct' : 'wrong');
  [...quizOptions.children].forEach(option => {
    option.disabled = true;
    if (option.textContent.toLowerCase() === currentAnswer) option.classList.add('correct');
  });
  if (quizFeedback) quizFeedback.textContent = correct ? `Correcto. Es la letra ${currentAnswer.toUpperCase()}.` : `La respuesta correcta es ${currentAnswer.toUpperCase()}.`;
  if (quizScore) quizScore.textContent = `${correctAnswers} / ${attempts}`;
}

if (nextQuiz) nextQuiz.addEventListener('click', renderQuiz);
renderQuiz();

// Conversor didáctico básico
const translatorInput = document.querySelector('#translatorInput');
const translatorOutput = document.querySelector('#translatorOutput');
const digitMap = {
  '1': 'a', '2': 'b', '3': 'c', '4': 'd', '5': 'e',
  '6': 'f', '7': 'g', '8': 'h', '9': 'i', '0': 'j'
};
const numberSign = unicodeBraille(indicators.numero);
const capitalSign = unicodeBraille(indicators.mayuscula);

function translateBasic(text) {
  let output = '';
  let inNumber = false;
  for (const original of text) {
    if (/\d/.test(original)) {
      if (!inNumber) output += numberSign;
      output += unicodeBraille(brailleMap[digitMap[original]]);
      inNumber = true;
      continue;
    }

    inNumber = false;
    if (original === ' ') {
      output += ' ';
      continue;
    }

    const lower = original.toLocaleLowerCase('es');
    if (brailleMap[lower]) {
      if (original !== lower) output += capitalSign;
      output += unicodeBraille(brailleMap[lower]);
    } else {
      output += '□';
    }
  }
  return output;
}

if (translatorInput && translatorOutput) {
  translatorInput.addEventListener('input', () => {
    const value = translatorInput.value;
    translatorOutput.textContent = value ? translateBasic(value) : 'Escribe arriba para comenzar.';
  });
}
