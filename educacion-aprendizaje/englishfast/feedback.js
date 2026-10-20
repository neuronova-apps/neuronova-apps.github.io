(() => {
  const { vocabBank = [], grammarBank = [] } = window.EnglishFastContent || {};

  const vocabByWord = new Map(vocabBank.map(item => [item.w, item]));
  const grammarBySentence = new Map(grammarBank.map(item => [item.s, item]));

  function isReviewMode() {
    return document.querySelector('#reviewErrors')?.getAttribute('aria-pressed') === 'true';
  }

  function enhanceVocabFeedback(selectedOption) {
    const currentWord = document.querySelector('#questionWord')?.textContent?.trim();
    const question = vocabByWord.get(currentWord);
    if (!question) return;

    const correct = selectedOption === question.c;
    const reviewing = isReviewMode();
    const feedback = document.querySelector('#feedback');
    const result = document.querySelector('#vocabResult');
    const resultText = document.querySelector('#vocabResultText');

    if (feedback) {
      feedback.textContent = correct
        ? `Correcto. ${question.w} significa ${question.c}. ${question.contrast}${reviewing ? ' Este error quedó resuelto.' : ''}`
        : `Elegiste ${selectedOption}. ${question.w} significa ${question.c}. ${question.contrast}${reviewing ? ' El error sigue pendiente.' : ' Se añadió al repaso de errores.'}`;
    }

    if (result && resultText && !result.hidden) {
      const status = correct
        ? reviewing
          ? 'Resultado: respuesta correcta y error resuelto.'
          : 'Resultado: respuesta correcta.'
        : reviewing
          ? 'Resultado: la palabra todavía necesita repaso.'
          : 'Resultado: conviene repasar esta palabra.';

      resultText.textContent = `${status} ${question.contrast} Uso: ${question.usage}`;
    }
  }

  function completeGrammarSentence(question) {
    return question.s.replace('___', question.c);
  }

  function enhanceGrammarFeedback(selectedOption) {
    const currentSentence = document.querySelector('#grammarSentence')?.textContent?.trim();
    const question = grammarBySentence.get(currentSentence);
    if (!question) return;

    const correct = selectedOption === question.c;
    const reviewing = isReviewMode();
    const completeSentence = completeGrammarSentence(question);
    const feedback = document.querySelector('#grammarFeedback');
    const result = document.querySelector('#grammarResult');
    const resultText = document.querySelector('#grammarResultText');

    if (feedback) {
      feedback.textContent = correct
        ? `Correcto. ${question.e} Oración completa: ${completeSentence}${reviewing ? ' Este error quedó resuelto.' : ''}`
        : `Elegiste ${selectedOption}. La opción correcta es ${question.c}. ${question.e} Oración completa: ${completeSentence}${reviewing ? ' El error sigue pendiente.' : ' Se añadió al repaso de errores.'}`;
    }

    if (result && resultText && !result.hidden) {
      const status = correct
        ? reviewing
          ? 'Resultado: respuesta correcta y error resuelto.'
          : 'Resultado: respuesta correcta.'
        : reviewing
          ? 'Resultado: la estructura todavía necesita repaso.'
          : 'Resultado: conviene revisar esta estructura.';

      resultText.textContent = `${status} ${question.e} Modelo correcto: ${completeSentence}`;
    }
  }

  document.addEventListener('click', event => {
    const vocabButton = event.target.closest('#answers button');
    const grammarButton = event.target.closest('#grammarAnswers button');

    if (!vocabButton && !grammarButton) return;

    const selectedOption = (vocabButton || grammarButton).textContent.trim();

    queueMicrotask(() => {
      if (vocabButton) enhanceVocabFeedback(selectedOption);
      if (grammarButton) enhanceGrammarFeedback(selectedOption);
    });
  });
})();
