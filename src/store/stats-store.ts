import { create } from 'zustand';
import {
  appendEntry,
  loadScoreBoard,
  saveScoreBoard,
} from '@/data/score-repository';
import type { ScoreEntry } from '@/shared/schemas';

interface StatsState {
  best: number;
  gamesPlayed: number;
  history: ScoreEntry[];
  loaded: boolean;
  hydrate: () => Promise<void>;
  updateBest: (score: number) => Promise<void>;
  recordGame: (entry: ScoreEntry) => Promise<void>;
}

export const useStatsStore = create<StatsState>()((set, get) => ({
  best: 0,
  gamesPlayed: 0,
  history: [],
  loaded: false,
  hydrate: async () => {
    if (get().loaded) {
      return;
    }
    const board = await loadScoreBoard();
    set({
      best: board.best,
      gamesPlayed: board.gamesPlayed,
      history: board.history,
      loaded: true,
    });
  },
  updateBest: async (score) => {
    if (score <= get().best) {
      return;
    }
    const board = {
      best: score,
      gamesPlayed: get().gamesPlayed,
      history: get().history,
    };
    await saveScoreBoard(board);
    set({ best: score });
  },
  recordGame: async (entry) => {
    const board = appendEntry(
      { best: get().best, gamesPlayed: get().gamesPlayed, history: get().history },
      entry,
    );
    await saveScoreBoard(board);
    set({
      best: board.best,
      gamesPlayed: board.gamesPlayed,
      history: board.history,
    });
  },
}));
