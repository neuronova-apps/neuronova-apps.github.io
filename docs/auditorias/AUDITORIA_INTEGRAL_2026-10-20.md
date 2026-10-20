# Auditoría integral — NeuroNova Apps (20-10-2026)

## Alcance y metodología
Inspección directa de archivos de la rama `main` del repositorio matriz, incluidos las cuatro páginas de categoría, nueve subaccesos y nueve páginas de privacidad. No se modificaron los repositorios de aplicaciones. Las consultas públicas a GitHub Pages por el verificador externo no lograron obtener páginas de categorías; **no equivale a evidencia de 404**. Se requiere ensayo real desde navegador.

## Inventario comprobado
- Inclusión y accesibilidad: Brailux (web), RutinaGo (presentación), ComunicaGo (presentación).
- Bienestar personal: Motiva (web).
- Desarrollo espiritual: QuizBible y MiMomento (web).
- Educación y aprendizaje: EnglishFast, Crucilux y Sudolux (web).
- Categorías 4/4; subaccesos 9/9; rutas de privacidad 9/9 en `main`.

## Hallazgos y acciones
1. [CORREGIDO EN ESTE PR] Portada de matriz: dos enlaces visibles a perfil GitHub, retirados.
2. [CORREGIDO EN ESTE PR] Tarjeta Brailux aún apuntaba a privacidad alojada en `/brailux-app/privacy/` en lugar de `/privacy/brailux/`.
3. [PENDIENTE DE CONTENIDO] Privacidad de Brailux, Motiva, QuizBible, MiMomento, EnglishFast y Crucilux: rutas reservadas de verificación, no políticas centrales completas. Sus políticas web/Android deben contrastarse antes de reemplazar textos legales. ComunicaGo contiene aviso de revisión; RutinaGo contiene descripción provisional del estado Android.
4. [PENDIENTE DE PRUEBA FUNCIONAL] Ejercitar en navegador devocionales, diario y oraciones en MiMomento; juego, teclado, pistas y finalización en Sudolux y Crucilux; ejercicios y progreso de EnglishFast; QuizBible, Brailux y Motiva, incluyendo consola, responsive y alto contraste.
5. [PENDIENTE DE DESPLIEGUE] Comprobar que los últimos merges estén publicados en GitHub Pages y que las rutas respondan 200, desde navegador y/o solicitud HTTP directa.
6. [REVISAR POR SEPARADO] PR #28 de RutinaGo: versión informativa ampliada pendiente de integración. No se fusiona automáticamente dentro de esta auditoría.

## Criterio de cierre
No declarar auditoría totalmente aprobada hasta resolver políticas legales pendientes, prueba funcional, revisión accesible y confirmación de despliegue público.
