const menuButton = document.querySelector('.menu-button');
const mainNav = document.querySelector('.main-nav');
const year = document.querySelector('#year');
const revealItems = document.querySelectorAll('.reveal');
const hero = document.querySelector('.hero');
const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let reduceMotion = reduceMotionQuery.matches;
let revealObserver = null;
let heroObserver = null;

const appFaviconMap = new Map([
  ['Quiz Bible', 'https://neuronova-apps.github.io/quizbible-app/favicon.svg'],
  ['Mi Momento', 'https://neuronova-apps.github.io/mimomento-app/favicon.svg'],
  ['Brailux', 'https://neuronova-apps.github.io/brailux-app/favicon.svg'],
  ['English Fast', 'https://neuronova-apps.github.io/englishfast-app/favicon.svg'],
  ['Sudolux', 'https://neuronova-apps.github.io/sudolux-app/favicon.svg'],
  ['Crucilux', 'https://neuronova-apps.github.io/crucilux-app/favicon.svg'],
  ['Motiva', 'https://neuronova-apps.github.io/motiva-app/favicon.svg']
]);

const syncCardIconWithFavicon = (card, appName) => {
  const icon = card.querySelector('.app-icon');
  const faviconUrl = appFaviconMap.get(appName);

  if (!icon || !faviconUrl) {
    return;
  }

  const currentImage = icon.querySelector('img');
  if (currentImage?.src === faviconUrl) {
    icon.classList.add('has-favicon');
    icon.setAttribute('aria-hidden', 'true');
    return;
  }

  const originalMarkup = icon.innerHTML;
  const originalAriaHidden = icon.getAttribute('aria-hidden');
  const favicon = document.createElement('img');
  favicon.src = faviconUrl;
  favicon.alt = '';
  favicon.decoding = 'async';
  favicon.loading = 'eager';

  favicon.addEventListener('load', () => {
    icon.replaceChildren(favicon);
    icon.classList.add('has-favicon');
    icon.setAttribute('aria-hidden', 'true');
  }, { once: true });

  favicon.addEventListener('error', () => {
    icon.classList.remove('has-favicon');
    icon.innerHTML = originalMarkup;

    if (originalAriaHidden === null) {
      icon.removeAttribute('aria-hidden');
    } else {
      icon.setAttribute('aria-hidden', originalAriaHidden);
    }
  }, { once: true });
};

const syncAllCardFavicons = () => {
  document.querySelectorAll('.app-card').forEach((card) => {
    const title = card.querySelector('h4');
    const appName = title ? title.textContent.trim() : '';

    if (appName) {
      syncCardIconWithFavicon(card, appName);
    }
  });
};

const syncAppCards = async () => {
  try {
    const response = await fetch('apps.json');

    if (!response.ok) {
      throw new Error(`No se pudo cargar apps.json (${response.status})`);
    }

    const data = await response.json();
    const apps = Array.isArray(data.apps) ? data.apps : [];
    const appsByName = new Map(apps.map((app) => [app.name, app]));

    document.querySelectorAll('.app-card').forEach((card) => {
      const title = card.querySelector('h4');
      const appName = title ? title.textContent.trim() : '';
      const app = appName ? appsByName.get(appName) : null;

      if (!app) {
        return;
      }

      const status = card.querySelector('.status');
      if (status && app.status) {
        const dot = status.querySelector('span') || document.createElement('span');
        status.replaceChildren(dot, document.createTextNode(` ${app.status}`));
        status.dataset.source = 'apps.json';
      }

      const availabilityItems = card.querySelectorAll('.availability-item');
      const availableNow = availabilityItems[0]?.querySelector('span');
      const inDevelopment = availabilityItems[1]?.querySelector('span');

      if (availableNow && app.availableNow) {
        availableNow.textContent = app.availableNow;
      }

      if (inDevelopment && app.inDevelopment) {
        inDevelopment.textContent = app.inDevelopment;
      }

      const action = card.querySelector('.card-button');
      if (action) {
        if (app.url) {
          action.href = app.url;
        }

        if (app.ariaLabel) {
          action.setAttribute('aria-label', app.ariaLabel);
        }

        if (app.actionLabel) {
          action.replaceChildren(
            document.createTextNode(`${app.actionLabel} `),
            Object.assign(document.createElement('span'), {
              textContent: '↗'
            })
          );
          action.lastElementChild.setAttribute('aria-hidden', 'true');
        }
      }
    });
  } catch (error) {
    console.warn('Neuronova Apps: se mantiene el contenido HTML de respaldo porque no fue posible sincronizar apps.json.', error);
  }
};

const syncAccessibilityLauncherName = () => {
  const launcher = document.querySelector('.nova-a11y-launcher');

  if (!launcher) {
    return;
  }

  launcher.setAttribute('aria-label', 'Accesibilidad');
  launcher.setAttribute('title', 'Abrir opciones de accesibilidad (Alt + A)');
};

const showRevealItems = () => {
  revealItems.forEach((item) => item.classList.add('visible'));
};

const setupRevealObserver = () => {
  if (revealObserver) {
    revealObserver.disconnect();
    revealObserver = null;
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    showRevealItems();
    return;
  }

  revealObserver = new IntersectionObserver((entries, currentObserver) => {
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

  revealItems.forEach((item) => {
    if (!item.classList.contains('visible')) {
      revealObserver.observe(item);
    }
  });
};

const setupHeroObserver = () => {
  if (heroObserver) {
    heroObserver.disconnect();
    heroObserver = null;
  }

  if (!hero) {
    return;
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    hero.classList.remove('performance-paused');
    return;
  }

  heroObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      hero.classList.toggle('performance-paused', !entry.isIntersecting);
    });
  }, {
    threshold: 0.02
  });

  heroObserver.observe(hero);
};

const syncMotionPreference = (event) => {
  reduceMotion = event.matches;

  if (reduceMotion) {
    showRevealItems();
  }

  setupRevealObserver();
  setupHeroObserver();
};

syncAllCardFavicons();
syncAppCards();

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuButton && mainNav) {
  const responsiveMenu = window.matchMedia('(max-width: 980px)');

  const closeMenu = () => {
    mainNav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menú de navegación');
  };

  closeMenu();

  menuButton.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mainNav.classList.contains('open')) {
      closeMenu();
      menuButton.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (!mainNav.contains(event.target) && !menuButton.contains(event.target)) {
      closeMenu();
    }
  });

  responsiveMenu.addEventListener('change', closeMenu);
  window.addEventListener('pageshow', closeMenu);
}

setupRevealObserver();
setupHeroObserver();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', syncAccessibilityLauncherName, { once: true });
} else {
  syncAccessibilityLauncherName();
}

if (typeof reduceMotionQuery.addEventListener === 'function') {
  reduceMotionQuery.addEventListener('change', syncMotionPreference);
} else if (typeof reduceMotionQuery.addListener === 'function') {
  reduceMotionQuery.addListener(syncMotionPreference);
}

import('./ai-chat.js').catch((error) => {
  console.error('Neuronova Apps: no se pudo cargar el Asistente NeuroNova.', error);
});
