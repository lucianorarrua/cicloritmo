import { useApp, SCREENS } from '../state/store.jsx';
import { ROUTINES, CATEGORIES, CATEGORY_META } from '../data/routines.js';

function getTotalMinutes(routine) {
  const totalSeconds = routine.intervals.reduce((acc, i) => acc + i.duration, 0);
  return Math.round(totalSeconds / 60);
}

export function Selector() {
  const { state, actions } = useApp();
  const { categoryFilter, customRoutine } = state;

  const filteredEntries = Object.entries(ROUTINES).filter(([_, r]) => {
    if (categoryFilter === 'all') return true;
    return r.category === categoryFilter;
  });

  const showCustom = categoryFilter === 'all' && customRoutine.intervals.length > 0;

  return (
    <div class="flex flex-col gap-6 pb-6">
      <div class="text-center mt-2 space-y-2">
        <h1 class="text-3xl display-heading text-clay-ink">A pedalear hoy</h1>
        <p class="text-clay-muted text-sm max-w-xs mx-auto leading-relaxed">Elige un entrenamiento según tu energía de hoy o diseña uno a tu medida.</p>
      </div>

      <div class="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            class={`shrink-0 px-4 py-2 text-xs font-semibold rounded-full transition-all duration-200 ${
              categoryFilter === cat.key
                ? 'bg-clay-surface-card text-clay-ink'
                : 'text-clay-muted hover:text-clay-ink hover:bg-clay-surface-soft'
            }`}
            onClick={() => actions.setCategoryFilter(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEntries.map(([key, routine]) => {
          const meta = CATEGORY_META[routine.category];
          const minutes = getTotalMinutes(routine);
          return (
            <div
              key={key}
              class={`${meta.color} ${meta.textColor} rounded-3xl p-6 cursor-pointer flex flex-col justify-between min-h-[200px] transition-transform active:scale-[0.98]`}
              onClick={() => actions.selectRoutine(key)}
            >
              <div>
                <div class="flex justify-between items-start">
                  <span class={`text-xs px-3 py-1 rounded-full border ${meta.badgeClass}`}>
                    {meta.badge}
                  </span>
                  <span class="text-sm opacity-75 font-medium">{minutes} min</span>
                </div>
                <h3 class="text-lg font-bold mt-3 leading-tight">{routine.title}</h3>
                <p class="text-sm mt-1 opacity-80 leading-relaxed">{routine.description}</p>
              </div>
              <div class="flex justify-between items-end mt-4 pt-2">
                <span class="text-xs opacity-75 font-medium">Max {meta.maxStrength}</span>
                <span class="text-sm font-semibold">Pedalear →</span>
              </div>
            </div>
          );
        })}
        {showCustom && (
          <div
            class="bg-clay-brand-ochre text-clay-ink rounded-3xl p-6 cursor-pointer flex flex-col justify-between min-h-[200px] transition-transform active:scale-[0.98]"
            onClick={() => actions.selectRoutine('custom')}
          >
            <div>
              <div class="flex justify-between items-start">
                <span class="text-xs px-3 py-1 rounded-full border bg-clay-canvas/30 text-clay-ink border-clay-ink/20">
                  Personalizado
                </span>
                <span class="text-sm opacity-75 font-medium">{getTotalMinutes(customRoutine)} min</span>
              </div>
              <h3 class="text-lg font-bold mt-3 leading-tight">{customRoutine.title}</h3>
              <p class="text-sm mt-1 opacity-80 leading-relaxed">{customRoutine.description}</p>
            </div>
            <div class="flex justify-between items-end mt-4 pt-2">
              <span class="text-xs opacity-75 font-medium">A tu medida</span>
              <span class="text-sm font-semibold">Pedalear →</span>
            </div>
          </div>
        )}
      </div>

      <div class="bg-clay-surface-card rounded-3xl p-5 sm:p-6 border border-clay-hairline flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-center sm:text-left">
          <h3 class="text-lg font-bold text-clay-ink">¿Quieres diseñar tu propia rutina?</h3>
          <p class="text-clay-muted text-sm mt-1">Crea intervalos con tus propios tiempos, cadencias y resistencias.</p>
        </div>
        <button
          class="shrink-0 bg-clay-ink text-white rounded-xl px-6 py-3 text-sm font-semibold hover:opacity-90 transition-all active:scale-[0.98]"
          onClick={() => actions.setScreen(SCREENS.CREATOR)}
        >
          Diseñar Rutina Personalizada
        </button>
      </div>
    </div>
  );
}
