# Protocolo de verificación de accesibilidad de Neuronova Apps

## Propósito

Este protocolo convierte la accesibilidad del ecosistema en un proceso verificable y repetible. Se aplica a la matriz Neuronova Apps y a las siete aplicaciones web públicas.

El objetivo no es declarar una certificación WCAG. La evidencia se divide en pruebas automáticas y pruebas manuales, porque ninguna herramienta automática puede validar por sí sola todos los criterios de accesibilidad.

## Alcance mínimo

Cada ciclo de auditoría debe cubrir:

1. Neuronova Apps.
2. Quiz Bible.
3. Mi Momento.
4. Brailux.
5. English Fast.
6. Sudolux.
7. Crucilux.
8. Motiva.

Las páginas internas con funciones diferentes deben incorporarse cuando contengan controles, formularios, juegos, tableros, diálogos o flujos que no estén representados en la portada.

## Evidencia automática

El workflow `.github/workflows/accessibility-audit.yml` ejecuta `scripts/accessibility-audit.mjs` sobre las ocho superficies públicas.

La auditoría utiliza axe-core mediante Playwright y revisa el subconjunto automatizable de WCAG A y AA. Los resultados se guardan como artefactos de GitHub Actions durante 90 días:

- `axe-results.json`: detalle técnico de las reglas y nodos afectados.
- `summary.md`: resumen por aplicación.

La comprobación automática falla cuando:

- existe al menos una violación con impacto `serious` o `critical`;
- una URL no responde correctamente;
- una superficie no puede ser analizada.

Una ejecución automática satisfactoria significa únicamente que axe-core no detectó hallazgos bloqueantes dentro de su cobertura. No equivale a conformidad WCAG.

## Pruebas manuales obligatorias

Cada revisión manual debe registrar resultado, evidencia y observaciones para los siguientes bloques.

### Navegación por teclado

- todo elemento interactivo es alcanzable con `Tab` y `Shift + Tab`;
- el orden del foco sigue una secuencia comprensible;
- el foco es visible en todo momento;
- no existen trampas de teclado;
- los menús, pestañas, diálogos, juegos y controles personalizados pueden operarse sin ratón;
- `Escape`, flechas, Enter y Espacio funcionan cuando el patrón de interfaz los requiere;
- al cerrar un diálogo o menú, el foco vuelve a un lugar lógico.

### Lectores de pantalla

Realizar al menos una prueba con lector de pantalla disponible en el entorno de validación. Registrar lector, navegador y sistema operativo.

Comprobar:

- título de página y regiones principales;
- jerarquía de encabezados;
- nombres accesibles de enlaces y botones;
- etiquetas de formularios;
- mensajes de error y estados dinámicos;
- contenido de diálogos y pestañas;
- instrucciones de juegos, tableros y actividades;
- cambios de foco después de acciones relevantes.

### Zoom y reflow

Comprobar, como mínimo:

- zoom del navegador al 200 %;
- zoom al 400 % cuando el contenido y el navegador lo permitan;
- ausencia de pérdida de contenido o controles esenciales;
- lectura y operación sin desplazamiento horizontal innecesario en contenido textual;
- panel de accesibilidad utilizable con ampliación.

### Contraste y presentación

Comprobar:

- texto y controles legibles en la presentación normal;
- modo de alto contraste del núcleo Neuronova;
- foco reforzado visible sobre fondos claros y oscuros;
- información que no dependa exclusivamente del color;
- estados seleccionado, error, éxito y deshabilitado identificables visual y semánticamente.

### Movimiento y animación

Comprobar:

- `prefers-reduced-motion`;
- opción de reducción de movimiento del panel Neuronova;
- ausencia de contenido esencial que dependa de una animación;
- ausencia de pérdida funcional al reducir movimiento.

### Tamaño táctil y dispositivos móviles

En una pantalla móvil real o emulada, comprobar:

- controles operables sin precisión excesiva;
- ausencia de superposición entre paneles y contenido esencial;
- navegación principal accesible;
- formularios, juegos y tableros utilizables;
- orientación y reflow adecuados.

## Niveles de hallazgo

Los hallazgos se clasifican para priorizar su corrección:

- `Crítico`: impide completar una función esencial con teclado o tecnología de asistencia, oculta contenido esencial o genera una barrera grave.
- `Alto`: dificulta de forma considerable una tarea importante o incumple un requisito relevante de operación, percepción o comprensión.
- `Medio`: genera fricción o inconsistencia, pero existe una alternativa funcional razonable.
- `Bajo`: mejora recomendada sin barrera funcional significativa.

Los hallazgos críticos y altos deben corregirse antes de considerar cerrada una revisión de accesibilidad.

## Frecuencia

La auditoría automática se ejecuta semanalmente y también puede ejecutarse manualmente desde GitHub Actions. Además, se ejecuta cuando cambian archivos centrales relacionados con la matriz o el núcleo compartido de accesibilidad.

La revisión manual debe realizarse:

- antes de declarar estable una nueva versión del núcleo de accesibilidad;
- cuando una aplicación incorpora un flujo interactivo importante;
- después de cambios sustanciales de navegación, formularios, modales, juegos o tableros;
- antes de presentar públicamente una afirmación de conformidad con un estándar de accesibilidad.

## Registro de evidencias

Cada revisión manual debe generar un archivo basado en `docs/accessibility-audits/TEMPLATE.md` y conservarse dentro de `docs/accessibility-audits/` con formato recomendado:

`AAAA-MM-DD-nombre-app.md`

El registro debe indicar qué se probó, con qué tecnología, qué funcionó, qué falló y qué queda pendiente.

## Criterio para comunicar accesibilidad

Mientras no exista una auditoría completa y suficiente para sostener una declaración formal, la comunicación pública debe utilizar expresiones como:

- "accesibilidad integrada";
- "diseño con criterios de accesibilidad";
- "pruebas automáticas y manuales en evolución".

No debe utilizarse "certificado WCAG", "cumple WCAG" o una afirmación equivalente sin evidencia suficiente que respalde ese nivel de conformidad.
