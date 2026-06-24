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
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-clay-canvas max-w-sm w-full p-6 rounded-2xl border border-clay-hairline space-y-4">
        <h3 class="text-xl font-bold text-clay-ink">¿Estás seguro de parar?</h3>
        <p class="text-clay-body text-sm">Se perderá todo el progreso de la rutina actual y tendrás que volver a empezar.</p>
        <div class="flex gap-3 pt-2">
          <button onClick={() => window._closeStopConfirmModal()} class="flex-1 py-2.5 rounded-xl bg-clay-surface-soft hover:bg-clay-surface-strong text-clay-ink font-bold text-sm transition">
            Seguir Entrenando
          </button>
          <button onClick={() => window._confirmStopWorkout()} class="flex-1 py-2.5 rounded-xl bg-clay-error hover:bg-red-500 text-white font-bold text-sm transition">
            Sí, Finalizar
          </button>
        </div>
      </div>
    </div>
  );
}
