(() => {
  const board = document.querySelector('#crossword');
  const checkButton = document.querySelector('#checkAnswer');
  const hintButton = document.querySelector('#hintWord');
  const feedback = document.querySelector('#learningFeedback');

  if (!board || !checkButton || !hintButton || !feedback) {
    return;
  }

  const wordHelp = {
    SOL: {
      hints: ['Piensa en un astro que produce su propia luz, no en un planeta.', 'La palabra empieza por S.', 'La última letra es L.'],
      explanation: 'Sol encaja porque es la estrella que ilumina la Tierra. La pista describe un astro que emite luz propia.'
    },
    MAR: {
      hints: ['Busca una gran masa de agua salada; no es un río ni un lago.', 'La palabra empieza por M.', 'La última letra es R.'],
      explanation: 'Mar encaja porque designa una gran extensión de agua salada. La definición de la pista apunta directamente a ese concepto.'
    },
    LUZ: {
      hints: ['No es un objeto: es aquello que hace visibles los objetos a nuestros ojos.', 'La palabra empieza por L.', 'La última letra es Z.'],
      explanation: 'Luz encaja porque permite la visión cuando llega a nuestros ojos desde una fuente o después de reflejarse en los objetos.'
    },
    LUNA: {
      hints: ['Piensa en el cuerpo celeste que acompaña a la Tierra y vemos especialmente de noche.', 'La palabra empieza por L.', 'La última letra es A.'],
      explanation: 'Luna encaja porque es el satélite natural de la Tierra y corresponde al cuerpo celeste descrito por la pista.'
    },
    ROCA: {
      hints: ['Es un material natural sólido que puedes encontrar en montañas, suelos y acantilados.', 'La palabra empieza por R.', 'La última letra es A.'],
      explanation: 'Roca encaja porque es un material sólido natural que forma parte de la corteza terrestre.'
    },
    AGUA: {
      hints: ['Es una sustancia esencial que encontramos en ríos, lagos y mares.', 'La palabra empieza por A.', 'La última letra también es A.'],
      explanation: 'Agua encaja porque es el líquido presente en ríos, lagos y mares al que se refiere la pista.'
    },
    LIBRO: {
      hints: ['Piensa en algo que se lee y reúne contenido escrito en páginas.', 'La palabra empieza por L.', 'La última letra es O.'],
      explanation: 'Libro encaja porque es una obra escrita organizada en páginas reunidas en un volumen físico o equivalente digital.'
    },
    IDEA: {
      hints: ['Es algo que puede surgir en la mente antes de convertirse en una propuesta o un plan.', 'La palabra empieza por I.', 'La última letra es A.'],
      explanation: 'Idea encaja porque designa una representación mental, pensamiento o propuesta, tal como indica la pista.'
    },
    RISA: {
      hints: ['Piensa en una expresión espontánea asociada con diversión o alegría.', 'La palabra empieza por R.', 'La última letra es A.'],
      explanation: 'Risa encaja porque es una expresión de alegría o diversión que suele manifestarse con gestos y sonidos.'
    }
  };

  const hintLevels = new Map();

  function normalizeLetter(value) {
    return String(value ?? '')
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-ZÑ]/g, '')
      .slice(-1);
  }

  function activeWord() {
    return document.querySelector('.clue.active')?.dataset.word || '';
  }

  function activeChallenge() {
    return document.querySelector('.challenge-option.active')?.dataset.challenge || 'actual';
  }

  function activeCells() {
    return [...board.querySelectorAll('.cell.active-word')]
      .sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index));
  }

  function helpForWord(word) {
    if (wordHelp[word]) {
      return wordHelp[word];
    }

    const clue = document.querySelector(`.clue[data-word="${word}"] span:last-child`)?.textContent?.trim()
      || 'Relaciona la definición con las letras disponibles en el tablero.';
    const readable = word.charAt(0) + word.slice(1).toLowerCase();

    return {
      hints: [
        `Vuelve a la pista: ${clue}`,
        `La respuesta tiene ${word.length} letras y empieza por ${word.charAt(0)}.`,
        `La última letra es ${word.charAt(word.length - 1)}.`
      ],
      explanation: `${readable} encaja con la pista seleccionada y con las letras compartidas en sus cruces.`
    };
  }

  function clearReview() {
    board.querySelectorAll('.cell.review').forEach(cell => cell.classList.remove('review'));
    board.querySelectorAll('.cell-input[aria-invalid="true"]').forEach(input => input.setAttribute('aria-invalid', 'false'));
  }

  function setFeedback(type, title, text) {
    feedback.className = `learning-feedback ${type}`;
    feedback.replaceChildren();
    const heading = document.createElement('strong');
    heading.textContent = title;
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    feedback.append(heading, paragraph);
  }

  function resetFeedback() {
    clearReview();
    setFeedback('neutral', 'Ayuda gradual', 'Comprueba la palabra para recibir orientación sobre tu intento o usa “Pista gradual” cuando necesites una ayuda adicional.');
  }

  function isSolved(word) {
    return Boolean(document.querySelector(`.clue.active[data-word="${word}"]`)?.classList.contains('done'));
  }

  function evaluateAttempt() {
    const word = activeWord();
    if (!word) return;
    const help = helpForWord(word);
    clearReview();

    if (isSolved(word)) {
      setFeedback('success', 'Por qué encaja', help.explanation);
      return;
    }

    const cells = activeCells();
    const letters = cells.map(cell => normalizeLetter(cell.querySelector('.cell-input')?.value));
    const missing = letters.filter(letter => !letter).length;

    if (missing) {
      setFeedback('tip', 'Completa el patrón', `Faltan ${missing} ${missing === 1 ? 'letra' : 'letras'} en la palabra activa. Usa los cruces ya resueltos y vuelve a comprobar cuando todas las casillas tengan una letra.`);
      return;
    }

    let correctPositions = 0;
    cells.forEach((cell, index) => {
      const input = cell.querySelector('.cell-input');
      if (letters[index] === word[index]) {
        correctPositions += 1;
        return;
      }
      cell.classList.add('review');
      input?.setAttribute('aria-invalid', 'true');
    });

    setFeedback('review', 'Revisa el patrón', `Tienes ${correctPositions} de ${word.length} letras en la posición correcta. Las casillas marcadas necesitan revisión; vuelve a relacionar la pista con la palabra o solicita una pista gradual.`);
  }

  function showHint() {
    const word = activeWord();
    if (!word) return;
    const help = helpForWord(word);
    clearReview();

    if (isSolved(word)) {
      setFeedback('success', 'Por qué encaja', help.explanation);
      return;
    }

    const key = `${activeChallenge()}:${word}`;
    const currentLevel = hintLevels.get(key) || 0;
    const hintIndex = Math.min(currentLevel, help.hints.length - 1);
    hintLevels.set(key, Math.min(hintIndex + 1, help.hints.length));

    const suffix = hintIndex === help.hints.length - 1
      ? ' Esta es la pista más directa; la respuesta sigue dependiendo de completar las casillas.'
      : '';

    setFeedback('hint', `Pista ${hintIndex + 1} de ${help.hints.length}`, `${help.hints[hintIndex]}${suffix}`);
  }

  checkButton.addEventListener('click', () => queueMicrotask(evaluateAttempt));
  hintButton.addEventListener('click', showHint);

  board.addEventListener('keydown', event => {
    if (event.key === 'Enter') queueMicrotask(evaluateAttempt);
  });

  board.addEventListener('input', event => {
    const input = event.target.closest('.cell-input');
    if (!input) return;
    input.setAttribute('aria-invalid', 'false');
    input.closest('.cell')?.classList.remove('review');
  });

  document.addEventListener('click', event => {
    if (event.target.closest('.clue') || event.target.closest('.challenge-option')) {
      queueMicrotask(resetFeedback);
      return;
    }
    if (event.target.closest('#clearWord')) {
      queueMicrotask(resetFeedback);
      return;
    }
    if (event.target.closest('#resetGame')) {
      hintLevels.clear();
      queueMicrotask(resetFeedback);
    }
  });

  resetFeedback();
})();