import {
  BOARD_SIZE,
  SPAWN_FOUR_PROBABILITY,
  START_TILES,
  WIN_VALUE,
} from './constants';
import type { Direction, MoveResult, Tile } from '@/shared/types';

let nextId = 1;

function createId(): number {
  const id = nextId;
  nextId += 1;
  return id;
}

export function getNextId(): number {
  return nextId;
}

export function setNextId(value: number): void {
  nextId = value;
}

export function resetIds(): void {
  nextId = 1;
}

function logicalTiles(tiles: Tile[]): Tile[] {
  return tiles.filter((tile) => !tile.merging);
}

function emptyCells(tiles: Tile[]): { row: number; col: number }[] {
  const occupied = new Set(
    logicalTiles(tiles).map((tile) => tile.row * BOARD_SIZE + tile.col),
  );
  const cells: { row: number; col: number }[] = [];
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      if (!occupied.has(row * BOARD_SIZE + col)) {
        cells.push({ row, col });
      }
    }
  }
  return cells;
}

export function spawnTile(
  tiles: Tile[],
  random: () => number = Math.random,
): Tile | null {
  const cells = emptyCells(tiles);
  if (cells.length === 0) {
    return null;
  }
  const cell = cells[Math.floor(random() * cells.length)];
  const value = random() < SPAWN_FOUR_PROBABILITY ? 4 : 2;
  return { id: createId(), value, row: cell.row, col: cell.col, isNew: true };
}

export function createInitialTiles(random: () => number = Math.random): Tile[] {
  resetIds();
  let tiles: Tile[] = [];
  for (let i = 0; i < START_TILES; i += 1) {
    const tile = spawnTile(tiles, random);
    if (tile) {
      tiles = [...tiles, tile];
    }
  }
  return tiles;
}

function lineCells(direction: Direction): { row: number; col: number }[][] {
  const lines: { row: number; col: number }[][] = [];
  for (let i = 0; i < BOARD_SIZE; i += 1) {
    const cells: { row: number; col: number }[] = [];
    for (let j = 0; j < BOARD_SIZE; j += 1) {
      if (direction === 'left') {
        cells.push({ row: i, col: j });
      } else if (direction === 'right') {
        cells.push({ row: i, col: BOARD_SIZE - 1 - j });
      } else if (direction === 'up') {
        cells.push({ row: j, col: i });
      } else {
        cells.push({ row: BOARD_SIZE - 1 - j, col: i });
      }
    }
    lines.push(cells);
  }
  return lines;
}

export function applyMove(input: Tile[], direction: Direction): MoveResult {
  const grid: (Tile | null)[][] = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null),
  );
  for (const tile of logicalTiles(input)) {
    grid[tile.row][tile.col] = tile;
  }

  const survivors: Tile[] = [];
  const merging: Tile[] = [];
  let moved = false;
  let scoreGained = 0;

  for (const line of lineCells(direction)) {
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
        scoreGained += last.value;
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
    return { tiles: input, moved: false, scoreGained: 0 };
  }
  return { tiles: [...merging, ...survivors], moved: true, scoreGained };
}

export function maxTileValue(tiles: Tile[]): number {
  return logicalTiles(tiles).reduce(
    (max, tile) => (tile.value > max ? tile.value : max),
    0,
  );
}

export function hasWon(tiles: Tile[]): boolean {
  return logicalTiles(tiles).some((tile) => tile.value >= WIN_VALUE);
}

export function canMove(tiles: Tile[]): boolean {
  const logical = logicalTiles(tiles);
  if (logical.length < BOARD_SIZE * BOARD_SIZE) {
    return true;
  }
  const grid: number[][] = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => 0),
  );
  for (const tile of logical) {
    grid[tile.row][tile.col] = tile.value;
  }
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const value = grid[row][col];
      if (col + 1 < BOARD_SIZE && grid[row][col + 1] === value) {
        return true;
      }
      if (row + 1 < BOARD_SIZE && grid[row + 1][col] === value) {
        return true;
      }
    }
  }
  return false;
}

export function clearTransientFlags(tiles: Tile[]): Tile[] {
  return logicalTiles(tiles).map((tile) => ({
    id: tile.id,
    value: tile.value,
    row: tile.row,
    col: tile.col,
  }));
}
