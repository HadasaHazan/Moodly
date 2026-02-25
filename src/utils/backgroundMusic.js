let audioContext = null;
let masterGain = null;
let schedulerId = null;
let currentPreset = 'melody_a';
let currentStep = 0;
let unlocked = false;
let noiseSource = null;
let noiseGainNode = null;
let noiseFilterLow = null;
let noiseFilterHigh = null;

const NOTE_FREQ = {
  A3: 220.0,
  B3: 246.94,
  G3: 196.0,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25
};

const PRESETS = {
  melody_a: {
    intervalMs: 1400,
    padWave: 'sine',
    leadWave: 'triangle',
    padGain: 0.01,
    leadGain: 0.0045,
    padAttack: 0.22,
    padRelease: 0.5,
    leadAttack: 0.05,
    leadRelease: 0.15,
    padDurationFactor: 1.25,
    leadDurationFactor: 0.9,
    sequence: [
      { chord: ['C4', 'E4', 'G4'], lead: 'E5' },
      { chord: ['A3', 'C4', 'E4'], lead: 'C5' },
      { chord: ['F4', 'A4', 'C5'], lead: 'A4' },
      { chord: ['G4', 'B4', 'D5'], lead: 'B4' }
    ]
  },
  melody_b: {
    intervalMs: 1200,
    padWave: 'sine',
    leadWave: 'triangle',
    padGain: 0.0095,
    leadGain: 0.0042,
    padAttack: 0.18,
    padRelease: 0.45,
    leadAttack: 0.04,
    leadRelease: 0.14,
    padDurationFactor: 1.2,
    leadDurationFactor: 0.92,
    sequence: [
      { chord: ['D4', 'F4', 'A4'], lead: 'A4' },
      { chord: ['G4', 'B4', 'D5'], lead: 'G4' },
      { chord: ['E4', 'G4', 'B4'], lead: 'B4' },
      { chord: ['A3', 'C4', 'E4'], lead: 'E4' }
    ]
  },
  melody_c: {
    intervalMs: 1600,
    padWave: 'triangle',
    leadWave: 'sine',
    padGain: 0.01,
    leadGain: 0.0035,
    padAttack: 0.28,
    padRelease: 0.7,
    leadAttack: 0.06,
    leadRelease: 0.22,
    padDurationFactor: 1.35,
    leadDurationFactor: 0.85,
    noise: {
      gain: 0.018,
      lowpassHz: 1400,
      highpassHz: 120
    },
    sequence: [
      { chord: ['C4', 'G4', 'C5'], lead: 'G4' },
      { chord: ['B3', 'F4', 'B4'], lead: 'F4' },
      { chord: ['A3', 'E4', 'A4'], lead: 'E4' },
      { chord: ['G3', 'D4', 'G4'], lead: 'D4' }
    ]
  },
  melody_d: {
    intervalMs: 900,
    padWave: 'sawtooth',
    leadWave: 'square',
    padGain: 0.018,
    leadGain: 0.008,
    padAttack: 0.08,
    padRelease: 0.22,
    leadAttack: 0.02,
    leadRelease: 0.08,
    padDurationFactor: 1.15,
    leadDurationFactor: 0.95,
    sequence: [
      { chord: ['A3', 'C4', 'E4'], lead: 'E5' },
      { chord: ['G3', 'B3', 'D4'], lead: 'D5' },
      { chord: ['F4', 'A4', 'C5'], lead: 'C5' },
      { chord: ['E4', 'G4', 'B4'], lead: 'B4' }
    ]
  }
};

const ensureContext = () => {
  if (!audioContext) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    audioContext = new Ctx();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(audioContext.destination);
  }

  return audioContext;
};

const playTone = (frequency, duration, wave, gainValue, attack = 0.3, release = 0.35) => {
  if (!audioContext || !masterGain) return;

  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = wave;
  oscillator.frequency.value = frequency;

  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(gainValue, now + attack);
  gainNode.gain.linearRampToValueAtTime(0, now + duration + release);

  oscillator.connect(gainNode);
  gainNode.connect(masterGain);

  oscillator.start(now);
  oscillator.stop(now + duration + release + 0.02);
};

const stopNoise = () => {
  try {
    if (noiseSource) {
      noiseSource.stop();
    }
  } catch (error) {
    // ignore
  }
  noiseSource = null;
  noiseGainNode = null;
  noiseFilterLow = null;
  noiseFilterHigh = null;
};

const startNoise = (noisePreset) => {
  if (!audioContext || !masterGain || !noisePreset) return;
  stopNoise();

  const bufferSeconds = 1.1;
  const buffer = audioContext.createBuffer(1, Math.floor(audioContext.sampleRate * bufferSeconds), audioContext.sampleRate);
  const channel = buffer.getChannelData(0);
  for (let i = 0; i < channel.length; i++) {
    channel[i] = (Math.random() * 2 - 1) * 0.7;
  }

  noiseSource = audioContext.createBufferSource();
  noiseSource.buffer = buffer;
  noiseSource.loop = true;

  noiseFilterHigh = audioContext.createBiquadFilter();
  noiseFilterHigh.type = 'highpass';
  noiseFilterHigh.frequency.value = noisePreset.highpassHz || 120;
  noiseFilterHigh.Q.value = 0.7;

  noiseFilterLow = audioContext.createBiquadFilter();
  noiseFilterLow.type = 'lowpass';
  noiseFilterLow.frequency.value = noisePreset.lowpassHz || 1400;
  noiseFilterLow.Q.value = 0.6;

  noiseGainNode = audioContext.createGain();
  noiseGainNode.gain.value = Math.max(0, Math.min(0.08, noisePreset.gain || 0.015));

  noiseSource.connect(noiseFilterHigh);
  noiseFilterHigh.connect(noiseFilterLow);
  noiseFilterLow.connect(noiseGainNode);
  noiseGainNode.connect(masterGain);

  noiseSource.start();
};

const playStep = () => {
  const preset = PRESETS[currentPreset] || PRESETS.melody_a;
  const step = preset.sequence[currentStep % preset.sequence.length];
  currentStep += 1;

  if (!step || !step.chord || !step.chord.length) return;

  const stepDuration = preset.intervalMs / 1000;
  const padDuration = stepDuration * (preset.padDurationFactor ?? 0.95);
  const leadDuration = stepDuration * (preset.leadDurationFactor ?? 0.55);

  step.chord.forEach((note) => {
    if (!NOTE_FREQ[note]) return;
    playTone(
      NOTE_FREQ[note],
      padDuration,
      preset.padWave,
      preset.padGain,
      preset.padAttack ?? 0.3,
      preset.padRelease ?? 0.35
    );
  });

  if (step.lead && NOTE_FREQ[step.lead]) {
    playTone(
      NOTE_FREQ[step.lead],
      leadDuration,
      preset.leadWave,
      preset.leadGain,
      preset.leadAttack ?? 0.05,
      preset.leadRelease ?? 0.12
    );
  }
};

const fadeMaster = (target, duration = 0.3) => {
  if (!audioContext || !masterGain) return;
  const now = audioContext.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.linearRampToValueAtTime(target, now + duration);
};

const startScheduler = () => {
  stopScheduler();
  const preset = PRESETS[currentPreset] || PRESETS.melody_a;
  schedulerId = window.setInterval(playStep, preset.intervalMs);
};

const stopScheduler = () => {
  if (schedulerId) {
    window.clearInterval(schedulerId);
    schedulerId = null;
  }
};

export const unlockMusic = async () => {
  ensureContext();
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }
  unlocked = true;
};

export const setMusicPreset = async (presetId) => {
  if (presetId === 'off') {
    stopMusic();
    return;
  }

  currentPreset = PRESETS[presetId] ? presetId : 'melody_a';
  currentStep = 0;

  ensureContext();

  if (unlocked && audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  const preset = PRESETS[currentPreset] || PRESETS.melody_a;
  if (preset.noise) {
    startNoise(preset.noise);
  } else {
    stopNoise();
  }

  startScheduler();
  fadeMaster(unlocked ? 1 : 0);
};

export const stopMusic = () => {
  stopScheduler();
  fadeMaster(0, 0.2);
  stopNoise();
};

export const attachUnlockListeners = () => {
  const unlockOnce = async () => {
    await unlockMusic();
    window.removeEventListener('pointerdown', unlockOnce);
    window.removeEventListener('keydown', unlockOnce);
    fadeMaster(1, 0.5);
  };

  window.addEventListener('pointerdown', unlockOnce, { once: true });
  window.addEventListener('keydown', unlockOnce, { once: true });
};
