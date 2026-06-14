export const palette = {
  background: '#faf8ef',
  boardBackground: '#bbada0',
  emptyCell: 'rgba(238, 228, 218, 0.35)',
  text: '#776e65',
  textInverse: '#f9f6f2',
  muted: '#a39689',
  button: '#8f7a66',
  buttonText: '#f9f6f2',
  card: '#bbada0',
  overlay: 'rgba(250, 248, 239, 0.9)',
};

interface TileColor {
  background: string;
  color: string;
}

const tileColors: Record<number, TileColor> = {
  2: { background: '#eee4da', color: '#776e65' },
  4: { background: '#ede0c8', color: '#776e65' },
  8: { background: '#f2b179', color: '#f9f6f2' },
  16: { background: '#f59563', color: '#f9f6f2' },
  32: { background: '#f67c5f', color: '#f9f6f2' },
  64: { background: '#f65e3b', color: '#f9f6f2' },
  128: { background: '#edcf72', color: '#f9f6f2' },
  256: { background: '#edcc61', color: '#f9f6f2' },
  512: { background: '#edc850', color: '#f9f6f2' },
  1024: { background: '#edc53f', color: '#f9f6f2' },
  2048: { background: '#edc22e', color: '#f9f6f2' },
};

const superTile: TileColor = { background: '#3c3a32', color: '#f9f6f2' };

export function tileColor(value: number): TileColor {
  return tileColors[value] ?? superTile;
}
