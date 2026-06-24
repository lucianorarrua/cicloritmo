import { useState } from 'preact/hooks';
import { useApp, SCREENS } from '../state/store.jsx';

const TYPE_BADGES = {
  warmup: 'bg-clay-brand-lavender/40 text-clay-ink',
  work: 'bg-clay-brand-pink/20 text-clay-brand-pink',
  recovery: 'bg-green-100 text-green-700',
  cooldown: 'bg-clay-brand-lavender/40 text-clay-ink',
};

const TYPE_LABELS = {
  warmup: 'Calentamiento',
  work: 'Trabajo',
  recovery: 'Recuperación',
  cooldown: 'Enfriamiento',
};

function formClasses() {
  return 'bg-clay-canvas border border-clay-hairline p-2 rounded-xl text-sm text-clay-ink focus:outline-none focus:border-clay-ink';
}

function labelClasses() {
  return 'text-[11px] font-bold text-clay-muted';
}

export function Creator() {
  const { state, actions } = useApp();
  const { customRoutine } = state;
  const intervals = customRoutine.intervals;

  const [name, setName] = useState('Trabajo');
  const [duration, setDuration] = useState(60);
  const [res, setRes] = useState(5);
  const [rpm, setRpm] = useState(85);
  const [type, setType] = useState('work');

  function handleAdd() {
    actions.addCustomInterval({ name, duration, res, rpm, type });
  }

  function handleSave() {
    if (intervals.length === 0) {
      alert('Debes agregar al menos 1 intervalo');
      return;
    }
    actions.selectRoutine('custom');
  }

  return (
    <div class="space-y-6 w-full max-w-2xl mx-auto">
      <button
        class="text-sm text-clay-muted hover:text-clay-ink transition flex items-center gap-1 self-start"
        onClick={() => actions.setScreen(SCREENS.SELECTOR)}
      >
        ← Cancelar y volver
      </button>

      <div>
        <h2 class="text-2xl font-semibold text-clay-ink">Diseña tu Rutina Personalizada</h2>
        <p class="text-sm text-clay-muted mt-1">
          Arma cada bloque con la cadencia y resistencia que prefieras.
        </p>
      </div>

      <div>
        <h3 class="text-sm font-semibold text-clay-body mb-2">Intervalos de la Rutina:</h3>
        <div class="max-h-64 overflow-y-auto space-y-2 pr-1">
          {intervals.length === 0 && (
            <p class="text-xs text-clay-muted py-4 text-center">
              No hay intervalos aún. Agrega el primero abajo.
            </p>
          )}
          {intervals.map((interval, i) => (
            <div
              key={i}
              class="bg-clay-surface-soft border border-clay-hairline p-3 rounded-xl flex items-center justify-between gap-3"
            >
              <div class="flex items-center gap-3 min-w-0">
                <span class="text-xs font-mono text-clay-muted w-5">{i + 1}</span>
                <span class="text-sm font-medium text-clay-ink truncate">{interval.name}</span>
                <span class={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${TYPE_BADGES[interval.type] || ''}`}>
                  {TYPE_LABELS[interval.type] || interval.type}
                </span>
              </div>
              <div class="flex items-center gap-4 text-xs text-clay-muted flex-shrink-0">
                <span class="font-mono">{interval.duration}s</span>
                <span class="font-mono">Res {interval.res}</span>
                <span class="font-mono">{interval.rpm} RPM</span>
              </div>
              <button
                class="text-clay-error hover:bg-red-50 p-1.5 rounded flex-shrink-0"
                onClick={() => actions.removeCustomInterval(i)}
                title="Borrar intervalo"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div class="bg-clay-surface-card p-6 rounded-2xl border border-clay-hairline">
        <h3 class="text-sm font-semibold text-clay-body mb-4">Nuevo Intervalo</h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="col-span-2 sm:col-span-2">
            <label class={`block ${labelClasses()} mb-1`}>Nombre Intervalo</label>
            <input
              type="text"
              class={`w-full ${formClasses()}`}
              value={name}
              onInput={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label class={`block ${labelClasses()} mb-1`}>Duración (seg)</label>
            <input
              type="number"
              class={`w-full ${formClasses()}`}
              value={duration}
              min={5}
              onInput={(e) => setDuration(Number(e.target.value))}
            />
          </div>
          <div>
            <label class={`block ${labelClasses()} mb-1`}>Resistencia 1-10</label>
            <input
              type="number"
              class={`w-full ${formClasses()}`}
              value={res}
              min={1}
              max={10}
              onInput={(e) => setRes(Number(e.target.value))}
            />
          </div>
          <div>
            <label class={`block ${labelClasses()} mb-1`}>Cadencia RPM</label>
            <input
              type="number"
              class={`w-full ${formClasses()}`}
              value={rpm}
              min={30}
              max={150}
              onInput={(e) => setRpm(Number(e.target.value))}
            />
          </div>
          <div>
            <label class={`block ${labelClasses()} mb-1`}>Tipo de Ritmo</label>
            <select
              class={`w-full ${formClasses()}`}
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="warmup">Calentamiento</option>
              <option value="work">Trabajo</option>
              <option value="recovery">Recuperación</option>
              <option value="cooldown">Enfriamiento</option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              class="w-full bg-clay-ink text-white rounded-xl py-2 px-4 text-sm font-semibold hover:bg-clay-body-strong transition"
              onClick={handleAdd}
            >
              Añadir Bloque
            </button>
          </div>
        </div>
      </div>

      <button
        class="w-full bg-clay-ink text-white rounded-xl py-3 px-6 text-sm font-semibold hover:bg-clay-body-strong transition"
        onClick={handleSave}
      >
        Guardar y Configurar Audio
      </button>
    </div>
  );
}
