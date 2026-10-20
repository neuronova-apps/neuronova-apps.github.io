(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];

  const board = $('#crossword');
  const check = $('#checkAnswer');
  const clearWordButton = $('#clearWord');
  const reset = $('#resetGame');
  const message = $('#gameMessage');
  const solvedCount = $('#solvedCount');
  const bestScore = $('#bestScore');
  const progressState = $('#progressState');
  const gameKicker = $('#gameKicker');
  const gameTitle = $('#game-title');
  const challengeSummary = $('#challengeSummary');
  const acrossClues = $('#acrossClues');
  const downClues = $('#downClues');

  if (!board || !check || !clearWordButton || !reset || !acrossClues || !downClues) {
    return;
  }

  const STORAGE_KEY = 'crucilux-progress-v1';
  const STORAGE_VERSION = 5;
  const DEFAULT_CHALLENGE = 'cotidianas';
  const GRID_SIZE = 5;

  const puzzles = {
    cotidianas: {
      title: 'Palabras cotidianas',
      kicker: 'Reto 1 · Inicio',
      selectorSubtitle: 'Inicio · 3 palabras',
      summary: 'Tres conceptos breves y familiares para comenzar.',
      words: {
        SOL: { number: 1, direction: 'across', indices: [1, 2, 3], clue: 'Estrella que ilumina nuestro planeta.' },
        MAR: { number: 2, direction: 'across', indices: [15, 16, 17], clue: 'Gran extensión de agua salada.' },
        LUZ: { number: 3, direction: 'down', indices: [3, 8, 13], clue: 'Hace posible que podamos ver.' }
      },
      order: ['SOL', 'MAR', 'LUZ']
    },
    naturaleza: {
      title: 'Naturaleza',
      kicker: 'Reto 2 · Naturaleza',
      selectorSubtitle: 'Cielo, agua y tierra · 3 palabras',
      summary: 'Palabras relacionadas con el cielo, el agua y la tierra.',
      words: {
        LUNA: { number: 1, direction: 'across', indices: [0, 1, 2, 3], clue: 'Satélite natural visible en el cielo nocturno.' },
        ROCA: { number: 2, direction: 'across', indices: [15, 16, 17, 18], clue: 'Material sólido que forma parte de la corteza terrestre.' },
        AGUA: { number: 3, direction: 'down', indices: [3, 8, 13, 18], clue: 'Líquido esencial presente en ríos, lagos y mares.' }
      },
      order: ['LUNA', 'ROCA', 'AGUA']
    },
    lenguaje: {
      title: 'Lenguaje e ideas',
      kicker: 'Reto 3 · Lenguaje',
      selectorSubtitle: 'Lectura y expresión · 3 palabras',
      summary: 'Conceptos vinculados con expresión, lectura y pensamiento.',
      words: {
        LIBRO: { number: 1, direction: 'across', indices: [5, 6, 7, 8, 9], clue: 'Obra escrita formada por páginas reunidas en un volumen.' },
        IDEA: { number: 2, direction: 'across', indices: [20, 21, 22, 23], clue: 'Representación mental, pensamiento o propuesta.' },
        RISA: { number: 3, direction: 'down', indices: [8, 13, 18, 23], clue: 'Expresión de alegría que suele acompañarse de sonidos.' }
      },
      order: ['LIBRO', 'IDEA', 'RISA']
    },
    hogar: {
      title: 'Objetos y espacios',
      kicker: 'Reto 4 · Cotidiano',
      selectorSubtitle: 'Casa y entorno · 3 palabras',
      summary: 'Elementos sencillos del entorno diario para ampliar la práctica.',
      words: {
        PISO: { number: 1, direction: 'across', indices: [0, 1, 2, 3], clue: 'Superficie sobre la que caminamos dentro de una habitación.' },
        LADO: { number: 2, direction: 'across', indices: [10, 11, 12, 13], clue: 'Cada una de las partes que delimitan una figura o una posición.' },
        OJO: { number: 3, direction: 'down', indices: [3, 8, 13], clue: 'Órgano que permite percibir la luz y las imágenes.' }
      },
      order: ['PISO', 'LADO', 'OJO']
    },
    naturaleza2: {
      title: 'Naturaleza cercana',
      kicker: 'Reto 5 · Naturaleza',
      selectorSubtitle: 'Plantas y caminos · 3 palabras',
      summary: 'Conceptos relacionados con plantas, hojas y recorridos al aire libre.',
      words: {
        FLOR: { number: 1, direction: 'across', indices: [0, 1, 2, 3], clue: 'Parte de muchas plantas que suele contener los órganos reproductores.' },
        HOJA: { number: 2, direction: 'across', indices: [15, 16, 17, 18], clue: 'Parte plana de una planta que normalmente realiza fotosíntesis.' },
        RUTA: { number: 3, direction: 'down', indices: [3, 8, 13, 18], clue: 'Camino o itinerario que se sigue para llegar a un lugar.' }
      },
      order: ['FLOR', 'HOJA', 'RUTA']
    },
    lenguaje2: {
      title: 'Palabras y expresión',
      kicker: 'Reto 6 · Lenguaje',
      selectorSubtitle: 'Lectura y poesía · 3 palabras',
      summary: 'Un segundo reto de lenguaje centrado en lectura, ideas y recursos expresivos.',
      words: {
        LEER: { number: 1, direction: 'across', indices: [0, 1, 2, 3], clue: 'Interpretar signos escritos para comprender un mensaje.' },
        IDEA: { number: 2, direction: 'across', indices: [15, 16, 17, 18], clue: 'Pensamiento, representación mental o propuesta.' },
        RIMA: { number: 3, direction: 'down', indices: [3, 8, 13, 18], clue: 'Coincidencia de sonidos al final de dos o más versos.' }
      },
      order: ['LEER', 'IDEA', 'RIMA']
    },
    cultura: {
      title: 'Cultura general',
      kicker: 'Reto 7 · Cultura',
      selectorSubtitle: 'Arte y cine · 3 palabras',
      summary: 'Conceptos básicos vinculados con creación artística y expresión cultural.',
      words: {
        ARTE: { number: 1, direction: 'across', indices: [0, 1, 2, 3], clue: 'Actividad humana orientada a crear obras con intención estética o expresiva.' },
        CINE: { number: 2, direction: 'across', indices: [15, 16, 17, 18], clue: 'Arte y técnica de crear y proyectar imágenes en movimiento.' },
        ESTE: { number: 3, direction: 'down', indices: [3, 8, 13, 18], clue: 'Punto cardinal por donde aparece aproximadamente el Sol.' }
      },
      order: ['ARTE', 'CINE', 'ESTE']
    },
    cultura2: {
      title: 'Creación y obras',
      kicker: 'Reto 8 · Cultura',
      selectorSubtitle: 'Creación artística · 3 palabras',
      summary: 'Vocabulario asociado con inspiración, creación y producción cultural.',
      words: {
        MUSA: { number: 1, direction: 'across', indices: [0, 1, 2, 3], clue: 'Persona o idea que inspira la creación artística.' },
        OBRA: { number: 2, direction: 'across', indices: [15, 16, 17, 18], clue: 'Resultado de una creación artística, literaria o intelectual.' },
        ALMA: { number: 3, direction: 'down', indices: [3, 8, 13, 18], clue: 'Palabra usada de forma figurada para expresar la esencia de algo.' }
      },
      order: ['MUSA', 'OBRA', 'ALMA']
    },
    ciencia: {
      title: 'Ciencia básica',
      kicker: 'Reto 9 · Ciencia',
      selectorSubtitle: 'Observación y medida · 3 palabras',
      summary: 'Conceptos sencillos asociados con observación, materia y lenguaje científico.',
      words: {
        LUPA: { number: 1, direction: 'across', indices: [0, 1, 2, 3], clue: 'Lente que permite observar un objeto con mayor tamaño aparente.' },
        MASA: { number: 2, direction: 'across', indices: [15, 16, 17, 18], clue: 'Magnitud física que expresa la cantidad de materia de un cuerpo.' },
        ALFA: { number: 3, direction: 'down', indices: [3, 8, 13, 18], clue: 'Primera letra del alfabeto griego, usada también en notación científica.' }
      },
      order: ['LUPA', 'MASA', 'ALFA']
    },
    geografia: {
      title: 'Geografía',
      kicker: 'Reto 10 · Geografía',
      selectorSubtitle: 'Lugares y territorio · 3 palabras',
      summary: 'Nombres y conceptos básicos para orientarse entre ciudad, mapa y territorio.',
      words: {
        LIMA: { number: 1, direction: 'across', indices: [0, 1, 2, 3], clue: 'Capital del Perú.' },
        MAPA: { number: 2, direction: 'across', indices: [15, 16, 17, 18], clue: 'Representación gráfica de un territorio o una parte de él.' },
        AREA: { number: 3, direction: 'down', indices: [3, 8, 13, 18], clue: 'Superficie comprendida dentro de determinados límites.' }
      },
      order: ['LIMA', 'MAPA', 'AREA']
    },
    biblia: {
      title: 'Biblia',
      kicker: 'Reto 11 · Biblia',
      selectorSubtitle: 'Conceptos bíblicos · 3 palabras',
      summary: 'Un reto breve con palabras frecuentes en relatos y expresiones bíblicas.',
      words: {
        VER: { number: 1, direction: 'across', indices: [0, 1, 2], clue: 'Percibir con los ojos; verbo frecuente en numerosos relatos bíblicos.' },
        AMEN: { number: 2, direction: 'across', indices: [15, 16, 17, 18], clue: 'Expresión de afirmación que suele cerrar oraciones.' },
        VIDA: { number: 3, direction: 'down', indices: [0, 5, 10, 15], clue: 'Condición de los seres vivos y tema recurrente en las Escrituras.' }
      },
      order: ['VER', 'AMEN', 'VIDA']
    },
    miscelanea: {
      title: 'Miscelánea',
      kicker: 'Reto 12 · Mixto',
      selectorSubtitle: 'Conceptos variados · 3 palabras',
      summary: 'Un cierre variado que combina objetos, emociones y espacios cotidianos.',
      words: {
        CAFE: { number: 1, direction: 'across', indices: [0, 1, 2, 3], clue: 'Bebida preparada habitualmente con granos tostados y molidos.' },
        AMOR: { number: 2, direction: 'across', indices: [15, 16, 17, 18], clue: 'Afecto intenso hacia una persona, ser o realidad.' },
        CASA: { number: 3, direction: 'down', indices: [0, 5, 10, 15], clue: 'Edificio o lugar destinado principalmente a vivienda.' }
      },
      order: ['CAFE', 'AMOR', 'CASA']
    }
  };

  const challengeIds = Object.keys(puzzles);

  function validatePuzzles() {
    challengeIds.forEach(id => {
      const puzzle = puzzles[id];
      const lettersByIndex = new Map();
      puzzle.order.forEach(word => {
        const entry = puzzle.words[word];
        if (!entry || entry.indices.length !== word.length) {
          throw new Error(`Crucilux: definición inválida en ${id}/${word}.`);
        }
        entry.indices.forEach((index, letterIndex) => {
          const letter = word[letterIndex];
          const previous = lettersByIndex.get(index);
          if (previous && previous !== letter) {
            throw new Error(`Crucilux: cruce incompatible en ${id}, casilla ${index}.`);
          }
          lettersByIndex.set(index, letter);
        });
      });
    });
  }

  function buildChallengeSelector() {
    const selector = $('.challenge-selector');
    if (!selector) return;
    challengeIds.forEach((id, index) => {
      const puzzle = puzzles[id];
      let button = selector.querySelector(`[data-challenge="${id}"]`);
      if (!button) {
        button = document.createElement('button');
        button.className = 'challenge-option';
        button.type = 'button';
        button.dataset.challenge = id;
        button.setAttribute('aria-pressed', 'false');
        selector.appendChild(button);
      }
      button.replaceChildren();
      const number = document.createElement('span');
      number.className = 'challenge-number';
      number.textContent = String(index + 1).padStart(2, '0');
      const title = document.createElement('strong');
      title.textContent = puzzle.title;
      const subtitle = document.createElement('small');
      subtitle.textContent = puzzle.selectorSubtitle;
      const status = document.createElement('span');
      status.className = 'challenge-status';
      status.textContent = `0/${puzzle.order.length}`;
      button.append(number, title, subtitle, status);
    });
  }

  function syncChallengeCopy() {
    const totalChallenges = challengeIds.length;
    const totalWords = challengeIds.reduce((sum, id) => sum + puzzles[id].order.length, 0);
    const metrics = $$('.hero-metrics > div');
    if (metrics[0]?.querySelector('strong')) metrics[0].querySelector('strong').textContent = String(totalChallenges).padStart(2, '0');
    if (metrics[0]?.querySelector('span')) metrics[0].querySelector('span').textContent = 'Retos disponibles';
    if (metrics[1]?.querySelector('strong')) metrics[1].querySelector('strong').textContent = String(totalWords).padStart(2, '0');
    if (metrics[1]?.querySelector('span')) metrics[1].querySelector('span').textContent = 'Palabras en total';
    const lead = $('.hero .lead');
    if (lead) lead.textContent = `Crucilux ofrece ${totalChallenges} retos de crucigrama con categorías distintas. Escribe cada letra directamente en el tablero, aprovecha los cruces, recibe orientación gradual y consulta guías para comprender mejor las pistas y estrategias de resolución.`;
    const playDescription = $('.play-section .section-heading > p');
    if (playDescription) playDescription.textContent = `Los ${totalChallenges} retos funcionan directamente en el navegador. La comprobación distingue palabras incompletas de intentos incorrectos, indica cuántas letras están bien colocadas y ofrece pistas graduales sin escribir la respuesta automáticamente.`;
    const methodHeading = $('.method-section .section-heading h2');
    if (methodHeading) methodHeading.textContent = `${totalChallenges} retos con feedback progresivo.`;
    const chooseCard = $('.method-grid .method-card:first-child p');
    if (chooseCard) chooseCard.textContent = 'Selecciona uno de los retos disponibles y cambia de categoría cuando quieras.';
    const footerSummary = $('.site-footer .footer-grid > div:first-child > p');
    if (footerSummary) footerSummary.textContent = `${totalChallenges} crucigramas, ${totalWords} respuestas y cinco guías educativas para practicar vocabulario y razonamiento verbal.`;
  }

  validatePuzzles();
  buildChallengeSelector();
  syncChallengeCopy();
  const challengeButtons = $$('.challenge-option');
  const states = Object.fromEntries(challengeIds.map(id => [id, createEmptyState(id)]));

  let selectedChallenge = DEFAULT_CHALLENGE;
  let restored = false;

  function normalizeLetter(value) {
    return String(value ?? '')
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-ZÑ]/g, '')
      .slice(-1);
  }

  function occupiedIndices(puzzle) {
    const occupied = new Set();
    puzzle.order.forEach(word => {
      puzzle.words[word].indices.forEach(index => occupied.add(index));
    });
    return occupied;
  }

  function wordsForIndex(puzzle, index) {
    return puzzle.order.filter(word => puzzle.words[word].indices.includes(index));
  }

  function firstIndexForWord(puzzle, word) {
    return puzzle.words[word].indices[0];
  }

  function createEmptyState(challengeId) {
    const puzzle = puzzles[challengeId];
    return {
      best: 0,
      solved: new Set(),
      active: puzzle.order[0],
      letters: {},
      selectedIndex: firstIndexForWord(puzzle, puzzle.order[0])
    };
  }

  function normalizeState(challengeId, storedState = {}) {
    const puzzle = puzzles[challengeId];
    const occupied = occupiedIndices(puzzle);
    const validWords = new Set(puzzle.order);
    const solved = new Set(Array.isArray(storedState.solved) ? storedState.solved.filter(word => validWords.has(word)) : []);
    const storedBest = Number(storedState.best);
    const best = Number.isFinite(storedBest)
      ? Math.max(solved.size, Math.min(puzzle.order.length, Math.max(0, Math.floor(storedBest))))
      : solved.size;
    const active = validWords.has(storedState.active) ? storedState.active : puzzle.order[0];
    const letters = {};
    if (storedState.letters && typeof storedState.letters === 'object') {
      Object.entries(storedState.letters).forEach(([key, value]) => {
        const index = Number(key);
        const letter = normalizeLetter(value);
        if (Number.isInteger(index) && occupied.has(index) && letter) letters[index] = letter;
      });
    }
    solved.forEach(word => {
      puzzle.words[word].indices.forEach((index, letterIndex) => {
        letters[index] = word[letterIndex];
      });
    });
    const storedSelected = Number(storedState.selectedIndex);
    const selectedIndex = Number.isInteger(storedSelected) && occupied.has(storedSelected)
      ? storedSelected
      : firstIndexForWord(puzzle, active);
    return { best, solved, active, letters, selectedIndex };
  }

  function readStoredProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const stored = JSON.parse(raw);
      if (stored && typeof stored.challenges === 'object' && stored.challenges !== null) {
        challengeIds.forEach(id => {
          states[id] = normalizeState(id, stored.challenges[id]);
        });
        if (challengeIds.includes(stored.selectedChallenge)) selectedChallenge = stored.selectedChallenge;
      } else {
        states[DEFAULT_CHALLENGE] = normalizeState(DEFAULT_CHALLENGE, stored || {});
      }
      restored = challengeIds.some(id => {
        const state = states[id];
        return state.solved.size > 0 || Object.keys(state.letters).length > 0;
      });
    } catch (_) {}
  }

  function persistProgress() {
    try {
      const challenges = {};
      challengeIds.forEach(id => {
        const state = states[id];
        challenges[id] = {
          best: state.best,
          solved: [...state.solved],
          active: state.active,
          letters: state.letters,
          selectedIndex: state.selectedIndex
        };
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, selectedChallenge, challenges }));
    } catch (_) {}
  }

  function currentPuzzle() { return puzzles[selectedChallenge]; }
  function currentState() { return states[selectedChallenge]; }

  function isLockedIndex(index) {
    const puzzle = currentPuzzle();
    const state = currentState();
    return wordsForIndex(puzzle, index).some(word => state.solved.has(word));
  }

  function startNumberForIndex(puzzle, index) {
    const starter = puzzle.order.find(word => puzzle.words[word].indices[0] === index);
    return starter ? puzzle.words[starter].number : null;
  }

  function directionLabel(direction) {
    return direction === 'down' ? 'vertical' : 'horizontal';
  }

  function cellLabel(index) {
    const puzzle = currentPuzzle();
    const state = currentState();
    const row = Math.floor(index / GRID_SIZE) + 1;
    const column = (index % GRID_SIZE) + 1;
    const letter = state.letters[index] || '';
    const memberships = wordsForIndex(puzzle, index)
      .map(word => `${puzzle.words[word].number} ${directionLabel(puzzle.words[word].direction)}`)
      .join(' y ');
    const status = isLockedIndex(index) ? 'Casilla resuelta.' : 'Casilla editable.';
    return `Fila ${row}, columna ${column}. ${letter ? `Letra ${letter}.` : 'Vacía.'} ${status} Pistas ${memberships}.`;
  }

  function buildBoard() {
    const puzzle = currentPuzzle();
    const occupied = occupiedIndices(puzzle);
    board.innerHTML = '';
    board.setAttribute('aria-rowcount', String(GRID_SIZE));
    board.setAttribute('aria-colcount', String(GRID_SIZE));
    for (let index = 0; index < GRID_SIZE * GRID_SIZE; index += 1) {
      const cell = document.createElement('div');
      const isBlock = !occupied.has(index);
      cell.className = isBlock ? 'cell block' : 'cell';
      cell.dataset.index = String(index);
      cell.setAttribute('role', 'gridcell');
      cell.setAttribute('aria-rowindex', String(Math.floor(index / GRID_SIZE) + 1));
      cell.setAttribute('aria-colindex', String((index % GRID_SIZE) + 1));
      if (isBlock) {
        cell.setAttribute('aria-hidden', 'true');
        board.appendChild(cell);
        continue;
      }
      const clueNumber = startNumberForIndex(puzzle, index);
      if (clueNumber !== null) {
        const number = document.createElement('span');
        number.className = 'cell-number';
        number.textContent = String(clueNumber);
        number.setAttribute('aria-hidden', 'true');
        cell.appendChild(number);
      }
      const letterInput = document.createElement('input');
      letterInput.className = 'cell-input';
      letterInput.type = 'text';
      letterInput.maxLength = 1;
      letterInput.autocomplete = 'off';
      letterInput.autocapitalize = 'characters';
      letterInput.spellcheck = false;
      letterInput.inputMode = 'text';
      letterInput.dataset.index = String(index);
      letterInput.addEventListener('focus', () => selectCell(index, false));
      letterInput.addEventListener('click', () => letterInput.select());
      letterInput.addEventListener('input', event => handleCellInput(event, index));
      letterInput.addEventListener('keydown', event => handleCellKeydown(event, index));
      cell.appendChild(letterInput);
      board.appendChild(cell);
    }
  }

  function createClueButton(word) {
    const puzzle = currentPuzzle();
    const entry = puzzle.words[word];
    const button = document.createElement('button');
    button.className = 'clue';
    button.type = 'button';
    button.dataset.word = word;
    const number = document.createElement('span');
    number.textContent = String(entry.number);
    const text = document.createElement('span');
    text.textContent = entry.clue;
    button.append(number, text);
    button.addEventListener('click', () => selectWord(word));
    return button;
  }

  function buildClues() {
    const puzzle = currentPuzzle();
    acrossClues.innerHTML = '';
    downClues.innerHTML = '';
    puzzle.order.forEach(word => {
      const target = puzzle.words[word].direction === 'down' ? downClues : acrossClues;
      target.appendChild(createClueButton(word));
    });
  }

  function renderBoard() {
    const puzzle = currentPuzzle();
    const state = currentState();
    const activeIndices = new Set(puzzle.words[state.active].indices);
    $$('.cell:not(.block)').forEach(cell => {
      const index = Number(cell.dataset.index);
      const input = cell.querySelector('.cell-input');
      const locked = isLockedIndex(index);
      const selected = index === state.selectedIndex;
      cell.classList.toggle('active-word', activeIndices.has(index));
      cell.classList.toggle('selected', selected);
      cell.classList.toggle('solved', locked);
      cell.classList.toggle('locked', locked);
      cell.setAttribute('aria-selected', String(selected));
      cell.setAttribute('aria-readonly', String(locked));
      if (input) {
        input.value = state.letters[index] || '';
        input.readOnly = locked;
        input.tabIndex = selected ? 0 : -1;
        input.setAttribute('aria-label', cellLabel(index));
      }
    });
  }

  function renderClueState() {
    const state = currentState();
    $$('.clue').forEach(clue => {
      const word = clue.dataset.word;
      clue.classList.toggle('done', state.solved.has(word));
      clue.classList.toggle('active', word === state.active);
      clue.setAttribute('aria-pressed', String(word === state.active));
    });
  }

  function renderChallengeSelector() {
    challengeButtons.forEach(button => {
      const id = button.dataset.challenge;
      const puzzle = puzzles[id];
      const state = states[id];
      if (!puzzle || !state) return;
      const active = id === selectedChallenge;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
      const status = button.querySelector('.challenge-status');
      if (status) status.textContent = state.solved.size === puzzle.order.length ? 'Completado' : `${state.solved.size}/${puzzle.order.length}`;
    });
  }

  function renderHeader() {
    const puzzle = currentPuzzle();
    if (gameKicker) gameKicker.textContent = puzzle.kicker;
    if (gameTitle) gameTitle.textContent = puzzle.title;
    if (challengeSummary) challengeSummary.textContent = puzzle.summary;
  }

  function renderStats() {
    const puzzle = currentPuzzle();
    const state = currentState();
    const total = puzzle.order.length;
    if (state.solved.size > state.best) state.best = state.solved.size;
    if (solvedCount) solvedCount.textContent = `${state.solved.size}/${total}`;
    if (bestScore) bestScore.textContent = `${state.best}/${total}`;
    if (progressState) {
      progressState.textContent = state.solved.size === total ? 'Completado' : state.solved.size || Object.keys(state.letters).length ? 'En progreso' : 'Comenzar';
    }
  }

  function render() {
    renderBoard();
    renderClueState();
    renderChallengeSelector();
    renderHeader();
    renderStats();
    persistProgress();
  }

  function focusCell(index) {
    const input = board.querySelector(`.cell-input[data-index="${index}"]`);
    if (input) {
      input.focus();
      input.select();
    }
  }

  function chooseCellForWord(word) {
    const puzzle = currentPuzzle();
    const state = currentState();
    const indices = puzzle.words[word].indices;
    const currentIsUseful = indices.includes(state.selectedIndex) && !isLockedIndex(state.selectedIndex);
    if (currentIsUseful) return state.selectedIndex;
    return indices.find(index => !isLockedIndex(index) && !state.letters[index]) ?? indices.find(index => !isLockedIndex(index)) ?? indices[0];
  }

  function selectWord(word, focus = true) {
    const puzzle = currentPuzzle();
    const state = currentState();
    if (!puzzle.words[word]) return;
    state.active = word;
    state.selectedIndex = chooseCellForWord(word);
    renderBoard();
    renderClueState();
    persistProgress();
    if (focus) focusCell(state.selectedIndex);
    if (message) {
      message.className = 'game-message';
      message.textContent = state.solved.has(word) ? 'Esta palabra ya está resuelta. Puedes usar sus letras en los cruces.' : 'Escribe una letra directamente en cada casilla y luego comprueba la palabra.';
    }
  }

  function selectCell(index, focus = true) {
    const puzzle = currentPuzzle();
    const state = currentState();
    const memberships = wordsForIndex(puzzle, index);
    if (!memberships.length) return;
    state.selectedIndex = index;
    if (!memberships.includes(state.active)) state.active = memberships[0];
    renderBoard();
    renderClueState();
    persistProgress();
    if (focus) focusCell(index);
  }

  function nextEditableInActive(index, delta) {
    const puzzle = currentPuzzle();
    const state = currentState();
    const indices = puzzle.words[state.active].indices;
    const position = indices.indexOf(index);
    if (position === -1) return null;
    for (let next = position + delta; next >= 0 && next < indices.length; next += delta) {
      if (!isLockedIndex(indices[next])) return indices[next];
    }
    return null;
  }

  function handleCellInput(event, index) {
    const state = currentState();
    if (isLockedIndex(index)) {
      event.target.value = state.letters[index] || '';
      return;
    }
    const letter = normalizeLetter(event.target.value);
    if (letter) {
      state.letters[index] = letter;
      event.target.value = letter;
    } else {
      delete state.letters[index];
      event.target.value = '';
    }
    state.selectedIndex = index;
    renderStats();
    persistProgress();
    if (letter) {
      const next = nextEditableInActive(index, 1);
      if (next !== null) {
        state.selectedIndex = next;
        renderBoard();
        persistProgress();
        focusCell(next);
      } else if (message) {
        message.className = 'game-message';
        message.textContent = 'La palabra activa tiene todas sus casillas completas. Pulsa “Comprobar palabra”.';
      }
    }
  }

  function moveByGrid(index, rowDelta, columnDelta) {
    const row = Math.floor(index / GRID_SIZE);
    const column = index % GRID_SIZE;
    const targetRow = row + rowDelta;
    const targetColumn = column + columnDelta;
    if (targetRow < 0 || targetRow >= GRID_SIZE || targetColumn < 0 || targetColumn >= GRID_SIZE) return;
    const target = targetRow * GRID_SIZE + targetColumn;
    if (occupiedIndices(currentPuzzle()).has(target)) selectCell(target);
  }

  function handleCellKeydown(event, index) {
    const state = currentState();
    if (event.key === 'ArrowLeft') { event.preventDefault(); moveByGrid(index, 0, -1); return; }
    if (event.key === 'ArrowRight') { event.preventDefault(); moveByGrid(index, 0, 1); return; }
    if (event.key === 'ArrowUp') { event.preventDefault(); moveByGrid(index, -1, 0); return; }
    if (event.key === 'ArrowDown') { event.preventDefault(); moveByGrid(index, 1, 0); return; }
    if (event.key === 'Enter') { event.preventDefault(); checkActiveWord(); return; }
    if (event.key === 'Delete') {
      if (!isLockedIndex(index)) {
        event.preventDefault();
        delete state.letters[index];
        renderBoard();
        renderStats();
        persistProgress();
        focusCell(index);
      }
      return;
    }
    if (event.key === 'Backspace' && !isLockedIndex(index)) {
      event.preventDefault();
      if (state.letters[index]) {
        delete state.letters[index];
        renderBoard();
        renderStats();
        persistProgress();
        focusCell(index);
      } else {
        const previous = nextEditableInActive(index, -1);
        if (previous !== null) {
          delete state.letters[previous];
          state.selectedIndex = previous;
          renderBoard();
          renderStats();
          persistProgress();
          focusCell(previous);
        }
      }
    }
  }

  function checkActiveWord() {
    const puzzle = currentPuzzle();
    const state = currentState();
    const word = state.active;
    const entry = puzzle.words[word];
    if (state.solved.has(word)) {
      if (message) {
        message.className = 'game-message ok';
        message.textContent = 'Esta palabra ya está resuelta correctamente.';
      }
      return;
    }
    const letters = entry.indices.map(index => state.letters[index] || '');
    const missing = letters.filter(letter => !letter).length;
    if (missing) {
      if (message) {
        message.className = 'game-message error';
        message.textContent = `Faltan ${missing} ${missing === 1 ? 'letra' : 'letras'} para comprobar esta palabra.`;
      }
      return;
    }
    if (letters.join('') === word) {
      state.solved.add(word);
      entry.indices.forEach((index, letterIndex) => {
        state.letters[index] = word[letterIndex];
      });
      render();
      if (message) {
        message.className = 'game-message ok';
        message.textContent = state.solved.size === puzzle.order.length ? `¡${puzzle.title} completado! Has resuelto las ${puzzle.order.length} palabras.` : '¡Correcto! La palabra quedó fijada y sus cruces pueden ayudarte con las demás.';
      }
      return;
    }
    if (message) {
      message.className = 'game-message error';
      message.textContent = 'La palabra todavía no coincide con la pista. Revisa las letras e inténtalo otra vez.';
    }
  }

  function clearActiveWord() {
    const puzzle = currentPuzzle();
    const state = currentState();
    const word = state.active;
    if (state.solved.has(word)) {
      if (message) {
        message.className = 'game-message';
        message.textContent = 'La palabra ya está resuelta y permanece fijada en el tablero.';
      }
      return;
    }
    puzzle.words[word].indices.forEach(index => {
      if (!isLockedIndex(index)) delete state.letters[index];
    });
    state.selectedIndex = chooseCellForWord(word);
    render();
    focusCell(state.selectedIndex);
    if (message) {
      message.className = 'game-message';
      message.textContent = 'Se borraron las letras editables de la palabra activa. Los cruces ya resueltos se conservan.';
    }
  }

  function selectChallenge(challengeId, focus = true) {
    if (!puzzles[challengeId]) return;
    selectedChallenge = challengeId;
    const puzzle = currentPuzzle();
    const state = currentState();
    const occupied = occupiedIndices(puzzle);
    if (!occupied.has(state.selectedIndex)) state.selectedIndex = firstIndexForWord(puzzle, state.active);
    buildBoard();
    buildClues();
    render();
    if (focus) focusCell(state.selectedIndex);
    if (message) {
      message.className = 'game-message';
      message.textContent = `Reto seleccionado: ${puzzle.title}. Progreso ${state.solved.size} de ${puzzle.order.length} palabras.`;
    }
  }

  challengeButtons.forEach(button => {
    button.addEventListener('click', () => selectChallenge(button.dataset.challenge));
  });
  check.addEventListener('click', checkActiveWord);
  clearWordButton.addEventListener('click', clearActiveWord);

  reset.addEventListener('click', () => {
    const puzzle = currentPuzzle();
    const state = currentState();
    state.solved = new Set();
    state.letters = {};
    state.active = puzzle.order[0];
    state.selectedIndex = firstIndexForWord(puzzle, state.active);
    render();
    focusCell(state.selectedIndex);
    if (message) {
      message.className = 'game-message';
      message.textContent = `Reto reiniciado: ${puzzle.title}. Se borraron las letras de la partida; la mejor marca se conserva.`;
    }
  });

  readStoredProgress();
  selectChallenge(selectedChallenge, false);

  if (restored && message) {
    const puzzle = currentPuzzle();
    const state = currentState();
    const enteredLetters = Object.keys(state.letters).length;
    message.className = 'game-message ok';
    message.textContent = state.solved.size || enteredLetters
      ? `Progreso restaurado en ${puzzle.title}: ${state.solved.size} de ${puzzle.order.length} palabras resueltas y ${enteredLetters} casillas con letra.`
      : 'Tus progresos guardados en Crucilux están disponibles en el selector de retos.';
  }
})();