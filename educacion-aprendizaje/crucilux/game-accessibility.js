(() => {
  const menu = document.querySelector('.menu-button');
  const nav = document.querySelector('.main-nav');
  const board = document.querySelector('#crossword');
  const gameTitle = document.querySelector('#game-title');
  const gameMessage = document.querySelector('#gameMessage');
  const learningFeedback = document.querySelector('#learningFeedback');
  const answerActions = document.querySelector('.answer-actions');

  function normalizeFooter() {
    const footer = document.querySelector('.site-footer');
    if (!footer) return;

    const columns = [...footer.querySelectorAll('.footer-column')];
    const explore = columns[0];
    const contact = columns[1];
    const footerBottom = footer.querySelector('.footer-bottom');

    explore?.querySelector('a[href="privacy/"]')?.remove();

    if (contact) {
      contact.innerHTML = `
        <h2>Contacto</h2>
        <a href="mailto:berm_km@hotmail.com">berm_km@hotmail.com</a>
        <span>Pucallpa, Ucayali · Perú</span>
        <span>Proyecto independiente</span>`;
    }

    if (footerBottom) {
      footerBottom.innerHTML = `
        <p>© 2026 Crucilux · Neuronova Apps</p>
        <p><a href="privacy/">Política de privacidad</a></p>`;
    }
  }

  normalizeFooter();

  if (!board) return;

  let syncQueued = false;

  function text(element) {
    return element?.textContent?.trim().replace(/\s+/g, ' ') || '';
  }

  function scheduleSync() {
    if (syncQueued) return;
    syncQueued = true;
    queueMicrotask(() => {
      syncQueued = false;
      syncAccessibility();
    });
  }

  function syncMenu() {
    if (!menu) return;
    const expanded = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-label', expanded ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
  }

  function syncChallenges() {
    document.querySelectorAll('.challenge-option').forEach(button => {
      const number = text(button.querySelector('.challenge-number')).replace(/^0+/, '') || '1';
      const title = text(button.querySelector('strong'));
      const detail = text(button.querySelector('small'));
      const status = text(button.querySelector('.challenge-status'));
      const selected = button.getAttribute('aria-pressed') === 'true';
      const progress = status === 'Completado'
        ? 'Completado.'
        : status.includes('/')
          ? `Progreso ${status.replace('/', ' de ')}.`
          : status ? `${status}.` : '';

      button.setAttribute(
        'aria-label',
        `Reto ${number}: ${title}. ${detail}. ${progress}${selected ? ' Seleccionado.' : ''}`.replace(/\s+/g, ' ').trim()
      );
      button.setAttribute('aria-controls', 'crossword acrossClues downClues solvedCount bestScore progressState');
    });
  }

  function syncClues() {
    document.querySelectorAll('.clue').forEach(button => {
      const group = button.closest('.clue-group');
      const groupLabel = text(group?.querySelector('.clue-label')).toLowerCase();
      const direction = groupLabel.startsWith('vertical') ? 'vertical' : 'horizontal';
      const spans = button.querySelectorAll('span');
      const number = text(spans[0]);
      const clue = text(spans[1]);
      const selected = button.getAttribute('aria-pressed') === 'true';
      const solved = button.classList.contains('done');
      const state = `${solved ? ' Resuelta.' : ''}${selected ? ' Pista activa.' : ''}`;

      button.setAttribute('aria-label', `Pista ${number} ${direction}: ${clue}.${state}`.replace(/\s+/g, ' ').trim());
      button.setAttribute('aria-controls', 'crossword learningFeedback gameMessage');
    });
  }

  function syncBoard() {
    const activeClue = document.querySelector('.clue.active');
    const activeLabel = activeClue ? activeClue.getAttribute('aria-label') || text(activeClue) : '';
    const title = text(gameTitle) || 'Crucilux';

    board.setAttribute('role', 'group');
    board.removeAttribute('aria-rowcount');
    board.removeAttribute('aria-colcount');
    board.setAttribute('aria-describedby', 'boardInstructions gameMessage');
    board.setAttribute(
      'aria-label',
      `${title}. Crucigrama de 5 filas y 5 columnas.${activeLabel ? ` ${activeLabel}` : ''}`
    );

    board.querySelectorAll('.cell:not(.block)').forEach(cell => {
      const input = cell.querySelector('.cell-input');
      if (!input) return;

      const invalid = input.getAttribute('aria-invalid') === 'true';
      cell.removeAttribute('role');
      cell.removeAttribute('aria-rowindex');
      cell.removeAttribute('aria-colindex');
      cell.removeAttribute('aria-selected');
      cell.removeAttribute('aria-readonly');
      cell.setAttribute('aria-invalid', String(invalid));
      input.setAttribute('aria-invalid', String(invalid));
      input.setAttribute('aria-keyshortcuts', 'ArrowUp ArrowDown ArrowLeft ArrowRight Enter Backspace Delete');
    });
  }

  function syncRegions() {
    if (gameMessage) {
      gameMessage.setAttribute('role', 'status');
      gameMessage.setAttribute('aria-live', 'polite');
      gameMessage.setAttribute('aria-atomic', 'true');
    }
    if (learningFeedback) {
      learningFeedback.setAttribute('role', 'status');
      learningFeedback.setAttribute('aria-live', 'polite');
      learningFeedback.setAttribute('aria-atomic', 'true');
    }
    if (answerActions) {
      answerActions.setAttribute('role', 'group');
      answerActions.setAttribute('aria-label', 'Controles de la palabra activa');
    }
  }

  function syncAccessibility() {
    syncMenu();
    syncChallenges();
    syncClues();
    syncBoard();
    syncRegions();
  }

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !menu || !nav) return;
    const wasOpen = menu.getAttribute('aria-expanded') === 'true' || nav.classList.contains('open');
    if (!wasOpen) return;

    queueMicrotask(() => {
      if (menu.getAttribute('aria-expanded') === 'false' && !nav.classList.contains('open')) {
        menu.focus();
      }
      scheduleSync();
    });
  }, true);

  const observer = new MutationObserver(scheduleSync);
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['class', 'aria-pressed', 'aria-expanded', 'tabindex', 'readonly']
  });

  document.addEventListener('click', scheduleSync);
  document.addEventListener('input', scheduleSync);
  document.addEventListener('focusin', scheduleSync);

  syncAccessibility();
})();