(() => {
  const menuButton = document.querySelector('.site-header .menu-button');
  const mainNav = document.querySelector('.site-header .main-nav');
  if (!menuButton || !mainNav) return;

  const closeMenu = ({ restoreFocus = false } = {}) => {
    mainNav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menú de navegación');
    if (restoreFocus) menuButton.focus({ preventScroll: true });
  };

  menuButton.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
  });

  mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mainNav.classList.contains('open')) closeMenu({ restoreFocus: true });
  });
})();

(() => {
  const app = document.querySelector('#quizApp');
  if (!app) return;

  const STORAGE_KEY = 'quizbible-progress-v1';
  const STORAGE_VERSION = 1;

  const progress = document.querySelector('#quizProgress');
  const scoreNode = document.querySelector('#quizScore');
  const category = document.querySelector('#quizCategory');
  const questionNode = document.querySelector('#quizQuestion');
  const form = document.querySelector('#quizForm');
  const optionsNode = document.querySelector('#quizOptions');
  const feedback = document.querySelector('#quizFeedback');
  const learning = document.querySelector('#quizLearning');
  const explanationNode = document.querySelector('#quizExplanation');
  const referenceNode = document.querySelector('#quizReference');
  const a11yStatus = document.querySelector('#quizA11yStatus');
  const checkButton = document.querySelector('#checkAnswer');
  const nextButton = document.querySelector('#nextQuestion');
  const restartButton = document.querySelector('#restartQuiz');

  if (!progress || !scoreNode || !category || !questionNode || !form || !optionsNode || !feedback || !learning || !explanationNode || !referenceNode || !a11yStatus || !checkButton || !nextButton || !restartButton) return;

  let questions = [];
  let currentIndex = 0;
  let answers = {};
  let completed = false;
  let answered = false;

  const categoryLabel = value => ({eventos:'Eventos',personajes:'Personajes',lugares:'Lugares',evangelios:'Evangelios'}[value] || value);
  const difficultyLabel = value => ({beginner:'Inicial',intermediate:'Intermedia',advanced:'Avanzada'}[value] || value);

  function isPlayableQuestion(question) {
    if (!question || question.status !== 'approved') return false;
    if (!Array.isArray(question.options) || question.options.length < 3) return false;
    if (!question.correctOptionId || !question.options.some(option => option.id === question.correctOptionId)) return false;
    if (typeof question.prompt !== 'string' || !question.prompt.trim()) return false;
    if (typeof question.explanation !== 'string' || !question.explanation.trim()) return false;
    return Array.isArray(question.references) && question.references.some(reference => typeof reference?.display === 'string' && reference.display.trim());
  }

  function getSelectedOptionId() { return form.querySelector('input[name="quiz-answer"]:checked')?.value || null; }
  function setOptionsDisabled(disabled) { optionsNode.querySelectorAll('input[name="quiz-answer"]').forEach(input => { input.disabled = disabled; }); }
  function calculateScore() { return questions.reduce((total, question) => total + (answers[question.id] === question.correctOptionId ? 1 : 0), 0); }
  function updateScore() { scoreNode.textContent = `Puntuación: ${calculateScore()}/${questions.length}`; }
  function announceProgress(prefix = '') { const message = `${prefix}${progress.textContent}. ${scoreNode.textContent}.`.trim(); a11yStatus.textContent = ''; requestAnimationFrame(() => { a11yStatus.textContent = message; }); }
  function focusQuestion() { questionNode.focus({ preventScroll: false }); }
  function hideLearning() { learning.hidden = true; explanationNode.textContent = ''; referenceNode.textContent = ''; }
  function showLearning(question) { explanationNode.textContent = question.explanation; referenceNode.textContent = question.references.map(reference => reference.display).filter(Boolean).join(' · '); learning.hidden = false; }

  function readStoredProgress() {
    try { const raw = localStorage.getItem(STORAGE_KEY); if (!raw) return null; const parsed = JSON.parse(raw); return parsed && typeof parsed === 'object' ? parsed : null; } catch { return null; }
  }

  function persistProgress() {
    if (!questions.length) return false;
    const currentQuestion = questions[currentIndex];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({version: STORAGE_VERSION,currentQuestionId: currentQuestion?.id || questions[0].id,answers,completed}));
      return true;
    } catch { return false; }
  }

  function clearStoredProgress() { try { localStorage.removeItem(STORAGE_KEY); } catch {} }

  function restoreProgress() {
    const stored = readStoredProgress();
    if (!stored || stored.version !== STORAGE_VERSION || !stored.answers || typeof stored.answers !== 'object' || Array.isArray(stored.answers)) return false;
    const validAnswers = {};
    let answeredCount = 0;
    for (const question of questions) {
      const selectedOptionId = stored.answers[question.id];
      const optionExists = question.options.some(option => option.id === selectedOptionId);
      if (!optionExists) break;
      validAnswers[question.id] = selectedOptionId;
      answeredCount += 1;
    }
    answers = validAnswers;
    completed = stored.completed === true && answeredCount === questions.length;
    if (completed) { currentIndex = Math.max(0, questions.length - 1); return true; }
    const storedIndex = questions.findIndex(question => question.id === stored.currentQuestionId);
    const lastAnsweredIndex = answeredCount - 1;
    const nextUnansweredIndex = answeredCount < questions.length ? answeredCount : Math.max(0, questions.length - 1);
    const storedPositionIsValid = storedIndex >= 0 && (storedIndex === lastAnsweredIndex || storedIndex === nextUnansweredIndex);
    currentIndex = storedPositionIsValid ? storedIndex : nextUnansweredIndex;
    persistProgress();
    return answeredCount > 0 || storedIndex > 0;
  }

  function markAnsweredQuestion(question, selectedId, restored = false) {
    const correctOption = question.options.find(option => option.id === question.correctOptionId);
    const isCorrect = selectedId === question.correctOptionId;
    answered = true;
    const selectedInput = Array.from(optionsNode.querySelectorAll('input[name="quiz-answer"]')).find(input => input.value === selectedId);
    if (selectedInput) selectedInput.checked = true;
    setOptionsDisabled(true);
    optionsNode.querySelectorAll('.quiz-option').forEach(label => {
      const optionId = label.dataset.optionId;
      const isCorrectOption = optionId === question.correctOptionId;
      const isSelectedOption = optionId === selectedId;
      const optionState = label.querySelector('.quiz-option-state');
      label.classList.toggle('correct', isCorrectOption);
      label.classList.toggle('incorrect', isSelectedOption && !isCorrect);
      if (optionState) {
        if (isCorrectOption && isSelectedOption) optionState.textContent = 'Respuesta correcta y seleccionada.';
        else if (isCorrectOption) optionState.textContent = 'Respuesta correcta.';
        else if (isSelectedOption) optionState.textContent = 'Tu respuesta, incorrecta.';
        else optionState.textContent = '';
      }
    });
    const restoredPrefix = restored ? 'Progreso restaurado. ' : '';
    if (isCorrect) { feedback.textContent = `${restoredPrefix}Correcto. Revisa el contexto y la referencia antes de continuar.`; feedback.className = 'quiz-feedback success'; }
    else { feedback.textContent = `${restoredPrefix}No es correcto. La respuesta es ${correctOption.text}. Revisa el contexto y la referencia.`; feedback.className = 'quiz-feedback error'; }
    showLearning(question);
    checkButton.hidden = true;
    nextButton.hidden = false;
    restartButton.hidden = false;
    nextButton.textContent = currentIndex === questions.length - 1 ? 'Ver resultado' : 'Siguiente pregunta';
  }

  function renderQuestion({ restored = false, focus = 'none' } = {}) {
    const question = questions[currentIndex];
    answered = false;
    completed = false;
    app.dataset.state = 'playing';
    optionsNode.hidden = false;
    checkButton.hidden = false;
    nextButton.hidden = true;
    restartButton.hidden = false;
    checkButton.disabled = true;
    feedback.textContent = restored ? 'Progreso restaurado. Continúa desde esta pregunta.' : 'Elige una opción y comprueba tu respuesta.';
    feedback.className = 'quiz-feedback neutral';
    hideLearning();
    progress.textContent = `Pregunta ${currentIndex + 1} de ${questions.length}`;
    updateScore();
    category.textContent = `${categoryLabel(question.category)} · Dificultad ${difficultyLabel(question.difficulty).toLowerCase()}`;
    questionNode.textContent = question.prompt;
    optionsNode.innerHTML = '<legend class="visually-hidden">Elige una respuesta para la pregunta actual</legend>';
    question.options.forEach(option => {
      const label = document.createElement('label');
      label.className = 'quiz-option';
      label.dataset.optionId = option.id;
      const input = document.createElement('input'); input.type = 'radio'; input.name = 'quiz-answer'; input.value = option.id;
      const marker = document.createElement('span'); marker.className = 'quiz-option-marker'; marker.setAttribute('aria-hidden','true'); marker.textContent = option.id.toUpperCase();
      const text = document.createElement('span'); text.className = 'quiz-option-text'; text.textContent = option.text;
      const optionState = document.createElement('span'); optionState.className = 'quiz-option-state visually-hidden';
      label.append(input, marker, text, optionState); optionsNode.append(label);
    });
    const restoredAnswer = answers[question.id];
    if (restoredAnswer) markAnsweredQuestion(question, restoredAnswer, restored);
    if (focus === 'question') requestAnimationFrame(focusQuestion);
    else if (focus === 'option' && !restoredAnswer) optionsNode.querySelector('input')?.focus({ preventScroll: false });
  }

  function checkAnswer() {
    if (answered) return;
    const selectedId = getSelectedOptionId();
    if (!selectedId) { feedback.textContent = 'Selecciona una respuesta antes de comprobar.'; return; }
    const question = questions[currentIndex];
    answers[question.id] = selectedId;
    markAnsweredQuestion(question, selectedId);
    updateScore();
    persistProgress();
    nextButton.focus({ preventScroll: false });
  }

  function showResult({ restored = false, focus = true } = {}) {
    completed = true; app.dataset.state = 'complete'; progress.textContent = 'Quiz completado'; updateScore();
    category.textContent = 'Resultado guardado en este navegador';
    questionNode.textContent = `Has respondido correctamente ${calculateScore()} de ${questions.length} preguntas.`;
    optionsNode.hidden = true; checkButton.hidden = true; nextButton.hidden = true; restartButton.hidden = false;
    feedback.textContent = restored ? 'Resultado restaurado. Puedes reiniciar el progreso para comenzar de nuevo.' : 'El resultado quedó guardado localmente. Puedes reiniciar el progreso para comenzar de nuevo.';
    feedback.className = 'quiz-feedback neutral';
    hideLearning(); persistProgress(); if (focus) requestAnimationFrame(focusQuestion);
  }

  function nextQuestion() { if (!answered) return; if (currentIndex >= questions.length - 1) { showResult(); return; } currentIndex += 1; completed = false; persistProgress(); renderQuestion({ focus: 'question' }); announceProgress(); }
  function restartQuiz() { clearStoredProgress(); currentIndex = 0; answers = {}; completed = false; renderQuestion({ focus: 'question' }); feedback.textContent = 'Progreso reiniciado. Elige una opción para comenzar de nuevo.'; announceProgress('Progreso reiniciado. '); }

  optionsNode.addEventListener('change', () => { if (!answered) checkButton.disabled = !getSelectedOptionId(); });
  form.addEventListener('submit', event => { event.preventDefault(); checkAnswer(); });
  nextButton.addEventListener('click', nextQuestion);
  restartButton.addEventListener('click', restartQuiz);

  fetch('data/questions.json')
    .then(response => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
    .then(data => {
      questions = Array.isArray(data) ? data.filter(isPlayableQuestion) : [];
      if (!questions.length) throw new Error('No hay preguntas aprobadas disponibles.');
      const restored = restoreProgress();
      if (completed) showResult({ restored: true, focus: false });
      else renderQuestion({ restored, focus: 'none' });
    })
    .catch(() => {
      app.dataset.state = 'error'; progress.textContent = 'Quiz no disponible'; scoreNode.textContent = ''; category.textContent = 'Error de carga';
      questionNode.textContent = 'No se pudo cargar el banco de preguntas.';
      optionsNode.hidden = true; checkButton.hidden = true; nextButton.hidden = true; restartButton.hidden = true; hideLearning();
      feedback.textContent = 'Recarga la página para intentarlo de nuevo.'; feedback.className = 'quiz-feedback error';
    });
})();

(() => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': 'https://neuronova-apps.github.io/quizbible-app/#app',
    name: 'Quiz Bible',
    url: 'https://neuronova-apps.github.io/quizbible-app/',
    description: 'Quiz bíblico web con preguntas revisadas, explicación, referencias, progreso local y cinco guías educativas públicas.',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    inLanguage: 'es-PE',
    applicationSuite: 'Neuronova Apps',
    image: 'https://neuronova-apps.github.io/quizbible-app/assets/social/quizbible-social.png',
    featureList: ['Seis preguntas bíblicas aprobadas', 'Feedback educativo', 'Referencias bíblicas', 'Progreso local', 'Cinco guías educativas', 'Accesibilidad reforzada'],
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