import { type ReactNode, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { MOVE_DURATION_BY_SPEED } from '@/game/constants';
import type { Colors } from '@/theme/colors';
import { useBoardMetrics } from '@/theme/layout';
import { useThemedStyles } from '@/theme/useTheme';
import { useGameStore } from '@/store/game-store';
import { useSettingsStore } from '@/store/settings-store';
import { Tile } from './Tile';
import type { Tile as TileModel } from '@/shared/types';

interface Props {
  tiles: TileModel[];
  children?: ReactNode;
}

export function Board({ tiles, children }: Props) {
  const gridSize = useGameStore((state) => state.gridSize);
  const animationSpeed = useSettingsStore((state) => state.animationSpeed);
  const metrics = useBoardMetrics(gridSize);
  const styles = useThemedStyles(makeStyles);
  const duration = MOVE_DURATION_BY_SPEED[animationSpeed];

  const cells = useMemo(
    () =>
      Array.from({ length: gridSize * gridSize }, (_, index) => ({
        row: Math.floor(index / gridSize),
        col: index % gridSize,
      })),
    [gridSize],
  );

  return (
    <View
      style={[
        styles.board,
        {
          width: metrics.boardSize,
          height: metrics.boardSize,
          borderRadius: metrics.cellGap,
        },
      ]}
    >
      {cells.map((cell) => (
        <View
          key={`cell-${cell.row}-${cell.col}`}
          style={[
            styles.cell,
            {
              width: metrics.cellSize,
              height: metrics.cellSize,
              borderRadius: metrics.cellSize * 0.12,
              left: metrics.position(cell.col),
              top: metrics.position(cell.row),
            },
          ]}
        />
      ))}
      {tiles.map((tile) => (
        <Tile
          key={tile.id}
          tile={tile}
          x={metrics.position(tile.col)}
          y={metrics.position(tile.row)}
          size={metrics.cellSize}
          fontSize={metrics.fontSize(tile.value)}
          duration={duration}
        />
      ))}
      {children ? <View style={styles.overlay}>{children}</View> : null}
    </View>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    board: {
      backgroundColor: colors.board,
      alignSelf: 'center',
      overflow: 'hidden',
    },
    cell: {
      position: 'absolute',
      backgroundColor: colors.boardCell,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 10,
      elevation: 10,
    },
  });
