# Línea base automática de accesibilidad - 2026-08-15

## Alcance

Primera línea base automatizada del ecosistema Neuronova Apps después de incorporar el protocolo sistemático de verificación.

Superficies auditadas:

- Neuronova Apps;
- Quiz Bible;
- Mi Momento;
- Brailux;
- English Fast;
- Sudolux;
- Crucilux;
- Motiva.

## Ejecución

- Workflow: `Accessibility ecosystem audit`.
- GitHub Actions run: `31894009167`.
- Commit auditado: `7738fca0bc76a4873159db1ede036c0559b8061c`.
- Herramientas: Playwright + axe-core.
- Cobertura configurada: reglas automatizables WCAG 2.x A/AA mediante etiquetas `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` y `wcag22aa`.

## Resultado

| Superficie | Estado | Violaciones automáticas | Serias o críticas |
|---|---|---:|---:|
| Neuronova Apps | Auditada | 0 | 0 |
| Quiz Bible | Auditada | 0 | 0 |
| Mi Momento | Auditada | 0 | 0 |
| Brailux | Auditada | 0 | 0 |
| English Fast | Auditada | 0 | 0 |
| Sudolux | Auditada | 0 | 0 |
| Crucilux | Auditada | 0 | 0 |
| Motiva | Auditada | 0 | 0 |

La ejecución terminó correctamente y el workflow registró `success`.

## Interpretación

Este resultado demuestra que, en las páginas incluidas en esta línea base, axe-core no detectó violaciones dentro del subconjunto de criterios que puede evaluar automáticamente con la configuración utilizada.

No demuestra conformidad completa con WCAG ni sustituye pruebas humanas. Permanecen pendientes las verificaciones manuales descritas en `docs/ACCESSIBILITY_AUDIT.md`, especialmente navegación por teclado, lector de pantalla, zoom y reflow, contraste en estados interactivos, reducción de movimiento y uso móvil/táctil.

## Evidencia complementaria

La ejecución generó los artefactos `axe-results.json` y `summary.md` mediante GitHub Actions. Los artefactos de la ejecución se conservan temporalmente según la política del workflow; este registro permanece en el repositorio como evidencia histórica resumida.

## Estado de la revisión

- Auditoría automática: Aprobada.
- Auditoría manual: Pendiente.
- Declaración de conformidad WCAG: No realizada.
