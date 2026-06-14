import { z } from 'zod';

const ConfigSchema = z.object({
  apiUrl: z.string().url().optional(),
  onlineEnabled: z.boolean(),
});

export const config = ConfigSchema.parse({
  apiUrl: process.env.EXPO_PUBLIC_API_URL || undefined,
  onlineEnabled: process.env.EXPO_PUBLIC_ONLINE_ENABLED === 'true',
});
