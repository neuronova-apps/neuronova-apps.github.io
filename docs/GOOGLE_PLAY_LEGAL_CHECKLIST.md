# Google Play legal checklist - NeuroNova Apps

Última revisión: 2026-08-24

Este documento distingue requisitos de Google Play de los elementos jurídicos y operativos adoptados como estándar interno de NeuroNova Apps. Crear estas páginas no sustituye las declaraciones ni configuraciones que deben completarse en Play Console para cada aplicación.

## Fuentes oficiales revisadas

- Google Play Developer Program Policies / User Data: https://support.google.com/googleplay/android-developer/answer/10144311
- Developer Program Policy: https://support.google.com/googleplay/android-developer/answer/17190352
- Data safety: https://support.google.com/googleplay/android-developer/answer/10787469
- Account deletion: https://support.google.com/googleplay/android-developer/answer/13327111
- App support and store listing contact details: https://support.google.com/googleplay/android-developer/answer/113477
- Policy announcement, 15 July 2026: https://support.google.com/googleplay/android-developer/answer/17134731

## Obligatorio para todas las apps

- [ ] Política de privacidad completa y exacta para la app.
- [ ] Política accesible desde la aplicación.
- [ ] URL pública, activa, sin georrestricción y no PDF declarada en Play Console.
- [ ] Sección "Seguridad de los datos" coherente con el código, los SDK y la política de privacidad.
- [ ] Correo electrónico de contacto configurado en la ficha de Google Play.
- [ ] La política identifica a la aplicación o al desarrollador y proporciona un punto de contacto de privacidad.
- [ ] La política describe acceso, recopilación, uso, compartición, terceros, seguridad, conservación y eliminación cuando corresponda.

## Condicional

- [ ] Si la app permite crear cuentas: opción clara para solicitar eliminación dentro de la app.
- [ ] Si la app permite crear cuentas: recurso web externo funcional para solicitar eliminación y URL declarada en Play Console.
- [ ] Si se conservan datos tras una solicitud de eliminación por un motivo legítimo: explicar qué se conserva, por qué y durante cuánto tiempo.
- [ ] Revisar requisitos específicos cuando existan datos sensibles, permisos restringidos, publicidad, menores, salud, finanzas u otras categorías reguladas.
- [ ] Revisar integraciones de IA de terceros: desde julio de 2026 Google aclara que las obligaciones de User Data también se aplican a estas integraciones.

## Recomendado o estándar NeuroNova

- [x] Sitio web central de soporte preparado.
- [x] Términos y condiciones generales preparados.
- [x] Página matriz de licencias y atribuciones preparada.
- [x] Sección para reportar problemas preparada.
- [x] Página central de aplicaciones preparada para incorporar enlaces de Google Play sin rediseño.
- [x] Archivo central `config/legal-links.json` preparado.
- [x] Archivo `config/apps-links.json` preparado.

## Pendiente por aplicación antes de usar una política central en Play Console

Auditar el código Android real y documentar: SDK, Firebase, APIs, publicidad, autenticación, almacenamiento local/remoto, analítica, permisos, servicios de terceros, transmisión de datos, retención y eliminación. Las políticas web existentes no deben asumirse automáticamente como válidas para la versión Android.

Sudolux mantiene su política web existente en `sudolux-app/privacy/`. La ruta central `privacy/sudolux/` conserva ese alcance verificado, pero deberá revisarse de nuevo contra el código Android antes de utilizarse en una ficha de Google Play.
