let wakeLock = null;
let fallbackVideo = null;
let fallbackCanvas = null;
let fallbackCtx = null;
let fallbackIntervalId = null;

export async function startKeepScreenOnLock(isPaused) {
  if ('wakeLock' in navigator) {
    try {
      if (!wakeLock) {
        wakeLock = await navigator.wakeLock.request('screen');
        wakeLock.addEventListener('release', () => {
          wakeLock = null;
        });
      }
    } catch (err) {
      console.warn(`Wake Lock API: ${err.message}`);
    }
  }

  try {
    if (!fallbackVideo) {
      fallbackCanvas = document.createElement('canvas');
      fallbackCanvas.width = 16;
      fallbackCanvas.height = 16;
      fallbackCtx = fallbackCanvas.getContext('2d');
      fallbackCtx.fillStyle = 'rgba(0,0,0,0.1)';
      fallbackCtx.fillRect(0, 0, 16, 16);

      const stream = fallbackCanvas.captureStream(1);

      fallbackVideo = document.createElement('video');
      fallbackVideo.style.position = 'absolute';
      fallbackVideo.style.pointerEvents = 'none';
      fallbackVideo.style.opacity = '0.001';
      fallbackVideo.style.width = '1px';
      fallbackVideo.style.height = '1px';
      fallbackVideo.srcObject = stream;
      fallbackVideo.muted = true;
      fallbackVideo.playsInline = true;
      fallbackVideo.loop = true;

      document.body.appendChild(fallbackVideo);

      if (fallbackIntervalId) clearInterval(fallbackIntervalId);
      fallbackIntervalId = setInterval(() => {
        if (!isPaused && fallbackCtx) {
          fallbackCtx.clearRect(0, 0, 16, 16);
          fallbackCtx.fillStyle = `rgba(0, 0, 0, ${0.05 + Math.random() * 0.05})`;
          fallbackCtx.fillRect(0, 0, 16, 16);
        }
      }, 1000);
    }

    fallbackVideo.play().catch(e => {
      console.warn("Respaldo video: ", e);
    });
  } catch (err) {
    console.error("Respaldo no iniciado: ", err);
  }
}

export async function stopKeepScreenOnLock() {
  if (wakeLock) {
    try { await wakeLock.release(); } catch(e){}
    wakeLock = null;
  }
  if (fallbackVideo) {
    try { fallbackVideo.pause(); } catch(e){}
  }
}

let visibilityHandler = null;

export function setupVisibilityChange(getIsPaused, getActiveRoutine) {
  if (visibilityHandler) {
    document.removeEventListener('visibilitychange', visibilityHandler);
  }
  visibilityHandler = async () => {
    if (document.visibilityState === 'visible' && !getIsPaused() && getActiveRoutine()) {
      await startKeepScreenOnLock(false);
    }
  };
  document.addEventListener('visibilitychange', visibilityHandler);
}
