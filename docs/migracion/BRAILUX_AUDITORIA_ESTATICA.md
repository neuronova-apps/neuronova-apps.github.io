# Auditoría estática de Brailux — incremento 3

Fecha: 2026-10-20
Estado: AUDITORIA_ESTATICA_REALIZADA_CON_PRUEBAS_FUNCIONALES_PENDIENTES

## Alcance
Únicamente archivos web copiados a inclusion-accesibilidad/brailux/ dentro del repositorio matriz, rama feature/matriz-acordeon-orbitas-fase1. Repositorio original brailux-app consultado sin cambios.

## Comprobaciones ejecutadas
- Se leyeron 16 documentos de Brailux: siete páginas HTML (incluida portada), seis CSS y scripts JavaScript, según el inventario de la migración (16 referencias auditadas).
- Se examinaron rutas src/href y url() locales declaradas en los archivos textuales; no se detectaron referencias locales directas faltantes dentro del conjunto inventariado. El SVG assets/brailux-core-mark.svg está presente.
- Se comprobó que la portada enlaza sus páginas educativas dentro del directorio de la matriz.
- Se identificó el uso de localStorage, clave brailux-progress-v1, en progress.js. Como la web original y la matriz comparten el origen https://neuronova-apps.github.io, el almacenamiento es por origen y no por ruta; la continuidad del esquema y sus escrituras necesita prueba real antes de aprobar.
- Los recursos visuales sociales, favicon y privacidad que aún apuntan a la antigua web se conservan deliberadamente durante la migración. No desactivar el acceso web original.
- Corrección: la URL og:url de aprende.html apuntaba a /brailux-app/aprende.html; actualizada para reflejar la ruta nueva dentro de la matriz.

## Límites
La verificación fue estática mediante lectura de GitHub, no prueba de navegador, de ejecución de ejercicios, de lector de pantalla, de alto contraste ni de persistencia real tras navegar entre rutas. Tampoco constituye revisión exhaustiva de todos los recursos binarios indirectos o de peticiones JavaScript dinámicas.

## Próximos controles obligatorios
1. Validación automatizada y en navegador de los seis módulos educativos, enlaces, recursos y consola.
2. Prueba de ejercicios, traductor, progreso existente y persistencia de brailux-progress-v1.
3. Revisión de accesibilidad móvil/escritorio, teclado, alto contraste y movimiento reducido.
4. Solo después revisión del PR y aprobación para publicar; preservar el sitio original como respaldo de funcionalidad hasta validación.

No se ha modificado main, GitHub Pages ni los repositorios de aplicaciones.
