import { GameSettingsSchema, type GameSettings } from '@/shared/schemas';
import { readJson, writeJson } from './storage';

const KEY = 'doublo.settings.v1';

export async function loadSettings(): Promise<GameSettings | null> {
  return readJson(KEY, GameSettingsSchema);
}

export async function saveSettings(settings: GameSettings): Promise<void> {
  await writeJson(KEY, GameSettingsSchema, settings);
}
