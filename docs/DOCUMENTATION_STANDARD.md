# Estándar de documentación de Neuronova Apps

## Propósito

Este documento establece la estructura mínima de documentación para la matriz Neuronova Apps y para cada aplicación del ecosistema. Su finalidad es mantener información comparable, actualizada y verificable entre repositorios independientes.

La documentación debe describir el estado real del proyecto. No debe presentar como disponible una función futura ni mantener como pendiente una función que ya se encuentra publicada.

## Principios

La documentación del ecosistema se rige por cinco criterios: claridad, correspondencia con la implementación, actualización periódica, separación entre estado actual y roadmap, y lenguaje prudente en accesibilidad, privacidad, salud, educación o cualquier afirmación que requiera evidencia.

`apps.json` continúa siendo la fuente de verdad de la matriz para estado resumido, disponibilidad y enlaces. El README de cada aplicación conserva el detalle técnico de su propio repositorio.

## Perfil de aplicación

Todo README de una aplicación debe incluir, como mínimo, estas secciones con los mismos encabezados:

1. `## Estado del proyecto`
2. `## Alcance actual`
3. `## Funciones disponibles`
4. `## Tecnología`
5. `## Accesibilidad`
6. `## Privacidad`
7. `## Limitaciones conocidas`
8. `## Roadmap`
9. `## Desarrollo local`
10. `## Estructura principal`
11. `## Enlaces`
12. `## Neuronova Apps`
13. `## Autoría`
14. `## Última revisión`

Pueden añadirse secciones específicas, por ejemplo modelo editorial, fuentes, guías públicas o presentación social, siempre que no sustituyan las secciones obligatorias.

## Perfil de matriz

El README de la matriz debe incluir, como mínimo:

1. `## Estado`
2. `## Alcance actual`
3. `## Arquitectura`
4. `## Accesibilidad`
5. `## Gobernanza documental`
6. `## Limitaciones conocidas`
7. `## Roadmap`
8. `## Repositorios de aplicaciones`
9. `## Sitio principal`
10. `## Autoría`
11. `## Última revisión`

La matriz puede mantener secciones adicionales sobre iniciativa, propósito, ecosistema y arquitectura compartida.

## Contenido esperado

`Estado del proyecto` debe indicar la etapa web real, la publicación actual y, cuando corresponda, el estado separado de Android u otras plataformas.

`Alcance actual` define qué problema resuelve hoy el proyecto y qué queda fuera de su alcance. Debe evitar promesas que todavía no estén implementadas.

`Funciones disponibles` enumera únicamente funciones utilizables en la versión pública o en la rama descrita.

`Tecnología` identifica las tecnologías necesarias para comprender y ejecutar el proyecto.

`Accesibilidad` describe las medidas implementadas y diferencia claramente entre integración, auditoría automática, revisión manual y cualquier eventual declaración de conformidad.

`Privacidad` resume el tratamiento actual de datos y enlaza la política pública cuando exista.

`Limitaciones conocidas` registra restricciones funcionales, de contenido, pruebas, plataformas o infraestructura que sean relevantes para interpretar el estado actual.

`Roadmap` incluye únicamente líneas previstas y debe distinguirlas de funciones ya disponibles.

`Última revisión` utiliza fecha ISO `AAAA-MM-DD` y representa la fecha en que se comprobó que el README seguía describiendo el estado real del proyecto.

## Reglas de actualización

Cuando una función cambia de estado, se actualiza primero el repositorio responsable. Si el cambio afecta la presentación en la matriz, también se actualiza `apps.json`.

Una modificación importante de arquitectura, privacidad, accesibilidad o alcance debe reflejarse en el README dentro del mismo ciclo de cambio.

No se debe actualizar la fecha de revisión sin comprobar el contenido del documento.

## Control automático

La matriz mantiene `scripts/documentation-audit.mjs` y `.github/workflows/documentation-standard.yml`. El control consulta los README públicos de la matriz y las siete aplicaciones y comprueba la presencia de las secciones obligatorias y una fecha de revisión válida.

El control documental no demuestra que todo el contenido sea verdadero por sí mismo. Su función es detectar desviaciones estructurales y documentación sin fecha de revisión para facilitar una inspección humana posterior.

## Plantilla

La plantilla base para nuevas aplicaciones se encuentra en `docs/README_TEMPLATE.md`.
