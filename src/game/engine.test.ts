import {
  applyMove,
  canMove,
  clearTransientFlags,
  createInitialTiles,
  hasWon,
  maxTileValue,
  spawnTile,
} from './engine';
import type { Tile } from '@/shared/types';

function tile(id: number, value: number, row: number, col: number): Tile {
  return { id, value, row, col };
}

function survivors(tiles: Tile[]): Tile[] {
  return tiles.filter((item) => !item.merging);
}

describe('applyMove', () => {
  it('slides tiles to the wall in the move direction', () => {
    const result = applyMove([tile(1, 2, 0, 2)], 'left');
    expect(result.moved).toBe(true);
    expect(survivors(result.tiles)[0]).toMatchObject({ value: 2, row: 0, col: 0 });
  });

  it('merges two equal tiles into one doubled tile', () => {
    const result = applyMove([tile(1, 2, 0, 0), tile(2, 2, 0, 1)], 'left');
    expect(result.scoreGained).toBe(4);
    expect(survivors(result.tiles)).toHaveLength(1);
    expect(survivors(result.tiles)[0]).toMatchObject({ value: 4, row: 0, col: 0 });
  });

  it('does not merge three equal tiles into a single tile', () => {
    const result = applyMove(
      [tile(1, 2, 0, 0), tile(2, 2, 0, 1), tile(3, 2, 0, 2)],
      'left',
    );
    const values = survivors(result.tiles)
      .map((item) => item.value)
      .sort((a, b) => a - b);
    expect(values).toEqual([2, 4]);
  });

  it('reports no movement when nothing can slide or merge', () => {
    const result = applyMove([tile(1, 2, 0, 0), tile(2, 4, 0, 1)], 'left');
    expect(result.moved).toBe(false);
    expect(result.scoreGained).toBe(0);
  });
});

describe('canMove', () => {
  it('returns true when an empty cell exists', () => {
    expect(canMove([tile(1, 2, 0, 0)])).toBe(true);
  });

  it('returns false on a full board with no possible merges', () => {
    const tiles = [
      tile(1, 2, 0, 0),
      tile(2, 4, 0, 1),
      tile(3, 2, 0, 2),
      tile(4, 4, 0, 3),
      tile(5, 4, 1, 0),
      tile(6, 2, 1, 1),
      tile(7, 4, 1, 2),
      tile(8, 2, 1, 3),
      tile(9, 2, 2, 0),
      tile(10, 4, 2, 1),
      tile(11, 2, 2, 2),
      tile(12, 4, 2, 3),
      tile(13, 4, 3, 0),
      tile(14, 2, 3, 1),
      tile(15, 4, 3, 2),
      tile(16, 2, 3, 3),
    ];
    expect(canMove(tiles)).toBe(false);
  });
});

describe('helpers', () => {
  it('detects a win at the target value', () => {
    expect(hasWon([tile(1, 2048, 0, 0)])).toBe(true);
    expect(hasWon([tile(1, 1024, 0, 0)])).toBe(false);
  });

  it('reports the highest tile value', () => {
    expect(maxTileValue([tile(1, 8, 0, 0), tile(2, 64, 0, 1)])).toBe(64);
  });

  it('strips transient flags and merging tiles', () => {
    const cleaned = clearTransientFlags([
      { id: 1, value: 4, row: 0, col: 0, justMerged: true },
      { id: 2, value: 2, row: 0, col: 0, merging: true },
    ]);
    expect(cleaned).toHaveLength(1);
    expect(cleaned[0]).toEqual({ id: 1, value: 4, row: 0, col: 0 });
  });

  it('creates a deterministic initial board with two tiles', () => {
    const tiles = createInitialTiles(() => 0);
    expect(tiles).toHaveLength(2);
  });

  it('spawns a tile into an empty cell', () => {
    const spawned = spawnTile([tile(1, 2, 0, 0)], () => 0);
    expect(spawned).not.toBeNull();
    expect(spawned?.isNew).toBe(true);
  });
});
