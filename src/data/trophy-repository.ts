import { TrophyBookSchema, type TrophyBook } from '@/shared/schemas';
import { readJson, writeJson } from './storage';

const KEY = 'doublo.trophies.v1';
const EMPTY: TrophyBook = { earned: [] };

export async function loadTrophies(): Promise<TrophyBook> {
  const data = await readJson(KEY, TrophyBookSchema);
  return data ?? EMPTY;
}

export async function saveTrophies(book: TrophyBook): Promise<void> {
  await writeJson(KEY, TrophyBookSchema, book);
}
