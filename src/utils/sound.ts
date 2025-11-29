let audioCtx: AudioContext | null = null;

export const playTechClick = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    if (!audioCtx) {
      audioCtx = new AudioContext();
    }

    // Resume context if it's suspended (common browser policy)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const t = audioCtx.currentTime;

    // Oscillator 1: The "Tick"
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(2000, t);
    osc1.frequency.exponentialRampToValueAtTime(1000, t + 0.05);

    gain1.gain.setValueAtTime(0, t);
    gain1.gain.linearRampToValueAtTime(0.1, t + 0.005);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc1.start(t);
    osc1.stop(t + 0.05);

    // Oscillator 2: The "Chirp" (slightly delayed, higher pitch) - gives the "cricket/tech" feel
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);

    osc2.type = 'triangle'; // Slightly sharper tone
    osc2.frequency.setValueAtTime(2500, t + 0.03); // Start slightly later
    osc2.frequency.exponentialRampToValueAtTime(4000, t + 0.08); // Sweep up

    gain2.gain.setValueAtTime(0, t + 0.03);
    gain2.gain.linearRampToValueAtTime(0.05, t + 0.035);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc2.start(t + 0.03);
    osc2.stop(t + 0.08);

  } catch (e) {
    console.error("Audio play failed", e);
  }
};
