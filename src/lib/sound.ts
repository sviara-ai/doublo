import { Platform } from 'react-native';
import { Audio } from 'expo-av';

let nativeSound: Audio.Sound | null = null;
let nativeLoading: Promise<void> | null = null;
let webContext: AudioContext | null = null;

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

function playWebClick(): void {
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
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(1050, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.22, now + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.06);
}

async function playNativeClick(): Promise<void> {
  try {
    await ensureNativeLoaded();
    if (nativeSound) {
      await nativeSound.replayAsync();
    }
  } catch {
    return;
  }
}

export function playScoreSound(): void {
  if (Platform.OS === 'web') {
    playWebClick();
    return;
  }
  void playNativeClick();
}
