(() => {
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalContent = document.getElementById('modalContent');
  const appStatus = document.getElementById('appStatus');
  const journalText = document.getElementById('journalText');
  const saveJournalButton = document.getElementById('saveJournalBtn');
  const prayerList = document.getElementById('prayerList');
  const menuButton = document.querySelector('.site-header .menu-button');
  const mainNav = document.querySelector('.site-header .main-nav');
  const appTabs = [...document.querySelectorAll('.app-tabs [data-nav]')];
  const prayerTabs = [...document.querySelectorAll('[data-prayer-tab]')];
  const focusableSelector = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  let modalReturnFocus = null;

  const announce = message => {
    if (!appStatus || !message) return;
    appStatus.textContent = '';
    requestAnimationFrame(() => { appStatus.textContent = message; });
  };

  const closeMainNav = ({ restoreFocus = false } = {}) => {
    if (!menuButton || !mainNav) return;
    mainNav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menú de navegación');
    if (restoreFocus) menuButton.focus({ preventScroll: true });
  };

  if (menuButton && mainNav) {
    menuButton.addEventListener('click', () => {
      const open = mainNav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    });

    mainNav.querySelectorAll('a, button').forEach(control => {
      control.addEventListener('click', () => closeMainNav());
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && mainNav.classList.contains('open')) {
        closeMainNav({ restoreFocus: true });
      }
    });
  }

  const sectionLabel = target => appTabs.find(tab => tab.dataset.nav === target)?.textContent.trim() || target;

  function syncAppTabs(target) {
    appTabs.forEach(tab => {
      const selected = tab.dataset.nav === target;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
  }

  function syncPrayerTabs(value) {
    prayerTabs.forEach(tab => {
      const selected = tab.dataset.prayerTab === value;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    const selectedTab = prayerTabs.find(tab => tab.dataset.prayerTab === value);
    if (prayerList && selectedTab) prayerList.setAttribute('aria-labelledby', selectedTab.id);
  }

  const focusScreen = target => {
    const panel = document.getElementById(`${target}Screen`);
    if (panel) requestAnimationFrame(() => panel.focus());
  };

  function moveTab(event, tabs, activate) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const index = tabs.indexOf(event.currentTarget);
    if (index < 0) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    activate(tabs[next]);
  }

  appTabs.forEach(tab => {
    tab.addEventListener('keydown', event => moveTab(event, appTabs, next => {
      if (typeof window.navigate === 'function') window.navigate(next.dataset.nav);
      syncAppTabs(next.dataset.nav);
      announce(`Sección ${sectionLabel(next.dataset.nav)}.`);
      requestAnimationFrame(() => next.focus());
    }));
    tab.addEventListener('click', () => {
      syncAppTabs(tab.dataset.nav);
      announce(`Sección ${sectionLabel(tab.dataset.nav)}.`);
      requestAnimationFrame(() => tab.focus());
    });
  });

  prayerTabs.forEach(tab => {
    tab.addEventListener('keydown', event => moveTab(event, prayerTabs, next => {
      next.focus();
      next.click();
    }));
    tab.addEventListener('click', () => {
      syncPrayerTabs(tab.dataset.prayerTab);
      announce(`Oraciones ${tab.textContent.trim().toLowerCase()}.`);
    });
  });

  document.addEventListener('click', event => {
    const nav = event.target.closest('[data-nav]');
    if (!nav || nav.closest('.app-tabs')) return;
    const target = nav.dataset.nav;
    if (!target || !document.getElementById(`${target}Screen`)) return;
    requestAnimationFrame(() => {
      syncAppTabs(target);
      if (!nav.classList.contains('brand')) focusScreen(target);
      announce(`Sección ${sectionLabel(target)}.`);
    });
  });

  const modalFocusables = () => modalContent
    ? [...modalContent.querySelectorAll(focusableSelector)].filter(element => !element.hasAttribute('hidden') && element.getClientRects().length > 0)
    : [];

  function focusModalStart() {
    if (!modalContent) return;
    const title = modalContent.querySelector('#modalTitle');
    if (title) {
      title.tabIndex = -1;
      requestAnimationFrame(() => title.focus({ preventScroll: true }));
      return;
    }
    requestAnimationFrame(() => (modalFocusables()[0] || modalContent).focus({ preventScroll: true }));
  }

  if (typeof window.openModal === 'function') {
    const originalOpenModal = window.openModal;
    window.openModal = html => {
      if (modalBackdrop && modalBackdrop.hidden && document.activeElement instanceof HTMLElement) modalReturnFocus = document.activeElement;
      originalOpenModal(html);
      focusModalStart();
    };
  }

  if (typeof window.closeModal === 'function') {
    const originalCloseModal = window.closeModal;
    window.closeModal = () => {
      const returnTarget = modalReturnFocus;
      originalCloseModal();
      modalReturnFocus = null;
      requestAnimationFrame(() => {
        if (returnTarget instanceof HTMLElement && returnTarget.isConnected && returnTarget.getClientRects().length > 0) {
          returnTarget.focus({ preventScroll: true });
          return;
        }
        const activePanel = document.querySelector('.screen.active');
        if (activePanel instanceof HTMLElement) activePanel.focus();
      });
    };
  }

  document.addEventListener('keydown', event => {
    if (!modalBackdrop || modalBackdrop.hidden || event.key !== 'Tab') return;
    const focusables = modalFocusables();
    if (!focusables.length) {
      event.preventDefault();
      modalContent?.focus();
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const activeIndex = focusables.indexOf(document.activeElement);
    if (activeIndex === -1) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  function fieldError(field, message) {
    if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return;
    field.setCustomValidity(message);
    field.focus();
    field.reportValidity();
    announce(message);
  }

  modalContent?.addEventListener('input', event => {
    const field = event.target;
    if ((field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && field.validity.customError && field.value.trim()) field.setCustomValidity('');
  });

  modalContent?.addEventListener('submit', event => {
    if (!(event.target instanceof HTMLFormElement)) return;
    const empty = [...event.target.querySelectorAll('input[required],textarea[required]')].find(field => !field.value.trim());
    if (!empty) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    fieldError(empty, 'Completa este campo antes de guardar.');
  }, true);

  if (journalText) {
    journalText.setAttribute('aria-describedby', 'charCount');
    journalText.addEventListener('input', () => {
      if (journalText.validity.customError && journalText.value.trim()) journalText.setCustomValidity('');
    });
  }

  saveJournalButton?.addEventListener('click', event => {
    if (!journalText || journalText.value.trim()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    fieldError(journalText, 'Escribe una reflexión antes de guardar.');
  }, true);

  syncAppTabs('home');
  syncPrayerTabs('active');
})();

(() => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': 'https://neuronova-apps.github.io/mimomento-app/#app',
    name: 'Mi Momento',
    url: 'https://neuronova-apps.github.io/mimomento-app/',
    description: 'Demo web funcional de devocionales, oración y reflexión personal con progreso, oraciones y diario guardados localmente.',
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web',
    inLanguage: 'es-PE',
    applicationSuite: 'Neuronova Apps',
    image: 'https://neuronova-apps.github.io/mimomento-app/assets/social/mimomento-social.png',
    featureList: ['Cuatro planes de muestra', 'Doce sesiones disponibles', 'Registro local de oraciones', 'Diario de reflexiones', 'Progreso devocional local', 'Accesibilidad web reforzada'],
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
