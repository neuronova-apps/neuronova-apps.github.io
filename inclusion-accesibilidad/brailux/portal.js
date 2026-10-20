const menuButton = document.querySelector('.menu-button');
const mainNav = document.querySelector('.main-nav');
const heroSystem = document.querySelector('.hero-system[aria-label]');

if (heroSystem && !heroSystem.hasAttribute('role')) {
  heroSystem.setAttribute('role', 'img');
}

if (menuButton && mainNav) {
  const closeMenu = () => {
    mainNav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  };

  menuButton.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mainNav.classList.contains('open')) {
      closeMenu();
      menuButton.focus({preventScroll: true});
    }
  });
}

(() => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': 'https://neuronova-apps.github.io/brailux-app/#app',
    name: 'Brailux',
    url: 'https://neuronova-apps.github.io/brailux-app/',
    description: 'Aplicación educativa web para conocer, aprender y practicar los fundamentos del sistema Braille con recursos interactivos y accesibles.',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    inLanguage: 'es-PE',
    applicationSuite: 'Neuronova Apps',
    image: 'https://neuronova-apps.github.io/brailux-app/assets/social/brailux-social.png',
    featureList: ['Seis unidades guiadas', 'Práctica interactiva', 'Progreso local', 'Recursos educativos sobre Braille', 'Accesibilidad web reforzada'],
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

const NEURONOVA_AI_CLIENT_URL = 'https://neuronova-apps.github.io/ai-chat.js';

import(NEURONOVA_AI_CLIENT_URL).catch((error) => {
  console.error('Brailux · Asistente NeuroNova:', error);
});
