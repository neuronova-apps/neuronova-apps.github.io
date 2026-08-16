const appPhases = [
  { title: 'Definición del proyecto', subtitle: 'Idea, propósito, alcance y criterios de éxito', items: [
    ['Definir el problema o necesidad que resolverá la app', 'Dejar claro para quién se construye y qué valor principal ofrece.'],
    ['Definir nombre, propósito y público objetivo', 'Evitar avanzar a diseño sin una identidad básica del producto.'],
    ['Delimitar alcance inicial y funciones fuera de alcance', 'Separar el MVP de ideas que pueden incorporarse después.'],
    ['Definir criterios de éxito del MVP', 'Especificar qué debe funcionar para considerar usable la primera versión.'],
    ['Definir modelo gratuito, premium o monetización prevista', 'Aunque se implemente después, debe considerarse desde la arquitectura inicial.']
  ]},
  { title: 'Arquitectura y planificación', subtitle: 'Estructura técnica antes de construir pantallas', items: [
    ['Crear repositorio y estructura base del proyecto', 'Configurar rama principal, README y organización inicial.'],
    ['Definir arquitectura de datos y persistencia', 'Determinar qué se guarda localmente y qué podría requerir servicios externos.'],
    ['Definir navegación y mapa de pantallas', 'Establecer las rutas principales antes de diseñar detalles visuales.'],
    ['Definir dependencias, SDK mínimo y objetivo Android', 'Mantener compatibilidad con los requisitos vigentes de Google Play.'],
    ['Definir estrategia de versiones y respaldos', 'VersionCode, versionName y control de cambios desde el inicio.']
  ]},
  { title: 'Diseño y experiencia', subtitle: 'Interfaz, accesibilidad y coherencia con Neuronova', items: [
    ['Crear prototipo visual de las pantallas principales', 'Validar estructura y jerarquía antes de llevar todo a código.'],
    ['Aplicar identidad visual propia y coherencia con Neuronova', 'Compartir patrones familiares sin perder la personalidad de cada app.'],
    ['Definir tema claro, oscuro y comportamiento predeterminado', 'Cuando corresponda al producto.'],
    ['Implementar criterios de accesibilidad desde el diseño', 'Contraste, tamaños táctiles, foco, lectura y navegación.'],
    ['Validar diseño vertical y horizontal cuando aplique', 'Evitar recortes, scroll innecesario o controles inaccesibles.']
  ]},
  { title: 'Desarrollo del núcleo', subtitle: 'Funciones mínimas que hacen que la app sea realmente utilizable', items: [
    ['Implementar navegación principal y estados de pantalla', 'La app debe poder recorrerse sin rutas rotas.'],
    ['Implementar la función central del producto', 'Juego, aprendizaje, frases, devocionales u otra función principal.'],
    ['Implementar almacenamiento de preferencias y progreso', 'Solo cuando sea necesario para la experiencia.'],
    ['Gestionar errores y estados vacíos', 'La interfaz debe responder correctamente ante datos incompletos o acciones inválidas.'],
    ['Eliminar funciones simuladas que puedan confundirse con funciones reales', 'Diferenciar demo, pendiente y funcionalidad completa.']
  ]},
  { title: 'Contenido y banco de datos', subtitle: 'Calidad, coherencia y preparación del contenido definitivo', items: [
    ['Definir estructura del banco de contenido', 'Campos, identificadores, categorías, niveles y metadatos necesarios.'],
    ['Completar el contenido previsto para el MVP', 'Evitar publicar una app funcional con un banco insuficiente.'],
    ['Auditar duplicados, errores, coherencia y dificultad', 'Aplicar controles específicos según el tipo de contenido.'],
    ['Validar derechos de uso y atribuciones cuando correspondan', 'No incorporar contenido cuyo uso no esté autorizado.'],
    ['Integrar el banco definitivo en la app', 'Verificar carga, rendimiento y manejo de registros inválidos.']
  ]},
  { title: 'Pruebas funcionales', subtitle: 'Comprobar comportamiento antes de considerar una beta', items: [
    ['Probar recorrido completo de cada función principal', 'Desde apertura hasta cierre o finalización del flujo.'],
    ['Probar persistencia al cerrar, volver y rotar el dispositivo', 'Cuando el tipo de app necesite conservar el estado.'],
    ['Probar diferentes tamaños de pantalla y orientación', 'Teléfonos pequeños, promedio y grandes.'],
    ['Probar accesibilidad y navegación por controles', 'Contraste, lectura, foco y tamaño de elementos interactivos.'],
    ['Corregir errores bloqueantes y regresiones conocidas', 'No pasar a beta con fallos que impidan completar la función principal.']
  ]},
  { title: 'Preparación Android release', subtitle: 'Convertir el proyecto funcional en un candidato distribuible', items: [
    ['Confirmar applicationId definitivo', 'Evitar identificadores temporales antes de publicar.'],
    ['Configurar icono, nombre, versión y metadatos de la app', 'Revisar recursos de release y textos visibles.'],
    ['Crear y proteger la clave de firma de producción', 'La pérdida de credenciales puede comprometer futuras actualizaciones.'],
    ['Generar APK release firmado para pruebas', 'Comprobar instalación y comportamiento de la compilación release.'],
    ['Generar AAB release firmado', 'Este será el formato de distribución para Google Play.']
  ]},
  { title: 'Beta y prueba cerrada', subtitle: 'Validación con usuarios antes de producción', items: [
    ['Crear la aplicación en Google Play Console', 'Configurar datos básicos del proyecto.'],
    ['Crear pista de prueba cerrada', 'Definir grupo de evaluadores y acceso a la versión.'],
    ['Subir AAB firmado a la prueba cerrada', 'Verificar que Play Console acepte el paquete sin errores bloqueantes.'],
    ['Completar el periodo de prueba requerido', 'Mantener el seguimiento de estabilidad y observaciones.'],
    ['Registrar, priorizar y corregir incidencias de los evaluadores', 'Distinguir errores bloqueantes, importantes y mejoras posteriores.'],
    ['Realizar compilación candidata después de las correcciones', 'Repetir pruebas esenciales antes de solicitar producción.']
  ]},
  { title: 'Ficha y cumplimiento de Play Store', subtitle: 'Información pública, políticas y formularios obligatorios', items: [
    ['Preparar nombre, descripción corta y descripción completa', 'Textos definitivos y coherentes con la funcionalidad real.'],
    ['Preparar icono, capturas y recursos gráficos de la ficha', 'Utilizar imágenes representativas de la versión que se publicará.'],
    ['Publicar política de privacidad cuando corresponda', 'La URL debe ser estable y accesible.'],
    ['Completar seguridad de datos y declaraciones de contenido', 'Responder según lo que la app realmente recopila o utiliza.'],
    ['Completar clasificación de contenido y público objetivo', 'Evitar respuestas genéricas que no representen la aplicación.'],
    ['Revisar permisos Android y eliminar los innecesarios', 'Cada permiso debe tener una razón funcional concreta.']
  ]},
  { title: 'Revisión final', subtitle: 'Control de calidad antes de enviar a producción', items: [
    ['Realizar auditoría funcional completa de la versión candidata', 'Probar nuevamente los flujos críticos sobre el release final.'],
    ['Realizar auditoría visual y de accesibilidad', 'Revisar legibilidad, contraste, tamaños y consistencia.'],
    ['Verificar que no queden textos de prueba o datos temporales', 'Incluye nombres, URLs, claves, correos y recursos provisionales.'],
    ['Confirmar que versión, firma y AAB sean los definitivos', 'No reemplazar accidentalmente el artefacto aprobado.'],
    ['Respaldar código, clave de firma y documentación crítica', 'Mantener copias seguras separadas del entorno de desarrollo.']
  ]},
  { title: 'Publicación en Google Play', subtitle: 'Cierre de la primera versión pública', items: [
    ['Solicitar acceso o paso a producción', 'Realizar el proceso exigido por Play Console para la cuenta.'],
    ['Crear lanzamiento de producción con el AAB aprobado', 'Incluir notas de versión claras para la primera publicación.'],
    ['Enviar la versión a revisión de Google Play', 'Resolver cualquier observación antes de considerarla publicada.'],
    ['Confirmar que la ficha esté disponible públicamente', 'Verificar desde un dispositivo o sesión externa.'],
    ['Instalar la versión publicada desde Google Play y probarla', 'La validación final debe hacerse sobre la distribución real.'],
    ['Registrar versión 1.0 como publicación completada', 'Cerrar el hito y abrir el ciclo de mantenimiento y próximas versiones.']
  ]}
];

const webPhases = [
  { title: 'Definición web', subtitle: 'Propósito, alcance y relación con la app', items: [
    ['Definir la función de la web del proyecto', 'Presentación, demo, documentación, soporte o combinación de estas funciones.'],
    ['Definir información mínima que debe comunicar', 'Propósito, estado, acceso y relación con NeuroNova.'],
    ['Definir estructura de navegación', 'Determinar secciones y jerarquía antes de ampliar el contenido.'],
    ['Definir URL y ubicación dentro del ecosistema', 'Mantener una ruta estable y reconocible.']
  ]},
  { title: 'Contenido y estructura', subtitle: 'Información clara, actualizada y coherente', items: [
    ['Crear página principal funcional', 'La página debe explicar el proyecto sin depender de información externa.'],
    ['Incluir estado real del proyecto', 'Diferenciar demo, MVP, desarrollo y disponibilidad pública.'],
    ['Incluir enlaces relevantes', 'App, repositorio, privacidad, soporte o recursos según corresponda.'],
    ['Revisar redacción, títulos y consistencia del contenido', 'Eliminar textos temporales, duplicados o contradictorios.']
  ]},
  { title: 'Diseño responsive', subtitle: 'Experiencia visual coherente con NeuroNova', items: [
    ['Aplicar identidad visual del proyecto', 'Mantener rasgos propios dentro del sistema visual de NeuroNova.'],
    ['Validar navegación en escritorio', 'Evitar desbordes, superposiciones y jerarquías confusas.'],
    ['Validar navegación en móvil', 'Comprobar lectura y controles en pantallas pequeñas.'],
    ['Validar tamaños intermedios y orientación', 'Revisar tabletas y cambios de ancho relevantes.']
  ]},
  { title: 'Accesibilidad web', subtitle: 'Lectura, teclado, contraste y movimiento', items: [
    ['Validar contraste y legibilidad', 'Texto, botones, estados y elementos informativos deben ser distinguibles.'],
    ['Validar navegación por teclado y foco visible', 'Toda acción principal debe poder alcanzarse sin ratón.'],
    ['Validar estructura semántica y etiquetas', 'Encabezados, enlaces, botones y formularios deben tener significado claro.'],
    ['Validar reducción de movimiento y preferencias disponibles', 'Evitar depender de animaciones para comprender el contenido.']
  ]},
  { title: 'SEO y presentación pública', subtitle: 'Metadatos, indexación y recursos compartidos', items: [
    ['Configurar title y meta description', 'Describir de forma fiel la página y el proyecto.'],
    ['Configurar favicon e identidad social', 'Usar recursos propios de la app cuando corresponda.'],
    ['Configurar canonical, Open Graph y datos de indexación', 'Evitar URLs ambiguas o contenido duplicado.'],
    ['Actualizar sitemap o enlaces del ecosistema', 'La matriz debe poder descubrir y enlazar correctamente el proyecto.']
  ]},
  { title: 'Calidad web', subtitle: 'Pruebas funcionales, rendimiento y seguridad básica', items: [
    ['Ejecutar validaciones de HTML, enlaces y JavaScript', 'Corregir errores que afecten carga o navegación.'],
    ['Ejecutar prueba responsive en navegador', 'Comprobar flujos reales en distintos tamaños.'],
    ['Ejecutar auditoría de accesibilidad', 'Corregir hallazgos relevantes antes de considerar estable la web.'],
    ['Ejecutar auditoría de rendimiento y resiliencia', 'Revisar carga, recursos y fallos recuperables.']
  ]},
  { title: 'Publicación y mantenimiento web', subtitle: 'Disponibilidad estable y actualización continua', items: [
    ['Publicar versión estable en GitHub Pages', 'Confirmar que la URL pública carga correctamente.'],
    ['Verificar enlaces desde la matriz NeuroNova', 'La app debe ser accesible desde el ecosistema principal.'],
    ['Verificar información pública después del despliegue', 'Estado, enlaces y recursos deben coincidir con la versión publicada.'],
    ['Definir criterio de actualización de la web', 'Actualizarla cuando cambie el estado, acceso o versión relevante de la app.']
  ]}
];

const projectSelect = document.querySelector('#projectSelect');
const roadmap = document.querySelector('#roadmap');
const progressValue = document.querySelector('#progressValue');
const progressBar = document.querySelector('#progressBar');
const progressDetail = document.querySelector('#progressDetail');
const progressTrack = document.querySelector('.project-panel .progress-track');
const resetButton = document.querySelector('#resetProject');
const expandButton = document.querySelector('#expandAll');
const collapseButton = document.querySelector('#collapseAll');
const appModeButton = document.querySelector('#appMode');
const webModeButton = document.querySelector('#webMode');
const currentProgressLabel = document.querySelector('#currentProgressLabel');
const routeEyebrow = document.querySelector('#routeEyebrow');
const panelTitle = document.querySelector('#panel-title');
const routeDescription = document.querySelector('#routeDescription');

let trackerMode = 'app';

function currentPhases() { return trackerMode === 'web' ? webPhases : appPhases; }
function storageKey(project, mode = trackerMode) {
  return mode === 'app' ? `neuronova-project-tracker:${project}:v1` : `neuronova-web-tracker:${project}:v1`;
}
function readState(project, mode = trackerMode) {
  try { return JSON.parse(localStorage.getItem(storageKey(project, mode))) || {}; }
  catch { return {}; }
}
function writeState(project, state, mode = trackerMode) { localStorage.setItem(storageKey(project, mode), JSON.stringify(state)); }
function itemId(phaseIndex, itemIndex) { return `p${phaseIndex}-i${itemIndex}`; }
function phaseState(phaseIndex, state, phases = currentPhases()) {
  const ids = phases[phaseIndex].items.map((_, itemIndex) => itemId(phaseIndex, itemIndex));
  const completed = ids.filter(id => state[id]).length;
  if (completed === 0) return ['pending', 'Pendiente'];
  if (completed === ids.length) return ['done', 'Completada'];
  return ['active', 'En progreso'];
}

function setMode(mode) {
  trackerMode = mode;
  const appActive = mode === 'app';
  appModeButton.classList.toggle('active', appActive);
  webModeButton.classList.toggle('active', !appActive);
  appModeButton.setAttribute('aria-pressed', String(appActive));
  webModeButton.setAttribute('aria-pressed', String(!appActive));
  currentProgressLabel.textContent = appActive ? 'Avance de la app' : 'Avance de la web';
  routeEyebrow.textContent = appActive ? 'Ruta de la aplicación' : 'Ruta web';
  panelTitle.textContent = appActive ? 'Del concepto a Play Store' : 'De la estructura a una web estable';
  routeDescription.textContent = appActive
    ? 'La ruta de app cubre definición, desarrollo, contenido, pruebas, release, beta y publicación en Google Play.'
    : 'La ruta web cubre estructura, contenido, responsive, accesibilidad, SEO, calidad y publicación en GitHub Pages.';
  render();
}

function render() {
  const project = projectSelect.value;
  const phases = currentPhases();
  const state = readState(project);
  roadmap.innerHTML = '';

  phases.forEach((phase, phaseIndex) => {
    const [stateName, stateLabel] = phaseState(phaseIndex, state, phases);
    const details = document.createElement('details');
    details.className = 'phase';
    details.dataset.state = stateName;
    details.open = phaseIndex === 0 || stateName === 'active';

    const summary = document.createElement('summary');
    summary.innerHTML = `<span class="phase-number">${String(phaseIndex + 1).padStart(2, '0')}</span><span class="phase-title"><strong>${phase.title}</strong><span>${phase.subtitle}</span></span><span class="phase-status">${stateLabel}</span>`;

    const body = document.createElement('div');
    body.className = 'phase-body';
    const checklist = document.createElement('div');
    checklist.className = 'checklist';

    phase.items.forEach(([title, description], itemIndex) => {
      const id = itemId(phaseIndex, itemIndex);
      const row = document.createElement('div');
      row.className = `check-item${state[id] ? ' completed' : ''}`;
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `${trackerMode}-${project}-${id}`;
      checkbox.checked = Boolean(state[id]);
      const label = document.createElement('label');
      label.htmlFor = checkbox.id;
      label.innerHTML = `${title}<small>${description}</small>`;
      checkbox.addEventListener('change', () => {
        const freshState = readState(projectSelect.value);
        freshState[id] = checkbox.checked;
        writeState(projectSelect.value, freshState);
        render();
        document.dispatchEvent(new CustomEvent('tracker-updated'));
      });
      row.append(checkbox, label);
      checklist.append(row);
    });

    body.append(checklist);
    details.append(summary, body);
    roadmap.append(details);
  });
  updateProgress(state, phases);
}

function getStats(project, mode) {
  const phases = mode === 'web' ? webPhases : appPhases;
  const state = readState(project, mode);
  const total = phases.reduce((sum, phase) => sum + phase.items.length, 0);
  let completed = 0;
  phases.forEach((phase, phaseIndex) => phase.items.forEach((_, itemIndex) => { if (state[itemId(phaseIndex, itemIndex)]) completed += 1; }));
  return { total, completed, percent: total ? Math.round((completed / total) * 100) : 0 };
}

function updateProgress(state, phases = currentPhases()) {
  const total = phases.reduce((sum, phase) => sum + phase.items.length, 0);
  const completed = phases.reduce((sum, phase, phaseIndex) => sum + phase.items.filter((_, itemIndex) => state[itemId(phaseIndex, itemIndex)]).length, 0);
  const percent = total ? Math.round((completed / total) * 100) : 0;
  progressValue.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;
  progressDetail.textContent = `${completed} de ${total} hitos completados`;
  progressTrack.setAttribute('aria-valuenow', String(percent));
}

projectSelect.addEventListener('change', () => { render(); document.dispatchEvent(new CustomEvent('tracker-updated')); });
appModeButton.addEventListener('click', () => setMode('app'));
webModeButton.addEventListener('click', () => setMode('web'));
resetButton.addEventListener('click', () => {
  const projectName = projectSelect.options[projectSelect.selectedIndex].text;
  const routeName = trackerMode === 'app' ? 'app' : 'web';
  if (!window.confirm(`¿Reiniciar todos los marcadores de la ${routeName} de ${projectName}?`)) return;
  localStorage.removeItem(storageKey(projectSelect.value));
  render();
  document.dispatchEvent(new CustomEvent('tracker-updated'));
});
expandButton.addEventListener('click', () => document.querySelectorAll('.phase').forEach(phase => { phase.open = true; }));
collapseButton.addEventListener('click', () => document.querySelectorAll('.phase').forEach(phase => { phase.open = false; }));

render();
