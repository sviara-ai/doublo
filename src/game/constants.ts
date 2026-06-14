import type { GameSettings } from '@/shared/schemas';

export const SPAWN_TILE_VALUE = 2;
export const SPAWN_BONUS_TILE_VALUE = 4;
export const SPAWN_FOUR_PROBABILITY = 0.1;

export const GRID_SIZE_OPTIONS = [3, 4, 5, 6] as const;
export const START_TILE_OPTIONS = [1, 2, 3] as const;
export const WIN_TARGET_OPTIONS = [512, 1024, 2048, 4096] as const;
export const ANIMATION_SPEED_OPTIONS = ['normal', 'fast'] as const;

export const DEFAULT_SETTINGS: GameSettings = {
  gridSize: 4,
  startTiles: 2,
  winTarget: 2048,
  animationSpeed: 'normal',
  soundEnabled: true,
};

export const MOVE_DURATION_BY_SPEED: Record<
  GameSettings['animationSpeed'],
  number
> = {
  normal: 110,
  fast: 65,
};

export function transientClearMs(speed: GameSettings['animationSpeed']): number {
  return MOVE_DURATION_BY_SPEED[speed] + 30;
}
