import { StyleSheet, View } from 'react-native';
import { BOARD_SIZE } from '@/game/constants';
import { palette } from '@/theme/colors';
import { boardSize, cellPosition, cellSize } from '@/theme/metrics';
import { Tile } from './Tile';
import type { Tile as TileModel } from '@/shared/types';

interface Props {
  tiles: TileModel[];
}

const cells = Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, index) => ({
  row: Math.floor(index / BOARD_SIZE),
  col: index % BOARD_SIZE,
}));

export function Board({ tiles }: Props) {
  return (
    <View style={styles.board}>
      {cells.map((cell) => (
        <View
          key={`cell-${cell.row}-${cell.col}`}
          style={[
            styles.cell,
            { left: cellPosition(cell.col), top: cellPosition(cell.row) },
          ]}
        />
      ))}
      {tiles.map((tile) => (
        <Tile key={tile.id} tile={tile} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: boardSize,
    height: boardSize,
    backgroundColor: palette.boardBackground,
    borderRadius: 8,
  },
  cell: {
    position: 'absolute',
    width: cellSize,
    height: cellSize,
    borderRadius: 6,
    backgroundColor: palette.emptyCell,
  },
});
