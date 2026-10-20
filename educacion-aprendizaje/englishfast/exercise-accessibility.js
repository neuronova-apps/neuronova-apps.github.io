(() => {
  const vocabAnswers = document.querySelector('#answers');
  const grammarAnswers = document.querySelector('#grammarAnswers');
  const vocabFeedback = document.querySelector('#feedback');
  const grammarFeedback = document.querySelector('#grammarFeedback');
  const vocabResult = document.querySelector('#vocabResult');
  const grammarResult = document.querySelector('#grammarResult');
  const vocabStage = document.querySelector('#ruta-vocabulario .practice-stage');
  const grammarStage = document.querySelector('#ruta-gramatica .practice-stage');
  const nextQuestion = document.querySelector('#nextQuestion');
  const nextGrammar = document.querySelector('#nextGrammar');
  const reviewErrors = document.querySelector('#reviewErrors');
  const resetProgress = document.querySelector('#resetProgress');
  const storageNotice = document.querySelector('#storageNotice');
  const filterSummary = document.querySelector('#filterSummary');
  const practiceLevel = document.querySelector('#practiceLevel');
  const vocabTopic = document.querySelector('#vocabTopic');
  const grammarTopic = document.querySelector('#grammarTopic');

  function normalizeFooter() {
    const footer = document.querySelector('.site-footer');
    const columns = [...document.querySelectorAll('.site-footer .footer-column')];
    const explore = columns[0];
    const contact = columns[1];
    const footerBottom = document.querySelector('.site-footer .footer-bottom');

    if (explore && !explore.querySelector('a[href*="github.com/neuronova-apps/englishfast-app"]')) {
      const github = document.createElement('a');
      github.href = 'https://github.com/neuronova-apps/englishfast-app';
      github.target = '_blank';
      github.rel = 'noopener noreferrer';
      github.textContent = 'GitHub';
      explore.appendChild(github);
    }

    if (contact) {
      contact.innerHTML = `
        <h2>Contacto</h2>
        <a href="mailto:berm_km@hotmail.com">berm_km@hotmail.com</a>
        <span>Pucallpa, Ucayali · Perú</span>
        <span>Proyecto independiente</span>`;
    }

    if (footerBottom) {
      footerBottom.innerHTML = `
        <p>© 2026 English Fast · Neuronova Apps</p>
        <p><a href="privacy/">Política de privacidad</a></p>`;
    }

    if (footer) footer.dataset.footerUnified = 'true';
  }

  function configureAnswerGroup(container, labelIds, descriptionIds) {
    if (!container) return;
    container.setAttribute('role', 'group');
    container.setAttribute('aria-labelledby', labelIds.join(' '));
    container.setAttribute('aria-describedby', descriptionIds.join(' '));
  }

  function configureFocusableRegion(element, label) {
    if (!element) return;
    element.tabIndex = -1;
    element.setAttribute('role', 'region');
    element.setAttribute('aria-label', label);
  }

  normalizeFooter();

  configureAnswerGroup(vocabAnswers, ['vocabCategory', 'questionWord'], ['vocabItemStats', 'feedback']);
  configureAnswerGroup(grammarAnswers, ['grammarSentence'], ['grammarItemStats', 'grammarFeedback']);

  configureFocusableRegion(vocabStage, 'Práctica de vocabulario');
  configureFocusableRegion(grammarStage, 'Práctica de gramática');
  configureFocusableRegion(vocabResult, 'Resultado de vocabulario');
  configureFocusableRegion(grammarResult, 'Resultado de gramática');
  configureFocusableRegion(storageNotice, 'Estado del progreso');

  vocabFeedback?.removeAttribute('aria-live');
  grammarFeedback?.removeAttribute('aria-live');
  storageNotice?.removeAttribute('aria-live');

  [practiceLevel, vocabTopic, grammarTopic].forEach(select => {
    if (select && filterSummary) select.setAttribute('aria-describedby', 'filterSummary');
  });

  if (nextQuestion) nextQuestion.setAttribute('aria-describedby', 'vocabRoutePosition');
  if (nextGrammar) nextGrammar.setAttribute('aria-describedby', 'grammarRoutePosition');

  function focusLater(element) {
    if (!element) return;
    requestAnimationFrame(() => {
      if (!element.hidden && document.contains(element)) {
        element.focus({ preventScroll: false });
      }
    });
  }

  function focusFirstReviewRoute() {
    const vocabHasExercise = Boolean(vocabAnswers?.querySelector('button'));
    const grammarHasExercise = Boolean(grammarAnswers?.querySelector('button'));

    if (vocabHasExercise) focusLater(vocabStage);
    else if (grammarHasExercise) focusLater(grammarStage);
  }

  document.addEventListener('click', event => {
    if (event.target.closest('#answers button')) {
      focusLater(vocabResult);
      return;
    }

    if (event.target.closest('#grammarAnswers button')) {
      focusLater(grammarResult);
      return;
    }

    if (event.target.closest('#nextQuestion')) {
      focusLater(vocabStage);
      return;
    }

    if (event.target.closest('#nextGrammar')) {
      focusLater(grammarStage);
      return;
    }

    if (event.target.closest('#resetProgress')) {
      focusLater(storageNotice);
      return;
    }

    if (event.target.closest('#reviewErrors')) {
      requestAnimationFrame(() => {
        if (reviewErrors?.getAttribute('aria-pressed') === 'true') {
          focusFirstReviewRoute();
        }
      });
    }
  });
})();

(() => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': 'https://neuronova-apps.github.io/englishfast-app/#app',
    name: 'English Fast',
    url: 'https://neuronova-apps.github.io/englishfast-app/',
    description: 'Experiencia educativa web para practicar vocabulario, gramática y comprensión del inglés con sesiones breves y progreso local.',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    inLanguage: 'es-PE',
    applicationSuite: 'Neuronova Apps',
    image: 'https://neuronova-apps.github.io/englishfast-app/assets/social/englishfast-social.png',
    featureList: ['Práctica de vocabulario', 'Práctica de gramática', 'Contenido inicial A1 y A2', 'Progreso local por ejercicio', 'Repaso de errores', 'Recursos educativos públicos'],
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