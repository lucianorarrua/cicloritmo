import { useState } from 'preact/hooks';
import { useApp, SCREENS } from '../state/store.jsx';
import {
  TYPE_BADGES, TYPE_LABELS, TYPE_ACCENT,
  POSITION_BADGES, POSITION_LABELS,
  CATEGORIES, CATEGORY_META, POSITIONS,
} from '../data/schema.js';
import { FOCUS_OPTIONS } from '../data/contract.js';
import { isAiEnabled, generateRoutine } from '../services/generator.js';

function inputClass() {
  return 'w-full bg-clay-canvas border border-clay-hairline rounded-xl px-3.5 py-2.5 text-sm text-clay-ink placeholder:text-clay-muted-soft focus:outline-none focus:border-clay-ink transition-colors';
}

function labelClass() {
  return 'block text-[11px] font-semibold text-clay-muted mb-1.5 uppercase tracking-[0.05em]';
}

function categoryColor(key) {
  const meta = CATEGORY_META[key];
  return meta?.color || 'bg-clay-surface-card';
}

function categoryBadge(key) {
  const meta = CATEGORY_META[key];
  return meta?.badge || key;
}

const SparkleIcon = () => (
  <svg class="sparkle-icon w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z" />
    <path d="M18 16l.75 2.25L21 19l-2.25.75L18 22l-.75-2.25L15 19l2.25-.75z" />
    <path d="M6 14l.5 1.5L8 16l-1.5.5L6 18l-.5-1.5L4 16l1.5-.5z" />
  </svg>
);

export function Creator() {
  const { state, actions } = useApp();
  const { customRoutine } = state;
  const intervals = customRoutine.intervals;
  const aiAvailable = isAiEnabled();

  // ── Manual mode state ──
  const [name, setName] = useState('Trabajo');
  const [duration, setDuration] = useState(60);
  const [res, setRes] = useState(5);
  const [rpm, setRpm] = useState(85);
  const [type, setType] = useState('work');
  const [position, setPosition] = useState('sentado');

  // ── AI mode state ──
  const [activeTab, setActiveTab] = useState(aiAvailable ? 'ai' : 'manual');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [category, setCategory] = useState('hiit');
  const [focus, setFocus] = useState('mixto');
  const [positionPref, setPositionPref] = useState([POSITIONS.SENTADO, POSITIONS.PARADO]);
  const [extraInstructions, setExtraInstructions] = useState('');
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [showNewInterval, setShowNewInterval] = useState(false);

  const CORE_CATEGORIES = CATEGORIES.filter(c => c.key !== 'all');

  function handleAdd() {
    actions.addCustomInterval({ name, duration, res, rpm, type, position });
  }

  function handleSave() {
    if (intervals.length === 0) {
      alert('Debes agregar al menos 1 intervalo');
      return;
    }
    actions.selectRoutine('custom');
  }

  function togglePosition(pos) {
    setPositionPref(prev =>
      prev.includes(pos) && prev.length > 1
        ? prev.filter(p => p !== pos)
        : prev.includes(pos)
          ? prev
          : [...prev, pos]
    );
    setAiError('');
  }

  async function handleGenerate() {
    if (positionPref.length === 0) {
      setAiError('Selecciona al menos una posición.');
      return;
    }
    setGenerating(true);
    setAiError('');

    const result = await generateRoutine({
      duration_minutes: durationMinutes,
      category,
      focus,
      position_preference: positionPref,
      extra_instructions: extraInstructions.trim(),
    });

    if (result.ok) {
      actions.setCustomRoutine(result.routine);
      setActiveTab('manual');
      setDurationMinutes(30);
      setCategory('hiit');
      setFocus('mixto');
      setPositionPref([POSITIONS.SENTADO, POSITIONS.PARADO]);
      setExtraInstructions('');
    } else {
      setAiError(result.error);
    }

    setGenerating(false);
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

      {/* Tab bar */}
      {aiAvailable && (
        <div class="flex gap-1.5 bg-clay-surface-soft rounded-2xl p-1.5">
          <button
            onClick={() => setActiveTab('manual')}
            class={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
              activeTab === 'manual'
                ? 'bg-clay-canvas text-clay-ink shadow-[0_1px_3px_rgba(10,10,10,0.08)]'
                : 'text-clay-muted hover:text-clay-ink'
            }`}
          >
            Manual
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            class={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
              activeTab === 'ai'
                ? 'bg-clay-canvas text-clay-ink shadow-[0_1px_3px_rgba(10,10,10,0.08)]'
                : 'text-clay-muted hover:text-clay-ink'
            }`}
          >
            <SparkleIcon />
            <span class={activeTab === 'ai' ? 'ai-gradient-text' : ''}>Generar con IA</span>
          </button>
        </div>
      )}

      {/* ── Manual mode ── */}
      {activeTab === 'manual' && (
        <>
          {/* Interval list */}
          <div>
            <div class="flex items-stretch justify-between mb-2.5 min-h-[28px]">
              <h3 class="text-xs font-semibold text-clay-muted uppercase tracking-[0.1em] flex items-center">Intervalos ({intervals.length})</h3>
              <div class="flex items-center gap-2">
                {aiAvailable && intervals.length > 0 && (
                  <span class="text-[10px] font-medium text-clay-muted-soft bg-clay-surface-soft px-2 py-0.5 rounded-full">
                    {customRoutine.title || 'Rutina generada'}
                  </span>
                )}
                <button
                  onClick={() => setShowNewInterval(!showNewInterval)}
                  class="clay-btn text-[11px] font-semibold text-clay-ink bg-clay-ink/5 hover:bg-clay-ink/10 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5 leading-none"
                >
                  <svg class={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${showNewInterval ? 'rotate-45' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  {showNewInterval ? 'Cancelar' : 'Nuevo intervalo'}
                </button>
              </div>
            </div>
            <div class="max-h-56 overflow-y-auto space-y-2 pr-1 no-scrollbar">
              {intervals.length === 0 && (
                <div class="text-center py-10 bg-clay-surface-soft rounded-2xl border border-clay-hairline border-dashed">
                  <p class="text-sm text-clay-muted">No hay intervalos a&uacute;n.</p>
                  <p class="text-xs text-clay-muted-soft mt-1">Agrega el primero con el bot&oacute;n "Nuevo intervalo".</p>
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
                      {interval.position && (
                        <span class={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${POSITION_BADGES[interval.position] || ''}`}>
                          {POSITION_LABELS[interval.position] || interval.position}
                        </span>
                      )}
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
          {showNewInterval && (
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
                <label class={labelClass()}>Posici&oacute;n</label>
                <select
                  class={inputClass() + ' pr-8'}
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                >
                  <option value="sentado">Sentado</option>
                  <option value="parado">De Pie</option>
                </select>
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
                  <option value="recovery">Recuperaci&oacute;n</option>
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
          )}

          {/* Save CTA */}
          <button
            onClick={handleSave}
            class="clay-btn w-full bg-clay-ink text-clay-on-primary rounded-2xl py-3.5 text-sm font-bold tracking-tight shadow-[0_4px_20px_rgba(10,10,10,0.12)]"
          >
            Guardar y Configurar Audio
          </button>
        </>
      )}

      {/* ── AI mode ── */}
      {activeTab === 'ai' && (
        <div class="bg-clay-surface-card rounded-3xl border border-clay-hairline p-5 sm:p-6 space-y-6">
          {/* Duration slider */}
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-[11px] font-semibold text-clay-muted uppercase tracking-[0.05em]">Duraci&oacute;n</label>
              <span class="text-sm font-mono font-bold text-clay-ink tabular-nums">{durationMinutes} min</span>
            </div>
            <input
              type="range"
              min="5"
              max="90"
              step="5"
              value={durationMinutes}
              onInput={(e) => { setDurationMinutes(Number(e.target.value)); setAiError(''); }}
              class="w-full"
            />
            <div class="flex justify-between text-[10px] text-clay-muted-soft mt-1 font-medium">
              <span>5 min</span>
              <span>90 min</span>
            </div>
          </div>

          {/* Category */}
          <div>
            <label class={labelClass()}>Categor&iacute;a</label>
            <div class="flex flex-wrap gap-2">
              {CORE_CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => { setCategory(cat.key); setAiError(''); }}
                  class={`px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 border ${
                    category === cat.key
                      ? `${categoryColor(cat.key)} text-white border-transparent shadow-[0_2px_8px_rgba(10,10,10,0.1)]`
                      : 'bg-clay-canvas text-clay-muted border-clay-hairline hover:border-clay-ink/30'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <p class="text-[10px] text-clay-muted-soft mt-1.5 font-medium">
              Intensidad m&aacute;xima: {CATEGORY_META[category]?.maxStrength || '-'}
            </p>
          </div>

          {/* Focus */}
          <div>
            <label class={labelClass()}>Enfoque</label>
            <div class="flex gap-2">
              {FOCUS_OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => { setFocus(opt.key); setAiError(''); }}
                  class={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 border ${
                    focus === opt.key
                      ? 'bg-clay-ink text-clay-on-primary border-clay-ink shadow-[0_2px_8px_rgba(10,10,10,0.1)]'
                      : 'bg-clay-canvas text-clay-muted border-clay-hairline hover:border-clay-ink/30'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Position preference */}
          <div>
            <label class={labelClass()}>Posici&oacute;n</label>
            <div class="flex gap-2">
              {Object.values(POSITIONS).map(pos => (
                <button
                  key={pos}
                  onClick={() => togglePosition(pos)}
                  class={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 border ${
                    positionPref.includes(pos)
                      ? 'bg-clay-ink text-clay-on-primary border-clay-ink shadow-[0_2px_8px_rgba(10,10,10,0.1)]'
                      : 'bg-clay-canvas text-clay-muted border-clay-hairline hover:border-clay-ink/30'
                  }`}
                >
                  {POSITION_LABELS[pos] || pos}
                </button>
              ))}
            </div>
          </div>

          {/* Extra instructions */}
          <div>
            <label class={labelClass()}>Instrucciones extra (opcional)</label>
            <textarea
              class={inputClass() + ' resize-none h-20'}
              value={extraInstructions}
              onInput={(e) => { setExtraInstructions(e.target.value); setAiError(''); }}
              maxLength={500}
              placeholder='Ej: "Quiero enfocarme en piernas", "Algo que me haga sudar mucho"...'
            />
            <p class="text-[10px] text-clay-muted-soft mt-1 text-right tabular-nums">{extraInstructions.length}/500</p>
          </div>

          {/* Error */}
          {aiError && (
            <div class="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-clay-error font-medium">
              {aiError}
            </div>
          )}

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={generating}
            class="clay-btn w-full rounded-2xl py-3.5 text-sm font-bold tracking-tight transition-all duration-200 flex items-center justify-center gap-2 bg-clay-ink text-clay-on-primary shadow-[0_4px_20px_rgba(10,10,10,0.12)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                <svg class="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generando rutina...
              </>
            ) : (
              <>
                <SparkleIcon />
                Generar Rutina
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
