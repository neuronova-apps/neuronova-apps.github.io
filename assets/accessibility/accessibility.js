(() => {
  'use strict';

  if (window.NeuronovaA11y?.ready) return;

  const STORAGE_KEY = 'neuronova-a11y-v1';
  const defaults = {
    fontSize: '1',
    contrast: 'normal',
    theme: 'normal',
    spacing: 'normal',
    lineHeight: 'normal',
    dyslexia: 'off',
    links: 'normal',
    motion: 'normal',
    guide: 'off',
    focus: 'strong'
  };

  let prefs = {...defaults};
  try {
    prefs = {...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')};
  } catch (_) {
    prefs = {...defaults};
  }

  const root = document.documentElement;

  function injectStructuredData() {
    if (document.querySelector('script[data-neuronova-schema="true"]')) return;

    const baseUrl = 'https://neuronova-apps.github.io/';
    const websiteId = `${baseUrl}#website`;
    const normalizePath = path => {
      const clean = String(path || '/').replace(/index\.html$/i, '');
      return clean.endsWith('/') ? clean : `${clean}/`;
    };

    const apps = {
      '/quizbible-app/': {
        name: 'Quiz Bible',
        url: `${baseUrl}quizbible-app/`,
        description: 'Experiencia de preguntas bíblicas pensada para aprender, recordar y descubrir contenidos mediante desafíos breves y progresivos.',
        applicationCategory: 'EducationalApplication',
        featureList: ['Preguntas bíblicas', 'Niveles progresivos', 'Aprendizaje interactivo']
      },
      '/mimomento-app/': {
        name: 'Mi Momento',
        url: `${baseUrl}mimomento-app/`,
        description: 'Gestor personal de devocionales, oraciones y reflexiones pensado para acompañar el hábito espiritual diario desde un espacio organizado.',
        applicationCategory: 'LifestyleApplication',
        featureList: ['Devocionales diarios', 'Planes por propósito', 'Diario y seguimiento']
      },
      '/brailux-app/': {
        name: 'Brailux',
        url: `${baseUrl}brailux-app/`,
        description: 'Aplicación orientada al aprendizaje y práctica del sistema Braille mediante una experiencia digital accesible, clara y progresiva.',
        applicationCategory: 'EducationalApplication',
        featureList: ['Aprendizaje guiado', 'Práctica interactiva', 'Accesibilidad integrada']
      },
      '/englishfast-app/': {
        name: 'English Fast',
        url: `${baseUrl}englishfast-app/`,
        description: 'Aplicación para fortalecer el aprendizaje del inglés mediante teoría breve, práctica contextualizada y diferentes modalidades de juego.',
        applicationCategory: 'EducationalApplication',
        featureList: ['Gramática y vocabulario', 'Práctica fonética', 'Multijuegos']
      },
      '/sudolux-app/': {
        name: 'Sudolux',
        url: `${baseUrl}sudolux-app/`,
        description: 'Sudoku digital enfocado en una experiencia limpia y progresiva, con retos de lógica para practicar concentración y resolución de problemas.',
        applicationCategory: 'GameApplication',
        featureList: ['Niveles progresivos', 'Partidas interactivas', 'Retos de lógica']
      },
      '/crucilux-app/': {
        name: 'Crucilux',
        url: `${baseUrl}crucilux-app/`,
        description: 'Aplicación de crucigramas y retos de palabras orientada a ejercitar vocabulario, memoria, razonamiento verbal y atención.',
        applicationCategory: 'GameApplication',
        featureList: ['Crucigramas progresivos', 'Retos de vocabulario', 'Ejercitación verbal']
      },
      '/motiva-app/': {
        name: 'Motiva',
        url: `${baseUrl}motiva-app/`,
        description: 'Espacio de frases motivacionales y reflexivas pensado para ofrecer mensajes breves que acompañen distintos momentos del día.',
        applicationCategory: 'LifestyleApplication',
        featureList: ['Frases seleccionadas', 'Personalización', 'Experiencia cotidiana']
      }
    };

    const buildAppNode = app => ({
      '@type': 'WebApplication',
      '@id': `${app.url}#app`,
      name: app.name,
      url: app.url,
      description: app.description,
      applicationCategory: app.applicationCategory,
      operatingSystem: 'Web',
      inLanguage: 'es-PE',
      applicationSuite: 'Neuronova Apps',
      featureList: app.featureList,
      isPartOf: {'@id': websiteId}
    });

    const path = normalizePath(window.location.pathname);
    let structuredData;

    if (path === '/') {
      const appNodes = Object.values(apps).map(buildAppNode);
      structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': websiteId,
            url: baseUrl,
            name: 'Neuronova Apps',
            description: 'Ecosistema de aplicaciones web orientadas al aprendizaje, la accesibilidad, el bienestar, la espiritualidad y el entretenimiento.',
            inLanguage: 'es-PE',
            hasPart: appNodes.map(app => ({'@id': app['@id']}))
          },
          {
            '@type': 'ItemList',
            '@id': `${baseUrl}#apps`,
            name: 'Aplicaciones de Neuronova Apps',
            numberOfItems: appNodes.length,
            itemListElement: appNodes.map((app, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@id': app['@id'],
                name: app.name,
                url: app.url
              }
            }))
          },
          ...appNodes
        ]
      };
    } else if (apps[path]) {
      structuredData = {
        '@context': 'https://schema.org',
        ...buildAppNode(apps[path])
      };
    } else {
      return;
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.neuronovaSchema = 'true';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }

  injectStructuredData();

  function parseRgb(color) {
    const match = String(color || '').match(/rgba?\((\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)/i);
    if (!match) return null;
    return [Number(match[1]), Number(match[2]), Number(match[3])];
  }

  function luminance(rgb) {
    if (!rgb) return null;
    const channels = rgb.map(value => {
      const c = value / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
  }

  function pageAlreadyLight() {
    if (root.dataset.novaDayMode === 'disabled' || document.body?.dataset.novaDayMode === 'disabled') return true;

    const declaredScheme = getComputedStyle(root).colorScheme || '';
    if (/\blight\b/i.test(declaredScheme) && !/\bdark\b/i.test(declaredScheme)) return true;

    const candidates = [
      getComputedStyle(document.body).backgroundColor,
      getComputedStyle(root).backgroundColor
    ];

    for (const color of candidates) {
      const lum = luminance(parseRgb(color));
      if (lum !== null && lum > 0.62) return true;
    }

    return false;
  }

  let dayModeAvailable = true;

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch (_) {}
  }

  function apply() {
    root.dataset.novaFontSize = prefs.fontSize;
    root.dataset.novaContrast = prefs.contrast;
    root.dataset.novaTheme = dayModeAvailable ? prefs.theme : 'normal';
    root.dataset.novaSpacing = prefs.spacing;
    root.dataset.novaLineHeight = prefs.lineHeight;
    root.dataset.novaDyslexia = prefs.dyslexia;
    root.dataset.novaLinks = prefs.links;
    root.dataset.novaMotion = prefs.motion;
    root.dataset.novaGuide = prefs.guide;
    root.dataset.novaFocus = prefs.focus;
  }

  function setPreference(name, value) {
    if (!(name in defaults)) return;
    if (name === 'theme' && !dayModeAvailable) return;
    prefs[name] = value;
    apply();
    save();
    syncControls();
  }

  const launcher = document.createElement('button');
  launcher.type = 'button';
  launcher.className = 'nova-a11y-launcher';
  launcher.setAttribute('aria-expanded', 'false');
  launcher.setAttribute('aria-controls', 'novaA11yPanel');
  launcher.setAttribute('aria-label', 'Abrir opciones de accesibilidad. Atajo Alt más A');
  launcher.innerHTML = '<span class="nova-a11y-aa" aria-hidden="true">Aa</span><span class="nova-a11y-text-label">Accesibilidad</span>';

  const panel = document.createElement('section');
  panel.id = 'novaA11yPanel';
  panel.className = 'nova-a11y-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Opciones de accesibilidad');
  panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML = `
    <div class="nova-a11y-head">
      <div>
        <h2>Accesibilidad</h2>
        <p>Ajustes compartidos en Neuronova Apps</p>
      </div>
      <button type="button" class="nova-a11y-close" aria-label="Cerrar opciones de accesibilidad">×</button>
    </div>
    <div class="nova-a11y-body">
      <div class="nova-a11y-group">
        <span class="nova-a11y-label">Tamaño de texto</span>
        <div class="nova-a11y-choice-grid" role="group" aria-label="Tamaño de texto">
          <button type="button" class="nova-a11y-control" data-pref="fontSize" data-value="1">A<small>Normal</small></button>
          <button type="button" class="nova-a11y-control" data-pref="fontSize" data-value="2">A+<small>Grande</small></button>
          <button type="button" class="nova-a11y-control" data-pref="fontSize" data-value="3">A++<small>Extra</small></button>
        </div>
      </div>

      <div class="nova-a11y-group">
        <span class="nova-a11y-label">Lectura</span>
        <div class="nova-a11y-toggle-grid">
          <button type="button" class="nova-a11y-control" data-pref="spacing" data-toggle="wide" data-off="normal">Espaciar letras y palabras</button>
          <button type="button" class="nova-a11y-control" data-pref="lineHeight" data-toggle="wide" data-off="normal">Interlineado amplio</button>
          <button type="button" class="nova-a11y-control" data-pref="dyslexia" data-toggle="on" data-off="off">Lectura amigable para dislexia</button>
          <button type="button" class="nova-a11y-control" data-pref="guide" data-toggle="on" data-off="off">Guía de lectura</button>
        </div>
      </div>

      <div class="nova-a11y-group">
        <span class="nova-a11y-label">Visual</span>
        <div class="nova-a11y-toggle-grid">
          <button type="button" class="nova-a11y-control nova-a11y-day-control" data-pref="theme" data-toggle="day" data-off="normal">Modo día</button>
          <button type="button" class="nova-a11y-control" data-pref="contrast" data-toggle="high" data-off="normal">Alto contraste</button>
          <button type="button" class="nova-a11y-control" data-pref="links" data-toggle="strong" data-off="normal">Resaltar enlaces</button>
          <button type="button" class="nova-a11y-control" data-pref="motion" data-toggle="reduce" data-off="normal">Reducir movimiento</button>
          <button type="button" class="nova-a11y-control" data-pref="focus" data-toggle="strong" data-off="normal">Foco de teclado</button>
        </div>
      </div>

      <button type="button" class="nova-a11y-control nova-a11y-reset">Restablecer ajustes</button>
      <p class="nova-a11y-hint">Atajo: Alt + A. Los ajustes se conservan al navegar entre las apps del mismo sitio.</p>
    </div>`;

  const guide = document.createElement('div');
  guide.className = 'nova-reading-guide';
  guide.setAttribute('aria-hidden', 'true');

  document.body.append(guide, panel, launcher);

  dayModeAvailable = !pageAlreadyLight();
  if (!dayModeAvailable) {
    prefs.theme = 'normal';
    panel.querySelector('.nova-a11y-day-control')?.remove();
  }

  apply();

  const closeButton = panel.querySelector('.nova-a11y-close');
  const resetButton = panel.querySelector('.nova-a11y-reset');
  const controls = [...panel.querySelectorAll('[data-pref]')];

  function syncControls() {
    controls.forEach(control => {
      const pref = control.dataset.pref;
      if (control.dataset.value) {
        const active = prefs[pref] === control.dataset.value;
        control.classList.toggle('active', active);
        control.setAttribute('aria-pressed', String(active));
      } else {
        const active = prefs[pref] === control.dataset.toggle;
        control.classList.toggle('active', active);
        control.setAttribute('aria-pressed', String(active));
      }
    });
  }

  function openPanel() {
    panel.setAttribute('aria-hidden', 'false');
    launcher.setAttribute('aria-expanded', 'true');
    closeButton.focus();
  }

  function closePanel(returnFocus = true) {
    panel.setAttribute('aria-hidden', 'true');
    launcher.setAttribute('aria-expanded', 'false');
    if (returnFocus) launcher.focus();
  }

  function togglePanel() {
    if (panel.getAttribute('aria-hidden') === 'true') openPanel();
    else closePanel();
  }

  launcher.addEventListener('click', togglePanel);
  closeButton.addEventListener('click', () => closePanel());

  controls.forEach(control => {
    control.addEventListener('click', () => {
      const pref = control.dataset.pref;
      if (control.dataset.value) {
        setPreference(pref, control.dataset.value);
      } else {
        const activeValue = control.dataset.toggle;
        const offValue = control.dataset.off;
        setPreference(pref, prefs[pref] === activeValue ? offValue : activeValue);
      }
    });
  });

  resetButton.addEventListener('click', () => {
    prefs = {...defaults};
    apply();
    save();
    syncControls();
  });

  document.addEventListener('keydown', event => {
    if (event.altKey && event.key.toLowerCase() === 'a') {
      event.preventDefault();
      togglePanel();
    }
    if (event.key === 'Escape' && panel.getAttribute('aria-hidden') === 'false') {
      closePanel();
    }
  });

  document.addEventListener('pointermove', event => {
    if (prefs.guide === 'on') {
      guide.style.top = `${Math.max(28, Math.min(window.innerHeight - 28, event.clientY))}px`;
    }
  }, {passive: true});

  window.NeuronovaA11y = {
    ready: true,
    open: openPanel,
    close: closePanel,
    toggle: togglePanel,
    set: setPreference,
    get: () => ({...prefs}),
    reset: () => {
      prefs = {...defaults};
      apply();
      save();
      syncControls();
    }
  };

  const legacyContrast = document.querySelector('#contrastToggle');
  if (legacyContrast) {
    const accessButton = legacyContrast.cloneNode(true);
    accessButton.id = 'novaAccessibilityHeaderButton';
    accessButton.textContent = 'Accesibilidad';
    accessButton.removeAttribute('aria-pressed');
    accessButton.setAttribute('aria-haspopup', 'dialog');
    accessButton.setAttribute('aria-controls', 'novaA11yPanel');
    legacyContrast.replaceWith(accessButton);
    accessButton.addEventListener('click', openPanel);
  }

  syncControls();
})();
