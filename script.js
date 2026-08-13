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
