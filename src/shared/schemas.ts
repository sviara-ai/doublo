import { z } from 'zod';

export const TileSchema = z.object({
  id: z.number(),
  value: z.number(),
  row: z.number(),
  col: z.number(),
  isNew: z.boolean().optional(),
  justMerged: z.boolean().optional(),
  merging: z.boolean().optional(),
});

export const GameSettingsSchema = z.object({
  gridSize: z.number(),
  startTiles: z.number(),
  winTarget: z.number(),
  animationSpeed: z.enum(['normal', 'fast']),
});

export const SavedGameSchema = z.object({
  tiles: z.array(TileSchema),
  score: z.number(),
  moves: z.number(),
  startedAt: z.number(),
  status: z.enum(['playing', 'won']),
  keepPlaying: z.boolean(),
  nextTileId: z.number(),
  gridSize: z.number(),
  winTarget: z.number(),
});

export const ScoreEntrySchema = z.object({
  id: z.string(),
  userId: z.string(),
  score: z.number(),
  maxTile: z.number(),
  moves: z.number(),
  durationMs: z.number(),
  createdAt: z.number(),
});

export const ScoreBoardSchema = z.object({
  best: z.number(),
  gamesPlayed: z.number(),
  history: z.array(ScoreEntrySchema),
});

export type GameSettings = z.infer<typeof GameSettingsSchema>;
export type SavedGame = z.infer<typeof SavedGameSchema>;
export type ScoreEntry = z.infer<typeof ScoreEntrySchema>;
export type ScoreBoard = z.infer<typeof ScoreBoardSchema>;
