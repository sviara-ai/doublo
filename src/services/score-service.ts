import type { ScoreEntry } from '@/shared/schemas';

interface BuildScoreEntryParams {
  userId: string;
  score: number;
  maxTile: number;
  moves: number;
  durationMs: number;
}

export function buildScoreEntry(params: BuildScoreEntryParams): ScoreEntry {
  return {
    id: `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`,
    userId: params.userId,
    score: params.score,
    maxTile: params.maxTile,
    moves: params.moves,
    durationMs: params.durationMs,
    createdAt: Date.now(),
  };
}
