interface TileColor {
  background: string;
  color: string;
}

const NAVY = '#00163F';
const WHITE = '#FFFFFF';

const ramp: Record<number, TileColor> = {
  2: { background: '#EAF1FC', color: NAVY },
  4: { background: '#D7E6F9', color: NAVY },
  8: { background: '#B9D2F3', color: NAVY },
  16: { background: '#93B7EA', color: NAVY },
  32: { background: '#6E9DE3', color: WHITE },
  64: { background: '#4A82D9', color: WHITE },
  128: { background: '#2E6FD2', color: WHITE },
  256: { background: '#155FC6', color: WHITE },
  512: { background: '#0E4AAB', color: WHITE },
  1024: { background: '#0B3A8C', color: WHITE },
  2048: { background: '#0060C7', color: WHITE },
};

const superTile: TileColor = { background: NAVY, color: WHITE };

export function tileColor(value: number): TileColor {
  return ramp[value] ?? superTile;
}
