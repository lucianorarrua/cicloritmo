import { useApp, SCREENS } from '../state/store.jsx';
import { formatTime } from '../utils/time.js';

export function Summary() {
  const { state, actions } = useApp();
  const { globalTimeElapsed, estimatedCalories, estimatedDistance, activeRoutine } = state;

  const avgResistance = activeRoutine?.intervals.length
    ? activeRoutine.intervals.reduce((acc, c) => acc + c.res, 0) / activeRoutine.intervals.length
    : 0;

  return (
    <div class="max-w-md mx-auto w-full flex flex-col items-center gap-6 py-8">
      <div class="w-24 h-24 rounded-full bg-clay-surface-soft border border-clay-hairline flex items-center justify-center">
        <svg class="w-12 h-12 text-clay-ink" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      </div>

      <div class="text-center">
        <h2 class="display-heading text-3xl text-clay-ink">¡Rutina Completada!</h2>
        <p class="text-clay-muted mt-2 text-sm">¡Excelente trabajo! Aquí tienes tu resumen.</p>
      </div>

      <div class="bg-clay-surface-card p-6 rounded-3xl border border-clay-hairline w-full">
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-clay-surface-soft p-4 rounded-2xl border border-clay-hairline">
            <p class="text-[10px] font-bold text-clay-muted uppercase tracking-widest">Tiempo de Pedaleo</p>
            <p class="text-2xl font-black font-mono mt-1 text-clay-ink">{formatTime(globalTimeElapsed)}</p>
          </div>

          <div class="bg-clay-surface-soft p-4 rounded-2xl border border-clay-hairline">
            <p class="text-[10px] font-bold text-clay-muted uppercase tracking-widest">Calorías Quemadas</p>
            <p class="text-2xl font-black font-mono mt-1 text-clay-error">{Math.round(estimatedCalories)} kcal</p>
          </div>

          <div class="bg-clay-surface-soft p-4 rounded-2xl border border-clay-hairline">
            <p class="text-[10px] font-bold text-clay-muted uppercase tracking-widest">Distancia Aprox.</p>
            <p class="text-2xl font-black font-mono mt-1 text-clay-ink">{estimatedDistance.toFixed(2)} km</p>
          </div>

          <div class="bg-clay-surface-soft p-4 rounded-2xl border border-clay-hairline">
            <p class="text-[10px] font-bold text-clay-muted uppercase tracking-widest">Esfuerzo Promedio</p>
            <p class="text-2xl font-bold font-mono mt-1 text-clay-brand-ochre">Fuerza {avgResistance.toFixed(1)}/10</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => actions.setScreen(SCREENS.SELECTOR)}
        class="w-full py-3.5 rounded-xl bg-clay-ink text-white font-bold text-sm hover:opacity-90 transition"
      >
        Volver al Menú Principal
      </button>
    </div>
  );
}
