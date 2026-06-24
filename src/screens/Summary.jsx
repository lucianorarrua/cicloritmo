import { useApp, SCREENS } from '../state/store.jsx';
import { formatTime } from '../utils/time.js';

export function Summary() {
  const { state, actions } = useApp();
  const { globalTimeElapsed, estimatedCalories, estimatedDistance, activeRoutine } = state;

  const avgResistance = activeRoutine?.intervals.length
    ? activeRoutine.intervals.reduce((acc, c) => acc + c.res, 0) / activeRoutine.intervals.length
    : 0;

  return (
    <div class="max-w-sm mx-auto w-full flex flex-col items-center gap-6 py-4">
      {/* Trophy */}
      <div class="w-20 h-20 rounded-full bg-clay-surface-card border border-clay-hairline flex items-center justify-center">
        <svg class="w-10 h-10 text-clay-ink" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      </div>

      {/* Title */}
      <div class="text-center space-y-1.5">
        <h2 class="display-md text-clay-ink">Rutina Completada</h2>
        <p class="text-sm text-clay-muted">Excelente trabajo. Aqu&iacute; tienes tu resumen.</p>
      </div>

      {/* Stats grid */}
      <div class="bg-clay-surface-card rounded-3xl border border-clay-hairline p-5 w-full">
        <div class="grid grid-cols-2 gap-2.5">
          <div class="bg-clay-canvas rounded-2xl border border-clay-hairline p-3.5 text-center">
            <p class="text-[10px] font-bold text-clay-muted uppercase tracking-[0.08em]">Tiempo</p>
            <p class="text-xl font-bold font-mono text-clay-ink mt-0.5 tabular-nums">{formatTime(globalTimeElapsed)}</p>
          </div>

          <div class="bg-red-50 rounded-2xl border border-red-100 p-3.5 text-center">
            <p class="text-[10px] font-bold text-red-500 uppercase tracking-[0.08em]">Calor&iacute;as</p>
            <p class="text-xl font-bold font-mono text-red-600 mt-0.5 tabular-nums">
              {Math.round(estimatedCalories)}<span class="text-xs font-medium"> kcal</span>
            </p>
          </div>

          <div class="bg-clay-canvas rounded-2xl border border-clay-hairline p-3.5 text-center">
            <p class="text-[10px] font-bold text-clay-muted uppercase tracking-[0.08em]">Distancia</p>
            <p class="text-xl font-bold font-mono text-clay-ink mt-0.5 tabular-nums">
              {estimatedDistance.toFixed(2)}<span class="text-xs text-clay-muted"> km</span>
            </p>
          </div>

          <div class="bg-clay-brand-ochre/15 rounded-2xl border border-clay-brand-ochre/30 p-3.5 text-center">
            <p class="text-[10px] font-bold text-clay-brand-ochre uppercase tracking-[0.08em]">Esfuerzo Prom.</p>
            <p class="text-xl font-bold font-mono text-clay-ink mt-0.5 tabular-nums">
              {avgResistance.toFixed(1)}<span class="text-xs text-clay-muted">/10</span>
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => actions.setScreen(SCREENS.SELECTOR)}
        class="clay-btn w-full bg-clay-ink text-clay-on-primary rounded-2xl py-3.5 font-bold text-sm tracking-tight shadow-[0_4px_20px_rgba(10,10,10,0.12)]"
      >
        Volver al Men&uacute; Principal
      </button>
    </div>
  );
}
