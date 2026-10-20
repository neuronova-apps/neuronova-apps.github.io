const { vocabBank = [], grammarBank = [] } = window.EnglishFastContent || {};

const STORAGE_KEYS = {
  vocabCorrect: 'ef-vc',
  vocabAnswered: 'ef-va',
  grammarCorrect: 'ef-gc',
  grammarAnswered: 'ef-ga'
};

const ERROR_STORAGE_KEY = 'ef-errors-v1';
const ITEM_PROGRESS_KEY = 'ef-item-progress-v1';
const LEGACY_STORAGE_KEYS = ['englishfast-score', 'englishfast-answered'];

const VOCAB_GUIDES = {
  Home: {
    explanation: 'Reconoce palabras que nombran espacios y elementos habituales del hogar.',
    example: 'Ejemplo: door significa puerta.'
  },
  Study: {
    explanation: 'Relaciona vocabulario frecuente de estudio, escuela y aprendizaje con su significado.',
    example: 'Ejemplo: class significa clase.'
  },
  'Daily life': {
    explanation: 'Trabaja palabras que aparecen con frecuencia al describir actividades y situaciones cotidianas.',
    example: 'Ejemplo: day significa día.'
  },
  People: {
    explanation: 'Identifica palabras para hablar de personas, familia y relaciones cercanas.',
    example: 'Ejemplo: sister significa hermana.'
  },
  Actions: {
    explanation: 'Reconoce verbos frecuentes que expresan acciones habituales.',
    example: 'Ejemplo: walk significa caminar.'
  },
  Time: {
    explanation: 'Relaciona expresiones básicas para ubicar acciones y momentos en el tiempo.',
    example: 'Ejemplo: yesterday significa ayer.'
  },
  Feelings: {
    explanation: 'Identifica adjetivos utilizados para expresar estados de ánimo y sensaciones.',
    example: 'Ejemplo: sad significa triste.'
  },
  Food: {
    explanation: 'Reconoce vocabulario básico relacionado con alimentos y comidas.',
    example: 'Ejemplo: milk significa leche.'
  },
  Travel: {
    explanation: 'Practica palabras útiles para desplazamientos, transporte y viajes.',
    example: 'Ejemplo: train significa tren.'
  },
  Work: {
    explanation: 'Relaciona vocabulario frecuente de trabajo y situaciones laborales.',
    example: 'Ejemplo: job significa trabajo o empleo.'
  },
  Health: {
    explanation: 'Identifica palabras sencillas relacionadas con salud y atención personal.',
    example: 'Ejemplo: sick significa enfermo o enferma.'
  },
  Connectors: {
    explanation: 'Reconoce palabras que ayudan a relacionar ideas y explicar causas o secuencias.',
    example: 'Ejemplo: but significa pero.'
  },
  Description: {
    explanation: 'Practica adjetivos frecuentes para describir objetos, lugares y situaciones.',
    example: 'Ejemplo: cheap significa barato o barata.'
  }
};

const GRAMMAR_GUIDES = {
  'Verb to be': {
    explanation: 'El verbo to be cambia según el sujeto: am con I, is con he/she/it y are con you/we/they.',
    example: 'Ejemplo: She is at home.'
  },
  'Present simple': {
    explanation: 'El presente simple expresa hábitos y hechos. Con he, she o it suele añadirse -s al verbo afirmativo; las preguntas usan do o does.',
    example: 'Ejemplo: He works every day. / Do you study English?'
  },
  Articles: {
    explanation: 'A y an presentan sustantivos singulares no específicos; the señala algo específico o conocido en el contexto.',
    example: 'Ejemplo: a book, an apple, the door.'
  },
  Pronouns: {
    explanation: 'Los pronombres personales sustituyen nombres para evitar repeticiones y señalar quién realiza la acción.',
    example: 'Ejemplo: Ana and I → We.'
  },
  Prepositions: {
    explanation: 'Las preposiciones básicas ayudan a expresar posición. In suele indicar dentro y on contacto con una superficie.',
    example: 'Ejemplo: The phone is on the table.'
  },
  'There is / are': {
    explanation: 'There is presenta un elemento singular; there are presenta elementos plurales.',
    example: 'Ejemplo: There is a book. / There are two books.'
  },
  Can: {
    explanation: 'Can expresa capacidad o posibilidad y mantiene la misma forma con todos los sujetos.',
    example: 'Ejemplo: We can swim.'
  },
  Possessives: {
    explanation: 'Los adjetivos posesivos, como my, your o their, acompañan a un sustantivo para indicar pertenencia.',
    example: 'Ejemplo: This is my bag.'
  },
  'Past simple': {
    explanation: 'El pasado simple describe acciones terminadas. Algunos verbos son irregulares y cambian de forma.',
    example: 'Ejemplo: We went home yesterday.'
  },
  Comparatives: {
    explanation: 'Los comparativos contrastan dos elementos. Los adjetivos cortos suelen usar -er; los largos, more + adjetivo.',
    example: 'Ejemplo: bigger than / more interesting than.'
  },
  'Going to': {
    explanation: 'Be going to se usa para hablar de planes o intenciones futuras.',
    example: 'Ejemplo: I am going to study tonight.'
  },
  'Present continuous': {
    explanation: 'El presente continuo usa be + verbo en -ing para acciones que están ocurriendo alrededor del momento actual.',
    example: 'Ejemplo: They are studying now.'
  },
  Quantifiers: {
    explanation: 'Los cuantificadores expresan cantidad. Many acompaña sustantivos contables plurales y any es frecuente en preguntas y negativas.',
    example: 'Ejemplo: How many books? / Do you have any questions?'
  },
  Should: {
    explanation: 'Should se utiliza para dar consejos o recomendaciones y no cambia según el sujeto.',
    example: 'Ejemplo: You should rest.'
  },
  Connectors: {
    explanation: 'Los conectores unen ideas. Because introduce una causa; but contrasta y so puede introducir una consecuencia.',
    example: 'Ejemplo: I stayed home because it was raining.'
  }
};

const vocabCategory = document.querySelector('#vocabCategory');
const word = document.querySelector('#questionWord');
const answers = document.querySelector('#answers');
const feedback = document.querySelector('#feedback');
const nextQuestion = document.querySelector('#nextQuestion');
const vocabItemStats = document.querySelector('#vocabItemStats');
const vocabExplanation = document.querySelector('#vocabExplanation');
const vocabExample = document.querySelector('#vocabExample');
const vocabRoutePosition = document.querySelector('#vocabRoutePosition');
const vocabResult = document.querySelector('#vocabResult');
const vocabResultText = document.querySelector('#vocabResultText');

const grammarSentence = document.querySelector('#grammarSentence');
const grammarAnswers = document.querySelector('#grammarAnswers');
const grammarFeedback = document.querySelector('#grammarFeedback');
const nextGrammar = document.querySelector('#nextGrammar');
const grammarItemStats = document.querySelector('#grammarItemStats');
const grammarExplanation = document.querySelector('#grammarExplanation');
const grammarExample = document.querySelector('#grammarExample');
const grammarRoutePosition = document.querySelector('#grammarRoutePosition');
const grammarResult = document.querySelector('#grammarResult');
const grammarResultText = document.querySelector('#grammarResultText');

const vocabProgress = document.querySelector('#vocabProgress');
const grammarProgress = document.querySelector('#grammarProgress');
const itemsPracticed = document.querySelector('#itemsPracticed');
const progressAccuracy = document.querySelector('#progressAccuracy');
const reviewErrors = document.querySelector('#reviewErrors');
const resetProgress = document.querySelector('#resetProgress');
const storageNotice = document.querySelector('#storageNotice');
const practiceLevel = document.querySelector('#practiceLevel');
const vocabTopic = document.querySelector('#vocabTopic');
const grammarTopic = document.querySelector('#grammarTopic');
const filterSummary = document.querySelector('#filterSummary');
const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');

let storageAvailable = true;
let reviewMode = false;

function readStoredNumber(key) {
  if (!storageAvailable) return 0;

  try {
    return Number(localStorage.getItem(key) || 0) || 0;
  } catch {
    storageAvailable = false;
    return 0;
  }
}

function readStoredErrors() {
  if (!storageAvailable) return { vocab: [], grammar: [] };

  try {
    const value = JSON.parse(localStorage.getItem(ERROR_STORAGE_KEY) || '{}');
    const validVocab = new Set(vocabBank.map(item => item.id));
    const validGrammar = new Set(grammarBank.map(item => item.id));

    return {
      vocab: Array.isArray(value.vocab) ? [...new Set(value.vocab.filter(id => validVocab.has(id)))] : [],
      grammar: Array.isArray(value.grammar) ? [...new Set(value.grammar.filter(id => validGrammar.has(id)))] : []
    };
  } catch {
    return { vocab: [], grammar: [] };
  }
}

function emptyItemRecord() {
  return {
    attempts: 0,
    correct: 0,
    wrong: 0,
    reviewAttempts: 0,
    reviewCorrect: 0,
    lastResult: null,
    lastAt: null
  };
}

function normalizeItemRecord(value) {
  const base = emptyItemRecord();
  if (!value || typeof value !== 'object') return base;

  return {
    attempts: Math.max(0, Number(value.attempts) || 0),
    correct: Math.max(0, Number(value.correct) || 0),
    wrong: Math.max(0, Number(value.wrong) || 0),
    reviewAttempts: Math.max(0, Number(value.reviewAttempts) || 0),
    reviewCorrect: Math.max(0, Number(value.reviewCorrect) || 0),
    lastResult: value.lastResult === 'correct' || value.lastResult === 'wrong' ? value.lastResult : null,
    lastAt: typeof value.lastAt === 'string' ? value.lastAt : null
  };
}

function normalizeItemGroup(value, validIds) {
  if (!value || typeof value !== 'object') return {};

  return Object.fromEntries(
    Object.entries(value)
      .filter(([id]) => validIds.has(id))
      .map(([id, record]) => [id, normalizeItemRecord(record)])
  );
}

function readStoredItemProgress() {
  if (!storageAvailable) return { vocab: {}, grammar: {} };

  try {
    const value = JSON.parse(localStorage.getItem(ITEM_PROGRESS_KEY) || '{}');
    return {
      vocab: normalizeItemGroup(value.vocab, new Set(vocabBank.map(item => item.id))),
      grammar: normalizeItemGroup(value.grammar, new Set(grammarBank.map(item => item.id)))
    };
  } catch {
    return { vocab: {}, grammar: {} };
  }
}

const storedErrors = readStoredErrors();
const storedItemProgress = readStoredItemProgress();

const progress = {
  vocabCorrect: readStoredNumber(STORAGE_KEYS.vocabCorrect),
  vocabAnswered: readStoredNumber(STORAGE_KEYS.vocabAnswered),
  grammarCorrect: readStoredNumber(STORAGE_KEYS.grammarCorrect),
  grammarAnswered: readStoredNumber(STORAGE_KEYS.grammarAnswered),
  vocabErrors: storedErrors.vocab,
  grammarErrors: storedErrors.grammar,
  itemProgress: storedItemProgress
};

function shuffle(list) {
  const copy = [...list];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
}

function selectedLevel() {
  return practiceLevel?.value || 'all';
}

function itemMatchesLevel(item) {
  const level = selectedLevel();
  return level === 'all' || item.level === level;
}

function populateTopicSelect(select, bank, property) {
  if (!select) return;

  const previous = select.value;
  const topics = [...new Set(
    bank
      .filter(itemMatchesLevel)
      .map(item => item[property])
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b, 'es'));

  select.innerHTML = '<option value="all">Todos los temas</option>';

  topics.forEach(topic => {
    const option = document.createElement('option');
    option.value = topic;
    option.textContent = topic;
    select.appendChild(option);
  });

  select.value = topics.includes(previous) ? previous : 'all';
}

function updateTopicOptions() {
  populateTopicSelect(vocabTopic, vocabBank, 'cat');
  populateTopicSelect(grammarTopic, grammarBank, 'topic');
}

function getNormalVocabPool() {
  const topic = vocabTopic?.value || 'all';
  return vocabBank.filter(item => itemMatchesLevel(item) && (topic === 'all' || item.cat === topic));
}

function getNormalGrammarPool() {
  const topic = grammarTopic?.value || 'all';
  return grammarBank.filter(item => itemMatchesLevel(item) && (topic === 'all' || item.topic === topic));
}

let vocabDeck = [];
let vocabIndex = 0;
let grammarDeck = [];
let grammarIndex = 0;

function renderFilterSummary(message = '') {
  if (!filterSummary) return;

  if (message) {
    filterSummary.textContent = message;
    return;
  }

  const level = selectedLevel();
  const vocabCount = getNormalVocabPool().length;
  const grammarCount = getNormalGrammarPool().length;
  const levelLabel = level === 'all' ? 'A1 + A2 inicial' : level;
  filterSummary.textContent = `${levelLabel}: ruta de vocabulario con ${vocabCount} ejercicios y ruta de gramática con ${grammarCount} ejercicios según los filtros actuales.`;
}

function resetNormalDecks() {
  vocabDeck = getNormalVocabPool();
  vocabIndex = 0;
  grammarDeck = getNormalGrammarPool();
  grammarIndex = 0;
  renderVocab();
  renderGrammar();
  renderFilterSummary();
}

function applyPracticeFilters() {
  const wasReviewing = reviewMode;
  reviewMode = false;
  resetNormalDecks();
  renderProgress(wasReviewing ? 'Filtros aplicados. El modo repaso se cerró y comenzó la ruta seleccionada.' : 'Ruta de práctica actualizada.');
}

function pendingErrorCount() {
  return progress.vocabErrors.length + progress.grammarErrors.length;
}

function getVocabErrors() {
  return vocabBank.filter(item => progress.vocabErrors.includes(item.id));
}

function getGrammarErrors() {
  return grammarBank.filter(item => progress.grammarErrors.includes(item.id));
}

function addError(type, id) {
  const key = type === 'vocab' ? 'vocabErrors' : 'grammarErrors';
  if (!progress[key].includes(id)) progress[key].push(id);
}

function resolveError(type, id) {
  const key = type === 'vocab' ? 'vocabErrors' : 'grammarErrors';
  progress[key] = progress[key].filter(itemId => itemId !== id);
}

function getItemRecord(type, id) {
  const group = progress.itemProgress[type];
  if (!group[id]) group[id] = emptyItemRecord();
  return group[id];
}

function recordItemAttempt(type, id, correct, isReview) {
  const record = getItemRecord(type, id);

  if (isReview) {
    record.reviewAttempts += 1;
    if (correct) record.reviewCorrect += 1;
  } else {
    record.attempts += 1;
    if (correct) record.correct += 1;
    else record.wrong += 1;
  }

  record.lastResult = correct ? 'correct' : 'wrong';
  record.lastAt = new Date().toISOString();
}

function practicedItemCount() {
  const vocabCount = Object.values(progress.itemProgress.vocab).filter(record => record.attempts > 0).length;
  const grammarCount = Object.values(progress.itemProgress.grammar).filter(record => record.attempts > 0).length;
  return vocabCount + grammarCount;
}

function itemIsPending(type, id) {
  return type === 'vocab'
    ? progress.vocabErrors.includes(id)
    : progress.grammarErrors.includes(id);
}

function renderItemHistory(type, id, element) {
  if (!element) return;
  const record = progress.itemProgress[type]?.[id];

  if (!record || (!record.attempts && !record.reviewAttempts)) {
    element.textContent = 'Sin historial individual registrado todavía.';
    return;
  }

  const parts = [];

  if (record.attempts) {
    const accuracy = Math.round((record.correct / record.attempts) * 100);
    parts.push(`${record.correct} de ${record.attempts} correctas · ${accuracy}%`);
  } else {
    parts.push('Sin intentos de práctica normal registrados');
  }

  if (record.reviewAttempts) {
    parts.push(`repaso ${record.reviewCorrect}/${record.reviewAttempts}`);
  }

  parts.push(itemIsPending(type, id) ? 'pendiente de repaso' : 'sin error pendiente');
  element.textContent = `Historial de este ejercicio: ${parts.join(' · ')}.`;
}

function renderProgress(message = '') {
  const totalAnswered = progress.vocabAnswered + progress.grammarAnswered;
  const totalCorrect = progress.vocabCorrect + progress.grammarCorrect;
  const errors = pendingErrorCount();
  const practiced = practicedItemCount();
  const totalItems = vocabBank.length + grammarBank.length;

  if (vocabProgress) vocabProgress.textContent = `${progress.vocabCorrect} / ${progress.vocabAnswered}`;
  if (grammarProgress) grammarProgress.textContent = `${progress.grammarCorrect} / ${progress.grammarAnswered}`;
  if (itemsPracticed) itemsPracticed.textContent = `${practiced} / ${totalItems}`;

  if (progressAccuracy) {
    progressAccuracy.textContent = totalAnswered
      ? `${Math.round((totalCorrect / totalAnswered) * 100)}%`
      : '0%';
  }

  if (reviewErrors) {
    reviewErrors.textContent = reviewMode
      ? 'Volver a rutas normales'
      : errors
        ? `Repasar errores (${errors})`
        : 'Repasar errores';
    reviewErrors.setAttribute('aria-pressed', String(reviewMode));
  }

  if (storageNotice) {
    storageNotice.textContent = message || (storageAvailable
      ? errors
        ? `${errors} ${errors === 1 ? 'error pendiente' : 'errores pendientes'} para repasar. El progreso se guarda localmente en este navegador.`
        : 'Progreso guardado localmente en este navegador. No hay errores pendientes.'
      : errors
        ? `${errors} ${errors === 1 ? 'error pendiente' : 'errores pendientes'} para repasar durante esta sesión.`
        : 'El almacenamiento local no está disponible; el progreso se conservará solo durante esta sesión.');
  }
}

function saveProgress(message = '') {
  if (storageAvailable) {
    try {
      Object.entries(STORAGE_KEYS).forEach(([property, key]) => {
        localStorage.setItem(key, String(progress[property]));
      });
      localStorage.setItem(ERROR_STORAGE_KEY, JSON.stringify({
        vocab: progress.vocabErrors,
        grammar: progress.grammarErrors
      }));
      localStorage.setItem(ITEM_PROGRESS_KEY, JSON.stringify(progress.itemProgress));
    } catch {
      storageAvailable = false;
    }
  }

  renderProgress(message);
}

function renderOptions(container, options, onSelect) {
  if (!container) return;

  container.innerHTML = '';

  shuffle(options).forEach(option => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = option;
    button.addEventListener('click', () => onSelect(option, button));
    container.appendChild(button);
  });
}

function resetLessonResult(result, resultText) {
  if (result) {
    result.hidden = true;
    result.classList.remove('is-correct', 'is-wrong');
  }
  if (resultText) resultText.textContent = '';
}

function showLessonResult(result, resultText, correct, text) {
  if (!result || !resultText) return;
  result.hidden = false;
  result.classList.toggle('is-correct', correct);
  result.classList.toggle('is-wrong', !correct);
  resultText.textContent = text;
}

function routePosition(index, total, reviewing) {
  if (!total) return 'Sin ejercicios disponibles';
  return reviewing ? `Error ${index + 1} de ${total}` : `Ejercicio ${index + 1} de ${total}`;
}

function nextRouteLabel(index, total, reviewing, normalLabel) {
  if (reviewing) return 'Siguiente error';
  return index === total - 1 ? 'Reiniciar esta ruta' : normalLabel;
}

function renderVocabEmptyReview() {
  if (vocabCategory) vocabCategory.textContent = 'VOCABULARY · REPASO';
  if (word) word.textContent = '✓';
  if (answers) answers.innerHTML = '';
  if (feedback) feedback.textContent = 'No hay errores pendientes de vocabulario.';
  if (vocabItemStats) vocabItemStats.textContent = 'No hay ejercicios de vocabulario pendientes de repaso.';
  if (vocabExplanation) vocabExplanation.textContent = 'La cola de vocabulario está resuelta.';
  if (vocabExample) vocabExample.textContent = 'Puedes volver a la ruta normal o continuar resolviendo errores de gramática.';
  if (vocabRoutePosition) vocabRoutePosition.textContent = 'Repaso completado';
  resetLessonResult(vocabResult, vocabResultText);
  if (nextQuestion) {
    nextQuestion.disabled = true;
    nextQuestion.textContent = 'Sin errores pendientes';
  }
}

function renderGrammarEmptyReview() {
  const grammarLabel = grammarSentence?.closest('.quiz-card')?.querySelector('.quiz-label');
  if (grammarLabel) grammarLabel.textContent = 'GRAMMAR · REPASO';
  if (grammarSentence) grammarSentence.textContent = '✓ Sin errores pendientes';
  if (grammarAnswers) grammarAnswers.innerHTML = '';
  if (grammarFeedback) grammarFeedback.textContent = 'No hay errores pendientes de gramática.';
  if (grammarItemStats) grammarItemStats.textContent = 'No hay ejercicios de gramática pendientes de repaso.';
  if (grammarExplanation) grammarExplanation.textContent = 'La cola de gramática está resuelta.';
  if (grammarExample) grammarExample.textContent = 'Puedes volver a la ruta normal o continuar resolviendo errores de vocabulario.';
  if (grammarRoutePosition) grammarRoutePosition.textContent = 'Repaso completado';
  resetLessonResult(grammarResult, grammarResultText);
  if (nextGrammar) {
    nextGrammar.disabled = true;
    nextGrammar.textContent = 'Sin errores pendientes';
  }
}

function renderVocab() {
  if (!word || !answers || !feedback) return;

  if (reviewMode && !vocabDeck.length) {
    renderVocabEmptyReview();
    return;
  }

  const question = vocabDeck[vocabIndex];
  if (!question) {
    if (vocabCategory) vocabCategory.textContent = 'VOCABULARY';
    word.textContent = '—';
    answers.innerHTML = '';
    feedback.textContent = 'No hay ejercicios de vocabulario con estos filtros.';
    if (vocabExplanation) vocabExplanation.textContent = 'Cambia el nivel o el tema para iniciar una ruta con contenido disponible.';
    if (vocabExample) vocabExample.textContent = 'Los filtros no eliminan tu historial.';
    if (vocabRoutePosition) vocabRoutePosition.textContent = 'Sin ruta disponible';
    if (vocabItemStats) vocabItemStats.textContent = '';
    resetLessonResult(vocabResult, vocabResultText);
    if (nextQuestion) {
      nextQuestion.disabled = true;
      nextQuestion.textContent = 'Sin ejercicios';
    }
    return;
  }

  const guide = VOCAB_GUIDES[question.cat] || {
    explanation: 'Relaciona la palabra inglesa con su significado en español dentro del tema seleccionado.',
    example: 'Observa el contexto temático antes de responder.'
  };

  word.textContent = question.w;

  if (vocabCategory) {
    vocabCategory.textContent = reviewMode
      ? `VOCABULARY · REPASO · ${question.level} · ${question.cat}`
      : `VOCABULARY · ${question.level} · ${question.cat}`;
  }

  if (vocabExplanation) vocabExplanation.textContent = guide.explanation;
  if (vocabExample) vocabExample.textContent = guide.example;
  if (vocabRoutePosition) vocabRoutePosition.textContent = routePosition(vocabIndex, vocabDeck.length, reviewMode);

  feedback.textContent = reviewMode
    ? 'Paso 3 · Práctica: vuelve a resolver este error.'
    : 'Paso 3 · Práctica: selecciona la traducción correcta.';

  resetLessonResult(vocabResult, vocabResultText);

  if (nextQuestion) {
    nextQuestion.disabled = true;
    nextQuestion.textContent = 'Responde para continuar';
  }

  renderItemHistory('vocab', question.id, vocabItemStats);
  renderOptions(answers, question.a, (option, button) => checkVocab(option, button, question));
}

function checkVocab(option, button, question) {
  const buttons = [...answers.querySelectorAll('button')];
  if (buttons.some(item => item.disabled)) return;

  buttons.forEach(item => {
    item.disabled = true;
  });

  const correct = option === question.c;
  recordItemAttempt('vocab', question.id, correct, reviewMode);

  if (!reviewMode) {
    progress.vocabAnswered += 1;
    if (correct) progress.vocabCorrect += 1;
  }

  if (correct) {
    resolveError('vocab', question.id);
    button.classList.add('correct');
    feedback.textContent = reviewMode
      ? `Correcto. ${question.w} significa ${question.c}. Este error quedó resuelto.`
      : `Correcto. ${question.w} significa ${question.c}.`;
    showLessonResult(
      vocabResult,
      vocabResultText,
      true,
      reviewMode
        ? 'Resultado: respuesta correcta y error resuelto. Ya no queda pendiente en la cola de vocabulario.'
        : 'Resultado: respuesta correcta. El intento quedó registrado en tu historial individual.'
    );
  } else {
    addError('vocab', question.id);
    button.classList.add('wrong');
    buttons.find(item => item.textContent === question.c)?.classList.add('correct');
    feedback.textContent = reviewMode
      ? `Aún pendiente. La respuesta correcta es ${question.c}.`
      : `La respuesta correcta es ${question.c}. Se añadió al repaso de errores.`;
    showLessonResult(
      vocabResult,
      vocabResultText,
      false,
      `Resultado: conviene repasar esta palabra. ${question.w} significa ${question.c}.`
    );
  }

  if (nextQuestion) {
    nextQuestion.disabled = false;
    nextQuestion.textContent = nextRouteLabel(vocabIndex, vocabDeck.length, reviewMode, 'Siguiente palabra');
  }

  saveProgress();
  renderItemHistory('vocab', question.id, vocabItemStats);
}

function renderGrammar() {
  if (!grammarSentence || !grammarAnswers || !grammarFeedback) return;

  const grammarLabel = grammarSentence.closest('.quiz-card')?.querySelector('.quiz-label');

  if (reviewMode && !grammarDeck.length) {
    renderGrammarEmptyReview();
    return;
  }

  const question = grammarDeck[grammarIndex];
  if (!question) {
    if (grammarLabel) grammarLabel.textContent = 'GRAMMAR';
    grammarSentence.textContent = '—';
    grammarAnswers.innerHTML = '';
    grammarFeedback.textContent = 'No hay ejercicios de gramática con estos filtros.';
    if (grammarExplanation) grammarExplanation.textContent = 'Cambia el nivel o el tema para iniciar una ruta con contenido disponible.';
    if (grammarExample) grammarExample.textContent = 'Los filtros no eliminan tu historial.';
    if (grammarRoutePosition) grammarRoutePosition.textContent = 'Sin ruta disponible';
    if (grammarItemStats) grammarItemStats.textContent = '';
    resetLessonResult(grammarResult, grammarResultText);
    if (nextGrammar) {
      nextGrammar.disabled = true;
      nextGrammar.textContent = 'Sin ejercicios';
    }
    return;
  }

  const guide = GRAMMAR_GUIDES[question.topic] || {
    explanation: 'Observa la estructura gramatical del tema seleccionado antes de completar la oración.',
    example: 'Lee el ejemplo y después aplica la misma idea al ejercicio.'
  };

  if (grammarLabel) {
    grammarLabel.textContent = reviewMode
      ? `GRAMMAR · REPASO · ${question.level} · ${question.topic}`
      : `GRAMMAR · ${question.level} · ${question.topic}`;
  }

  if (grammarExplanation) grammarExplanation.textContent = guide.explanation;
  if (grammarExample) grammarExample.textContent = guide.example;
  if (grammarRoutePosition) grammarRoutePosition.textContent = routePosition(grammarIndex, grammarDeck.length, reviewMode);

  grammarSentence.textContent = question.s;
  grammarFeedback.textContent = reviewMode
    ? 'Paso 3 · Práctica: vuelve a resolver este error.'
    : 'Paso 3 · Práctica: selecciona la opción que completa correctamente la oración.';

  resetLessonResult(grammarResult, grammarResultText);

  if (nextGrammar) {
    nextGrammar.disabled = true;
    nextGrammar.textContent = 'Responde para continuar';
  }

  renderItemHistory('grammar', question.id, grammarItemStats);
  renderOptions(grammarAnswers, question.a, (option, button) => checkGrammar(option, button, question));
}

function checkGrammar(option, button, question) {
  const buttons = [...grammarAnswers.querySelectorAll('button')];
  if (buttons.some(item => item.disabled)) return;

  buttons.forEach(item => {
    item.disabled = true;
  });

  const correct = option === question.c;
  recordItemAttempt('grammar', question.id, correct, reviewMode);

  if (!reviewMode) {
    progress.grammarAnswered += 1;
    if (correct) progress.grammarCorrect += 1;
  }

  if (correct) {
    resolveError('grammar', question.id);
    button.classList.add('correct');
    grammarFeedback.textContent = reviewMode
      ? `Correcto. ${question.e} Este error quedó resuelto.`
      : `Correcto. ${question.e}`;
    showLessonResult(
      grammarResult,
      grammarResultText,
      true,
      reviewMode
        ? `Resultado: respuesta correcta y error resuelto. ${question.e}`
        : `Resultado: respuesta correcta. ${question.e}`
    );
  } else {
    addError('grammar', question.id);
    button.classList.add('wrong');
    buttons.find(item => item.textContent === question.c)?.classList.add('correct');
    grammarFeedback.textContent = reviewMode
      ? `Aún pendiente. Respuesta correcta: ${question.c}. ${question.e}`
      : `Respuesta correcta: ${question.c}. ${question.e} Se añadió al repaso de errores.`;
    showLessonResult(
      grammarResult,
      grammarResultText,
      false,
      `Resultado: necesita repaso. La opción correcta es ${question.c}. ${question.e}`
    );
  }

  if (nextGrammar) {
    nextGrammar.disabled = false;
    nextGrammar.textContent = nextRouteLabel(grammarIndex, grammarDeck.length, reviewMode, 'Siguiente oración');
  }

  saveProgress();
  renderItemHistory('grammar', question.id, grammarItemStats);
}

function refreshVocabReview() {
  vocabDeck = shuffle(getVocabErrors());
  vocabIndex = 0;
  renderVocab();
}

function refreshGrammarReview() {
  grammarDeck = shuffle(getGrammarErrors());
  grammarIndex = 0;
  renderGrammar();
}

function startErrorReview() {
  const errors = pendingErrorCount();

  if (!errors) {
    renderProgress('No hay errores pendientes. Continúa las rutas normales para seguir practicando.');
    return;
  }

  reviewMode = true;
  refreshVocabReview();
  refreshGrammarReview();
  renderFilterSummary('Modo repaso: se muestran todos los errores pendientes, sin limitarse por los filtros de nivel o tema.');
  renderProgress(`Modo repaso activo: ${errors} ${errors === 1 ? 'error pendiente' : 'errores pendientes'}. Los aciertos del repaso resuelven la cola sin alterar la precisión histórica.`);
  document.querySelector('#practica')?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  });
}

function exitErrorReview(message = 'Has vuelto a las rutas normales.') {
  reviewMode = false;
  resetNormalDecks();
  renderProgress(message);
}

nextQuestion?.addEventListener('click', () => {
  if (reviewMode) {
    refreshVocabReview();
    return;
  }

  vocabIndex += 1;

  if (vocabIndex >= vocabDeck.length) {
    vocabDeck = getNormalVocabPool();
    vocabIndex = 0;
  }

  renderVocab();
});

nextGrammar?.addEventListener('click', () => {
  if (reviewMode) {
    refreshGrammarReview();
    return;
  }

  grammarIndex += 1;

  if (grammarIndex >= grammarDeck.length) {
    grammarDeck = getNormalGrammarPool();
    grammarIndex = 0;
  }

  renderGrammar();
});

reviewErrors?.addEventListener('click', () => {
  if (reviewMode) {
    exitErrorReview();
  } else {
    startErrorReview();
  }
});

practiceLevel?.addEventListener('change', () => {
  updateTopicOptions();
  applyPracticeFilters();
});

vocabTopic?.addEventListener('change', applyPracticeFilters);
grammarTopic?.addEventListener('change', applyPracticeFilters);

resetProgress?.addEventListener('click', () => {
  progress.vocabCorrect = 0;
  progress.vocabAnswered = 0;
  progress.grammarCorrect = 0;
  progress.grammarAnswered = 0;
  progress.vocabErrors = [];
  progress.grammarErrors = [];
  progress.itemProgress = { vocab: {}, grammar: {} };

  if (storageAvailable) {
    try {
      [...Object.values(STORAGE_KEYS), ERROR_STORAGE_KEY, ITEM_PROGRESS_KEY, ...LEGACY_STORAGE_KEYS].forEach(key => {
        localStorage.removeItem(key);
      });
    } catch {
      storageAvailable = false;
    }
  }

  if (reviewMode) {
    exitErrorReview('Progreso, historial por ejercicio y cola de errores reiniciados.');
  } else {
    resetNormalDecks();
    renderProgress('Progreso, historial por ejercicio y cola de errores reiniciados.');
  }
});

menu?.addEventListener('click', () => {
  const isOpen = menu.getAttribute('aria-expanded') === 'true';
  const nextOpen = !isOpen;

  menu.setAttribute('aria-expanded', String(nextOpen));
  menu.setAttribute('aria-label', nextOpen ? 'Cerrar menú' : 'Abrir menú');
  nav?.classList.toggle('open', nextOpen);
});

nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
    menu?.setAttribute('aria-label', 'Abrir menú');
  });
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav?.classList.contains('open')) {
    nav.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
    menu?.setAttribute('aria-label', 'Abrir menú');
    menu?.focus();
  }
});

updateTopicOptions();
resetNormalDecks();
renderProgress();
