# Arquitectura IA de NeuroNova

## Principio principal

Google AI Studio se usa para diseñar y probar prompts y comportamiento. No es el enlace de producción entre los repositorios.

La ruta de producción es:

`Repositorio web -> runtime del Banco Maestro -> selector de contexto -> Firebase AI Logic -> Gemini -> respuesta`

## Fuente central

El repo matriz `neuronova-apps/neuronova-apps.github.io` actúa como punto central para la integración web.

- `apps.json`: índice liviano usado por la matriz web para estados y tarjetas de las aplicaciones.
- `ai/runtime/manifest.json`: manifiesto del runtime IA derivado del Banco Maestro v1.12.
- `ai/runtime/*.json`: fragmentos auditados de instrucciones, identidad, apps, intenciones, respuestas base, soporte, accesibilidad, seguridad/privacidad, fallback y resolutores.
- `ai/runtime-selector.js`: detecta la intención y selecciona únicamente los registros pertinentes para cada consulta.
- `ai/ai-chat-runtime.js`: carga el manifiesto y sus fragmentos una sola vez, valida los conteos y envía a Gemini solo el contexto seleccionado.
- `ai-chat.js`: cargador estable del cliente central.
- `ai-chat.css`: interfaz visual compartida.
- `ai-backend.json`: registro técnico del backend Firebase común y de su política de migración.
- Banco Maestro IA v1.12: fuente de verdad completa y auditada.

El runtime contiene 252 registros operativos y 9 resolutores, pero el selector no envía los 261 elementos completos en cada consulta. Solo incorpora los registros que correspondan a la intención, app y contexto detectados.

## Relación con los repositorios hermanos

Los sitios web de Sudolux, Brailux, Motiva, Crucilux, Quiz Bible, Mi Momento y English Fast viven bajo el mismo host `neuronova-apps.github.io` en rutas diferentes.

El selector reconoce estas rutas:

- `/sudolux-app/` -> Sudolux
- `/brailux-app/` -> Brailux
- `/motiva-app/` -> Motiva
- `/crucilux-app/` -> Crucilux
- `/quizbible-app/` -> Quiz Bible
- `/mimomento-app/` -> Mi Momento
- `/englishfast-app/` -> English Fast

Cuando se habilite el asistente en un repo hermano, el sitio deberá reutilizar el cliente central:

```html
<script type="module" src="https://neuronova-apps.github.io/ai-chat.js"></script>
```

De esta manera no es necesario mantener siete copias distintas del conocimiento ni siete configuraciones independientes del asistente.

## Flujo de una consulta

1. El usuario escribe una pregunta.
2. El cliente central carga `ai/runtime/manifest.json` y valida que corresponda al Banco Maestro v1.12.
3. Los fragmentos del runtime se combinan en memoria y se validan contra los conteos auditados.
4. `runtime-selector.js` identifica la app, la intención y el tipo de consulta.
5. Se recuperan únicamente reglas, fichas, respuestas, soporte, accesibilidad, seguridad y fallback pertinentes.
6. El cliente construye `CONTEXTO_BANCO_NEURONOVA`.
7. Firebase AI Logic envía la solicitud a Gemini.
8. Gemini debe responder usando ese contexto como fuente autorizada para cualquier hecho sobre NeuroNova.

Si el banco o un fragmento no puede cargarse, el cliente no debe completar hechos de NeuroNova mediante conocimiento general del modelo.

## Seguridad y privacidad

El runtime público no debe contener contraseñas, tokens, claves privadas, credenciales de cuentas de servicio, datos personales de usuarios ni conversaciones privadas. Las reglas de seguridad del banco tienen prioridad sobre soporte y respuestas funcionales.

El chat muestra además una advertencia explícita para que el usuario no comparta contraseñas, códigos, tokens ni datos sensibles.

## AI Studio

AI Studio queda como laboratorio de pruebas. Allí se pueden probar las mismas reglas y fragmentos del banco, pero el sitio publicado no depende de mantener una conversación o archivo abierto en AI Studio.

Los cambios validados en AI Studio deben trasladarse al Banco Maestro o a las instrucciones de producción. Para instrucciones administradas fuera del cliente puede evaluarse Firebase AI Logic Server Prompt Templates antes de una producción definitiva.

## Firebase y App Check

La web usa Firebase AI Logic y Firebase App Check. App Check debe mantenerse habilitado para proteger el acceso desde el cliente web.

### Backend Firebase centralizado

El único proyecto Firebase confirmado actualmente en el cliente funcional es `brailux`. Para no interrumpir el chatbot, se conserva temporalmente como backend compartido de la capa IA de NeuroNova.

Esta decisión es de infraestructura y no convierte Brailux en la matriz del ecosistema: NeuroNova continúa siendo la matriz funcional y de contenido. El proyecto Firebase `brailux` actúa únicamente como backend técnico provisional mientras no exista un proyecto Firebase común de NeuroNova confirmado.

Reglas de centralización:

1. Los repos hermanos no deben copiar ni mantener configuraciones Firebase propias para el Asistente NeuroNova.
2. Todos deben consumir el cliente central `https://neuronova-apps.github.io/ai-chat.js`.
3. El estado del backend común queda registrado en `ai-backend.json`.
4. No se cambiarán `projectId`, `appId`, claves Firebase, claves de sitio de App Check ni otros identificadores por valores inventados.
5. Cuando exista un proyecto Firebase definitivo de NeuroNova, la migración se realizará en el repo matriz.
6. Antes de activar un backend nuevo se verificarán App Check, dominios autorizados, Firebase AI Logic y una prueba real de respuesta.

Estado actual: `ACTIVE_SHARED_PROVISIONAL` sobre el proyecto Firebase confirmado `brailux`.

## Siguiente etapa

Después de validar este runtime en la matriz, el siguiente paso es conectar los repos hermanos uno por uno al cliente central, empezando por una sola app piloto y comprobando que la detección de ruta y el contexto específico funcionen antes de extenderlo a las demás.
