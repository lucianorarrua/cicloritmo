import { useApp } from '../state/store.jsx';

export function Header() {
  const { state, actions } = useApp();
  const { soundOn } = state;

  return (
    <header class="border-b border-clay-hairline bg-clay-canvas sticky top-0 z-50 px-4 py-3">
      <div class="max-w-4xl mx-auto flex justify-between items-center">
        <div class="flex items-center gap-2">
          <svg class="w-8 h-8 text-clay-ink" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18.5" cy="17.5" r="3.5" />
            <circle cx="5.5" cy="17.5" r="3.5" />
            <circle cx="15" cy="5" r="1" />
            <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
          </svg>
          <h1 class="text-xl font-semibold tracking-tight text-clay-ink">CicloRitmo</h1>
        </div>
        <div class="flex items-center gap-3 bg-clay-surface-soft px-3 py-1.5 rounded-full border border-clay-hairline">
          <button onClick={actions.toggleSound} class="hover:text-clay-ink transition flex items-center gap-1.5 text-xs font-semibold text-clay-body">
            <span>{soundOn ? '\uD83D\uDD0A' : '\uD83D\uDD07'}</span>
            <span class="hidden sm:inline">{soundOn ? 'Sonido ON' : 'Mute'}</span>
          </button>

        </div>
      </div>
    </header>
  );
}
