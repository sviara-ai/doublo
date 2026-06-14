import { Audio } from 'expo-av';

let sound: Audio.Sound | null = null;
let loading: Promise<void> | null = null;

async function ensureLoaded(): Promise<void> {
  if (sound) {
    return;
  }
  if (!loading) {
    loading = Audio.Sound.createAsync(
      require('../../assets/sounds/merge.wav'),
      { volume: 0.4 },
    ).then(({ sound: created }) => {
      sound = created;
    });
  }
  await loading;
}

export async function playScoreSound(): Promise<void> {
  try {
    await ensureLoaded();
    if (sound) {
      await sound.replayAsync();
    }
  } catch {
    return;
  }
}
