import { create } from 'zustand';
import { BEST_SCORE_FLUSH_MS } from '@/game/constants';
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
  updateBest: (score: number) => void;
  recordGame: (entry: ScoreEntry) => Promise<void>;
}

let flushTimer: ReturnType<typeof setTimeout> | null = null;

function cancelPendingFlush(): void {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
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
  updateBest: (score) => {
    if (score <= get().best) {
      return;
    }
    set({ best: score });
    cancelPendingFlush();
    flushTimer = setTimeout(() => {
      flushTimer = null;
      void saveScoreBoard({
        best: get().best,
        gamesPlayed: get().gamesPlayed,
        history: get().history,
      });
    }, BEST_SCORE_FLUSH_MS);
  },
  recordGame: async (entry) => {
    cancelPendingFlush();
    const board = appendEntry(
      {
        best: get().best,
        gamesPlayed: get().gamesPlayed,
        history: get().history,
      },
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
