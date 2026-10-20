(() => {
  const menuButton = document.querySelector('.menu-button');
  const mainNav = document.querySelector('.main-nav');
  const board = document.querySelector('#sudokuBoard');
  const heroVisual = document.querySelector('.hero-visual[aria-label]');
  const numberPad = document.querySelector('.number-pad');
  const noteModeButton = document.querySelector('#notesButton');
  const eraseButton = document.querySelector('#eraseButton');
  const checkButton = document.querySelector('#checkButton');
  const resetButton = document.querySelector('#resetButton');
  const gameStatus = document.querySelector('#gameMessage');
  const progressValue = document.querySelector('#progress');
  const errorValue = document.querySelector('#mistakes');

  if (heroVisual && !heroVisual.hasAttribute('role')) heroVisual.setAttribute('role', 'img');

  function createInstructions() {
    if (!board || document.querySelector('#sudokuInstructions')) return;
    const instructions = document.createElement('p');
    instructions.id = 'sudokuInstructions';
    instructions.textContent = 'Tablero de 9 filas y 9 columnas. Usa las flechas para moverte entre casillas. En una casilla editable, usa las teclas 1 a 9 para introducir un valor. Pulsa N para alternar el modo Notas y Backspace o Delete para borrar.';
    Object.assign(instructions.style, {position:'absolute',width:'1px',height:'1px',padding:'0',margin:'-1px',overflow:'hidden',clip:'rect(0, 0, 0, 0)',whiteSpace:'nowrap',border:'0'});
    board.before(instructions);
  }

  function syncBoardAccessibility() {
    if (!board) return;
    board.setAttribute('role', 'group');
    board.removeAttribute('aria-rowcount');
    board.removeAttribute('aria-colcount');
    board.setAttribute('aria-describedby', 'sudokuInstructions gameMessage');

    [...board.querySelectorAll('.sudoku-cell')].forEach(cell => {
      cell.removeAttribute('role');
      cell.removeAttribute('aria-rowindex');
      cell.removeAttribute('aria-colindex');
      cell.removeAttribute('aria-selected');
      cell.removeAttribute('aria-readonly');
      cell.setAttribute('aria-invalid', String(cell.classList.contains('invalid')));
    });
  }

  function syncNoteMode() {
    if (!noteModeButton) return;
    try {
      noteModeButton.setAttribute('aria-pressed', String(noteMode));
      noteModeButton.classList.toggle('active', noteMode);
      noteModeButton.textContent = noteMode ? 'Notas · activadas' : 'Notas · desactivadas';
    } catch {
      noteModeButton.setAttribute('aria-pressed', 'false');
    }
  }

  function syncStats() {
    try {
      const editable = puzzle.reduce((total, value) => total + (value === 0 ? 1 : 0), 0);
      const correct = values.reduce((total, value, index) => total + (puzzle[index] === 0 && value === solution[index] ? 1 : 0), 0);
      if (progressValue) progressValue.textContent = `${Math.round((correct / editable) * 100)}%`;
      if (errorValue) errorValue.textContent = String(errorCells.size);
    } catch {
      // La capa base puede seguir funcionando aunque el estado de la demo no esté disponible.
    }
  }

  function syncCheckMessage() {
    if (!gameStatus) return;
    try {
      let incorrect = 0;
      let empty = 0;
      values.forEach((value, index) => {
        if (puzzle[index] !== 0) return;
        if (value === 0) empty += 1;
        else if (value !== solution[index]) incorrect += 1;
      });
      if (incorrect === 0 && empty === 0) gameStatus.textContent = '¡Tablero completo y correcto! Has terminado la demostración.';
      else if (incorrect > 0) gameStatus.textContent = `Hay ${incorrect} ${incorrect === 1 ? 'casilla incorrecta actualmente' : 'casillas incorrectas actualmente'} y ${empty} por completar. Las notas no se consideran respuestas.`;
      else gameStatus.textContent = `Todo lo colocado es correcto. Faltan ${empty} ${empty === 1 ? 'casilla' : 'casillas'} por completar. Las notas no se consideran respuestas.`;
    } catch {
      gameStatus.textContent = 'Comprobación realizada.';
    }
  }

  function focusSelectedCell() {
    const selected = board?.querySelector('.sudoku-cell[tabindex="0"]');
    selected?.focus({preventScroll:true});
  }

  function focusStatus() {
    if (!gameStatus) return;
    gameStatus.tabIndex = -1;
    gameStatus.focus({preventScroll:true});
  }

  function normalizeFooterContact() {
    const columns = [...document.querySelectorAll('.site-footer .footer-column')];
    const contactColumn = columns[1];
    if (!contactColumn) return;
    contactColumn.replaceChildren();
    const heading = document.createElement('h2'); heading.textContent = 'Contacto';
    const email = document.createElement('a'); email.href = 'mailto:berm_km@hotmail.com'; email.textContent = 'berm_km@hotmail.com';
    const location = document.createElement('span'); location.textContent = 'Pucallpa, Ucayali · Perú';
    const project = document.createElement('span'); project.textContent = 'Proyecto independiente';
    contactColumn.append(heading, email, location, project);
  }

  function normalizeFooterBottom() {
    const footerBottom = document.querySelector('.site-footer .footer-bottom');
    if (!footerBottom) return;
    footerBottom.innerHTML = `<p>© 2026 Sudolux · Neuronova Apps</p><p><a href="privacy/">Política de privacidad</a></p>`;
  }

  createInstructions();
  syncBoardAccessibility();
  syncNoteMode();
  syncStats();
  normalizeFooterContact();
  normalizeFooterBottom();

  if (board && 'MutationObserver' in window) {
    const observer = new MutationObserver(() => {
      syncBoardAccessibility();
      syncStats();
    });
    observer.observe(board, {subtree:true,childList:true,attributes:true,attributeFilter:['class','tabindex','aria-label']});
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton && mainNav?.classList.contains('open')) {
      queueMicrotask(() => menuButton.focus({preventScroll:true}));
    }
    if (event.key.toLowerCase() === 'n' && event.target?.closest?.('.sudoku-cell')) {
      queueMicrotask(() => {
        syncNoteMode();
        if (gameStatus) gameStatus.textContent = noteMode
          ? 'Modo notas activado. Los números 1–9 añadirán o quitarán candidatos.'
          : 'Modo notas desactivado. Los números 1–9 se ingresarán como respuestas definitivas.';
      });
    }
  }, true);

  noteModeButton?.addEventListener('click', () => {
    if (typeof toggleNoteMode === 'function') toggleNoteMode();
    syncNoteMode();
    if (gameStatus) gameStatus.textContent = noteMode
      ? 'Modo notas activado. Los números 1–9 añadirán o quitarán candidatos.'
      : 'Modo notas desactivado. Los números 1–9 se ingresarán como respuestas definitivas.';
  });

  numberPad?.addEventListener('click', event => {
    const numberButton = event.target.closest('[data-number]');
    if (!numberButton) return;
    const number = Number(numberButton.dataset.number);
    if (typeof enterNumber === 'function') enterNumber(number);
    syncStats();
    if (gameStatus) gameStatus.textContent = noteMode
      ? `Candidato ${number} actualizado en la casilla seleccionada.`
      : `Número ${number} procesado en la casilla seleccionada.`;
    queueMicrotask(focusSelectedCell);
  });

  eraseButton?.addEventListener('click', () => {
    syncStats();
    if (gameStatus) gameStatus.textContent = 'Casilla actualizada.';
    queueMicrotask(focusSelectedCell);
  });

  checkButton?.addEventListener('click', () => {
    syncStats();
    syncCheckMessage();
    queueMicrotask(focusStatus);
  });

  resetButton?.addEventListener('click', () => {
    queueMicrotask(() => {
      syncNoteMode();
      syncStats();
      syncBoardAccessibility();
      if (gameStatus) gameStatus.textContent = 'Partida reiniciada.';
    });
  });
})();

(() => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': 'https://neuronova-apps.github.io/sudolux-app/#app',
    name: 'Sudolux',
    url: 'https://neuronova-apps.github.io/sudolux-app/',
    description: 'Experiencia web para aprender las reglas y técnicas del Sudoku, consultar guías educativas y resolver una partida clásica 9 × 9.',
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web',
    inLanguage: 'es-PE',
    applicationSuite: 'Neuronova Apps',
    image: 'https://neuronova-apps.github.io/sudolux-app/assets/social/sudolux-social.png',
    featureList: ['Sudoku clásico 9 × 9', 'Notas y candidatos', 'Validación de partida', 'Progreso local', 'Cinco guías educativas', 'Navegación accesible por teclado'],
    isPartOf: {'@id': 'https://neuronova-apps.github.io/#website'}
  };
  if (!document.querySelector('script[data-neuronova-schema="true"]')) {
    const schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.dataset.neuronovaSchema = 'true';
    schema.textContent = JSON.stringify(structuredData);
    document.head.appendChild(schema);
  }
})();