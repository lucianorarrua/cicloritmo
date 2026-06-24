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

# Instalar dependencias y construir
npm install
npm run build    # genera dist/

# Servir en desarrollo
npm run dev
```

## Deploy

El proyecto es estático. Cualquier plataforma de hosting estático funciona (Cloudflare Pages, Vercel, Netlify, GitHub Pages, etc).

### Cloudflare Pages

```bash
# Build
npm run build

# Deploy manual (CLI)
npx wrangler pages deploy dist --project-name=<nombre-del-proyecto>

# O conectá el repo en dash.cloudflare.com para deploy automático en cada push.
```


## Licencia

MIT
