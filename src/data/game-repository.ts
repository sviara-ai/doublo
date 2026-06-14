import { SavedGameSchema, type SavedGame } from '@/shared/schemas';
import { readJson, removeKey, writeJson } from './storage';

const KEY = 'doublo.savedgame.v1';

export async function loadSavedGame(): Promise<SavedGame | null> {
  return readJson(KEY, SavedGameSchema);
}

export async function saveGame(game: SavedGame): Promise<void> {
  await writeJson(KEY, SavedGameSchema, game);
}

export async function clearSavedGame(): Promise<void> {
  await removeKey(KEY);
}
