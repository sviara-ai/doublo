import {
  chainMultiplier,
  FIRST_TILE_ID,
  SPAWN_BONUS_TILE_VALUE,
  SPAWN_FOUR_PROBABILITY,
  SPAWN_TILE_VALUE,
} from './constants';
import type {
  Direction,
  InitialTilesResult,
  MoveResult,
  SpawnResult,
  Tile,
} from '@/shared/types';

function logicalTiles(tiles: Tile[]): Tile[] {
  return tiles.filter((tile) => !tile.merging);
}

function emptyCells(
  tiles: Tile[],
  size: number,
): { row: number; col: number }[] {
  const occupied = new Set(
    logicalTiles(tiles).map((tile) => tile.row * size + tile.col),
  );
  const cells: { row: number; col: number }[] = [];
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (!occupied.has(row * size + col)) {
        cells.push({ row, col });
      }
    }
  }
  return cells;
}

export function spawnTile(
  tiles: Tile[],
  size: number,
  nextTileId: number,
  random: () => number = Math.random,
): SpawnResult {
  const cells = emptyCells(tiles, size);
  if (cells.length === 0) {
    return { tile: null, nextTileId };
  }
  const cell = cells[Math.floor(random() * cells.length)];
  const value =
    random() < SPAWN_FOUR_PROBABILITY
      ? SPAWN_BONUS_TILE_VALUE
      : SPAWN_TILE_VALUE;
  return {
    tile: {
      id: nextTileId,
      value,
      row: cell.row,
      col: cell.col,
      isNew: true,
    },
    nextTileId: nextTileId + 1,
  };
}

export function createInitialTiles(
  size: number,
  startTiles: number,
  random: () => number = Math.random,
): InitialTilesResult {
  let tiles: Tile[] = [];
  let nextTileId = FIRST_TILE_ID;
  for (let i = 0; i < startTiles; i += 1) {
    const spawned = spawnTile(tiles, size, nextTileId, random);
    if (spawned.tile) {
      tiles = [...tiles, spawned.tile];
    }
    nextTileId = spawned.nextTileId;
  }
  return { tiles, nextTileId };
}

function lineCells(
  direction: Direction,
  size: number,
): { row: number; col: number }[][] {
  const lines: { row: number; col: number }[][] = [];
  for (let i = 0; i < size; i += 1) {
    const cells: { row: number; col: number }[] = [];
    for (let j = 0; j < size; j += 1) {
      if (direction === 'left') {
        cells.push({ row: i, col: j });
      } else if (direction === 'right') {
        cells.push({ row: i, col: size - 1 - j });
      } else if (direction === 'up') {
        cells.push({ row: j, col: i });
      } else {
        cells.push({ row: size - 1 - j, col: i });
      }
    }
    lines.push(cells);
  }
  return lines;
}

export function applyMove(
  input: Tile[],
  direction: Direction,
  size: number,
): MoveResult {
  const grid: (Tile | null)[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null),
  );
  for (const tile of logicalTiles(input)) {
    grid[tile.row][tile.col] = tile;
  }

  const survivors: Tile[] = [];
  const merging: Tile[] = [];
  let moved = false;
  let baseScore = 0;
  let mergeCount = 0;
  let topMergedValue = 0;

  for (const line of lineCells(direction, size)) {
    const present = line
      .map((cell) => grid[cell.row][cell.col])
      .filter((tile): tile is Tile => tile !== null);

    const placed: {
      tile: Tile;
      merged: boolean;
      value: number;
      absorbed?: Tile;
    }[] = [];

    for (const tile of present) {
      const last = placed[placed.length - 1];
      if (last && !last.merged && last.value === tile.value) {
        last.merged = true;
        last.value = tile.value * 2;
        last.absorbed = tile;
        baseScore += last.value;
        mergeCount += 1;
        if (last.value > topMergedValue) {
          topMergedValue = last.value;
        }
      } else {
        placed.push({ tile, merged: false, value: tile.value });
      }
    }

    for (let index = 0; index < placed.length; index += 1) {
      const cell = line[index];
      const entry = placed[index];
      const positionChanged =
        entry.tile.row !== cell.row || entry.tile.col !== cell.col;
      if (positionChanged || entry.merged) {
        moved = true;
      }
      survivors.push({
        id: entry.tile.id,
        value: entry.value,
        row: cell.row,
        col: cell.col,
        justMerged: entry.merged,
      });
      if (entry.absorbed) {
        merging.push({
          id: entry.absorbed.id,
          value: entry.absorbed.value,
          row: cell.row,
          col: cell.col,
          merging: true,
        });
      }
    }
  }

  if (!moved) {
    return {
      tiles: input,
      moved: false,
      scoreGained: 0,
      baseScore: 0,
      mergeCount: 0,
      multiplier: 1,
      topMergedValue: 0,
    };
  }
  const multiplier = chainMultiplier(mergeCount);
  return {
    tiles: [...merging, ...survivors],
    moved: true,
    scoreGained: Math.round(baseScore * multiplier),
    baseScore,
    mergeCount,
    multiplier,
    topMergedValue,
  };
}

export function maxTileValue(tiles: Tile[]): number {
  return logicalTiles(tiles).reduce(
    (max, tile) => (tile.value > max ? tile.value : max),
    0,
  );
}

export function hasWon(tiles: Tile[], winTarget: number): boolean {
  return logicalTiles(tiles).some((tile) => tile.value >= winTarget);
}

export function canMove(tiles: Tile[], size: number): boolean {
  const logical = logicalTiles(tiles);
  if (logical.length < size * size) {
    return true;
  }
  const grid: number[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => 0),
  );
  for (const tile of logical) {
    grid[tile.row][tile.col] = tile.value;
  }
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const value = grid[row][col];
      if (col + 1 < size && grid[row][col + 1] === value) {
        return true;
      }
      if (row + 1 < size && grid[row + 1][col] === value) {
        return true;
      }
    }
  }
  return false;
}

export function relieveBoard(tiles: Tile[], size: number): Tile[] {
  let current = logicalTiles(tiles);
  while (current.length > 0 && !canMove(current, size)) {
    const lowest = current.reduce(
      (min, tile) => (tile.value < min ? tile.value : min),
      current[0].value,
    );
    const survivors = current.filter((tile) => tile.value !== lowest);
    if (survivors.length === current.length) {
      return current;
    }
    current = survivors;
  }
  return current;
}

export function clearTransientFlags(tiles: Tile[]): Tile[] {
  return logicalTiles(tiles).map((tile) => ({
    id: tile.id,
    value: tile.value,
    row: tile.row,
    col: tile.col,
  }));
}
