(() => {
  if (!document.querySelector('style[data-neuronova-hero-scale]')) {
    const style = document.createElement('style');
    style.dataset.neuronovaHeroScale = 'true';
    style.textContent = '.core{width:121.5px;height:121.5px;border-radius:32.4px}.core-ring{inset:8.1px;border-radius:25.2px}.core strong{font-size:3.078rem}.core small{margin-top:8.1px;font-size:.81em}';
    document.head.appendChild(style);
  }
})();

(() => {
  if (!document.querySelector('link[rel="icon"]')) {
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/svg+xml';
    favicon.href = '/favicon.svg';
    document.head.appendChild(favicon);
  }

  if (!document.querySelector('link[data-neuronova-performance]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/performance.css';
    link.dataset.neuronovaPerformance = 'true';
    document.head.appendChild(link);
  }

  if (!document.querySelector('link[data-neuronova-a11y]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/accessibility/accessibility.css';
    link.dataset.neuronovaA11y = 'true';
    document.head.appendChild(link);
  }

  if (!window.NeuronovaA11y && !document.querySelector('script[data-neuronova-a11y]')) {
    const script = document.createElement('script');
    script.src = '/assets/accessibility/accessibility.js';
    script.dataset.neuronovaA11y = 'true';
    document.head.appendChild(script);
  }
})();

(() => {
  const currentAccess = {
    'Quiz Bible': 'https://neuronova-apps.github.io/quizbible-app/',
    'Mi Momento': 'https://neuronova-apps.github.io/mimomento-app/',
    'Brailux': 'https://neuronova-apps.github.io/brailux-app/',
    'English Fast': 'https://neuronova-apps.github.io/englishfast-app/',
    'Sudolux': 'https://neuronova-apps.github.io/sudolux-app/',
    'Crucilux': 'https://neuronova-apps.github.io/crucilux-app/',
    'Motiva': 'https://neuronova-apps.github.io/motiva-app/'
  };

  document.querySelectorAll('.app-card').forEach((card) => {
    const appName = card.querySelector('.card-content h3')?.textContent.trim();
    const url = currentAccess[appName];
    if (!url) return;

    const actions = card.querySelector('.card-actions');
    if (!actions) return;

    let access = actions.querySelector('.card-button');
    if (!access || access.tagName !== 'A') {
      const replacement = document.createElement('a');
      replacement.className = 'card-button';
      replacement.innerHTML = 'Abrir app <span aria-hidden="true">↗</span>';
      if (access) access.replaceWith(replacement);
      else actions.prepend(replacement);
      access = replacement;
    }

    access.href = url;
    access.setAttribute('aria-label', `Abrir ${appName}`);
    access.removeAttribute('aria-disabled');
  });
})();

(() => {
  document.querySelectorAll('.app-card .card-actions').forEach((actions) => {
    if (actions.querySelector('.play-store-button')) return;

    const playStoreButton = document.createElement('span');
    playStoreButton.className = 'play-store-button';
    playStoreButton.setAttribute('aria-disabled', 'true');
    playStoreButton.setAttribute('title', 'Disponible en Google Play próximamente');
    playStoreButton.textContent = 'Google Play · Próximamente';
    actions.appendChild(playStoreButton);
  });
})();

const menuButton = document.querySelector('.menu-button');
const mainNav = document.querySelector('.main-nav');
const year = document.querySelector('#year');
const revealItems = document.querySelectorAll('.reveal');
const hero = document.querySelector('.hero');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuButton && mainNav) {
  const closeMenu = () => {
    mainNav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menú de navegación');
  };

  menuButton.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      menuButton.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (!mainNav.contains(event.target) && !menuButton.contains(event.target)) {
      closeMenu();
    }
  });
}

if (reduceMotion) {
  revealItems.forEach((item) => item.classList.add('visible'));
} else if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -35px 0px'
  });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

if (hero && !reduceMotion && 'IntersectionObserver' in window) {
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      hero.classList.toggle('performance-paused', !entry.isIntersecting);
    });
  }, {
    threshold: 0.02
  });

  heroObserver.observe(hero);
}
