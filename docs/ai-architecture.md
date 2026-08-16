# Arquitectura IA de NeuroNova

## Principio principal

Google AI Studio se usa para diseñar y probar prompts y comportamiento. No es el enlace de producción entre los repositorios.

La ruta de producción es:

`Repositorio web -> índice/banco NeuroNova -> Firebase AI Logic -> Gemini -> respuesta`

## Fuente central

El repo matriz `neuronova-apps/neuronova-apps.github.io` actúa como punto central para la integración web.

- `apps.json`: índice runtime oficial y liviano derivado del Banco Maestro IA v1.12.
- `ai-chat.js`: cliente compartido del chatbot. Carga el índice, identifica la app o el tipo de consulta y envía a Gemini solo el contexto pertinente.
- `ai-chat.css`: interfaz visual compartida.
- `ai-backend.json`: registro técnico del backend Firebase común y de su política de migración.
- Banco Maestro IA v1.12: fuente de verdad completa y auditada para futuras ampliaciones del runtime.

La lógica del chatbot debe tratar el banco como fuente autorizada para cualquier afirmación sobre NeuroNova. Si un dato no está disponible, debe aplicar fallback y no completar con conocimiento general del modelo.

## Relación con los repositorios hermanos

Los sitios web de Sudolux, Brailux, Motiva, Crucilux, Quiz Bible, Mi Momento y English Fast viven bajo el mismo host `neuronova-apps.github.io` en rutas diferentes.

El cliente `ai-chat.js` está preparado para reconocer la ruta actual:

- `/sudolux-app/` -> Sudolux
- `/brailux-app/` -> Brailux
- `/motiva-app/` -> Motiva
- `/crucilux-app/` -> Crucilux
- `/quizbible-app/` -> Quiz Bible
- `/mimomento-app/` -> Mi Momento
- `/englishfast-app/` -> English Fast

Cuando se habilite el asistente en un repo hermano, ese sitio podrá reutilizar el cliente central:

```html
<script type="module" src="https://neuronova-apps.github.io/ai-chat.js"></script>
```

El script consulta siempre el índice central en:

```text
https://neuronova-apps.github.io/apps.json
```

De esta manera no es necesario mantener siete copias distintas del conocimiento común.

## Flujo de una consulta

1. El usuario escribe una pregunta.
2. `ai-chat.js` identifica si menciona una app, solicita el catálogo o está en una web específica.
3. El cliente carga `apps.json` y selecciona únicamente la ficha o fichas necesarias.
4. Construye `CONTEXTO_BANCO_NEURONOVA`.
5. Firebase AI Logic envía la solicitud al modelo Gemini configurado.
6. Gemini recibe instrucciones de no usar conocimiento externo para inventar datos de NeuroNova.
7. La respuesta vuelve al chat.

## AI Studio

AI Studio queda como laboratorio de pruebas. Allí se pueden probar las mismas reglas y fragmentos del banco, pero el sitio publicado no depende de mantener una conversación o archivo abierto en AI Studio.

Los cambios validados en AI Studio deben trasladarse al banco o a las instrucciones de producción. Para instrucciones que deban administrarse fuera del cliente, puede evaluarse Firebase AI Logic Server Prompt Templates antes de producción definitiva.

## Firebase y App Check

La web usa Firebase AI Logic y Firebase App Check. App Check debe mantenerse habilitado para proteger el acceso desde el cliente web. Para desarrollo local se debe usar el proveedor/debug token de App Check en lugar de habilitar `localhost` como dominio de reCAPTCHA.

### Backend Firebase centralizado

El único proyecto Firebase confirmado actualmente en el cliente funcional es `brailux`. Para no interrumpir el chatbot, se conserva temporalmente como backend compartido de la capa IA de NeuroNova.

Esta decisión es de infraestructura y no convierte Brailux en la matriz del ecosistema: NeuroNova continúa siendo la matriz funcional y de contenido. El proyecto Firebase `brailux` actúa únicamente como backend técnico provisional mientras no exista un proyecto Firebase común de NeuroNova confirmado.

Reglas de centralización:

1. Los repos hermanos no deben copiar ni mantener configuraciones Firebase propias para el Asistente NeuroNova.
2. Todos deben consumir el cliente central `https://neuronova-apps.github.io/ai-chat.js`.
3. El estado del backend común queda registrado en `ai-backend.json`.
4. No se cambiará `projectId`, `appId`, API key, clave de App Check ni otros identificadores por valores inventados.
5. Cuando exista un proyecto Firebase definitivo de NeuroNova, la migración se realizará en el repo matriz y los repos hermanos seguirán usando el mismo cliente central.
6. Antes de activar el nuevo backend se verificará App Check, dominios autorizados, Firebase AI Logic y una prueba real de respuesta.

Estado actual: `ACTIVE_SHARED_PROVISIONAL` sobre el proyecto Firebase confirmado `brailux`.

## Próxima ampliación

El índice runtime actual prioriza identidad, catálogo y estado de las siete apps para evitar alucinaciones. La siguiente evolución es publicar una exportación runtime del Banco Maestro IA completo y extender la recuperación selectiva a `intents`, `baseResponses`, `support`, `accessibility`, `securityPrivacy`, `fallbacks` y `resolvers`, manteniendo el mismo contrato de contexto y sin enviar los 261 elementos en cada consulta.
