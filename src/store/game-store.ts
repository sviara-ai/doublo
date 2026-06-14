import { create } from 'zustand';
import type { GameStatus, Tile } from '@/shared/types';

interface GameState {
  tiles: Tile[];
  score: number;
  moves: number;
  startedAt: number;
  status: GameStatus;
  keepPlaying: boolean;
  hydrated: boolean;
  set: (partial: Partial<GameState>) => void;
}

export const useGameStore = create<GameState>()((set) => ({
  tiles: [],
  score: 0,
  moves: 0,
  startedAt: 0,
  status: 'playing',
  keepPlaying: false,
  hydrated: false,
  set: (partial) => set(partial),
}));
