# Arquitectura matriz web: fase 1, piloto Inclusión y accesibilidad

Estado: IMPLEMENTADO_EN_RAMA, PENDIENTE_DE_REVISION_VISUAL.

## Estructura organizada
- `inclusion-accesibilidad/index.html`: composición visible, sin motor de apps copiado.
- `assets/categories/orbits-accordion.css`: estilos de órbita y acordeón de categoría separados del diseño compartido.
- `assets/categories/accordion.js`: comportamiento accesible básico; solo un panel abierto.
- `data/categories/inclusion-accesibilidad.json`: catálogo estructurado de 3 aplicaciones; metadatos de inventario, no cargado aún dinámicamente en HTML.
- `assets/categories/categories.css`: estilos generales ya existentes y no modificados.

## Criterios
- El hero de categoría replica la mecánica visual orbital existente en la portada matriz: anillos concéntricos con giro lento y centro NN. El único cambio conceptual es mostrar B, R y C para las apps de inclusión.
- Los símbolos B/R/C permiten abrir el panel correspondiente. Se conservan el encabezado y pie comunes.
- Brailux mantiene vínculo a su web funcional existente; RutinaGo y ComunicaGo conservan presentaciones sin inventar interfaces Android trasladadas.
- Sin intervención en repositorios de aplicaciones, sin modificaciones en main ni Pages.

## Riesgos y tareas posteriores
- Revisar visualmente fidelidad exacta de órbitas de la portada, tamaño responsive y accesibilidad de interacciones.
- Revisar integración progresiva de cada aplicación web; no eliminar antigua URL hasta validar JavaScript, recursos y datos locales.
- La navegación del panel informativo no implica migración funcional completada.
- Antes de replicar a otras categorías, corregir observaciones del piloto y decidir ubicación estable de contenidos web por aplicación.
