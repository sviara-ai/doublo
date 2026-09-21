import { create } from 'zustand';
import {
  DEFAULT_SETTINGS,
  FIRST_TILE_ID,
  TIME_ATTACK_MS,
} from '@/game/constants';
import type { GameMode, GameStatus, Tile } from '@/shared/types';

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
  mode: GameMode;
  timeLeftMs: number;
  nextTileId: number;
  previous: GameSnapshot | null;
  lastGain: number;
  lastMultiplier: number;
  gainSeq: number;
  blockedSeq: number;
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
  mode: 'classic',
  timeLeftMs: TIME_ATTACK_MS,
  nextTileId: FIRST_TILE_ID,
  previous: null,
  lastGain: 0,
  lastMultiplier: 1,
  gainSeq: 0,
  blockedSeq: 0,
  set: (partial) => set(partial),
}));
