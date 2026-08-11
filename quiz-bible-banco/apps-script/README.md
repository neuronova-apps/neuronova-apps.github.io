# Endpoint de revisión humana de Quiz Bible

Este componente conecta la página pública de revisión con el Google Sheet maestro privado sin exponer permisos de edición en GitHub.

## Despliegue único

1. Abre https://script.google.com y crea un proyecto nuevo.
2. Copia el contenido de `Code.gs` de esta carpeta al archivo `Code.gs` del proyecto.
3. En Configuración del proyecto > Propiedades del script, crea una propiedad:
   - Nombre: `REVIEW_SECRET`
   - Valor: una clave privada larga que solo conozca el revisor.
4. Pulsa Implementar > Nueva implementación > Aplicación web.
5. Ejecutar como: tú mismo.
6. Quién tiene acceso: Cualquiera.
7. Autoriza el acceso solicitado y copia la URL terminada en `/exec`.
8. En la página `/quiz-bible-banco/`, pulsa `Configurar revisión`, pega la URL y escribe la misma clave privada.

La URL se guarda en el navegador. La clave solo se mantiene durante la sesión mediante `sessionStorage`; no se escribe en el repositorio.

## Reglas del endpoint

- `approve`: exige los seis criterios marcados y un revisor. Cambia `Revision_humana` a `Si`, `Estado_QA` a `Verificado` y mantiene `Activa_app` en `No`.
- `correction`: exige una observación. Mantiene `Revision_humana` en `No`, `Estado_QA` en `Revisar` y `Activa_app` en `No`.
- Cada operación se registra en `Registro_revision_humana` con fecha, tradición, ID, libro, referencia, revisor, resultado, observación y criterios.
- La pregunta se localiza por `ID`; no depende del número de fila.
- Se usa `LockService` para evitar escrituras simultáneas conflictivas.

## Seguridad

Nunca incluyas `REVIEW_SECRET` en `index.html`, `script.js`, `review.js` ni en otro archivo público del repositorio. Si sospechas que la clave fue expuesta, sustitúyela en Script Properties.