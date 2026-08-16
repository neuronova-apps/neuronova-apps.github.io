const appPhases = [
  { title: 'Concepto e idea inicial', subtitle: 'Nacimiento de la aplicación y definición de su propósito', items: [
    ['Registrar la idea inicial de la app', 'Definir qué se quiere crear antes de abrir herramientas de desarrollo.'],
    ['Definir problema o necesidad que atenderá', 'Explicar qué utilidad concreta tendrá para el usuario.'],
    ['Definir público objetivo', 'Identificar a quién estará dirigida la primera versión.'],
    ['Definir nombre provisional o definitivo', 'Establecer una identidad de trabajo para el proyecto.'],
    ['Definir función principal y alcance inicial', 'Separar el núcleo del producto de funciones futuras.'],
    ['Definir criterios mínimos para considerar viable el proyecto', 'Determinar qué debe existir para continuar a desarrollo.']
  ]},
  { title: 'Creación del repositorio', subtitle: 'Base de control de versiones y organización del proyecto', items: [
    ['Crear repositorio GitHub de la aplicación', 'Usar el nombre definitivo o el nombre de trabajo aprobado.'],
    ['Configurar rama principal y archivo README', 'Dejar una descripción básica del proyecto y su finalidad.'],
    ['Configurar .gitignore para Android', 'Evitar subir archivos locales, temporales o sensibles.'],
    ['Definir estructura inicial de documentación', 'Registrar decisiones, versiones y cambios importantes.'],
    ['Confirmar acceso y permisos del repositorio', 'Verificar que el repositorio pueda recibir commits y pushes.']
  ]},
  { title: 'Creación en Android Studio', subtitle: 'Proyecto Android real y primera compilación', items: [
    ['Crear nuevo proyecto en Android Studio', 'Elegir plantilla y configuración técnica acorde con la app.'],
    ['Definir package/applicationId provisional o definitivo', 'Evitar identificadores genéricos antes de publicación.'],
    ['Configurar minSdk, targetSdk y compileSdk', 'Mantener compatibilidad con los requisitos vigentes.'],
    ['Configurar Gradle, Kotlin y dependencias base', 'Dejar un proyecto sincronizado sin errores.'],
    ['Ejecutar primera compilación debug', 'Confirmar que el proyecto base compila antes de añadir funciones.'],
    ['Instalar y abrir la primera build en emulador o dispositivo', 'Verificar que el proyecto arranca correctamente.']
  ]},
  { title: 'Enlace Android Studio y GitHub', subtitle: 'Sincronización del proyecto local con su repositorio', items: [
    ['Inicializar o verificar Git en el proyecto Android', 'Confirmar que Android Studio reconoce el repositorio local.'],
    ['Configurar remote del repositorio GitHub', 'Vincular correctamente origin con el repo correspondiente.'],
    ['Realizar commit inicial del proyecto Android', 'Guardar una base limpia y compilable.'],
    ['Realizar primer push a GitHub', 'Confirmar que el código aparece en el repositorio remoto.'],
    ['Verificar flujo commit, pull y push', 'Asegurar que Android Studio y GitHub quedan operativos entre sí.'],
    ['Definir criterio de respaldos y versiones', 'Evitar trabajar durante largos periodos sin puntos recuperables.']
  ]},
  { title: 'Planificación y arquitectura', subtitle: 'Pantallas, datos, navegación y alcance del MVP', items: [
    ['Definir mapa de pantallas y navegación', 'Ordenar el recorrido principal antes de construir toda la interfaz.'],
    ['Definir arquitectura del código', 'Separar interfaz, lógica, datos y persistencia cuando corresponda.'],
    ['Definir estructura de datos y almacenamiento', 'Determinar qué se guarda localmente y qué requiere otra fuente.'],
    ['Definir funciones del MVP', 'Concentrar el primer ciclo en una versión realmente utilizable.'],
    ['Definir funciones posteriores al MVP', 'Evitar sobrecargar el primer desarrollo.'],
    ['Definir modelo gratuito, premium o monetización prevista', 'Considerarlo antes de cerrar la arquitectura.']
  ]},
  { title: 'Prototipo y diseño UX/UI', subtitle: 'Validación visual antes de consolidar el desarrollo', items: [
    ['Crear prototipo de las pantallas principales', 'Validar jerarquía, navegación y distribución.'],
    ['Revisar prototipo en formato de teléfono promedio', 'Confirmar que el diseño funciona en un tamaño realista.'],
    ['Aplicar identidad propia de la app', 'Mantener coherencia con NeuroNova sin perder personalidad.'],
    ['Definir tema claro, oscuro y comportamiento predeterminado', 'Cuando corresponda al producto.'],
    ['Definir criterios de accesibilidad', 'Contraste, tamaños táctiles, lectura y navegación.'],
    ['Aprobar estructura visual antes de la implementación extensa', 'Reducir retrabajos posteriores.']
  ]},
  { title: 'Desarrollo funcional', subtitle: 'Construcción de la aplicación y de su función central', items: [
    ['Implementar navegación principal', 'Todas las pantallas esenciales deben poder recorrerse.'],
    ['Implementar función central del producto', 'Juego, aprendizaje, frases, devocionales u otra función principal.'],
    ['Implementar estados de pantalla y manejo de errores', 'Evitar bloqueos ante acciones inválidas o datos faltantes.'],
    ['Implementar preferencias y configuración', 'Solo las necesarias para la experiencia prevista.'],
    ['Implementar progreso o persistencia cuando corresponda', 'Conservar información necesaria entre sesiones.'],
    ['Eliminar funciones simuladas o placeholders engañosos', 'Diferenciar claramente lo funcional de lo pendiente.']
  ]},
  { title: 'Banco maestro y contenido', subtitle: 'Creación, depuración e integración del contenido de la app', items: [
    ['Definir estructura del banco maestro', 'Campos, IDs, categorías, dificultad y metadatos.'],
    ['Crear o consolidar el banco maestro', 'Trabajar sobre una fuente identificable y versionada.'],
    ['Completar contenido previsto para el MVP', 'Evitar una app funcional con contenido insuficiente.'],
    ['Auditar duplicados, coherencia y errores', 'Aplicar controles propios del tipo de banco.'],
    ['Validar derechos de uso y atribuciones', 'Cuando existan textos o materiales de terceros.'],
    ['Transformar el banco al formato requerido por la app', 'JSON, base local u otra estructura técnica.'],
    ['Integrar y probar el banco definitivo', 'Comprobar carga, filtros y manejo de registros inválidos.']
  ]},
  { title: 'Pruebas internas de desarrollo', subtitle: 'Corrección progresiva antes de preparar la beta', items: [
    ['Probar cada función principal', 'Validar el recorrido completo de uso.'],
    ['Probar tamaños de pantalla y orientación', 'Revisar teléfonos pequeños, promedio y grandes.'],
    ['Probar persistencia al cerrar, volver y rotar', 'Cuando la app deba conservar estado.'],
    ['Probar accesibilidad y legibilidad', 'Contraste, foco, tamaños y controles.'],
    ['Probar casos límite y errores frecuentes', 'Entradas inválidas, estados vacíos y acciones repetidas.'],
    ['Corregir errores bloqueantes y regresiones', 'No avanzar a beta con fallos que impidan el uso principal.']
  ]},
  { title: 'Beta interna instalable', subtitle: 'APK funcional para evaluación directa en dispositivos', items: [
    ['Generar APK debug estable', 'Usarlo para las primeras pruebas reales.'],
    ['Instalar APK en dispositivo físico', 'Comprobar funcionamiento fuera del emulador.'],
    ['Realizar ronda de prueba personal completa', 'Registrar observaciones visuales y funcionales.'],
    ['Corregir incidencias encontradas en dispositivo', 'Priorizar problemas que afectan experiencia o estabilidad.'],
    ['Generar nueva APK después de correcciones', 'Confirmar que las correcciones no introducen regresiones.']
  ]},
  { title: 'Preparación de release Android', subtitle: 'Conversión de la beta en un candidato distribuible', items: [
    ['Confirmar applicationId definitivo', 'Debe permanecer estable para futuras actualizaciones.'],
    ['Configurar nombre, icono y recursos de producción', 'Eliminar recursos temporales.'],
    ['Configurar versionCode y versionName', 'Preparar el esquema de versiones para Play Store.'],
    ['Crear y proteger clave de firma de producción', 'Mantener copia segura fuera del proyecto.'],
    ['Configurar firma release', 'Verificar que Gradle puede generar artefactos firmados.'],
    ['Generar APK release firmado', 'Probar instalación y comportamiento de la versión release.'],
    ['Generar AAB release firmado', 'Preparar el formato que se distribuirá mediante Google Play.']
  ]},
  { title: 'Preparación de Google Play Console', subtitle: 'Cuenta, ficha inicial y configuración del proyecto', items: [
    ['Crear la aplicación en Google Play Console', 'Registrar nombre, idioma y datos básicos.'],
    ['Configurar datos del desarrollador', 'Comprobar que la información requerida esté completa.'],
    ['Crear pista de prueba cerrada', 'Preparar el canal previo a producción.'],
    ['Definir grupo de evaluadores', 'Registrar las cuentas que participarán en la prueba.'],
    ['Subir AAB firmado a prueba cerrada', 'Resolver advertencias o errores bloqueantes.'],
    ['Publicar la versión de prueba cerrada', 'Confirmar que los evaluadores pueden instalarla.']
  ]},
  { title: 'Prueba cerrada y correcciones', subtitle: 'Validación con usuarios antes de solicitar producción', items: [
    ['Completar el periodo de prueba requerido', 'Mantener la pista activa según las condiciones aplicables.'],
    ['Recoger incidencias y observaciones', 'Registrar problemas funcionales y de experiencia.'],
    ['Clasificar incidencias por prioridad', 'Separar bloqueantes, importantes y mejoras futuras.'],
    ['Aplicar correcciones necesarias', 'Resolver lo que comprometa estabilidad o calidad.'],
    ['Generar y probar versión candidata', 'Repetir pruebas críticas tras las correcciones.'],
    ['Actualizar AAB de prueba cuando corresponda', 'Validar en Play la versión que se pretende llevar a producción.']
  ]},
  { title: 'Ficha y cumplimiento de Play Store', subtitle: 'Material público, políticas y declaraciones obligatorias', items: [
    ['Preparar descripción corta y completa', 'Representar fielmente la funcionalidad real.'],
    ['Preparar icono, capturas y recursos gráficos', 'Mostrar la versión que realmente se publicará.'],
    ['Publicar política de privacidad cuando corresponda', 'Usar una URL pública y estable.'],
    ['Completar seguridad de datos', 'Declarar únicamente lo que la app realmente recopila o utiliza.'],
    ['Completar clasificación de contenido', 'Responder según la naturaleza real de la aplicación.'],
    ['Completar público objetivo y declaraciones adicionales', 'Atender los formularios aplicables.'],
    ['Revisar permisos Android', 'Eliminar permisos innecesarios antes del lanzamiento.']
  ]},
  { title: 'Auditoría final de producción', subtitle: 'Último control antes de enviar la app a Google', items: [
    ['Realizar auditoría funcional completa', 'Probar todos los flujos críticos sobre release.'],
    ['Realizar auditoría visual y de accesibilidad', 'Revisar consistencia, contraste y legibilidad.'],
    ['Verificar que no existan datos de prueba', 'Eliminar textos, URLs, claves o recursos provisionales.'],
    ['Confirmar firma, versión y AAB definitivos', 'No sustituir accidentalmente el artefacto aprobado.'],
    ['Respaldar código y clave de firma', 'Mantener copias seguras para futuras versiones.'],
    ['Dar aprobación interna al candidato de producción', 'Cerrar formalmente la fase de desarrollo inicial.']
  ]},
  { title: 'Publicación en Google Play', subtitle: 'Distribución pública de la primera versión', items: [
    ['Solicitar acceso o paso a producción', 'Completar el proceso requerido por Play Console.'],
    ['Crear lanzamiento de producción', 'Seleccionar el AAB candidato aprobado.'],
    ['Añadir notas de la versión', 'Describir brevemente la primera publicación.'],
    ['Enviar a revisión de Google Play', 'Atender cualquier observación de la revisión.'],
    ['Confirmar publicación pública', 'Verificar que la ficha esté disponible externamente.'],
    ['Instalar desde Google Play y realizar prueba final', 'Validar la distribución real recibida por el usuario.'],
    ['Registrar versión 1.0 como completada', 'Abrir el ciclo posterior de mantenimiento y actualizaciones.']
  ]}
];

const webPhases = [
  { title: 'Concepto de la web', subtitle: 'Propósito, alcance y relación con la aplicación', items: [
    ['Definir para qué existirá la web', 'Presentación, demo, documentación, soporte o combinación de funciones.'],
    ['Definir público y mensaje principal', 'Determinar qué debe comprender una persona al entrar.'],
    ['Definir relación entre web y app', 'Aclarar si presenta, complementa o permite probar la aplicación.'],
    ['Definir nombre, URL y alcance inicial', 'Establecer una dirección coherente dentro de NeuroNova.'],
    ['Definir criterio de finalización de la primera versión web', 'Precisar cuándo puede considerarse lista para publicar.']
  ]},
  { title: 'Repositorio y GitHub Pages', subtitle: 'Base técnica y publicación inicial del sitio', items: [
    ['Crear repositorio GitHub de la web o confirmar el existente', 'Usar una estructura coherente con el ecosistema.'],
    ['Configurar rama principal', 'Definir main como fuente estable cuando corresponda.'],
    ['Crear README inicial', 'Documentar propósito y estructura básica.'],
    ['Configurar .gitignore cuando sea necesario', 'Excluir archivos locales o temporales.'],
    ['Activar o verificar GitHub Pages', 'Confirmar la fuente de publicación del sitio.'],
    ['Comprobar URL pública inicial', 'Verificar que el sitio pueda desplegarse aunque todavía sea mínimo.']
  ]},
  { title: 'Estructura web desde cero', subtitle: 'Archivos base, navegación y organización inicial', items: [
    ['Crear index.html', 'Establecer el punto de entrada de la web.'],
    ['Crear hoja de estilos principal', 'Separar la presentación del contenido.'],
    ['Crear JavaScript cuando sea necesario', 'Añadir comportamiento sin mezclarlo innecesariamente con HTML.'],
    ['Definir estructura de carpetas', 'Organizar assets, imágenes, scripts y documentos.'],
    ['Crear navegación principal', 'Permitir desplazarse por las secciones esenciales.'],
    ['Comprobar primera versión local', 'Abrir y recorrer la web antes de seguir ampliándola.']
  ]},
  { title: 'Arquitectura de información y prototipo', subtitle: 'Orden del contenido antes del diseño definitivo', items: [
    ['Definir secciones de la página', 'Inicio, descripción, funciones, privacidad, contacto u otras necesarias.'],
    ['Definir jerarquía de títulos y contenidos', 'Ordenar la información de mayor a menor relevancia.'],
    ['Crear prototipo o versión visual preliminar', 'Validar distribución antes de pulir detalles.'],
    ['Revisar prototipo en escritorio', 'Comprobar amplitud, lectura y navegación.'],
    ['Revisar prototipo en móvil', 'Confirmar que el enfoque funciona en pantallas pequeñas.'],
    ['Aprobar estructura antes del diseño final', 'Reducir cambios estructurales tardíos.']
  ]},
  { title: 'Contenido definitivo', subtitle: 'Información pública completa, coherente y actualizada', items: [
    ['Redactar presentación del proyecto', 'Explicar qué es y para qué sirve.'],
    ['Redactar funciones o características principales', 'Mostrar únicamente capacidades reales o claramente identificadas como futuras.'],
    ['Indicar estado real del proyecto', 'Diferenciar desarrollo, demo, MVP, beta o publicación.'],
    ['Incluir enlaces relevantes', 'Repositorio, app, privacidad, soporte o recursos.'],
    ['Revisar ortografía y consistencia', 'Eliminar contradicciones, textos temporales y duplicados.'],
    ['Confirmar que la web pueda entenderse sin contexto externo', 'La página debe ser autosuficiente para un visitante nuevo.']
  ]},
  { title: 'Diseño visual definitivo', subtitle: 'Identidad propia dentro del ecosistema NeuroNova', items: [
    ['Aplicar identidad visual de la app', 'Usar colores, símbolo o rasgos propios.'],
    ['Mantener coherencia con NeuroNova', 'Compartir patrones comunes sin convertir todas las webs en copias.'],
    ['Implementar favicon', 'Usar el identificador visual aprobado.'],
    ['Definir tipografía, espaciado y jerarquía visual', 'Asegurar lectura clara y consistente.'],
    ['Revisar botones, tarjetas y estados interactivos', 'Mantener controles reconocibles y coherentes.'],
    ['Eliminar elementos visuales provisionales', 'Dejar recursos preparados para publicación.']
  ]},
  { title: 'Funcionalidad web', subtitle: 'Interacciones, demos y componentes que deben funcionar', items: [
    ['Implementar comportamiento de navegación', 'Menús, anclas y rutas deben responder correctamente.'],
    ['Implementar componentes interactivos previstos', 'Demos, formularios, filtros, juegos o controles cuando correspondan.'],
    ['Implementar persistencia local cuando sea necesaria', 'Guardar preferencias o progreso solo si aporta a la experiencia.'],
    ['Gestionar estados vacíos y errores', 'Evitar interfaces rotas ante datos faltantes.'],
    ['Verificar enlaces internos y externos', 'Eliminar rutas rotas o destinos provisionales.'],
    ['Probar el flujo principal completo', 'Confirmar que la experiencia web puede completarse.']
  ]},
  { title: 'Diseño responsive', subtitle: 'Adaptación real a escritorio, tablet y móvil', items: [
    ['Validar escritorio amplio', 'Comprobar distribución y límites de ancho.'],
    ['Validar laptop o escritorio medio', 'Revisar cambios de columnas y espaciado.'],
    ['Validar tableta', 'Comprobar navegación y tamaño de controles.'],
    ['Validar teléfono promedio', 'Priorizar legibilidad y acciones principales.'],
    ['Validar teléfono pequeño', 'Evitar desbordes y elementos inaccesibles.'],
    ['Corregir scroll horizontal, recortes y superposiciones', 'La web debe adaptarse sin perder contenido esencial.']
  ]},
  { title: 'Accesibilidad web', subtitle: 'Lectura, teclado, contraste y preferencias de usuario', items: [
    ['Validar estructura semántica', 'Usar encabezados, regiones y controles adecuados.'],
    ['Validar navegación por teclado', 'Toda acción esencial debe ser alcanzable sin ratón.'],
    ['Validar foco visible', 'La posición del teclado debe distinguirse claramente.'],
    ['Validar contraste y legibilidad', 'Texto, botones y estados deben ser perceptibles.'],
    ['Validar nombres accesibles y etiquetas', 'Enlaces, botones e imágenes deben comunicar su función.'],
    ['Validar reducción de movimiento', 'Respetar preferencias cuando existan animaciones.'],
    ['Validar panel o funciones de accesibilidad de NeuroNova cuando correspondan', 'Comprobar que las preferencias funcionan correctamente.']
  ]},
  { title: 'SEO y presentación pública', subtitle: 'Metadatos, indexación y representación en buscadores y redes', items: [
    ['Configurar title y meta description', 'Describir fielmente la web.'],
    ['Configurar canonical', 'Establecer la URL pública principal.'],
    ['Configurar Open Graph', 'Preparar título, descripción e imagen para compartir.'],
    ['Configurar Twitter Card u otros metadatos necesarios', 'Mantener una presentación coherente fuera del sitio.'],
    ['Configurar robots e indexación', 'Definir si la página debe aparecer en buscadores.'],
    ['Actualizar sitemap', 'Incluir las URLs públicas que corresponda indexar.'],
    ['Verificar enlaces desde la matriz NeuroNova', 'La web debe poder descubrirse desde el ecosistema principal.']
  ]},
  { title: 'Validaciones automáticas y calidad', subtitle: 'Comprobaciones técnicas antes de considerar estable la web', items: [
    ['Validar HTML y estructura de archivos', 'Detectar errores básicos de marcado o rutas.'],
    ['Validar sintaxis JavaScript', 'Evitar fallos de carga por errores de código.'],
    ['Validar enlaces y recursos', 'Comprobar que archivos y destinos existen.'],
    ['Ejecutar pruebas de navegador', 'Revisar carga y flujo principal.'],
    ['Ejecutar pruebas responsive', 'Comprobar varios tamaños de viewport.'],
    ['Ejecutar auditoría de accesibilidad', 'Corregir hallazgos relevantes.'],
    ['Ejecutar auditoría de rendimiento', 'Revisar carga, peso y estabilidad.'],
    ['Ejecutar controles básicos de seguridad y resiliencia', 'Evitar patrones inseguros o fallos recuperables.']
  ]},
  { title: 'Publicación definitiva de la web', subtitle: 'Despliegue estable y verificación externa', items: [
    ['Realizar commit de versión candidata', 'Dejar un punto claro antes del despliegue.'],
    ['Realizar push a la rama publicada', 'Enviar la versión aprobada a GitHub.'],
    ['Confirmar despliegue correcto en GitHub Pages', 'Esperar a que la versión pública quede disponible.'],
    ['Abrir la URL en una sesión externa', 'Comprobar que no depende del entorno local.'],
    ['Revisar navegación y recursos en producción', 'Confirmar que no existan diferencias con las pruebas locales.'],
    ['Verificar favicon, metadatos y enlaces', 'Comprobar la presentación final.'],
    ['Dar la web por publicada', 'Cerrar formalmente la primera versión estable.']
  ]},
  { title: 'Mantenimiento web', subtitle: 'Actualizaciones posteriores a la primera publicación', items: [
    ['Definir cuándo debe actualizarse la web', 'Cambios de estado, funciones, versión o disponibilidad.'],
    ['Mantener enlaces y políticas vigentes', 'Evitar referencias obsoletas.'],
    ['Actualizar contenido al avanzar la app', 'La web debe representar el estado real del producto.'],
    ['Repetir auditorías después de cambios importantes', 'Evitar regresiones de accesibilidad o rendimiento.'],
    ['Registrar versiones relevantes', 'Mantener trazabilidad de cambios importantes.']
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
function storageKey(project, mode = trackerMode) { return `neuronova-${mode}-tracker:${project}:v2`; }
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
  appModeButton?.classList.toggle('active', appActive);
  webModeButton?.classList.toggle('active', !appActive);
  appModeButton?.setAttribute('aria-pressed', String(appActive));
  webModeButton?.setAttribute('aria-pressed', String(!appActive));
  if (currentProgressLabel) currentProgressLabel.textContent = appActive ? 'Avance de la app' : 'Avance de la web';
  if (routeEyebrow) routeEyebrow.textContent = appActive ? 'Ruta completa de la aplicación' : 'Ruta completa de la web';
  if (panelTitle) panelTitle.textContent = appActive ? 'De la idea a Google Play' : 'De la idea a la web publicada';
  if (routeDescription) routeDescription.textContent = appActive
    ? 'Seguimiento cronológico desde el concepto, creación del repositorio y proyecto en Android Studio, enlace con GitHub, desarrollo y pruebas, hasta la distribución pública en Google Play.'
    : 'Seguimiento cronológico desde el concepto, creación del repositorio y archivos base, diseño y desarrollo web, hasta la publicación definitiva y mantenimiento.';
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
      checkbox.id = `${trackerMode}-${id}`;
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

function updateProgress(state, phases = currentPhases()) {
  const total = phases.reduce((sum, phase) => sum + phase.items.length, 0);
  let completed = 0;
  phases.forEach((phase, phaseIndex) => phase.items.forEach((_, itemIndex) => { if (state[itemId(phaseIndex, itemIndex)]) completed += 1; }));
  const percent = total ? Math.round((completed / total) * 100) : 0;
  progressValue.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;
  progressDetail.textContent = `${completed} de ${total} hitos completados`;
  progressTrack?.setAttribute('aria-valuenow', String(percent));
}

function getStats(projectId, mode) {
  const phases = mode === 'web' ? webPhases : appPhases;
  const state = readState(projectId, mode);
  const total = phases.reduce((sum, phase) => sum + phase.items.length, 0);
  let completed = 0;
  phases.forEach((phase, phaseIndex) => phase.items.forEach((_, itemIndex) => { if (state[itemId(phaseIndex, itemIndex)]) completed += 1; }));
  return { total, completed, percent: total ? Math.round((completed / total) * 100) : 0 };
}

projectSelect.addEventListener('change', () => { render(); document.dispatchEvent(new CustomEvent('tracker-updated')); });
appModeButton?.addEventListener('click', () => setMode('app'));
webModeButton?.addEventListener('click', () => setMode('web'));
resetButton.addEventListener('click', () => {
  const projectName = projectSelect.options[projectSelect.selectedIndex].text;
  const routeName = trackerMode === 'app' ? 'app' : 'web';
  if (!window.confirm(`¿Reiniciar todos los marcadores de la ruta ${routeName} de ${projectName}?`)) return;
  localStorage.removeItem(storageKey(projectSelect.value));
  render();
  document.dispatchEvent(new CustomEvent('tracker-updated'));
});
expandButton.addEventListener('click', () => document.querySelectorAll('.phase').forEach(phase => { phase.open = true; }));
collapseButton.addEventListener('click', () => document.querySelectorAll('.phase').forEach(phase => { phase.open = false; }));

setMode('app');
