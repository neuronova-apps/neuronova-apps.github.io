# Brailux — migración web incremental 2

Estado: PORTADA_Y_DEPENDENCIAS_DIRECTAS_COPIADAS_EN_RAMA, PENDIENTE_DE_PRUEBAS_FUNCIONALES.

Destino: inclusion-accesibilidad/brailux/
Origen de consulta, solo lectura: neuronova-apps/brailux-app.

Archivos de portal copiados sin alterar el repositorio de origen:
- index.html: portada completa, con enlace de retorno a matriz y categoría.
- portal.css
- ecosystem-alignment.css
- portal.js
- assets/brailux-core-mark.svg

Las páginas de aprendizaje/práctica permanecen enlazadas por URL absoluta al sitio antiguo para no romper funciones durante la migración. La privacidad web permanece enlazada al sitio original.

Validaciones estáticas: la portada usa las dependencias locales anteriores; su canonical apunta al futuro espacio matriz. No equivale a pruebas en navegador, ni a migración integral de Brailux.

Pendiente: copiar las páginas interactivas una a una, auditar referencias, almacenamiento local y su integridad, revisar resultado visual y finalmente publicar tras revisión. No retirar accesos anteriores ni modificar apps Android.
