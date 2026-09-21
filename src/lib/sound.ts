import { Platform } from 'react-native';
import { Audio } from 'expo-av';

const PENTATONIC_SEMITONES = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];
const BASE_FREQUENCY = 440;
const SMALLEST_MERGE_EXPONENT = 2;
const ARPEGGIO_MAX_NOTES = 4;
const ARPEGGIO_GAP_S = 0.055;
const NOTE_ATTACK_S = 0.004;
const NOTE_RELEASE_S = 0.16;
const NOTE_PEAK_GAIN = 0.2;
const NATIVE_RATE_STEP = 0.09;
const NATIVE_RATE_MAX = 2;

let nativeSound: Audio.Sound | null = null;
let nativeLoading: Promise<void> | null = null;
let webContext: AudioContext | null = null;

function scaleIndex(value: number): number {
  if (value <= 0) {
    return 0;
  }
  const exponent = Math.round(Math.log2(value)) - SMALLEST_MERGE_EXPONENT;
  return Math.min(Math.max(exponent, 0), PENTATONIC_SEMITONES.length - 1);
}

function frequencyAt(index: number): number {
  const clamped = Math.min(Math.max(index, 0), PENTATONIC_SEMITONES.length - 1);
  return BASE_FREQUENCY * Math.pow(2, PENTATONIC_SEMITONES[clamped] / 12);
}

async function ensureNativeLoaded(): Promise<void> {
  if (nativeSound) {
    return;
  }
  if (!nativeLoading) {
    nativeLoading = Audio.Sound.createAsync(
      require('../../assets/sounds/merge.wav'),
      { volume: 0.4 },
    ).then(({ sound }) => {
      nativeSound = sound;
    });
  }
  await nativeLoading;
}

export function preloadSound(): void {
  if (Platform.OS !== 'web') {
    void ensureNativeLoaded();
  }
}

function playWebNote(
  context: AudioContext,
  frequency: number,
  startAt: number,
): void {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(frequency, startAt);
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(
    NOTE_PEAK_GAIN,
    startAt + NOTE_ATTACK_S,
  );
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + NOTE_RELEASE_S);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + NOTE_RELEASE_S + NOTE_ATTACK_S);
}

function playWebChord(topMergedValue: number, mergeCount: number): void {
  if (typeof window === 'undefined' || !window.AudioContext) {
    return;
  }
  if (!webContext) {
    webContext = new window.AudioContext();
  }
  const context = webContext;
  if (context.state === 'suspended') {
    void context.resume();
  }
  const top = scaleIndex(topMergedValue);
  const notes = Math.min(Math.max(mergeCount, 1), ARPEGGIO_MAX_NOTES);
  const start = context.currentTime;
  for (let step = 0; step < notes; step += 1) {
    const index = top - (notes - 1 - step);
    playWebNote(context, frequencyAt(index), start + step * ARPEGGIO_GAP_S);
  }
}

async function playNativeNote(topMergedValue: number): Promise<void> {
  try {
    await ensureNativeLoaded();
    if (!nativeSound) {
      return;
    }
    const rate = Math.min(
      1 + scaleIndex(topMergedValue) * NATIVE_RATE_STEP,
      NATIVE_RATE_MAX,
    );
    await nativeSound.setRateAsync(rate, false);
    await nativeSound.replayAsync();
  } catch {
    return;
  }
}

export function playScoreSound(
  topMergedValue: number,
  mergeCount: number,
): void {
  if (Platform.OS === 'web') {
    playWebChord(topMergedValue, mergeCount);
    return;
  }
  void playNativeNote(topMergedValue);
}
