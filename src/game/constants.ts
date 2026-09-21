import type { GameSettings } from '@/shared/schemas';
import type { GameMode } from '@/shared/types';

export const SPAWN_TILE_VALUE = 2;
export const SPAWN_BONUS_TILE_VALUE = 4;
export const SPAWN_FOUR_PROBABILITY = 0.1;
export const FIRST_TILE_ID = 1;

export const BEST_SCORE_FLUSH_MS = 1200;

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
  hapticsEnabled: true,
};

export const CHAIN_MULTIPLIERS = [1, 1, 1.5, 2, 3];

export function chainMultiplier(mergeCount: number): number {
  if (mergeCount <= 0) {
    return 1;
  }
  const index = Math.min(mergeCount, CHAIN_MULTIPLIERS.length - 1);
  return CHAIN_MULTIPLIERS[index];
}

export const TIME_ATTACK_MS = 3 * 60 * 1000;
export const TIME_ATTACK_TICK_MS = 200;
export const TIME_ATTACK_WARNING_MS = 30 * 1000;

export const MODE_OPTIONS: GameMode[] = ['classic', 'timeAttack', 'zen', 'pure'];

export const MODE_LABELS: Record<GameMode, string> = {
  classic: 'Classic',
  timeAttack: 'Time Attack',
  zen: 'Zen',
  pure: 'Pure',
};

export const MODE_DESCRIPTIONS: Record<GameMode, string> = {
  classic: 'The full game, with undo.',
  timeAttack: 'Three minutes. Score as high as you can.',
  zen: 'You can never lose. The board clears itself.',
  pure: 'No undo. The only mode that ranks.',
};

export const MILESTONE_TILES = [128, 256, 512, 1024, 2048, 4096];
export const TROPHY_TOAST_MS = 2600;

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
