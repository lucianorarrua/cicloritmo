import { useRef, useEffect } from 'preact/hooks';
import { playTickSound } from '../audio/engine.js';

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

  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const circumference = 2 * Math.PI * 42;

  return (
    <div class="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
      {/* Background ring */}
      <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="#f0f0f0" stroke-width="3.5" />
        <circle
          cx="50" cy="50" r="42" fill="none"
          stroke={phaseColor || '#0a0a0a'}
          stroke-width="3.5"
          stroke-dasharray={`${circumference * clampedProgress} ${circumference}`}
          stroke-linecap="round"
          class="transition-all duration-1000 ease-linear"
        />
      </svg>

      {/* Rotating wheel */}
      <svg
        ref={wheelRef}
        class="w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] text-clay-ink"
        style={{ transformOrigin: 'center', transition: 'none' }}
        viewBox="0 0 100 100"
      >
        {/* Outer ring */}
        <circle cx="50" cy="50" r="46" stroke="currentColor" stroke-width="2.5" fill="none" opacity="0.3" />
        {/* Tick marks */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 50 + 38 * Math.sin(rad);
          const y1 = 50 - 38 * Math.cos(rad);
          const x2 = 50 + 44 * Math.sin(rad);
          const y2 = 50 - 44 * Math.cos(rad);
          return (
            <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" stroke-width="2" opacity="0.15" />
          );
        })}
        {/* Needle */}
        <line x1="50" y1="50" x2="50" y2="12" stroke={phaseColor || '#0a0a0a'} stroke-width="4" stroke-linecap="round" />
        {/* Center dot */}
        <circle cx="50" cy="50" r="8" fill="#0a0a0a" />
        <circle cx="50" cy="50" r="3.5" fill="#fffaf0" />
        {/* Tip indicator */}
        <circle cx="50" cy="18" r="5" fill={phaseColor || '#EF4444'} stroke="#fffaf0" stroke-width="2" />
      </svg>
    </div>
  );
}
