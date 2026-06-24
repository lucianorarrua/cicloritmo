import { useRef, useEffect } from 'preact/hooks';
import { playTickSound, playAlertSound } from '../audio/engine.js';

export function MetronomeWheel({ rpm, isPaused, soundOn, tickSoundOn, volume, progress, phaseColor }) {
  const wheelRef = useRef(null);
  const angleRef = useRef(0);
  const lastTimeRef = useRef(null);
  const animFrameRef = useRef(null);
  const tickPassedRef = useRef(false);

  useEffect(() => {
    function animate(timestamp) {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      if (!isPaused && rpm > 0) {
        const degreesPerMs = rpm * 0.006;
        const prevAngle = angleRef.current;
        angleRef.current = (angleRef.current + (degreesPerMs * delta)) % 360;

        if (angleRef.current < prevAngle) {
          tickPassedRef.current = true;
        }

        if (tickPassedRef.current && angleRef.current >= 0 && angleRef.current < degreesPerMs * delta * 2) {
          tickPassedRef.current = false;
        }

        if (angleRef.current < prevAngle) {
          playTickSound(soundOn, tickSoundOn, volume);
        }

        if (wheelRef.current) {
          wheelRef.current.style.transform = `rotate(${angleRef.current}deg)`;
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    }

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [rpm, isPaused, soundOn, tickSoundOn, volume]);

  return (
    <div class="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center bg-clay-surface-soft rounded-full border border-clay-hairline">
      <svg class="absolute inset-0 w-full h-full -rotate-90 scale-[1.03]" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" fill="none" stroke="#ebe6d6" stroke-width="4" />
        <circle
          cx="50" cy="50" r="46" fill="none"
          stroke={phaseColor || '#0a0a0a'}
          stroke-width="4"
          stroke-dasharray="289"
          stroke-dashoffset={289 - (289 * progress)}
          stroke-linecap="round"
          class="transition-all duration-1000 ease-linear"
        />
      </svg>

      <svg
        ref={wheelRef}
        class="w-20 h-20 sm:w-24 sm:h-24 text-clay-ink"
        style={{ transformOrigin: 'center', transition: 'none' }}
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="42" stroke="#0a0a0a" stroke-width="3.5" fill="none" />
        <line x1="50" y1="8" x2="50" y2="92" stroke="#0a0a0a" stroke-width="1.5" opacity="0.2" />
        <line x1="8" y1="50" x2="92" y2="50" stroke="#0a0a0a" stroke-width="1.5" opacity="0.2" />
        <line x1="20.3" y1="20.3" x2="79.7" y2="79.7" stroke="#0a0a0a" stroke-width="1.2" opacity="0.2" />
        <line x1="20.3" y1="79.7" x2="79.7" y2="20.3" stroke="#0a0a0a" stroke-width="1.2" opacity="0.2" />
        <line x1="50" y1="50" x2="50" y2="8" stroke="#e8b94a" stroke-width="5" stroke-linecap="round" />
        <circle cx="50" cy="50" r="9" fill="#0a0a0a" />
        <circle cx="50" cy="50" r="4" fill="#fffaf0" />
        <circle cx="50" cy="14" r="6.5" fill="#EF4444" stroke="#FFFFFF" stroke-width="2.5" />
      </svg>
    </div>
  );
}
