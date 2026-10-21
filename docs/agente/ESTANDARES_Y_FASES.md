# Agente de calidad NeuroNova Apps — Fase 1

## Objetivo
Crear vigilancia reproducible **sin modificar automáticamente las aplicaciones**. Alcance: únicamente el repositorio matriz `neuronova-apps/neuronova-apps.github.io`. Los repositorios originales y Android quedan fuera.

## Modelo de identidad y adaptación
1. **Matriz**: encabezado de marca NeuroNova Apps, navegación por las cuatro categorías, pie con accesos legales y contacto; utilizar semántica `header/main/footer`.
2. **Categorías**: misma tipografía, ritmo visual, tarjeta, nombre de acceso `Conocer [app]` y etiqueta `Política de privacidad`; órbita/ilustración y contenido se adaptan a cada categoría.
3. **Webs interactivas**: conservar identidad propia, funcionalidad, disposición de juego/aprendizaje y progresión; compartir estándares de navegación, accesibilidad y contenido legal sin imponer CSS global que rompa sus interfaces.
4. **RutinaGo y ComunicaGo**: páginas de presentación, no versiones web interactivas.
5. **Privacidad**: mismo esquema editorial mínimo (identificación, versión y alcance, datos y almacenamiento, servicios externos, derechos/contacto, fecha/actualizaciones); el contenido factual y los tratamientos reales SON ESPECÍFICOS de cada aplicación. No inventar datos o igualar políticas por copia.
6. **Accesibilidad**: `lang`, título único, enlace saltar al contenido, orden de foco, etiquetas, contraste, reflujo 320–1440, teclado, anuncios dinámicos pertinentes y respeto a movimiento reducido. Distinguir pruebas estáticas de contrastes/teclado reales.

## Plan progresivo
- Fase 1: inventario automatizado no destructivo y reporte de diferencias (actual).
- Fase 2: auditoría visual de matriz, cuatro categorías, siete webs y dos páginas informativas; establecer tokens compartidos y excepciones.
- Fase 3: revisar y unificar presentación de políticas manteniendo prácticas de datos diferenciadas; confirmar textos con las versiones reales.
- Fase 4: pruebas funcionales y accesibilidad de cada app, correcciones aisladas en PR.
- Fase 5: regresión en GitHub Actions, monitorización de rutas publicadas y checklist de despliegue.

## Política de cambios
El agente informa, no hace merges ni sobrescribe funcionalidad. Cada corrección requiere PR específico, evidencias y revisión. Los hallazgos heurísticos no equivalen automáticamente a infracciones WCAG.
