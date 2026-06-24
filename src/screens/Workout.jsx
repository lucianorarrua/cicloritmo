import { useEffect, useRef } from 'preact/hooks';
import { useApp } from '../state/store.jsx';
import { POSITION_LABELS } from '../data/routines.js';
import { MetronomeWheel } from '../components/MetronomeWheel.jsx';
import { playCountdownSound, playAlertSound } from '../audio/engine.js';
import { calculateDistance, calculateCalories } from '../utils/metrics.js';
import { formatTime } from '../utils/time.js';
import {
  startKeepScreenOnLock,
  stopKeepScreenOnLock,
  setupVisibilityChange,
} from '../utils/keepAwake.js';

const PHASE_INFO = {
  warmup: { color: '#a4d4c5', bg: 'bg-clay-brand-mint/30', text: 'Calentamiento', textClass: 'text-clay-brand-teal', badge: 'bg-clay-brand-teal text-white' },
  work: { color: '#EF4444', bg: 'bg-red-50', text: 'Trabajo', textClass: 'text-clay-error', badge: 'bg-clay-error text-white' },
  recovery: { color: '#22c55e', bg: 'bg-green-50', text: 'Recuperación', textClass: 'text-clay-success', badge: 'bg-clay-success text-white' },
  cooldown: { color: '#b8a4ed', bg: 'bg-clay-brand-lavender/20', text: 'Enfriamiento', textClass: 'text-clay-brand-lavender', badge: 'bg-clay-brand-lavender text-clay-ink' },
};

const POSITION_INFO = {
  sentado: { text: 'Sentado', badge: 'bg-blue-50 text-blue-600 border border-blue-200' },
  parado: { text: 'De Pie', badge: 'bg-amber-50 text-amber-700 border border-amber-200' },
  mixto: { text: 'Mixto', badge: 'bg-purple-50 text-purple-600 border border-purple-200' },
};

function getPhaseInfo(type) {
  return PHASE_INFO[type] || { color: '#0a0a0a', bg: 'bg-clay-surface-soft', text: type, textClass: 'text-clay-ink', badge: 'bg-clay-ink text-white' };
}

function getEffortLevel(rpm, res) {
  const score = (rpm || 0) * 0.3 + (res || 0) * 1.5;
  if (score < 5) return { label: 'Suave', color: 'text-clay-brand-mint' };
  if (score < 10) return { label: 'Moderado', color: 'text-clay-brand-ochre' };
  if (score < 15) return { label: 'Alto', color: 'text-clay-brand-peach' };
  if (score < 20) return { label: 'Intenso', color: 'text-clay-brand-coral' };
  return { label: 'Máximo', color: 'text-clay-error' };
}

export function Workout() {
  const { state, actions } = useApp();
  const stateRef = useRef(state);
  stateRef.current = state;

  const { activeRoutine } = state;

  // Initialise first interval timer
  useEffect(() => {
    if (state.isWorkoutActive && activeRoutine && state.activeIntervalTimeLeft === 0) {
      const first = activeRoutine.intervals[0];
      if (first && first.duration > 0) {
        actions.setIntervalTime(first.duration);
      }
    }
  }, [state.isWorkoutActive]);

  // Keep screen awake
  useEffect(() => {
    startKeepScreenOnLock(state.isPaused);
    setupVisibilityChange(
      () => stateRef.current.isPaused,
      () => stateRef.current.activeRoutine,
    );
    return () => { stopKeepScreenOnLock(); };
  }, []);

  // Timer heartbeat
  useEffect(() => {
    if (!state.isWorkoutActive) return;

    const timer = setInterval(() => {
      const s = stateRef.current;
      if (s.isPaused || !s.isWorkoutActive || !s.activeRoutine) return;

      const idx = s.activeIntervalIndex;
      const interval = s.activeRoutine.intervals[idx];
      if (!interval) return;

      const timeLeft = s.activeIntervalTimeLeft;

      actions.updateMetrics(
        calculateDistance(interval.rpm, interval.res),
        calculateCalories(interval.rpm, interval.res),
      );

      if (timeLeft <= 3 && timeLeft > 0) {
        playCountdownSound(s.soundOn, s.countdownSoundOn, s.volume);
      }

      if (timeLeft === 1) {
        playAlertSound(s.soundOn, s.volume);
      }

      actions.tick();
    }, 1000);

    return () => clearInterval(timer);
  }, [state.isWorkoutActive]);

  const togglePlayPause = () => {
    if (state.isPaused) {
      actions.resumeWorkout();
      startKeepScreenOnLock(false);
    } else {
      actions.pauseWorkout();
      startKeepScreenOnLock(true);
    }
  };

  const handleNext = () => {
    playAlertSound(state.soundOn, state.volume);
    actions.nextInterval();
  };

  const handlePrev = () => {
    if (state.activeIntervalIndex > 0) {
      playAlertSound(state.soundOn, state.volume);
      actions.prevInterval();
    }
  };

  const handleStop = () => {
    if (typeof window !== 'undefined' && window._openStopConfirmModal) {
      window._openStopConfirmModal();
    }
  };

  // Loading / error states
  if (!activeRoutine) {
    return (
      <div class="h-full flex items-center justify-center bg-clay-canvas">
        <p class="text-clay-muted text-sm font-mono">Cargando rutina...</p>
      </div>
    );
  }

  const idx = state.activeIntervalIndex;
  const intervals = activeRoutine.intervals;
  const interval = intervals[idx];

  if (!interval) {
    return (
      <div class="h-full flex items-center justify-center bg-clay-canvas">
        <p class="text-clay-muted text-sm font-mono">Intervalo no encontrado</p>
      </div>
    );
  }

  const timeLeft = state.activeIntervalTimeLeft || 0;
  const phaseInfo = getPhaseInfo(interval.type);
  const intervalProgress = interval.duration > 0
    ? (interval.duration - timeLeft) / interval.duration
    : 0;
  const globalProgress = state.activeRoutineTotalTime > 0
    ? (state.globalTimeElapsed / state.activeRoutineTotalTime) * 100
    : 0;
  const nextInterval = idx + 1 < intervals.length ? intervals[idx + 1] : null;
  const isUrgent = timeLeft <= 3 && timeLeft > 0;
  const effort = getEffortLevel(interval.rpm, interval.res);

  // SVG icons
  const PlayIcon = (
    <svg class="w-7 h-7 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
  );
  const PauseIcon = (
    <svg class="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </svg>
  );
  const ChevronLeft = (
    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
  const ChevronRight = (
    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
  const StopIcon = (
    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );

  return (
    <div class="h-full flex flex-col bg-clay-canvas select-none overflow-hidden">

      {/* ── Top Control Bar ── */}
      <div class="flex items-center justify-between px-4 pt-2 pb-1 shrink-0" style="padding-top: max(0.5rem, env(safe-area-inset-top))">
        <div class="flex-1 min-w-0">
          <h1 class="text-[13px] font-semibold text-clay-ink truncate">{activeRoutine.title}</h1>
          <span class="text-[11px] text-clay-muted font-medium font-mono tabular-nums">
            {idx + 1}<span class="text-clay-muted-soft">/{intervals.length}</span>
          </span>
        </div>
        <button
          onClick={handleStop}
          class="ml-3 flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-clay-muted bg-clay-surface-soft border border-clay-hairline rounded-full hover:bg-clay-hairline active:bg-clay-hairline transition-colors"
        >
          {StopIcon}
          <span>Parar</span>
        </button>
      </div>

      {/* ── Hero: Phase + Interval Name + Timer ── */}
      <div class="flex-1 flex flex-col items-center justify-center min-h-0 px-4 gap-4">
        {/* Phase badge */}
        <div class={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase ${phaseInfo.badge}`}>
          {phaseInfo.text}
        </div>
        {/* Position badge */}
        {interval.position && (
          <div class={`px-3 py-1 rounded-full text-[11px] font-semibold -mt-2 ${POSITION_INFO[interval.position]?.badge || ''}`}>
            {POSITION_INFO[interval.position]?.text || POSITION_LABELS[interval.position] || interval.position}
          </div>
        )}

        {/* Interval name */}
        <h2 class="text-lg sm:text-xl font-bold text-clay-ink text-center leading-tight px-2">
          {interval.name}
        </h2>

        {/* Giant Timer */}
        <div class={`font-mono font-bold text-clay-ink tabular-nums leading-none select-none ${
          timeLeft >= 3600 ? 'text-[5.5rem] sm:text-[7rem]'
            : timeLeft >= 600 ? 'text-[6rem] sm:text-[7.5rem]'
            : 'text-[6.5rem] sm:text-[8rem]'
        } ${isUrgent ? 'text-clay-error urgent-pulse' : ''}`}>
          {formatTime(timeLeft)}
        </div>

        {/* Metronome wheel + interval progress */}
        <div class="flex items-center gap-4">
          <MetronomeWheel
            rpm={interval.rpm}
            isPaused={state.isPaused}
            soundOn={state.soundOn}
            tickSoundOn={state.tickSoundOn}
            volume={state.volume}
            progress={intervalProgress}
            phaseColor={phaseInfo.color}
          />
        </div>
      </div>

      {/* ── Target Cards: RPM & Resistance ── */}
      <div class="grid grid-cols-2 gap-2.5 px-4 pt-1 shrink-0">
        <div class={`rounded-2xl p-3.5 text-center border ${phaseInfo.bg} border-clay-hairline`}>
          <div class="text-[10px] font-semibold text-clay-muted uppercase tracking-[0.08em] mb-0.5">
            Cadencia
          </div>
          <div class="font-mono text-4xl sm:text-5xl font-bold text-clay-ink leading-none tabular-nums">
            {interval.rpm}
          </div>
          <div class="text-[10px] text-clay-muted-soft mt-0.5">RPM</div>
        </div>
        <div class={`rounded-2xl p-3.5 text-center border ${phaseInfo.bg} border-clay-hairline`}>
          <div class="text-[10px] font-semibold text-clay-muted uppercase tracking-[0.08em] mb-0.5">
            Resistencia
          </div>
          <div class="font-mono text-4xl sm:text-5xl font-bold text-clay-ink leading-none tabular-nums">
            {interval.res}
          </div>
          <div class="text-[10px] text-clay-muted-soft mt-0.5">Nivel 1-10</div>
        </div>
      </div>

      {/* ── Next Interval Banner ── */}
      <div class="px-4 pt-2 shrink-0">
        {nextInterval ? (
          <div class="bg-clay-surface-soft border border-clay-hairline rounded-xl px-3 py-2 flex items-center gap-2.5">
            <span class="text-[10px] font-bold uppercase text-clay-muted tracking-wider shrink-0">
              Siguiente
            </span>
            <span class="h-4 w-px bg-clay-hairline shrink-0" />
            <span class="text-xs font-semibold text-clay-ink truncate flex-1">
              {nextInterval.name}
            </span>
            <span class="text-[10px] text-clay-muted font-mono tabular-nums whitespace-nowrap shrink-0">
              {nextInterval.rpm} RPM · Res {nextInterval.res}
            </span>
          </div>
        ) : (
          <div class="bg-clay-surface-soft border border-clay-hairline rounded-xl px-3 py-2 flex items-center gap-2.5 opacity-50">
            <span class="text-[10px] font-bold uppercase text-clay-muted tracking-wider">
              Último
            </span>
            <span class="h-4 w-px bg-clay-hairline" />
            <span class="text-xs text-clay-muted flex-1">&Uacute;ltimo intervalo de la rutina</span>
          </div>
        )}
      </div>

      {/* ── Progress + Controls ── */}
      <div class="px-4 pt-3 pb-2 shrink-0 space-y-3">
        {/* Global progress bar */}
        <div class="flex items-center gap-2">
          <span class="text-[10px] text-clay-muted font-mono tabular-nums w-10 text-right">
            {formatTime(state.globalTimeElapsed)}
          </span>
          <div class="flex-1 h-1.5 bg-clay-hairline rounded-full overflow-hidden">
            <div
              class="h-full bg-clay-ink rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${Math.min(globalProgress, 100)}%` }}
            />
          </div>
          <span class="text-[10px] text-clay-muted font-mono tabular-nums w-10">
            {formatTime(state.activeRoutineTotalTime)}
          </span>
        </div>

        {/* Playback controls */}
        <div class="flex items-center justify-center gap-4">
          <button
            onClick={handlePrev}
            disabled={state.activeIntervalIndex === 0}
            class="w-12 h-12 flex items-center justify-center rounded-full border border-clay-hairline text-clay-ink bg-clay-canvas hover:bg-clay-surface-soft active:bg-clay-hairline transition-colors disabled:opacity-25 disabled:pointer-events-none"
          >
            {ChevronLeft}
          </button>
          <button
            onClick={togglePlayPause}
            class="clay-btn w-16 h-16 flex items-center justify-center rounded-full bg-clay-ink text-clay-on-primary shadow-[0_4px_20px_rgba(10,10,10,0.2)]"
          >
            {state.isPaused ? PlayIcon : PauseIcon}
          </button>
          <button
            onClick={handleNext}
            class="w-12 h-12 flex items-center justify-center rounded-full border border-clay-hairline text-clay-ink bg-clay-canvas hover:bg-clay-surface-soft active:bg-clay-hairline transition-colors"
          >
            {ChevronRight}
          </button>
        </div>
      </div>

      {/* ── Live Stats Strip ── */}
      <div class="grid grid-cols-3 border-t border-clay-hairline divide-x divide-clay-hairline shrink-0">
        <div class="py-2.5 text-center">
          <div class="text-[10px] font-semibold text-clay-muted uppercase tracking-[0.08em] mb-0.5">
            Esfuerzo
          </div>
          <div class={`text-sm font-bold font-mono tabular-nums ${effort.color}`}>
            {effort.label}
          </div>
        </div>
        <div class="py-2.5 text-center">
          <div class="text-[10px] font-semibold text-clay-muted uppercase tracking-[0.08em] mb-0.5">
            Calor&iacute;as
          </div>
          <div class="text-sm font-bold font-mono tabular-nums text-clay-ink">
            {Math.round(state.estimatedCalories)}<span class="text-[10px] text-clay-muted ml-0.5">kcal</span>
          </div>
        </div>
        <div class="py-2.5 text-center">
          <div class="text-[10px] font-semibold text-clay-muted uppercase tracking-[0.08em] mb-0.5">
            Distancia
          </div>
          <div class="text-sm font-bold font-mono tabular-nums text-clay-ink">
            {state.estimatedDistance.toFixed(1)}<span class="text-[10px] text-clay-muted ml-0.5">km</span>
          </div>
        </div>
      </div>
    </div>
  );
}
