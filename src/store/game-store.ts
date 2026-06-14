import { create } from 'zustand';
import { DEFAULT_SETTINGS } from '@/game/constants';
import type { GameStatus, Tile } from '@/shared/types';

export interface GameSnapshot {
  tiles: Tile[];
  score: number;
  moves: number;
  keepPlaying: boolean;
  nextTileId: number;
}

interface GameState {
  tiles: Tile[];
  score: number;
  moves: number;
  startedAt: number;
  status: GameStatus;
  keepPlaying: boolean;
  hydrated: boolean;
  gridSize: number;
  winTarget: number;
  previous: GameSnapshot | null;
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
  gridSize: DEFAULT_SETTINGS.gridSize,
  winTarget: DEFAULT_SETTINGS.winTarget,
  previous: null,
  set: (partial) => set(partial),
}));
