# Etapa 4 - Inclusión y accesibilidad (NeuroNova Apps)

Fecha: 2026-10-19.
Estado: PRESENTACION_WEB_EN_RAMA_LISTA_PARA_VERIFICACION.

## Intervención
Solo en el repositorio matriz y en la rama de migración.
- Brailux: presentación fiel al README público; enlace a la versión web actual mantenido. No se copió ni modificó su motor interactivo.
- RutinaGo: propósito de rutinas visuales, autonomía y secuencias; presentación institucional sin inventar una versión web.
- ComunicaGo: comunicación aumentativa y alternativa con apoyos visuales; gratuidad y uso sin fines de lucro; presentación institucional sin versión web inventada.
- Identidad visual y núcleo de accesibilidad compartidos de la etapa 3 conservados.

## Restricciones
- No editar ningún archivo del desarrollo Android ni los repositorios de las nueve aplicaciones.
- No modificar main, GitHub Pages, enlaces públicos existentes ni políticas originales.
- La centralización legal y la migración real de las aplicaciones web siguen pendientes de etapas posteriores.
- No declarar aprobado el recorrido visual humano: usuario autorizó continuar pese a incidencia 404.

## Comprobaciones previstas antes del despliegue final
- Encabezados, accesos, navegación, tarjetas y enlaces.
- Revisión de rutas de privacidad; privacidad de Brailux puede requerir auditoría Android separada.
- Revisión manual visual accesible en móvil y escritorio.

## Verificación de rutas y cierre de presentación web (2026-10-19)
Estado: ETAPA_4_PRESENTACION_WEB_CERRADA_CON_PENDIENTES_DE_PUBLICACION.

Verificaciones mediante lectura de archivos GitHub:
- Brailux: la versión web y su política actual existen en brailux-app/index.html y brailux-app/privacy/index.html; la categoría ahora enlaza a ambas. La ruta central privacy/brailux/index.html sigue siendo una página de verificación, no se declara política consolidada definitiva.
- RutinaGo: existe privacy/rutinago/index.html dentro de la matriz; se conserva el enlace.
- ComunicaGo: no existe privacy/comunicago/index.html en la matriz; su enlace se identifica explícitamente como Centro de privacidad, sin anunciar una política individual inexistente.
- Se constató que assets/accessibility/accessibility.js existe en el repositorio matriz.
- No se realizó modificación a Brailux, RutinaGo, ComunicaGo ni a ningún otro repositorio de aplicaciones.
- Sin cambios en main ni en la configuración de GitHub Pages.

Pendientes ajenos al cierre de la presentación: auditoría legal de las políticas definitivas, pruebas visuales/navegación humana antes de publicación, verificación en producción tras futura aprobación del PR.
Etapa 5 de bienestar personal (Motiva) habilitada en rama de migración, sin hacer merge.
