export type Direction = 'up' | 'down' | 'left' | 'right';

export type GameStatus = 'playing' | 'won' | 'over';

export interface Tile {
  id: number;
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  justMerged?: boolean;
  merging?: boolean;
}

export interface MoveResult {
  tiles: Tile[];
  moved: boolean;
  scoreGained: number;
}

export interface SpawnResult {
  tile: Tile | null;
  nextTileId: number;
}

export interface InitialTilesResult {
  tiles: Tile[];
  nextTileId: number;
}
