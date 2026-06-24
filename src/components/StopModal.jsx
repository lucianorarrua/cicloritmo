import { useState, useEffect } from 'preact/hooks';
import { useApp } from '../state/store.jsx';

export function StopModal() {
  const { state, actions } = useApp();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    window._openStopConfirmModal = () => {
      actions.pauseWorkout();
      setShowModal(true);
    };
    window._closeStopConfirmModal = () => {
      setShowModal(false);
      actions.resumeWorkout();
    };
    window._confirmStopWorkout = () => {
      setShowModal(false);
      actions.stopWorkout();
    };
  }, []);

  if (!showModal) return null;

  return (
    <div
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={() => window._closeStopConfirmModal()}
    >
      {/* Backdrop */}
      <div class="absolute inset-0 bg-clay-ink/60 backdrop-blur-sm" />

      {/* Sheet (mobile bottom, desktop centered) */}
      <div
        class="relative bg-clay-canvas w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl border-t sm:border border-clay-hairline p-6 pb-8 space-y-4 animate-[slideUp_250ms_cubic-bezier(0.16,1,0.3,1)]"
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar (mobile) */}
        <div class="sm:hidden flex justify-center -mt-1 mb-1">
          <div class="w-10 h-1 rounded-full bg-clay-hairline" />
        </div>

        <div class="text-center">
          <div class="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6 text-clay-error" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-clay-ink">¿Estás seguro?</h3>
          <p class="text-sm text-clay-muted mt-1.5 leading-relaxed">
            Se perder&aacute; todo el progreso de la rutina actual.
          </p>
        </div>

        <div class="flex gap-3 pt-1">
          <button
            onClick={() => window._closeStopConfirmModal()}
            class="clay-btn flex-1 py-3 rounded-2xl bg-clay-surface-soft border border-clay-hairline text-clay-ink font-semibold text-sm"
          >
            Seguir
          </button>
          <button
            onClick={() => window._confirmStopWorkout()}
            class="clay-btn flex-1 py-3 rounded-2xl bg-clay-error text-white font-semibold text-sm"
          >
            Finalizar
          </button>
        </div>
      </div>
    </div>
  );
}
