import { useApp, SCREENS } from '../state/store.jsx';
import { ROUTINES, CATEGORIES, CATEGORY_META } from '../data/routines.js';

function getTotalMinutes(routine) {
  const totalSeconds = routine.intervals.reduce((acc, i) => acc + i.duration, 0);
  return Math.round(totalSeconds / 60);
}

export function Selector() {
  const { state, actions } = useApp();
  const { categoryFilter, customRoutine } = state;

  const entries = Object.entries(ROUTINES);
  const filteredEntries = entries.filter(([_, r]) => {
    if (categoryFilter === 'all') return true;
    return r.category === categoryFilter;
  });

  const showCustom = categoryFilter === 'all' && customRoutine.intervals.length > 0;

  return (
    <div class="flex flex-col gap-5 pb-6">
      {/* Hero section */}
      <div class="text-center pt-2 space-y-1.5">
        <h1 class="display-lg text-clay-ink">A pedalear hoy</h1>
        <p class="text-sm text-clay-muted max-w-xs mx-auto leading-relaxed">
          Elige un entrenamiento según tu energía de hoy o dise&ntilde;a uno a tu medida.
        </p>
      </div>

      {/* Category pills */}
      <div class="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 px-0.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => actions.setCategoryFilter(cat.key)}
            class={`shrink-0 px-4 py-2 text-[13px] font-semibold rounded-full transition-all duration-200 ${
              categoryFilter === cat.key
                ? 'bg-clay-ink text-clay-on-primary shadow-sm'
                : 'text-clay-muted hover:text-clay-ink hover:bg-clay-surface-soft'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Routine feature cards */}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredEntries.map(([key, routine], idx) => {
          const meta = CATEGORY_META[routine.category];
          const minutes = getTotalMinutes(routine);
          return (
            <div
              key={key}
              onClick={() => actions.selectRoutine(key)}
              class={`${meta.color} ${meta.textColor} rounded-3xl p-5 sm:p-6 cursor-pointer flex flex-col justify-between min-h-[180px] active:scale-[0.97] transition-transform duration-150`}
            >
              <div>
                <div class="flex justify-between items-start gap-2">
                  <span class={`text-[11px] px-3 py-1 rounded-full font-semibold border ${meta.badgeClass}`}>
                    {meta.badge}
                  </span>
                  <span class="text-sm opacity-75 font-medium tabular-nums">{minutes} min</span>
                </div>
                <h3 class="text-lg font-bold mt-3 leading-tight">{routine.title}</h3>
                <p class="text-sm mt-1.5 opacity-80 leading-relaxed">{routine.description}</p>
              </div>
              <div class="flex justify-between items-end mt-5 pt-1">
                <span class="text-xs opacity-70 font-medium">Max {meta.maxStrength}</span>
                <span class="text-sm font-semibold">
                  Pedalear <span class="ml-0.5">→</span>
                </span>
              </div>
            </div>
          );
        })}

        {/* Custom routine card (ochre) */}
        {showCustom && (
          <div
            onClick={() => actions.selectRoutine('custom')}
            class="card-ochre rounded-3xl p-5 sm:p-6 cursor-pointer flex flex-col justify-between min-h-[180px] active:scale-[0.97] transition-transform duration-150"
          >
            <div>
              <div class="flex justify-between items-start gap-2">
                <span class="text-[11px] px-3 py-1 rounded-full font-semibold border bg-clay-canvas/30 text-clay-ink border-clay-ink/20">
                  Personalizado
                </span>
                <span class="text-sm opacity-75 font-medium tabular-nums">{getTotalMinutes(customRoutine)} min</span>
              </div>
              <h3 class="text-lg font-bold mt-3 leading-tight">{customRoutine.title}</h3>
              <p class="text-sm mt-1.5 opacity-80 leading-relaxed">{customRoutine.description}</p>
            </div>
            <div class="flex justify-between items-end mt-5 pt-1">
              <span class="text-xs opacity-70 font-medium">A tu medida</span>
              <span class="text-sm font-semibold">
                Pedalear <span class="ml-0.5">→</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Custom builder CTA */}
      <div class="bg-clay-surface-card rounded-3xl p-5 sm:p-6 border border-clay-hairline flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-center sm:text-left">
          <h3 class="text-lg font-bold text-clay-ink">¿Quieres dise&ntilde;ar tu propia rutina?</h3>
          <p class="text-clay-muted text-sm mt-1">
            Crea intervalos con tus propios tiempos, cadencias y resistencias.
          </p>
        </div>
        <button
          onClick={() => actions.setScreen(SCREENS.CREATOR)}
          class="clay-btn shrink-0 bg-clay-ink text-clay-on-primary rounded-xl px-6 py-3 text-sm font-semibold"
        >
          Dise&ntilde;ar Rutina
        </button>
      </div>

      {/* Empty state for filtered categories */}
      {filteredEntries.length === 0 && !showCustom && (
        <div class="text-center py-12">
          <p class="text-clay-muted text-sm">No hay rutinas en esta categor&iacute;a.</p>
          <button
            onClick={() => actions.setCategoryFilter('all')}
            class="text-sm font-semibold text-clay-ink mt-2 underline"
          >
            Ver todas
          </button>
        </div>
      )}
    </div>
  );
}
