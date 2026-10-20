(() => {
  const accessibilityCssUrl = 'https://neuronova-apps.github.io/assets/accessibility/accessibility.css';
  const accessibilityJsUrl = 'https://neuronova-apps.github.io/assets/accessibility/accessibility.js';
  const challengeSelectorCssUrl = 'challenge-selector.css';

  if (!document.querySelector(`link[href="${accessibilityCssUrl}"]`)) {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = accessibilityCssUrl;
    stylesheet.dataset.neuronovaA11y = 'true';
    document.head.appendChild(stylesheet);
  }

  if (!document.querySelector(`link[href="${challengeSelectorCssUrl}"]`)) {
    const challengeStylesheet = document.createElement('link');
    challengeStylesheet.rel = 'stylesheet';
    challengeStylesheet.href = challengeSelectorCssUrl;
    challengeStylesheet.dataset.cruciluxChallenges = 'true';
    document.head.appendChild(challengeStylesheet);
  }

  if (!document.querySelector(`script[src="${accessibilityJsUrl}"]`)) {
    const accessibilityScript = document.createElement('script');
    accessibilityScript.src = accessibilityJsUrl;
    accessibilityScript.dataset.neuronovaA11y = 'true';
    document.head.appendChild(accessibilityScript);
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': 'https://neuronova-apps.github.io/crucilux-app/#app',
    name: 'Crucilux',
    url: 'https://neuronova-apps.github.io/crucilux-app/',
    description: 'MVP web de Crucilux con tres retos de crucigrama, nueve palabras, edición directa de letras, feedback educativo, pistas graduales y cinco guías públicas sobre resolución de crucigramas.',
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web',
    inLanguage: 'es-PE',
    applicationSuite: 'Neuronova Apps',
    image: 'https://neuronova-apps.github.io/crucilux-app/assets/social/crucilux-social.png',
    featureList: [
      'Tres retos de crucigrama seleccionables',
      'Nueve palabras distribuidas por categorías',
      'Entrada y edición de letras directamente en las casillas',
      'Cruces compartidos y comprobación de la palabra activa',
      'Feedback de intentos y pistas graduales por palabra',
      'Navegación por teclado y contexto ARIA del tablero',
      'Cinco guías educativas indexables sobre crucigramas y vocabulario',
      'Progreso parcial y mejor resultado guardados por reto'
    ],
    isPartOf: {'@id': 'https://neuronova-apps.github.io/#website'}
  };

  if (!document.querySelector('script[data-neuronova-schema="true"]')) {
    const schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.dataset.neuronovaSchema = 'true';
    schema.textContent = JSON.stringify(structuredData);
    document.head.appendChild(schema);
  }

  const menu = document.querySelector('.menu-button');
  const nav = document.querySelector('.main-nav');
  const year = document.querySelector('#year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (menu && nav) {
    const close = () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Abrir menú de navegación');
    };

    menu.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', close);
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        close();
        menu.focus({preventScroll: true});
      }
    });
  }

  const challengeSelector = document.querySelector('.challenge-selector');

  if (challengeSelector) {
    challengeSelector.id = challengeSelector.id || 'challengeList';
    challengeSelector.classList.add('challenge-list-scroll');
    challengeSelector.hidden = true;
    challengeSelector.style.display = 'none';

    const challengeToggle = document.createElement('button');
    challengeToggle.className = 'challenge-list-toggle';
    challengeToggle.type = 'button';
    challengeToggle.setAttribute('aria-expanded', 'false');
    challengeToggle.setAttribute('aria-controls', challengeSelector.id);

    const currentLabel = document.createElement('span');
    currentLabel.className = 'challenge-list-current';
    const hintLabel = document.createElement('span');
    hintLabel.className = 'challenge-list-hint';
    const chevron = document.createElement('span');
    chevron.className = 'challenge-list-chevron';
    chevron.setAttribute('aria-hidden', 'true');
    chevron.textContent = '▾';

    challengeToggle.append(currentLabel, hintLabel, chevron);
    challengeSelector.before(challengeToggle);

    const challengeCount = () => challengeSelector.querySelectorAll('.challenge-option').length;
    const activeTitle = () => challengeSelector.querySelector('.challenge-option.active strong')?.textContent?.trim()
      || challengeSelector.querySelector('.challenge-option strong')?.textContent?.trim()
      || 'Seleccionar reto';

    const syncChallengeToggle = () => {
      const expanded = challengeToggle.getAttribute('aria-expanded') === 'true';
      const count = challengeCount();
      const title = activeTitle();
      currentLabel.textContent = `Reto actual: ${title}`;
      hintLabel.textContent = expanded
        ? 'Ocultar lista de retos'
        : `Ver lista de ${count} ${count === 1 ? 'reto' : 'retos'}`;
      challengeToggle.setAttribute(
        'aria-label',
        `${expanded ? 'Ocultar' : 'Mostrar'} lista de ${count} ${count === 1 ? 'reto' : 'retos'}. Reto actual: ${title}`
      );
    };

    const setChallengeListExpanded = expanded => {
      challengeToggle.setAttribute('aria-expanded', String(expanded));
      challengeSelector.hidden = !expanded;
      challengeSelector.style.display = expanded ? 'grid' : 'none';
      challengeSelector.style.maxHeight = expanded ? '350px' : '';
      challengeSelector.style.overflowY = expanded ? 'auto' : '';
      syncChallengeToggle();

      if (expanded) {
        requestAnimationFrame(() => {
          challengeSelector.querySelector('.challenge-option.active')?.scrollIntoView({block: 'nearest'});
        });
      }
    };

    challengeToggle.addEventListener('click', () => {
      setChallengeListExpanded(challengeToggle.getAttribute('aria-expanded') !== 'true');
    });

    challengeSelector.addEventListener('click', event => {
      const option = event.target.closest('.challenge-option');
      if (!option) return;
      queueMicrotask(() => {
        setChallengeListExpanded(false);
        challengeToggle.focus({preventScroll: true});
      });
    });

    const challengeObserver = new MutationObserver(syncChallengeToggle);
    challengeObserver.observe(challengeSelector, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['class', 'aria-pressed']
    });

    syncChallengeToggle();
  }

  const items = [...document.querySelectorAll('.reveal')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });

    items.forEach(item => observer.observe(item));
  } else {
    items.forEach(item => item.classList.add('visible'));
  }
})();