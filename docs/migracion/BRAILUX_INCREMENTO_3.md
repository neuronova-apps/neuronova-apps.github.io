# Brailux — incremento 3: contenidos educativos copiados
Fecha: 2026-10-19. Estado: COPIA_COMPLETA_DE_ARCHIVOS_TEXTUALES_IDENTIFICADOS_PENDIENTE_DE_PRUEBA_REAL.
Repositorio original: neuronova-apps/brailux-app (solo lectura).
Destino: inclusion-accesibilidad/brailux/ en rama feature/matriz-acordeon-orbitas-fase1.

Páginas web copiadas: aprende.html, que-es-el-braille.html, alfabeto-braille.html, numeros-braille.html, como-aprender-braille.html, ejercicios-braille.html.
Recursos copiados: styles.css, learning-route.css, progress.css, resources.css, script.js, progress.js.
Ya se habían copiado index.html, portal.css, ecosystem-alignment.css, portal.js y assets/brailux-core-mark.svg.
La portada interna enlaza las seis páginas locales de aprendizaje/práctica.

IMPORTANTE: no se ha validado aún el comportamiento en navegador ni todas las rutas de recursos no textuales. No se ha publicado en main ni se han desactivado sitios existentes.

Datos locales: progress.js utiliza localStorage['brailux-progress-v1']. Las dos rutas pertenecen al mismo origen github.io, pero el uso exacto y las posibles claves de los demás scripts deberán analizarse antes de afirmar continuidad de avances. Conservar URL antigua hasta confirmar equivalencia y verificar el estado del usuario en ambas versiones. No limpiar ni migrar datos automáticamente.

Siguiente paso: auditoría estática detallada y pruebas de navegador en rama, corrección de rutas o dependencias faltantes, luego PR controlado.
