# Etapa 5 — Auditoría y validación de Motiva

Estado: AUDITORÍA ESTÁTICA COMPLETADA; VALIDACIÓN EN NAVEGADOR PENDIENTE
Destino: bienestar-personal/motiva/
Repositorio original motiva-app: solo lectura.

## Archivos auditados
index.html; styles.css; hero-orbit.css; ecosystem-alignment.css; script.js; favicon.svg.

## Verificaciones realizadas
- Existen las seis dependencias locales directas declaradas por HTML y CSS.
- Enlaces internos de sección mediante #id resuelven a elementos existentes.
- Los selectores por ID utilizados por script.js corresponden a elementos presentes en index.html.
- No se detectaron ID duplicados en la página.
- La tarjeta Motiva en bienestar-personal/index.html enlaza con ./motiva/index.html.
- Estilos y script global de accesibilidad siguen ligados a la matriz institucional.
- Se corrigieron las referencias @id y url del JSON-LD generado en script.js que seguían apuntando a /motiva-app/. Los recursos gráficos OG y política de privacidad permanecen enlazados al sitio original deliberadamente.

## Límites
No se ejecutaron pruebas con DOM real, consola, navegadores móviles, teclado, lector de pantalla ni comparaciones visuales. La nueva ruta permanece en una rama no desplegada públicamente; NO afirmar que las frases, filtros, botones y órbitas funcionan allí sin prueba de navegador.

## Siguientes controles obligatorios
1. Probar frase diaria, cambio de frase, filtros de categoría, exploración, selección de necesidades, menú móvil y navegación entre matriz/categoría/app.
2. Probar anchos 320/375/768/1024/1440, teclado, contraste, zoom y movimiento reducido.
3. Revisar consola y recursos; ejecutar comprobaciones de PR.
4. Solo después fusionar y comprobar sitio desplegado; no retirar sitio original.

No hubo cambios en main ni en motiva-app.
