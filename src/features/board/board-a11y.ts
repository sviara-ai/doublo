import { maxTileValue } from '@/game/engine';
import type { Direction, Tile } from '@/shared/types';

export const MOVE_ACTIONS: { name: Direction; label: string }[] = [
  { name: 'up', label: 'Move tiles up' },
  { name: 'down', label: 'Move tiles down' },
  { name: 'left', label: 'Move tiles left' },
  { name: 'right', label: 'Move tiles right' },
];

export function describeBoard(tiles: Tile[], gridSize: number): string {
  const placed = tiles.filter((tile) => !tile.merging);
  const highest = maxTileValue(tiles);
  const empty = gridSize * gridSize - placed.length;
  return `Game board, ${gridSize} by ${gridSize}. ${placed.length} tiles, ${empty} empty squares. Highest tile ${highest}.`;
}

export function describeTile(tile: Tile): string {
  return `${tile.value}, row ${tile.row + 1}, column ${tile.col + 1}`;
}
