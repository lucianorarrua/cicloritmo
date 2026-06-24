import { useEffect, useRef } from 'preact/hooks';
import { useApp } from '../state/store.jsx';
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
  warmup: { color: '#1a3a3a', text: 'Calentamiento', textClass: 'text-clay-brand-teal' },
  work: { color: '#EF4444', text: 'Trabajo', textClass: 'text-clay-error' },
  recovery: { color: '#22c55e', text: 'Recuperación', textClass: 'text-clay-success' },
  cooldown: { color: '#b8a4ed', text: 'Enfriamiento', textClass: 'text-clay-brand-lavender' },
};

function getPhaseInfo(type) {
  return PHASE_INFO[type] || { color: '#0a0a0a', text: type, textClass: 'text-clay-ink' };
}

function getEffortLevel(rpm, res) {
  const score = (rpm || 0) * 0.3 + (res || 0) * 1.5;
  if (score < 5) return 'Suave';
  if (score < 10) return 'Moderado';
  if (score < 15) return 'Medio';
  if (score < 20) return 'Alto';
  return 'Máximo';
}

export function Workout() {
  const { state, actions } = useApp();
  const stateRef = useRef(state);
  stateRef.current = state;

  const { activeRoutine } = state;

  useEffect(() => {
    if (state.isWorkoutActive && activeRoutine && state.activeIntervalTimeLeft === 0) {
      const first = activeRoutine.intervals[0];
      if (first && first.duration > 0) {
        actions.setIntervalTime(first.duration);
      }
    }
  }, [state.isWorkoutActive]);

  useEffect(() => {
    startKeepScreenOnLock(state.isPaused);
    setupVisibilityChange(
      () => stateRef.current.isPaused,
      () => stateRef.current.activeRoutine,
    );
    return () => {
      stopKeepScreenOnLock();
    };
  }, []);

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

  if (!activeRoutine) {
    return (
      <div class="h-[98vh] sm:h-[85vh] overflow-hidden select-none flex items-center justify-center bg-clay-canvas">
        <p class="text-clay-ink/40 font-mono text-sm">Cargando rutina...</p>
      </div>
    );
  }

  const idx = state.activeIntervalIndex;
  const intervals = activeRoutine.intervals;
  const interval = intervals[idx];

  if (!interval) {
    return (
      <div class="h-[98vh] sm:h-[85vh] overflow-hidden select-none flex items-center justify-center bg-clay-canvas">
        <p class="text-clay-ink/40 font-mono text-sm">Intervalo no encontrado</p>
      </div>
    );
  }

  const timeLeft = state.activeIntervalTimeLeft || 0;
  const phaseInfo = getPhaseInfo(interval.type);
  const progress = interval.duration > 0
    ? (interval.duration - timeLeft) / interval.duration
    : 0;
  const globalProgress = state.activeRoutineTotalTime > 0
    ? (state.globalTimeElapsed / state.activeRoutineTotalTime) * 100
    : 0;
  const nextInterval = idx + 1 < intervals.length ? intervals[idx + 1] : null;

  const playIcon = (
    <svg class="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
  );

  const pauseIcon = (
    <svg class="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </svg>
  );

  const chevronLeft = (
    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );

  const chevronRight = (
    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );

  return (
    <div class="h-[98vh] sm:h-[85vh] overflow-hidden select-none flex flex-col justify-between bg-clay-canvas">

      {/* Section 1: Top Control Bar */}
      <div class="flex items-center justify-between px-4 pt-2 pb-1 shrink-0">
        <div class="flex-1 min-w-0">
          <h1 class="text-sm font-semibold text-clay-ink truncate">{activeRoutine.title}</h1>
          <span class="text-xs text-clay-ink/50 font-mono">{idx + 1}/{intervals.length}</span>
        </div>
        <button
          onClick={handleStop}
          class="ml-3 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 active:bg-red-200 transition-colors"
        >
          Parar
        </button>
      </div>

      {/* Section 2: Target Displays */}
      <div class="grid grid-cols-2 gap-2 px-3 pt-1 pb-2 shrink-0">
        <div class="bg-clay-surface-soft border border-clay-hairline rounded-xl p-3 text-center">
          <div class="text-[10px] sm:text-xs text-clay-ink/50 uppercase tracking-wider font-semibold">
            Cadencia Recomendada
          </div>
          <div class="font-mono text-5xl sm:text-6xl font-bold text-clay-ink leading-none py-1">
            {interval.rpm}
          </div>
          <div class="text-[10px] sm:text-xs text-clay-ink/40">RPM (Pedaladas)</div>
        </div>
        <div class="bg-clay-surface-soft border border-clay-hairline rounded-xl p-3 text-center">
          <div class="text-[10px] sm:text-xs text-clay-ink/50 uppercase tracking-wider font-semibold">
            Resistencia Bici
          </div>
          <div class="font-mono text-5xl sm:text-6xl font-bold text-clay-ink leading-none py-1">
            {interval.res}
          </div>
          <div class="text-[10px] sm:text-xs text-clay-ink/40">Nivel en Perilla (1-10)</div>
        </div>
      </div>

      {/* Section 3: Central Console */}
      <div class="flex flex-row items-center px-4 flex-grow min-h-0">
        <div class="flex-1 min-w-0">
          <div class={`text-sm font-semibold ${phaseInfo.textClass}`}>
            {phaseInfo.text}
          </div>
          <div class="text-lg sm:text-xl font-extrabold text-clay-ink leading-tight truncate">
            {interval.name}
          </div>
          <div class="font-mono text-5xl sm:text-6xl font-bold text-clay-ink leading-none mt-1">
            {formatTime(timeLeft)}
          </div>
        </div>
        <div class="ml-3 shrink-0">
          <MetronomeWheel
            rpm={interval.rpm}
            isPaused={state.isPaused}
            soundOn={state.soundOn}
            tickSoundOn={state.tickSoundOn}
            volume={state.volume}
            progress={progress}
            phaseColor={phaseInfo.color}
          />
        </div>
      </div>

      {/* Section 4: Next Interval Banner */}
      {nextInterval && (
        <div class="mx-4 mb-1 px-3 py-2 bg-clay-surface-soft border border-clay-hairline rounded-lg flex items-center gap-3 shrink-0">
          <span class="text-[10px] font-semibold uppercase bg-clay-hairline text-clay-ink/60 px-2 py-0.5 rounded tracking-wider">
            Siguiente
          </span>
          <span class="text-sm font-semibold text-clay-ink truncate flex-1">
            {nextInterval.name}
          </span>
          <span class="text-[10px] sm:text-xs text-clay-ink/40 font-mono whitespace-nowrap">
            {nextInterval.rpm} RPM | Res. {nextInterval.res}
          </span>
        </div>
      )}

      {/* Section 5: Controls Panel */}
      <div class="px-4 pt-1 pb-1 shrink-0">
        <div class="flex justify-between text-[10px] sm:text-xs text-clay-ink/50 mb-1">
          <span>
            Tiempo Transcurrido:{' '}
            <span class="font-mono text-clay-ink/70">{formatTime(state.globalTimeElapsed)}</span>
          </span>
          <span>
            Total:{' '}
            <span class="font-mono text-clay-ink/70">{formatTime(state.activeRoutineTotalTime)}</span>
          </span>
        </div>
        <div class="h-1.5 bg-clay-hairline rounded-full mb-3 overflow-hidden">
          <div
            class="h-full bg-clay-ink rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${Math.min(globalProgress, 100)}%` }}
          />
        </div>
        <div class="flex items-center gap-3">
          <button
            onClick={handlePrev}
            disabled={state.activeIntervalIndex === 0}
            class="w-11 h-11 flex items-center justify-center rounded-full border border-clay-hairline text-clay-ink/70 hover:bg-clay-surface-soft active:bg-clay-hairline transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            {chevronLeft}
          </button>
          <button
            onClick={togglePlayPause}
            class="flex-[1.5] h-12 bg-clay-ink text-white rounded-full flex items-center justify-center active:bg-clay-ink/90 transition-colors"
          >
            {state.isPaused ? playIcon : pauseIcon}
          </button>
          <button
            onClick={handleNext}
            class="w-11 h-11 flex items-center justify-center rounded-full border border-clay-hairline text-clay-ink/70 hover:bg-clay-surface-soft active:bg-clay-hairline transition-colors"
          >
            {chevronRight}
          </button>
        </div>
      </div>

      {/* Section 6: Live Stats Strip */}
      <div class="grid grid-cols-3 border-t border-clay-hairline divide-x divide-clay-hairline shrink-0">
        <div class="px-2 py-2 text-center">
          <div class="text-[10px] sm:text-xs text-clay-ink/50 uppercase tracking-wider font-semibold">
            Esfuerzo
          </div>
          <div class="font-mono text-base sm:text-lg font-bold text-clay-ink">
            {getEffortLevel(interval.rpm, interval.res)}
          </div>
        </div>
        <div class="px-2 py-2 text-center">
          <div class="text-[10px] sm:text-xs text-clay-ink/50 uppercase tracking-wider font-semibold">
            Calorías
          </div>
          <div class="font-mono text-base sm:text-lg font-bold text-clay-ink">
            {Math.round(state.estimatedCalories)}
          </div>
        </div>
        <div class="px-2 py-2 text-center">
          <div class="text-[10px] sm:text-xs text-clay-ink/50 uppercase tracking-wider font-semibold">
            Distancia
          </div>
          <div class="font-mono text-base sm:text-lg font-bold text-clay-ink">
            {state.estimatedDistance.toFixed(1)}
            <span class="text-xs text-clay-ink/50"> km</span>
          </div>
        </div>
      </div>

    </div>
  );
}
