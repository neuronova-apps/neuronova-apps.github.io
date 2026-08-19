# Migración segura de NeuroNova a Gemini Developer API

## Estado actual

El chatbot de NeuroNova usa el SDK web de Firebase AI Logic y `GoogleAIBackend()`. Esa inicialización corresponde a Gemini Developer API a través de Firebase AI Logic.

El proyecto Firebase activo sigue siendo `brailux` de forma provisional. Se mantiene para no interrumpir el chatbot mientras se configura un proyecto Firebase definitivo para NeuroNova.

## Regla de seguridad

No se debe copiar una clave Gemini creada en Google AI Studio dentro de HTML, JavaScript, JSON, variables globales del navegador ni archivos versionados en GitHub.

La configuración `firebaseConfig.apiKey` del cliente web es una clave de configuración de Firebase y no debe sustituirse por una clave Gemini de AI Studio.

## Arquitectura objetivo

`Chatbot NeuroNova -> Firebase AI Logic -> Gemini Developer API -> modelo Gemini`

Firebase App Check debe mantenerse habilitado para el dominio público de NeuroNova.

## Datos necesarios para el cambio definitivo

1. Proyecto Firebase definitivo de NeuroNova.
2. Aplicación web registrada dentro de ese proyecto.
3. Firebase AI Logic habilitado con Gemini Developer API.
4. App Check configurado para `neuronova-apps.github.io`.
5. Configuración web emitida por Firebase: `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId` y `appId`.
6. Site key de reCAPTCHA Enterprise usada por App Check.

## Archivos que se modificarán en el cambio definitivo

- `ai/ai-config.js`: sustituir únicamente la configuración Firebase provisional por los valores emitidos para NeuroNova.
- `ai-backend.json`: cambiar `activeFirebaseProjectId` y `backendStatus` para registrar el backend definitivo.

No es necesario reescribir `ai/ai-chat-runtime.js` para pasar a Gemini Developer API porque ya inicializa Firebase AI Logic mediante `GoogleAIBackend()`.

## Validación posterior

Después del cambio definitivo se debe comprobar:

- carga correcta del Banco Maestro IA;
- respuestas locales sin consumo generativo cuando corresponda;
- consultas generativas mediante Gemini Developer API;
- funcionamiento de App Check en producción;
- tratamiento de errores 429 y límites preventivos de sesión;
- funcionamiento del cliente central desde los repos hermanos.
