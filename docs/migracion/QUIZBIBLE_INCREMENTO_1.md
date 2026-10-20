# QuizBible — integración progresiva, incremento 1

Estado: ARCHIVOS COPIADOS A RAMA; PENDIENTE VALIDACION FUNCIONAL Y PUBLICACIÓN.

## Arquitectura
Matriz / → Desarrollo espiritual / → QuizBible /desarrollo-espiritual/quizbible/.
Tarjeta QuizBible enlaza al subacceso individual. MiMomento no fue modificado.
Se mantienen tarjetas visibles, sin acordeones. La web original permanece disponible.

## Inventario
- Portada index.html, cinco guías HTML.
- styles.css, hero-orbit.css, quiz.css, guide-cards.css, ecosystem-alignment.css y resources.css.
- quiz.js, favicon.svg y data/questions.json (banco JSON que consume quiz.js).
- Se conservó enlace a privacidad y versión antigua en la transición.

## Comprobaciones
Revisión estática de 15 recursos copiados, incluyendo referencias src/href, CSS url() y fetch() literal: sin faltantes locales detectados. Los selectores SVG #bg/#cyan son referencias internas, no archivos faltantes.

## Pendientes obligatorios
- Verificar en navegador banco de preguntas, carga fetch('data/questions.json'), navegación, aciertos y retroalimentación, filtros y accesibilidad.
- Revisar aspecto visual responsive y contrastes.
- Crear PR separado, ejecutar GitHub Actions, publicar tras validación y verificar el acceso público.
- No modificar repositorio quizbible-app ni su proyecto Android.
