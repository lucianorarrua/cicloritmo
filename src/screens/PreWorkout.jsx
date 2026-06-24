import { useApp, SCREENS } from '../state/store.jsx';
import { testAppSound } from '../audio/engine.js';
import { formatTime, totalSeconds } from '../utils/time.js';

export function PreWorkout() {
  const { state, actions } = useApp();
  const { activeRoutine, tickSoundOn, countdownSoundOn, soundOn } = state;
  const totalTime = activeRoutine ? totalSeconds(activeRoutine.intervals) : 0;

  return (
    <div class="flex flex-col gap-6 max-w-lg mx-auto w-full">
      <button
        onClick={() => actions.setScreen(SCREENS.SELECTOR)}
        class="self-start text-clay-muted hover:text-clay-ink text-sm font-medium flex items-center gap-1"
      >
        ← Volver a Rutinas
      </button>

      {activeRoutine && (
        <div class="bg-clay-surface-card rounded-2xl border border-clay-hairline p-5 flex flex-col gap-4">
          <div class="flex justify-between items-start gap-4">
            <div class="flex-1">
              <h2 class="text-xl font-semibold text-clay-ink">{activeRoutine.title}</h2>
              <p class="text-sm text-clay-body mt-1">{activeRoutine.description}</p>
            </div>
            <div class="text-right shrink-0">
              <span class="font-[family-name:var(--font-mono)] text-2xl text-clay-ink tabular-nums">
                {formatTime(totalTime)}
              </span>
            </div>
          </div>
          <div class="border-t border-clay-hairline" />
        </div>
      )}

      <div class="flex flex-col gap-3">
        <h3 class="text-xs uppercase tracking-wider text-clay-muted font-semibold">
          Opciones de Audio
        </h3>

        <label class="bg-clay-surface-soft border border-clay-hairline rounded-xl p-3 flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={tickSoundOn}
            onChange={() => actions.setAudioOptions(!tickSoundOn, countdownSoundOn)}
            class="accent-clay-ink w-5 h-5"
          />
          <span class="text-sm font-medium text-clay-body">Metrónomo de Cadencia</span>
        </label>

        <label class="bg-clay-surface-soft border border-clay-hairline rounded-xl p-3 flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={countdownSoundOn}
            onChange={() => actions.setAudioOptions(tickSoundOn, !countdownSoundOn)}
            class="accent-clay-ink w-5 h-5"
          />
          <span class="text-sm font-medium text-clay-body">Avisos de Cambio (3, 2, 1)</span>
        </label>
      </div>

      <button
        onClick={() => testAppSound(soundOn)}
        class="bg-clay-surface-soft border border-clay-hairline rounded-xl py-3 px-4 text-sm font-medium text-clay-body hover:bg-clay-surface-strong transition"
      >
        Probar Altavoces / Sonido
      </button>

      <p class="text-xs text-clay-muted text-center px-4">
        Asegúrate de que el volumen de tu dispositivo esté al máximo para escuchar las señales durante el entrenamiento.
      </p>

      <button
        onClick={actions.startWorkout}
        class="bg-clay-ink text-white w-full py-4 rounded-xl font-bold text-lg hover:opacity-90 transition"
      >
        INICIAR ENTRENAMIENTO Ahora
      </button>
    </div>
  );
}
