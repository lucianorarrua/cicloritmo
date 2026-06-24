import { useApp, SCREENS } from '../state/store.jsx';
import { ROUTINES } from '../data/routines.js';
import { CATEGORIES, CATEGORY_META } from '../data/schema.js';
import { isAiEnabled } from '../services/generator.js';

const SparkleIcon = () => (
  <svg class="sparkle-icon w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z" />
    <path d="M18 16l.75 2.25L21 19l-2.25.75L18 22l-.75-2.25L15 19l2.25-.75z" />
    <path d="M6 14l.5 1.5L8 16l-1.5.5L6 18l-.5-1.5L4 16l1.5-.5z" />
  </svg>
);

const StarBadge = () => (
  <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z" />
  </svg>
);

function getTotalMinutes(routine) {
  const totalSeconds = routine.intervals.reduce((acc, i) => acc + i.duration, 0);
  return Math.round(totalSeconds / 60);
}

export function Selector() {
  const { state, actions } = useApp();
  const { categoryFilter, customRoutine, customRoutines } = state;

  // Build the combined list of routines: built-ins + saved custom routines.
  // Built-ins use their slug as key; custom saved routines use "custom:<id>".
  const builtinEntries = Object.entries(ROUTINES).map(([key, r]) => ({ key, routine: r, isCustom: false }));
  const customEntries = customRoutines.map(r => ({ key: 'custom:' + r.id, routine: r, isCustom: true }));

  const allEntries = [...builtinEntries, ...customEntries];
  const filteredEntries = allEntries.filter(({ routine }) => {
    if (categoryFilter === 'all') return true;
    return routine.category === categoryFilter;
  });

  const aiAvailable = isAiEnabled();

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (!window.confirm('¿Borrar esta rutina personalizada?')) return;
    actions.deleteCustomRoutine(id);
  };

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
        {CATEGORIES.map((cat) => {
          const active = categoryFilter === cat.key;
          const activeClasses = cat.color && cat.textColor
            ? `${cat.color} ${cat.textColor} shadow-sm`
            : 'bg-clay-ink text-clay-on-primary shadow-sm';
          return (
            <button
              key={cat.key}
              onClick={() => actions.setCategoryFilter(cat.key)}
              class={`shrink-0 px-4 py-2 text-[13px] font-semibold rounded-full transition-all duration-200 ${
                active
                  ? activeClasses
                  : 'text-clay-muted hover:text-clay-ink hover:bg-clay-surface-soft'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Routine feature cards */}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredEntries.map(({ key, routine, isCustom }) => {
          const meta = CATEGORY_META[routine.category] || CATEGORY_META.suave;
          const minutes = getTotalMinutes(routine);
          return (
            <div
              key={key}
              onClick={() => actions.selectRoutine(key)}
              class={`group relative ${meta.color} ${meta.textColor} rounded-2xl p-3.5 sm:p-4 cursor-pointer flex flex-col justify-between min-h-[120px] active:scale-[0.97] transition-transform duration-150`}
            >
              {/* Delete button for custom routines */}
              {isCustom && (
                <button
                  onClick={(e) => handleDelete(e, routine.id)}
                  class="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/15 hover:bg-black/25 flex items-center justify-center transition-colors z-10"
                  title="Borrar rutina"
                  aria-label="Borrar rutina"
                >
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
              <div>
                <div class="flex justify-between items-start gap-2 pr-6">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class={`h-5 text-[10px] px-2.5 rounded-full font-semibold border inline-flex items-center gap-1 leading-none ${meta.badgeClass}`}>
                      {meta.badge}
                    </span>
                    {isCustom && (
                      <span class="h-5 text-[10px] px-2 rounded-full font-semibold border inline-flex items-center gap-1 leading-none bg-white/20 text-current border-white/25">
                        <StarBadge />
                        Custom
                      </span>
                    )}
                  </div>
                  <span class="text-[11px] opacity-75 font-medium tabular-nums">{minutes} min</span>
                </div>
                <h3 class="text-[15px] font-bold mt-1.5 leading-tight">{routine.title}</h3>
                <p class="text-[11px] mt-1 opacity-80 leading-relaxed line-clamp-2">{routine.description}</p>
              </div>
              <div class="flex justify-between items-end mt-2 pt-1">
                <span class="text-[10px] opacity-70 font-medium">{isCustom ? 'Personalizada' : `Max ${meta.maxStrength}`}</span>
                <span class="text-[11px] font-semibold">
                  Pedalear <span class="ml-0.5">&rarr;</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom builder CTA */}
      <div class="bg-clay-surface-card rounded-3xl p-5 sm:p-6 border border-clay-hairline flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-center sm:text-left">
          <h3 class="text-lg font-bold text-clay-ink">¿Quieres dise&ntilde;ar tu propia rutina?</h3>
          <p class="text-clay-muted text-sm mt-1">
            {aiAvailable
              ? 'Genera una rutina con IA o arma cada intervalo manualmente.'
              : 'Crea intervalos con tus propios tiempos, cadencias y resistencias.'}
          </p>
        </div>
        <button
          onClick={() => actions.setScreen(SCREENS.CREATOR)}
          class="clay-btn shrink-0 bg-clay-ink text-clay-on-primary rounded-xl px-6 py-3 text-sm font-semibold flex items-center gap-1.5"
        >
          {aiAvailable && <SparkleIcon />}
          Dise&ntilde;ar Rutina
        </button>
      </div>

      {/* Empty state for filtered categories */}
      {filteredEntries.length === 0 && (
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
