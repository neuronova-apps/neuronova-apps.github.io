(() => {
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
  if (document.querySelector('style[data-neuronova-compact-cards]')) return;

  const style = document.createElement('style');
  style.dataset.neuronovaCompactCards = 'true';
  style.textContent = `
    .hero {
      min-height: auto !important;
      align-items: start !important;
      padding: 28px 0 56px !important;
    }

    .hero-grid {
      align-items: start !important;
    }

    .hero h1 {
      max-width: 720px;
      margin-bottom: 20px;
      font-size: clamp(2.2rem, 4.8vw, 4.3rem) !important;
      line-height: 1.04;
    }

    .app-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 340px)) !important;
      justify-content: start;
      align-items: stretch;
      gap: 16px !important;
    }

    .app-card {
      min-height: 0 !important;
      width: 100%;
      padding: 18px !important;
      border-radius: 22px;
    }

    .app-icon {
      width: 52px;
      height: 52px;
      padding: 11px;
      border-radius: 16px;
    }

    .braille-dots { font-size: 1.75rem; }

    .status {
      padding: 5px 8px;
      font-size: .68rem;
    }

    .card-content { margin-top: 22px !important; }
    .app-category { margin-bottom: 7px; font-size: .68rem; }
    .app-card h3 { margin-bottom: 10px; font-size: 1.72rem; }
    .app-card .card-content > p:not(.app-category) {
      margin: 0;
      font-size: .9rem;
      line-height: 1.5;
    }

    .feature-list { margin-top: 14px; }
    .feature-list li {
      padding: 4px 0 4px 18px;
      font-size: .82rem;
      line-height: 1.4;
    }
    .feature-list li::before { top: 10px; width: 6px; height: 6px; }

    .card-actions {
      margin-top: 0;
      padding-top: 18px;
    }

    .card-button {
      min-height: 40px;
      padding: 0 12px;
      font-size: .82rem;
    }

    @media (max-width: 700px) {
      .hero {
        padding: 24px 0 44px !important;
      }
      .hero h1 {
        font-size: clamp(1.9rem, 9vw, 3.1rem) !important;
        line-height: 1.05;
      }
      .app-grid {
        grid-template-columns: 1fr !important;
      }
      .app-card {
        max-width: 100%;
      }
    }
  `;
  document.head.appendChild(style);
})();

const menuButton = document.querySelector('.menu-button');
const mainNav = document.querySelector('.main-nav');
const year = document.querySelector('#year');
const revealItems = document.querySelectorAll('.reveal');
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
