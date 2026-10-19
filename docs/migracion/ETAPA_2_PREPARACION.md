# Etapa 2 - Protección y preparación de migración

Fecha: 2026-10-19. Alcance exclusivo: cuenta neuronova-apps.

## Arquitectura aprobada
- Matriz pública: neuronova-apps/neuronova-apps.github.io.
- Categorías: inclusión y accesibilidad (Brailux, RutinaGo, ComunicaGo); bienestar personal (Motiva); desarrollo espiritual (QuizBible, MiMomento); educación y aprendizaje (EnglishFast, Crucilux, Sudolux).
- Los nueve repositorios de aplicaciones conservan código, historia y control de versiones. Las páginas individuales solo podrán retirarse tras verificar la representación y funcionalidad centralizadas, privacidad, enlaces y conservación de datos.

## Referencias de integridad comprobadas
- Matriz main antes de modificar la rama de migración: 2e5d95e019794b92c7389a9bbac9880140aa912c.
- Rama de referencia: backup/pre-migracion-2026-10-19. Verificada idéntica a main (0 cambios) antes de crear este documento.
- Rama de trabajo: chore/migracion-matriz-cuatro-categorias. Verificada idéntica a main (0 cambios) antes de crear este documento.
- brailux-app main: 5c853a3ffd29bd1019205eab10c5515a82d53cfe
- rutina-go main: 684a31368b92b5c303b2480c02bd42761e62d4b2
- comunica-go main: 95f78ed44cb82a9813cf8f6018e43754e67cee79
- motiva-app main: d05c8d22e377fe1144d4a83dbbc18c9ad63b3f9a
- quizbible-app main: 03c2252f1c374c5cf0c135eef91582e06ce5ea32
- mimomento-app main: a1233b0bf863901150411ef1b75b48dbc9112489
- englishfast-app main: 88f0092f52688a5c840c0c8c4a1e4086a3db07f7
- crucilux-app main: 2d066cf768b9bbf0acf02baf36b94003adfca57d
- sudolux-app main: c7e05a313f7839e0d500f37d61052e1339847c95

## Controles pendientes (no declararlos aprobados)
1. Respaldos completos independientes recuperables: NO VERIFICADOS. Una rama Git no equivale a copia externa de toda la historia. El entorno actual no puede acceder por git a github.com (resolución DNS fallida). Preparar y comprobar bundles/clones completos en equipo o entorno con acceso.
2. RutinaGo: existe antecedente de divergencia y push remoto fallido; el commit remoto listado aquí NO certifica que el historial local 3cd7cf2e984af5c028bfb6cb355dd023f14e09f9 esté publicado. No forzar push, reset ni rebase. Verificar respaldo local antes de intervención.
3. GitHub Pages individuales: no desactivar hasta pruebas de URLs, datos, licencias, privacidad, cookies y recursos. No se verificaron exhaustivamente mediante lectura API.
4. Apps web con datos locales: validar las claves quizbible-progress-v1, mimomento-local-v1, ef-item-progress-v1, crucilux-progress-v1, sudolux-demo-v1 y neuronova-a11y-v1. Probar continuidad/restauración.
5. neuronova-agente: revisar existencia y permisos antes de delegar trabajos.

## Estado
ETAPA_2_PREPARACION_PARCIAL_CON_BLOQUEOS_DOCUMENTADOS.
Ningún archivo ni configuración en main de los repositorios de aplicaciones o de la matriz debe cambiarse por este informe. Ninguna página se desactiva.
