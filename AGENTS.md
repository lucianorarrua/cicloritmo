# AGENTS.md

## Project: CicloRitmo

Single-file web application (index.html) for indoor cycling training.

## Tech Stack
- HTML5 + Tailwind CSS (CDN) + Vanilla JS (ES6+)
- Web Audio API for sound synthesis
- No build step, no dependencies

## Development Rules
- All code lives in a single `index.html` file
- JavaScript is inline in `<script>` tags, structured with modules/IIFE patterns
- CSS uses Tailwind utility classes; custom styles in `<style>` tag
- Use `Share Tech Mono` for timers/metrics, `Plus Jakarta Sans` for UI text
- Mobile-first: no scroll, full viewport height, thumb-friendly controls

## Architecture
- 5 virtual screens controlled via display block/none:
  - `#screen-selector`: Routine selection with category filter tabs
  - `#screen-preworkout`: Pre-start details and audio options
  - `#screen-creator`: Custom routine builder
  - `#screen-workout`: Active workout console (fullscreen)
  - `#screen-summary`: Post-workout stats report
- State management: in-memory objects
- Audio: synthesized via OscillatorNode + GainNode (no external files)

## Commands
- `npm run lint`: Not configured yet
- `npm run typecheck`: Not applicable (Vanilla JS)
