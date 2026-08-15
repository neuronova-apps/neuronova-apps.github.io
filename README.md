# Neuronova Apps

Neuronova Apps es una iniciativa personal e independiente orientada al desarrollo progresivo de aplicaciones web con propósitos diversos: accesibilidad, aprendizaje, bienestar, espiritualidad y entretenimiento.

La plataforma funciona como una matriz principal que reúne proyectos independientes bajo una misma identidad. Cada aplicación evoluciona en su propio repositorio y mantiene un acceso centralizado desde la web principal de Neuronova Apps.

## Iniciativa

El proyecto nace como una iniciativa personal de Gabriel Berrospi, con el propósito de explorar, diseñar y desarrollar soluciones digitales útiles, sencillas y accesibles. Neuronova Apps no corresponde a una institución ni representa oficialmente a una entidad pública o privada.

## Propósito

El propósito de Neuronova Apps es construir un ecosistema de aplicaciones que pueda crecer de manera gradual, priorizando una experiencia clara, compatibilidad con distintos dispositivos, organización modular y criterios de accesibilidad compartidos.

## Ecosistema actual

La matriz reúne siete aplicaciones:

- **Quiz Bible:** aprendizaje bíblico mediante preguntas, revisión progresiva y desafíos breves.
- **Mi Momento:** devocionales, oraciones, diario personal y seguimiento espiritual.
- **Brailux:** conocimiento, aprendizaje y práctica del sistema Braille.
- **English Fast:** aprendizaje de inglés mediante teoría breve, práctica y multijuegos.
- **Sudolux:** Sudoku orientado al entretenimiento y al ejercicio de la lógica.
- **Crucilux:** crucigramas y retos de vocabulario para ejercitación verbal.
- **Motiva:** frases motivacionales y reflexivas para distintos momentos del día.

## Estado

Ecosistema web funcional en desarrollo continuo. La matriz está publicada mediante GitHub Pages y organiza siete aplicaciones web independientes con distintos niveles de madurez.

## Alcance actual

Neuronova Apps actúa como matriz de identidad, navegación, documentación y componentes compartidos. No sustituye la arquitectura interna de cada aplicación ni centraliza su lógica funcional. Cada proyecto conserva su propio repositorio, ciclo de desarrollo, pruebas y despliegue.

La matriz mantiene información resumida de estado mediante `apps.json`, mientras cada repositorio de aplicación conserva la descripción técnica detallada de su implementación.

## Arquitectura

La página matriz se publica desde este repositorio. Cada aplicación mantiene un repositorio independiente para evitar acoplamientos innecesarios y permitir que su desarrollo, pruebas y despliegues evolucionen por separado.

### Fuente de verdad de estados

El archivo `apps.json` es la fuente central de la matriz para los datos que cambian con mayor frecuencia en cada aplicación:

- estado actual;
- funciones disponibles ahora;
- funciones que continúan en desarrollo;
- enlace público;
- texto y etiqueta accesible del botón de acceso.

`script.js` carga este archivo y sincroniza las tarjetas de la matriz. De esta forma, los cambios de estado no deben mantenerse manualmente en varios lugares. Si `apps.json` no puede cargarse, la matriz conserva el contenido HTML existente como respaldo y no bloquea la navegación.

Cuando una aplicación cambie de etapa o incorpore una función que deba mostrarse en la matriz, debe actualizarse primero `apps.json`. Los repositorios de cada aplicación continúan siendo la referencia técnica detallada sobre su implementación y desarrollo propio.

### Núcleo compartido de accesibilidad

La versión estable actual del núcleo compartido es `v1`:

```text
assets/accessibility/v1/accessibility.css
assets/accessibility/v1/accessibility.js
```

Las rutas históricas se mantienen como compatibilidad y permanecen ancladas a `v1`:

```text
assets/accessibility/accessibility.css
assets/accessibility/accessibility.js
```

Las nuevas integraciones deben utilizar rutas versionadas. Los cambios incompatibles no deben modificar `v1`; deben publicarse en una nueva versión, por ejemplo `v2`, para que cada aplicación pueda migrar de forma deliberada y probada.

`assets/accessibility/manifest.json` registra la versión estable y `.github/workflows/accessibility-core-guard.yml` comprueba que `v1` permanezca sin cambios accidentales y que las rutas de compatibilidad sigan siendo idénticas a esa versión.

El comportamiento del foco normal y reforzado se resuelve directamente desde el núcleo compartido, sin hojas de corrección locales en la matriz.

### Contador público de visitas

La matriz incluye un contador visual de solicitudes mediante el servicio externo Hits (`hits.sh`). La integración utiliza únicamente una imagen SVG remota: no incorpora JavaScript de analítica, cookies, `localStorage`, backend propio ni GitHub Actions como servidor de conteo.

La solicitud del SVG utiliza `referrerpolicy="no-referrer"`. El contador representa cargas registradas del recurso y no debe interpretarse como número de personas o visitantes únicos.

El directorio `quiz-bible-banco/` contiene una herramienta editorial de consulta y revisión del Banco Maestro de Quiz Bible. Sus archivos de datos forman parte del flujo de revisión y no deben confundirse con los archivos de presentación de la página matriz.

## Accesibilidad

Neuronova mantiene un núcleo compartido de accesibilidad versionado y un protocolo de verificación sistemática. La documentación técnica se encuentra en `docs/ACCESSIBILITY.md` y el protocolo de auditoría en `docs/ACCESSIBILITY_AUDIT.md`.

La auditoría automática del ecosistema utiliza Playwright y axe-core sobre la matriz y las siete aplicaciones. Las pruebas automáticas son evidencia parcial y no equivalen a una certificación WCAG. Las revisiones manuales con teclado, lector de pantalla, zoom, contraste, movimiento y dispositivos deben registrarse por separado.

## Gobernanza documental

El estándar común de documentación se encuentra en `docs/DOCUMENTATION_STANDARD.md` y la plantilla para nuevas aplicaciones en `docs/README_TEMPLATE.md`.

Los README de las aplicaciones deben mantener secciones comunes sobre estado, alcance, funciones, tecnología, accesibilidad, privacidad, limitaciones, roadmap, desarrollo local, estructura, enlaces, integración con Neuronova, autoría y fecha de revisión.

`apps.json` es la fuente resumida de la matriz. El README de cada aplicación sigue siendo la referencia técnica de su propio repositorio. Cuando exista una discrepancia, debe corregirse la fuente correspondiente en el mismo ciclo de cambio.

## Limitaciones conocidas

La matriz no ejecuta ni controla la lógica interna de las aplicaciones. El estado global depende de que cada repositorio mantenga actualizada su documentación y de que los controles automáticos se complementen con revisión humana.

Las pruebas automáticas de accesibilidad y documentación reducen regresiones, pero no sustituyen la validación funcional, editorial ni manual de cada aplicación.

El contador de visitas depende de un servicio externo y contabiliza solicitudes al recurso del contador. Puede incluir recargas, automatizaciones o tráfico no humano y no constituye analítica de usuarios únicos. Si el servicio externo deja de estar disponible, la funcionalidad principal de Neuronova continúa operativa y solo deja de mostrarse el contador.

## Roadmap

Las prioridades del ecosistema son consolidar las siete aplicaciones existentes, mantener sincronizados los estados de la matriz, ampliar las pruebas automáticas, completar revisiones manuales de accesibilidad y fortalecer estándares compartidos antes de incorporar nuevos proyectos.

Los cambios incompatibles del núcleo de accesibilidad deben publicarse como nuevas versiones y migrarse de forma controlada por aplicación.

## Repositorios de aplicaciones

- [Quiz Bible](https://github.com/neuronova-apps/quizbible-app)
- [Mi Momento](https://github.com/neuronova-apps/mimomento-app)
- [Brailux](https://github.com/neuronova-apps/brailux-app)
- [English Fast](https://github.com/neuronova-apps/englishfast-app)
- [Sudolux](https://github.com/neuronova-apps/sudolux-app)
- [Crucilux](https://github.com/neuronova-apps/crucilux-app)
- [Motiva](https://github.com/neuronova-apps/motiva-app)

## Sitio principal

https://neuronova-apps.github.io/

## Desarrollo

Neuronova Apps se encuentra en desarrollo continuo. Las funciones, interfaces, contenidos y características de cada aplicación pueden cambiar durante las etapas de diseño, prueba y mejora.

Los cambios del repositorio matriz deben preservar la independencia de cada aplicación y evitar que estilos o scripts centrales modifiquen de forma accidental su estructura propia.

## Autoría

Proyecto personal desarrollado por Gabriel Berrospi.

## Última revisión

2026-08-15
