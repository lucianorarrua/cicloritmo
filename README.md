# CicloRitmo

Entrenador Virtual de Ciclismo de Interior. Aplicación web interactiva de asistencia al entrenamiento en bicicleta estática o de spinning, optimizada para dispositivos móviles y tablets.

## Características

- **Guía visual gigantesca**: RPM, resistencia e instrucciones legibles a distancia durante el ejercicio.
- **Metrónomo audio-visual**: Sincronización exacta entre estímulo visual (rueda) y acústico (tic de cadencia) vía Web Audio API.
- **Rutinas pre-programadas**: 9 rutinas integradas (cardio, HIIT, fuerza, fondo).
- **Creador de rutinas personalizadas**: Compone tus propias sesiones.
- **Métricas en tiempo real**: Calorías, distancia y esfuerzo estimados en vivo.
- **Protección de pantalla**: Doble sistema antibloqueo (Wake Lock API + video fantasma).
- **Single-file offline**: Un solo `index.html` autónomo. Sin dependencias de backend.

## Tecnologías

- HTML5, CSS3 (Tailwind CSS CDN)
- JavaScript ES6+ (Vanilla)
- Web Audio API (síntesis de sonido en tiempo real)
- Google Fonts (Plus Jakarta Sans + Share Tech Mono)

## Desarrollo

```bash
# Clonar
git clone git@github.com:lucianarrua/cicloritmo.git
cd cicloritmo

# La aplicación es un solo archivo. Abrir en el navegador:
open index.html
# o servir con cualquier servidor estático:
npx serve .
```

## Licencia

MIT
