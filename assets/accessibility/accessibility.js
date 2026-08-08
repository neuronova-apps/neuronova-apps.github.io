(() => {
  'use strict';

  if (window.NeuronovaA11y?.ready) return;

  const STORAGE_KEY = 'neuronova-a11y-v1';
  const defaults = {
    fontSize: '1',
    contrast: 'normal',
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

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch (_) {}
  }

  function apply() {
    root.dataset.novaFontSize = prefs.fontSize;
    root.dataset.novaContrast = prefs.contrast;
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
    prefs[name] = value;
    apply();
    save();
    syncControls();
  }

  apply();

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
