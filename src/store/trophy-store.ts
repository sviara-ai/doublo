import { create } from 'zustand';
import { MILESTONE_TILES } from '@/game/constants';
import { loadTrophies, saveTrophies } from '@/data/trophy-repository';

interface TrophyState {
  earned: number[];
  pending: number | null;
  loaded: boolean;
  hydrate: () => Promise<void>;
  award: (maxTile: number) => void;
  clearPending: () => void;
}

export const useTrophyStore = create<TrophyState>()((set, get) => ({
  earned: [],
  pending: null,
  loaded: false,
  hydrate: async () => {
    if (get().loaded) {
      return;
    }
    const book = await loadTrophies();
    set({ earned: book.earned, loaded: true });
  },
  award: (maxTile) => {
    const { earned } = get();
    const unlocked = MILESTONE_TILES.filter(
      (milestone) => milestone <= maxTile && !earned.includes(milestone),
    );
    if (unlocked.length === 0) {
      return;
    }
    const next = [...earned, ...unlocked].sort((a, b) => a - b);
    set({ earned: next, pending: unlocked[unlocked.length - 1] });
    void saveTrophies({ earned: next });
  },
  clearPending: () => set({ pending: null }),
}));
