import { useApp, SCREENS } from '../state/store.jsx';
import { testAppSound } from '../audio/engine.js';
import { formatTime, totalSeconds } from '../utils/time.js';

function ToggleOption({ label, description, checked, onChange }) {
  return (
    <button
      onClick={onChange}
      class={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-200 flex items-start gap-3.5 ${
        checked
          ? 'border-clay-ink bg-clay-ink/[0.03]'
          : 'border-clay-hairline bg-clay-canvas hover:border-clay-ink/20'
      }`}
    >
      <div class={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
        checked ? 'bg-clay-ink border-clay-ink' : 'border-clay-hairline'
      }`}>
        {checked && (
          <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      <div class="min-w-0">
        <span class="text-sm font-semibold text-clay-ink block">{label}</span>
        <span class="text-xs text-clay-muted mt-0.5 block">{description}</span>
      </div>
    </button>
  );
}

export function PreWorkout() {
  const { state, actions } = useApp();
  const { activeRoutine, tickSoundOn, countdownSoundOn, soundOn } = state;
  const totalTime = activeRoutine ? totalSeconds(activeRoutine.intervals) : 0;

  return (
    <div class="flex flex-col gap-6 max-w-md mx-auto w-full">
      {/* Back button */}
      <button
        onClick={() => actions.setScreen(SCREENS.SELECTOR)}
        class="self-start text-sm font-medium text-clay-muted hover:text-clay-ink transition-colors flex items-center gap-1"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Volver a Rutinas
      </button>

      {/* Routine info card */}
      {activeRoutine && (
        <div class="bg-clay-surface-card rounded-3xl border border-clay-hairline p-5">
          <div class="flex justify-between items-start gap-4">
            <div class="flex-1 min-w-0">
              <h2 class="text-xl font-semibold text-clay-ink">{activeRoutine.title}</h2>
              <p class="text-sm text-clay-body mt-1.5 leading-relaxed">{activeRoutine.description}</p>
            </div>
            <div class="text-right shrink-0 bg-clay-canvas rounded-2xl px-3.5 py-2 border border-clay-hairline">
              <span class="block text-[10px] font-semibold text-clay-muted uppercase tracking-wider">Duraci&oacute;n</span>
              <span class="font-mono text-2xl font-bold text-clay-ink tabular-nums leading-tight">
                {formatTime(totalTime)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Audio options section */}
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-1.5 mb-1">
          <svg class="w-4 h-4 text-clay-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
          <h3 class="text-xs font-semibold text-clay-muted uppercase tracking-[0.1em]">
            Opciones de Audio
          </h3>
        </div>

        <ToggleOption
          label="Metr&oacute;nomo de Cadencia"
          description="Escucha un clic r&iacute;tmico sincronizado con la cadencia objetivo."
          checked={tickSoundOn}
          onChange={() => actions.setAudioOptions(!tickSoundOn, countdownSoundOn)}
        />

        <ToggleOption
          label="Avisos de Cambio (3, 2, 1)"
          description="Cuenta regresiva antes de cada transici&oacute;n de intervalo."
          checked={countdownSoundOn}
          onChange={() => actions.setAudioOptions(tickSoundOn, !countdownSoundOn)}
        />
      </div>

      {/* Test sound */}
      <button
        onClick={() => testAppSound(soundOn)}
        class="bg-clay-surface-soft border border-clay-hairline rounded-2xl py-3.5 px-4 text-sm font-medium text-clay-body hover:bg-clay-surface-strong transition-colors flex items-center justify-center gap-2"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        Probar Altavoces
      </button>

      {/* Volume reminder */}
      <p class="text-xs text-clay-muted text-center leading-relaxed">
        Aseg&uacute;rate de que el volumen de tu dispositivo est&eacute; al m&aacute;ximo para escuchar las se&ntilde;ales durante el entrenamiento.
      </p>

      {/* Start CTA */}
      <button
        onClick={actions.startWorkout}
        class="clay-btn w-full bg-clay-ink text-clay-on-primary rounded-2xl py-4 font-bold text-lg tracking-tight shadow-[0_4px_24px_rgba(10,10,10,0.15)]"
      >
        INICIAR ENTRENAMIENTO
      </button>
    </div>
  );
}
