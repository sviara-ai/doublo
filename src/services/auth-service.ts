import { z } from 'zod';
import { readJson, writeJson } from '@/data/storage';

const KEY = 'doublo.deviceid.v1';
const DeviceIdSchema = z.string().min(1);

function randomDeviceId(): string {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const rand = (Math.random() * 16) | 0;
    const value = char === 'x' ? rand : (rand & 0x3) | 0x8;
    return value.toString(16);
  });
}

export async function getDeviceId(): Promise<string> {
  const existing = await readJson(KEY, DeviceIdSchema);
  if (existing) {
    return existing;
  }
  const id = randomDeviceId();
  await writeJson(KEY, DeviceIdSchema, id);
  return id;
}
