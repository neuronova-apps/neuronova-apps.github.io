const menuButton = document.querySelector('.menu-button');
const mainNav = document.querySelector('.main-nav');
const year = document.querySelector('#year');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (year) year.textContent = new Date().getFullYear();

if (menuButton && mainNav) {
  const closeMenu = () => {
    mainNav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menú de navegación');
  };

  menuButton.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
  });

  mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('click', event => {
    if (!mainNav.classList.contains('open')) return;
    if (mainNav.contains(event.target) || menuButton.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  const responsiveMenuBreakpoint = window.matchMedia('(max-width: 900px)');
  const resetMenuOnBreakpointChange = () => closeMenu();
  if (responsiveMenuBreakpoint.addEventListener) {
    responsiveMenuBreakpoint.addEventListener('change', resetMenuOnBreakpointChange);
  } else {
    responsiveMenuBreakpoint.addListener(resetMenuOnBreakpointChange);
  }
}

const revealItems = document.querySelectorAll('.reveal');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach(item => item.classList.add('visible'));
} else {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: .1});
  revealItems.forEach(item => observer.observe(item));
}

const categories = [
  'Filosofía','Fe y espiritualidad','Superación','Motivación','Momentos difíciles',
  'Amor y vínculos','Familia','Amistad','Autoconocimiento','Metas y logros',
  'Sabiduría y aprendizaje','Paz y bienestar','Gratitud','Esperanza','Calma',
  'Reflexión','Humor e ingenio','Literatura y autores','Astrología'
];

const needs = [
  'Calma','Esperanza','Seguir adelante','Reflexionar','Enfocarme','Agradecer',
  'Comprenderme','Tomar decisión','Aprender','Recuperar confianza','Conectar',
  'Aligerar','Impulso','Aceptar cambios','Inspiración','Asumir responsabilidad'
];

const quotes = [
  {id:'FR000001',text:'La claridad suele comenzar cuando dejamos de apresurar la respuesta.',author:'Motiva',source:'Colección original de la app',categories:['Filosofía','Autoconocimiento','Sabiduría y aprendizaje','Reflexión'],need:'Reflexionar'},
  {id:'FR000002',text:'Avanzar despacio sigue siendo avanzar cuando la dirección tiene sentido.',author:'Motiva',source:'Colección original de la app',categories:['Superación','Metas y logros','Motivación'],need:'Seguir adelante'},
  {id:'FR000003',text:'No todo merece una respuesta inmediata; algunas cosas se entienden mejor después de un poco de silencio.',author:'Motiva',source:'Colección original de la app',categories:['Paz y bienestar','Filosofía','Autoconocimiento','Calma'],need:'Calma'},
  {id:'FR000004',text:'Una meta se vuelve menos distante cuando la conviertes en una acción concreta.',author:'Motiva',source:'Colección original de la app',categories:['Metas y logros','Motivación','Superación'],need:'Enfocarme'},
  {id:'FR000005',text:'Cambiar de opinión después de comprender algo mejor también es una forma de crecimiento.',author:'Motiva',source:'Colección original de la app',categories:['Autoconocimiento','Sabiduría y aprendizaje','Filosofía','Reflexión'],need:'Reflexionar'},
  {id:'FR000006',text:'La constancia no exige hacerlo todo; exige volver a aquello que has decidido cuidar.',author:'Motiva',source:'Colección original de la app',categories:['Superación','Metas y logros','Motivación'],need:'Seguir adelante'},
  {id:'FR000007',text:'Una pausa consciente puede convertir un día acelerado en un momento que realmente alcanzas a vivir.',author:'Motiva',source:'Colección original de la app',categories:['Paz y bienestar','Gratitud','Autoconocimiento','Calma'],need:'Calma'},
  {id:'FR000008',text:'Agradecer una presencia es recordar que ningún vínculo valioso debería darse por hecho.',author:'Motiva',source:'Colección original de la app',categories:['Amor y vínculos','Gratitud','Familia','Amistad'],need:'Agradecer'},
  {id:'FR000009',text:'Conocerte mejor no significa tener todas las respuestas, sino reconocer con más claridad tus propias preguntas.',author:'Motiva',source:'Colección original de la app',categories:['Autoconocimiento','Filosofía','Sabiduría y aprendizaje','Reflexión'],need:'Comprenderme'},
  {id:'FR000010',text:'Tu progreso no pierde valor porque otra persona avance a un ritmo diferente.',author:'Motiva',source:'Colección original de la app',categories:['Superación','Autoconocimiento','Motivación'],need:'Recuperar confianza'},
  {id:'FR000011',text:'Cuando todo parece demasiado grande, vuelve a la siguiente tarea posible.',author:'Motiva',source:'Colección original de la app',categories:['Motivación','Metas y logros','Superación'],need:'Enfocarme'},
  {id:'FR000012',text:'Elegir también significa aceptar que no todos los caminos pueden recorrerse al mismo tiempo.',author:'Motiva',source:'Colección original de la app',categories:['Filosofía','Autoconocimiento','Metas y logros','Reflexión'],need:'Tomar decisión'},
  {id:'FR000013',text:'La serenidad puede nacer cuando dejamos de exigirnos controlar aquello que está fuera de nuestras manos.',author:'Motiva',source:'Colección original de la app',categories:['Fe y espiritualidad','Paz y bienestar','Filosofía','Calma'],need:'Calma'},
  {id:'FR000014',text:'Hay días en que creer es simplemente dar un paso más sin tener todas las respuestas.',author:'Motiva',source:'Colección original de la app',categories:['Fe y espiritualidad','Esperanza','Superación'],need:'Esperanza'},
  {id:'FR000017',text:'Cuidar un vínculo también es aprender a escuchar lo que la otra persona intenta decir.',author:'Motiva',source:'Colección original de la app',categories:['Amor y vínculos','Familia','Amistad'],need:'Conectar'},
  {id:'FR000018',text:'La experiencia enseña más cuando dejamos de defender el error y empezamos a observarlo.',author:'Motiva',source:'Colección original de la app',categories:['Sabiduría y aprendizaje','Autoconocimiento','Filosofía','Reflexión'],need:'Aprender'},
  {id:'FR000019',text:'A veces el plan perfecto consiste en aceptar que el plan necesitaba otro plan.',author:'Motiva',source:'Colección original de la app',categories:['Humor e ingenio','Metas y logros','Motivación'],need:'Aligerar'},
  {id:'FR000020',text:'Empezar con lo posible suele ser más útil que esperar a sentirte completamente preparado.',author:'Motiva',source:'Colección original de la app',categories:['Motivación','Superación','Metas y logros'],need:'Impulso'},
  {id:'FR000022',text:'El que lee mucho y anda mucho, ve mucho y sabe mucho.',author:'Miguel de Cervantes Saavedra',source:'Don Quijote de la Mancha · dominio público',categories:['Sabiduría y aprendizaje','Literatura y autores','Filosofía'],need:'Aprender'},
  {id:'FR000024',text:'Lo bueno, si breve, dos veces bueno.',author:'Baltasar Gracián',source:'Oráculo manual y arte de prudencia · dominio público',categories:['Sabiduría y aprendizaje','Literatura y autores','Filosofía'],need:'Reflexionar'},
  {id:'FR000027',text:'Ser bueno es el único modo de ser dichoso.',author:'José Martí',source:'Maestros ambulantes · dominio público',categories:['Sabiduría y aprendizaje','Literatura y autores','Filosofía'],need:'Asumir responsabilidad'},
  {id:'FR000031',text:'Pensar mejor comienza por revisar lo que damos por cierto.',author:'Motiva',source:'Colección original de la app',categories:['Filosofía','Reflexión','Sabiduría y aprendizaje'],need:'Reflexionar'}
];

const categoryTones = ['rgba(127,164,147,.18)','rgba(184,174,201,.20)','rgba(145,174,184,.18)','rgba(217,201,168,.22)'];

function dayIndex(length) {
  const now = new Date();
  const key = Number(`${now.getFullYear()}${String(now.getMonth() + 1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`);
  let hash = key;
  hash = ((hash << 5) - hash) + 17;
  return Math.abs(hash) % length;
}

function randomFrom(list, excludeId = '') {
  const pool = excludeId && list.length > 1 ? list.filter(item => item.id !== excludeId) : list;
  return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
}

function quotesForCategory(category) {
  return category && category !== 'Todas' ? quotes.filter(quote => quote.categories.includes(category)) : quotes;
}

function quotesForNeed(need) {
  return quotes.filter(quote => quote.need === need || quote.categories.includes(need));
}

function attribution(quote) {
  return quote.author === 'Motiva' ? quote.source : `${quote.author} · ${quote.source}`;
}

const dailyDate = document.querySelector('#dailyDate');
const dailyCategory = document.querySelector('#dailyCategory');
const dailyQuote = document.querySelector('#dailyQuoteTitle');
const dailyAuthor = document.querySelector('#dailyAuthor');
const newDailyQuote = document.querySelector('#newDailyQuote');
let currentDailyQuote = quotes[dayIndex(quotes.length)];

function renderDailyQuote(quote) {
  if (!quote) return;
  currentDailyQuote = quote;
  if (dailyDate) dailyDate.textContent = new Intl.DateTimeFormat('es-PE', {weekday:'long', day:'numeric', month:'long'}).format(new Date());
  if (dailyCategory) dailyCategory.textContent = quote.categories[0];
  if (dailyQuote) dailyQuote.textContent = quote.text;
  if (dailyAuthor) dailyAuthor.textContent = quote.author === 'Motiva' ? 'Motiva' : quote.author;
}

renderDailyQuote(currentDailyQuote);
newDailyQuote?.addEventListener('click', () => renderDailyQuote(randomFrom(quotes, currentDailyQuote?.id)));

const needGrid = document.querySelector('#needGrid');
const categoryGrid = document.querySelector('#categoryGrid');
const categoryFilter = document.querySelector('#categoryFilter');
const randomQuoteButton = document.querySelector('#randomQuote');
const quoteList = document.querySelector('#quoteList');
const exploreToolbar = document.querySelector('.explore-toolbar');

needGrid?.classList.add('needs-grid');
quoteList?.classList.add('category-grid');
exploreToolbar?.classList.add('explorer-copy');
quoteList?.setAttribute('aria-live', 'polite');

function renderQuoteList(list, label = 'Frases disponibles') {
  if (!quoteList) return;
  quoteList.setAttribute('aria-label', label);
  quoteList.replaceChildren();

  if (!list.length) {
    const empty = document.createElement('p');
    empty.textContent = 'Esta colección todavía no tiene frases públicas en la demo.';
    quoteList.appendChild(empty);
    return;
  }

  list.forEach((quote, index) => {
    const card = document.createElement('article');
    card.className = 'category-card';
    card.style.setProperty('--tone', categoryTones[index % categoryTones.length]);

    const meta = document.createElement('span');
    meta.textContent = quote.categories[0];

    const text = document.createElement('strong');
    text.textContent = `“${quote.text}”`;

    const source = document.createElement('p');
    source.textContent = attribution(quote);
    source.style.margin = '12px 0 0';
    source.style.color = 'var(--muted)';
    source.style.fontSize = '.78rem';
    source.style.lineHeight = '1.45';

    card.append(meta, text, source);
    quoteList.appendChild(card);
  });
}

if (needGrid) {
  needGrid.replaceChildren();
  needs.forEach(need => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'need-chip';
    button.textContent = need;
    button.dataset.need = need;
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      needGrid.querySelectorAll('.need-chip').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      needGrid.querySelectorAll('.need-chip').forEach(item => item.classList.toggle('active', item === button));
      renderQuoteList(quotesForNeed(need), `Frases relacionadas con ${need}`);
      document.querySelector('#explorar')?.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth'});
    });
    needGrid.appendChild(button);
  });
}

if (categoryFilter) {
  categoryFilter.replaceChildren();
  ['Todas', ...categories].forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  categoryFilter.addEventListener('change', () => renderQuoteList(quotesForCategory(categoryFilter.value), `Categoría ${categoryFilter.value}`));
}

if (categoryGrid) {
  categoryGrid.replaceChildren();
  categories.forEach((category, index) => {
    const count = quotesForCategory(category).length;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'category-card';
    button.style.setProperty('--tone', categoryTones[index % categoryTones.length]);
    button.setAttribute('aria-label', `Explorar categoría ${category}`);
    button.innerHTML = `<span>${String(index + 1).padStart(2,'0')} · ${count ? `${count} en demo` : 'colección en desarrollo'}</span><strong>${category}</strong>`;
    button.addEventListener('click', () => {
      if (categoryFilter) categoryFilter.value = category;
      renderQuoteList(quotesForCategory(category), `Categoría ${category}`);
      document.querySelector('#explorar')?.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth'});
    });
    categoryGrid.appendChild(button);
  });
}

randomQuoteButton?.addEventListener('click', () => {
  const pool = quotesForCategory(categoryFilter?.value || 'Todas');
  const quote = randomFrom(pool);
  renderQuoteList(quote ? [quote] : [], 'Frase aleatoria');
});

renderQuoteList(quotes, 'Colección pública actual de Motiva');

(() => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': 'https://neuronova-apps.github.io/motiva-app/#app',
    name: 'Motiva',
    url: 'https://neuronova-apps.github.io/motiva-app/',
    description: 'Espacio web de frases breves para la reflexión, la calma, la inspiración y el crecimiento cotidiano.',
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web',
    inLanguage: 'es-PE',
    applicationSuite: 'Neuronova Apps',
    image: 'https://neuronova-apps.github.io/motiva-app/assets/social/motiva-social.png'
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
})();
