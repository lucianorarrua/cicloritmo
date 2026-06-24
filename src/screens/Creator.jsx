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

const TYPE_ACCENT = {
  warmup: 'border-l-clay-brand-lavender',
  work: 'border-l-clay-brand-pink',
  recovery: 'border-l-clay-success',
  cooldown: 'border-l-clay-brand-lavender',
};

function inputClass() {
  return 'w-full bg-clay-canvas border border-clay-hairline rounded-xl px-3.5 py-2.5 text-sm text-clay-ink placeholder:text-clay-muted-soft focus:outline-none focus:border-clay-ink transition-colors';
}

function labelClass() {
  return 'block text-[11px] font-semibold text-clay-muted mb-1.5 uppercase tracking-[0.05em]';
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
    <div class="flex flex-col gap-5 w-full max-w-lg mx-auto">
      {/* Cancel */}
      <button
        onClick={() => actions.setScreen(SCREENS.SELECTOR)}
        class="text-sm font-medium text-clay-muted hover:text-clay-ink transition-colors flex items-center gap-1 self-start"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Cancelar y volver
      </button>

      {/* Header */}
      <div>
        <h2 class="display-sm text-clay-ink">Dise&ntilde;a tu Rutina</h2>
        <p class="text-sm text-clay-muted mt-1">
          Arma cada bloque con la cadencia y resistencia que prefieras.
        </p>
      </div>

      {/* Interval list */}
      <div>
        <div class="flex items-center justify-between mb-2.5">
          <h3 class="text-xs font-semibold text-clay-muted uppercase tracking-[0.1em]">Intervalos ({intervals.length})</h3>
        </div>
        <div class="max-h-56 overflow-y-auto space-y-2 pr-1 no-scrollbar">
          {intervals.length === 0 && (
            <div class="text-center py-10 bg-clay-surface-soft rounded-2xl border border-clay-hairline border-dashed">
              <p class="text-sm text-clay-muted">No hay intervalos a&uacute;n.</p>
              <p class="text-xs text-clay-muted-soft mt-1">Agrega el primero usando el formulario de abajo.</p>
            </div>
          )}
          {intervals.map((interval, i) => (
            <div
              key={i}
              class={`bg-clay-canvas border border-clay-hairline rounded-xl p-3 flex items-center gap-3 border-l-[3px] ${TYPE_ACCENT[interval.type] || 'border-l-clay-hairline'}`}
            >
              <span class="text-xs font-mono font-bold text-clay-muted w-5 text-center shrink-0">{i + 1}</span>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-semibold text-clay-ink truncate">{interval.name}</span>
                  <span class={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${TYPE_BADGES[interval.type] || ''}`}>
                    {TYPE_LABELS[interval.type] || interval.type}
                  </span>
                </div>
                <div class="flex gap-3 mt-1 text-[11px] text-clay-muted font-medium">
                  <span class="font-mono tabular-nums">{interval.duration}s</span>
                  <span>Res {interval.res}</span>
                  <span class="font-mono tabular-nums">{interval.rpm} RPM</span>
                </div>
              </div>
              <button
                onClick={() => actions.removeCustomInterval(i)}
                class="text-clay-muted hover:text-clay-error hover:bg-red-50 p-1.5 rounded-lg shrink-0 transition-colors"
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

      {/* New interval form */}
      <div class="bg-clay-surface-card rounded-3xl border border-clay-hairline p-5 sm:p-6">
        <h3 class="text-xs font-semibold text-clay-muted uppercase tracking-[0.1em] mb-4">Nuevo Intervalo</h3>
        <div class="grid grid-cols-2 gap-3">
          <div class="col-span-2">
            <label class={labelClass()}>Nombre</label>
            <input
              type="text"
              class={inputClass()}
              value={name}
              onInput={(e) => setName(e.target.value)}
              placeholder="Ej: Sprint 1/4"
            />
          </div>
          <div>
            <label class={labelClass()}>Duraci&oacute;n (seg)</label>
            <input
              type="number"
              class={inputClass()}
              value={duration}
              min={5}
              onInput={(e) => setDuration(Number(e.target.value))}
            />
          </div>
          <div>
            <label class={labelClass()}>Resistencia (1-10)</label>
            <input
              type="number"
              class={inputClass()}
              value={res}
              min={1}
              max={10}
              onInput={(e) => setRes(Number(e.target.value))}
            />
          </div>
          <div>
            <label class={labelClass()}>Cadencia RPM</label>
            <input
              type="number"
              class={inputClass()}
              value={rpm}
              min={30}
              max={150}
              onInput={(e) => setRpm(Number(e.target.value))}
            />
          </div>
          <div>
            <label class={labelClass()}>Tipo</label>
            <select
              class={inputClass() + ' pr-8'}
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
              onClick={handleAdd}
              class="clay-btn w-full bg-clay-ink text-clay-on-primary rounded-xl py-2.5 text-sm font-semibold"
            >
              A&ntilde;adir Bloque
            </button>
          </div>
        </div>
      </div>

      {/* Save CTA */}
      <button
        onClick={handleSave}
        class="clay-btn w-full bg-clay-ink text-clay-on-primary rounded-2xl py-3.5 text-sm font-bold tracking-tight shadow-[0_4px_20px_rgba(10,10,10,0.12)]"
      >
        Guardar y Configurar Audio
      </button>
    </div>
  );
}
