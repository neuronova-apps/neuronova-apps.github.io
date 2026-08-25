(() => {
  document.querySelectorAll('[data-current-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const nav = document.querySelector('#legal-nav');
  let button = document.querySelector('[data-legal-menu]');
  if (!button && nav) {
    button = document.createElement('button');
    button.className = 'menu-button';
    button.type = 'button';
    button.dataset.legalMenu = '';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', 'legal-nav');
    button.setAttribute('aria-label', 'Abrir menú de navegación');
    button.innerHTML = '<span></span><span></span><span></span>';
    nav.insertAdjacentElement('beforebegin', button);
  }

  if (button && nav) {
    const close = () => {
      nav.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', 'Abrir menú de navegación');
    };
    button.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        close();
        button.focus();
      }
    });
  }

  const playLinks = document.querySelectorAll('[data-play-key]');
  if (playLinks.length) {
    fetch('/config/apps-links.json')
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('config')))
      .then((apps) => {
        playLinks.forEach((link) => {
          const item = apps[link.dataset.playKey];
          if (item && item.playStore) {
            link.href = item.playStore;
            link.hidden = false;
          }
        });
      })
      .catch(() => {});
  }
})();
