# Neuronova Apps

Neuronova Apps es una iniciativa personal e independiente orientada al desarrollo progresivo de aplicaciones web con propósitos diversos: accesibilidad, aprendizaje, bienestar, espiritualidad y entretenimiento.

La plataforma funciona como una matriz principal que reúne proyectos independientes bajo una misma identidad. Cada aplicación evoluciona en su propio repositorio y mantiene un acceso centralizado desde la web principal de Neuronova Apps.

## Iniciativa

El proyecto nace como una iniciativa personal de Gabriel Berrospi, con el propósito de explorar, diseñar y desarrollar soluciones digitales útiles, sencillas y accesibles. Neuronova Apps no corresponde a una institución ni representa oficialmente a una entidad pública o privada.

## Propósito

El propósito de Neuronova Apps es construir un ecosistema de aplicaciones que pueda crecer de manera gradual, priorizando una experiencia clara, compatibilidad con distintos dispositivos, organización modular y criterios de accesibilidad compartidos.

## Ecosistema actual

La matriz reúne siete aplicaciones:

- **Quiz Bible:** aprendizaje bíblico mediante preguntas, revisión progresiva y desafíos breves.
- **Mi Momento:** devocionales, oraciones, diario personal y seguimiento espiritual.
- **Brailux:** conocimiento, aprendizaje y práctica del sistema Braille.
- **English Fast:** aprendizaje de inglés mediante teoría breve, práctica y multijuegos.
- **Sudolux:** Sudoku orientado al entretenimiento y al ejercicio de la lógica.
- **Crucilux:** crucigramas y retos de vocabulario para ejercitación verbal.
- **Motiva:** frases motivacionales y reflexivas para distintos momentos del día.

## Arquitectura

La página matriz se publica desde este repositorio. Cada aplicación mantiene un repositorio independiente para evitar acoplamientos innecesarios y permitir que su desarrollo, pruebas y despliegues evolucionen por separado.

El núcleo compartido de accesibilidad se encuentra en:

```text
assets/accessibility/accessibility.css
assets/accessibility/accessibility.js
```

La página matriz utiliza además `focus-fix.css` como corrección local del comportamiento del foco de teclado cuando la preferencia reforzada está desactivada. Este archivo pertenece únicamente al portal raíz y no forma parte del núcleo compartido que consumen las aplicaciones.

La documentación de integración se encuentra en `docs/ACCESSIBILITY.md`.

El directorio `quiz-bible-banco/` contiene una herramienta editorial de consulta y revisión del Banco Maestro de Quiz Bible. Sus archivos de datos forman parte del flujo de revisión y no deben confundirse con los archivos de presentación de la página matriz.

## Repositorios de aplicaciones

- [Quiz Bible](https://github.com/neuronova-apps/quizbible-app)
- [Mi Momento](https://github.com/neuronova-apps/mimomento-app)
- [Brailux](https://github.com/neuronova-apps/brailux-app)
- [English Fast](https://github.com/neuronova-apps/englishfast-app)
- [Sudolux](https://github.com/neuronova-apps/sudolux-app)
- [Crucilux](https://github.com/neuronova-apps/crucilux-app)
- [Motiva](https://github.com/neuronova-apps/motiva-app)

## Sitio principal

https://neuronova-apps.github.io/

## Desarrollo

Neuronova Apps se encuentra en desarrollo continuo. Las funciones, interfaces, contenidos y características de cada aplicación pueden cambiar durante las etapas de diseño, prueba y mejora.

Los cambios del repositorio matriz deben preservar la independencia de cada aplicación y evitar que estilos o scripts centrales modifiquen de forma accidental su estructura propia.

## Autoría

Proyecto personal desarrollado por Gabriel Berrospi.

## Estado

Proyecto en desarrollo. GitHub se utiliza para documentar su evolución, mantener organizada la arquitectura y conservar una separación clara entre la matriz, los módulos compartidos y las aplicaciones del ecosistema.
