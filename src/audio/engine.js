let audioCtx = null;

export function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playTickSound(soundOn, tickSoundOn, volume = 0.8) {
  if (!soundOn || !tickSoundOn) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1050, ctx.currentTime);
    gain.gain.setValueAtTime(0.4 * volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

    osc.start();
    osc.stop(ctx.currentTime + 0.045);
  } catch (e) {
    console.error("Error en Web Audio API: ", e);
  }
}

export function playCountdownSound(soundOn, countdownSoundOn, volume = 0.8) {
  if (!soundOn || !countdownSoundOn) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(950, ctx.currentTime);
    gain.gain.setValueAtTime(0.5 * volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {
    console.error("Error en Web Audio API: ", e);
  }
}

export function playAlertSound(soundOn, volume = 0.8) {
  if (!soundOn) return;
  try {
    const ctx = getAudioContext();
    const time = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(587.33, time);
    gain1.gain.setValueAtTime(0.45 * volume, time);
    gain1.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.00, time + 0.12);
    gain2.gain.setValueAtTime(0.45 * volume, time + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, time + 0.45);

    osc1.start(time);
    osc1.stop(time + 0.3);
    osc2.start(time + 0.12);
    osc2.stop(time + 0.5);

    if (navigator.vibrate) {
      navigator.vibrate([150, 75, 150]);
    }
  } catch (e) {
    console.error("Error en Web Audio API: ", e);
  }
}

export function testAppSound(soundOn) {
  try {
    getAudioContext();
    playAlertSound(soundOn);
  } catch(e) {
    alert("Para habilitar el audio debes interactuar primero con la página.");
  }
}
