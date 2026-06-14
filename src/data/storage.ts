import AsyncStorage from '@react-native-async-storage/async-storage';
import type { z } from 'zod';

export async function readJson<T>(
  key: string,
  schema: z.ZodType<T>,
): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (raw === null) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw);
    const result = schema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export async function writeJson<T>(
  key: string,
  schema: z.ZodType<T>,
  value: T,
): Promise<void> {
  const validated = schema.parse(value);
  await AsyncStorage.setItem(key, JSON.stringify(validated));
}

export async function removeKey(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}
