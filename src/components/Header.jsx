import { useApp } from '../state/store.jsx';

export function Header() {
  const { state, actions } = useApp();
  const { soundOn } = state;

  return (
    <header class="sticky top-0 z-50 bg-clay-canvas border-b border-clay-hairline">
      <div class="max-w-2xl mx-auto flex items-center justify-between px-3 sm:px-4 h-14">
        <div class="flex items-center gap-2.5">
          <svg class="w-7 h-7 text-clay-ink" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18.5" cy="17.5" r="3.5" />
            <circle cx="5.5" cy="17.5" r="3.5" />
            <circle cx="15" cy="5" r="1" />
            <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
          </svg>
          <span class="text-lg font-semibold tracking-tight text-clay-ink">CicloRitmo</span>
        </div>

        <button
          onClick={actions.toggleSound}
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-clay-hairline bg-clay-surface-soft text-xs font-semibold text-clay-body hover:bg-clay-surface-strong transition-colors"
          aria-label={soundOn ? 'Silenciar' : 'Activar sonido'}
        >
          <span class="text-sm">{soundOn ? '\uD83D\uDD0A' : '\uD83D\uDD07'}</span>
          <span class="hidden sm:inline">{soundOn ? 'Sonido ON' : 'Silenciado'}</span>
        </button>
      </div>
    </header>
  );
}
