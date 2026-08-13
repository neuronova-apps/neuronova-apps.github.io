# Accesibilidad compartida de Neuronova Apps

Neuronova Apps utiliza un núcleo central de accesibilidad alojado en el repositorio matriz. Las aplicaciones del ecosistema deben consumir este módulo en lugar de crear implementaciones independientes.

## Archivos centrales

```text
/assets/accessibility/accessibility.css
/assets/accessibility/accessibility.js
```

Direcciones públicas previstas:

```text
https://neuronova-apps.github.io/assets/accessibility/accessibility.css
https://neuronova-apps.github.io/assets/accessibility/accessibility.js
```

## Funciones disponibles

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

Cada página puede cargar directamente los archivos centrales:

```html
<link rel="stylesheet" href="https://neuronova-apps.github.io/assets/accessibility/accessibility.css">
<script src="https://neuronova-apps.github.io/assets/accessibility/accessibility.js" defer></script>
```

También puede utilizarse un cargador JavaScript local cuando la arquitectura de la aplicación lo requiera. El recurso final siempre debe proceder del repositorio matriz.

## Comportamiento del foco en la matriz

El núcleo compartido mantiene la preferencia `focus` con dos estados: `strong` y `normal`. El modo reforzado aplica un contorno de alto contraste a los elementos que reciben foco mediante teclado.

La página matriz carga adicionalmente `focus-fix.css` para restablecer el estilo de foco normal del navegador cuando la preferencia reforzada está desactivada. Esta hoja es un ajuste local del portal raíz y no forma parte de los dos archivos centrales indicados anteriormente.

Las aplicaciones que consumen únicamente `accessibility.css` y `accessibility.js` no cargan automáticamente `focus-fix.css`. La integración compartida debe seguir considerando como núcleo oficial únicamente los recursos ubicados en `/assets/accessibility/`.

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

Antes de incorporar nuevas funciones deben priorizarse utilidad, simplicidad y compatibilidad. Entre las ampliaciones que pueden evaluarse se encuentran lectura en voz alta, modo de lectura simplificada, control de ancho de línea y preferencias visuales adicionales.
