# Accesibilidad compartida de Neuronova Apps

Neuronova Apps utiliza un núcleo central de accesibilidad alojado en el repositorio matriz. Las aplicaciones del ecosistema deben consumir este módulo compartido en lugar de mantener copias independientes de sus funciones generales.

## Versión estable actual

La versión estable del núcleo es `v1`.

Archivos versionados:

```text
/assets/accessibility/v1/accessibility.css
/assets/accessibility/v1/accessibility.js
```

Direcciones públicas recomendadas:

```text
https://neuronova-apps.github.io/assets/accessibility/v1/accessibility.css
https://neuronova-apps.github.io/assets/accessibility/v1/accessibility.js
```

Las nuevas integraciones deben utilizar estas rutas versionadas.

## Compatibilidad con integraciones existentes

Las rutas históricas continúan disponibles:

```text
/assets/accessibility/accessibility.css
/assets/accessibility/accessibility.js
```

Estas rutas se conservan como compatibilidad y permanecen ancladas al comportamiento de `v1`. No deben utilizarse para introducir nuevas funciones incompatibles.

De esta forma, una aplicación que todavía consuma las rutas históricas no cambia de comportamiento de manera accidental cuando el núcleo evolucione.

## Política de versiones

`v1` se considera una versión estable e inmutable para cambios incompatibles. Una modificación que pueda alterar el diseño, comportamiento, estados, controles o integración de aplicaciones existentes debe publicarse en una nueva versión, por ejemplo `v2`.

Las correcciones futuras deben seguir estas reglas:

- una mejora incompatible no modifica `v1`;
- una nueva versión se publica en su propio directorio;
- cada aplicación decide cuándo migrar a una versión nueva;
- la migración debe probarse antes de cambiar la URL utilizada por la aplicación;
- las rutas históricas permanecen asociadas a `v1` para preservar compatibilidad;
- `assets/accessibility/manifest.json` registra la versión estable y las rutas oficiales.

El flujo `.github/workflows/accessibility-core-guard.yml` protege los archivos de `v1` y comprueba que las rutas históricas sigan siendo idénticas a esa versión. Si un cambio altera accidentalmente el núcleo estable, la comprobación falla antes de considerar el cambio compatible.

## Funciones disponibles en v1

El módulo incorpora:

- tamaño de texto en tres niveles: normal, grande y extra grande;
- modo día para páginas de tema oscuro, con ocultamiento automático del control cuando la página ya es clara o deshabilita esta opción;
- alto contraste;
- espaciado ampliado entre letras y palabras;
- interlineado amplio;
- configuración de lectura amigable para personas con dislexia, basada en tipografía sans serif clara, mayor interlineado y espaciado;
- guía horizontal de lectura;
- resaltado de enlaces;
- reducción de movimiento y animaciones;
- foco de teclado reforzado;
- restablecimiento de preferencias;
- atajo de teclado `Alt + A` para abrir el panel;
- persistencia de preferencias mediante `localStorage`.

Las preferencias se guardan bajo la clave:

```text
neuronova-a11y-v1
```

Al utilizar GitHub Pages bajo el mismo origen `neuronova-apps.github.io`, las preferencias pueden conservarse cuando el usuario navega entre la página matriz y las aplicaciones publicadas como subrutas del mismo dominio.

## Integración recomendada

Cada nueva página debe cargar explícitamente `v1`:

```html
<link rel="stylesheet" href="https://neuronova-apps.github.io/assets/accessibility/v1/accessibility.css">
<script src="https://neuronova-apps.github.io/assets/accessibility/v1/accessibility.js" defer></script>
```

También puede utilizarse un cargador JavaScript local cuando la arquitectura de una aplicación lo requiera. El recurso compartido final debe proceder del repositorio matriz y apuntar a una versión explícita.

## Migración a una versión futura

Cuando exista una versión nueva, la aplicación no debe migrar automáticamente. El cambio recomendado es deliberado:

```text
v1 -> pruebas de integración -> validación de accesibilidad -> v2
```

La versión anterior debe continuar disponible durante el periodo de transición. Esto permite corregir o revertir una migración sin afectar a las demás aplicaciones del ecosistema.

## Comportamiento del foco

El núcleo compartido mantiene la preferencia `focus` con dos estados: `strong` y `normal`. El modo reforzado aplica un contorno amarillo de alto contraste a los elementos que reciben foco mediante teclado.

Cuando la preferencia se establece en `normal`, el núcleo deja de imponer ese contorno y permite que cada página o el navegador utilicen su estilo de foco habitual. Esta lógica forma parte directamente de `accessibility.css`, por lo que la matriz y las aplicaciones que consumen el núcleo compartido reciben el mismo comportamiento sin hojas de corrección adicionales.

## Principios

El panel debe mantenerse:

- visible sin interferir con el contenido;
- operable mediante teclado;
- comprensible sin depender únicamente de iconos;
- adaptable a dispositivos móviles;
- compatible con lectores de pantalla mediante nombres y estados accesibles;
- coherente visualmente con la identidad tecnológica de Neuronova Apps.

El módulo central no sustituye la accesibilidad semántica propia de cada aplicación. Cada proyecto debe mantener encabezados jerárquicos, etiquetas de formularios, textos alternativos, estados ARIA cuando correspondan, orden lógico del foco y controles nativos siempre que sea posible.

## Evolución prevista

Antes de incorporar nuevas funciones deben priorizarse utilidad, simplicidad, compatibilidad y pruebas. Entre las ampliaciones que pueden evaluarse se encuentran lectura en voz alta, modo de lectura simplificada, control de ancho de línea y preferencias visuales adicionales. Si una ampliación modifica el contrato actual del núcleo, debe incorporarse en una nueva versión y no directamente en `v1`.
