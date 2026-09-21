import { loadScoreBoard } from '@/data/score-repository';
import type { ScoreEntry } from '@/shared/schemas';
import type { GameMode } from '@/shared/types';

export const RANKED_MODE: GameMode = 'pure';

export interface LeaderboardEntry {
  userId: string;
  score: number;
  maxTile: number;
  createdAt: number;
}

export interface LeaderboardService {
  submit: (entry: ScoreEntry) => Promise<void>;
  top: (limit: number) => Promise<LeaderboardEntry[]>;
}

const localLeaderboardService: LeaderboardService = {
  submit: async () => {},
  top: async (limit) => {
    const board = await loadScoreBoard();
    return board.history
      .filter((entry) => entry.mode === RANKED_MODE)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((entry) => ({
        userId: entry.userId,
        score: entry.score,
        maxTile: entry.maxTile,
        createdAt: entry.createdAt,
      }));
  },
};

export function getLeaderboardService(): LeaderboardService {
  return localLeaderboardService;
}
