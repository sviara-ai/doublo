import { create } from 'zustand';
import { DEFAULT_SETTINGS } from '@/game/constants';
import { loadSettings, saveSettings } from '@/data/settings-repository';
import type { GameSettings } from '@/shared/schemas';

interface SettingsState extends GameSettings {
  loaded: boolean;
  hydrate: () => Promise<void>;
  update: (partial: Partial<GameSettings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()((set, get) => ({
  ...DEFAULT_SETTINGS,
  loaded: false,
  hydrate: async () => {
    if (get().loaded) {
      return;
    }
    const saved = await loadSettings();
    set({ ...(saved ?? DEFAULT_SETTINGS), loaded: true });
  },
  update: async (partial) => {
    const next: GameSettings = {
      gridSize: get().gridSize,
      startTiles: get().startTiles,
      winTarget: get().winTarget,
      animationSpeed: get().animationSpeed,
      ...partial,
    };
    await saveSettings(next);
    set(partial);
  },
}));
