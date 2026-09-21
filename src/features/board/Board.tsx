import { type ReactNode, useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { MOVE_DURATION_BY_SPEED } from '@/game/constants';
import type { Colors } from '@/theme/colors';
import { useBoardMetrics } from '@/theme/layout';
import { useThemedStyles } from '@/theme/useTheme';
import { motion } from '@/theme/tokens';
import { useGameStore } from '@/store/game-store';
import { useSettingsStore } from '@/store/settings-store';
import { describeBoard, MOVE_ACTIONS } from './board-a11y';
import { Tile } from './Tile';
import type { Direction, Tile as TileModel } from '@/shared/types';

interface Props {
  tiles: TileModel[];
  onMove: (direction: Direction) => void;
  children?: ReactNode;
}

export function Board({ tiles, onMove, children }: Props) {
  const gridSize = useGameStore((state) => state.gridSize);
  const blockedSeq = useGameStore((state) => state.blockedSeq);
  const animationSpeed = useSettingsStore((state) => state.animationSpeed);
  const metrics = useBoardMetrics(gridSize);
  const styles = useThemedStyles(makeStyles);
  const reducedMotion = useReducedMotion();
  const duration = reducedMotion ? 0 : MOVE_DURATION_BY_SPEED[animationSpeed];
  const shake = useSharedValue(0);

  useEffect(() => {
    if (blockedSeq === 0 || reducedMotion) {
      return;
    }
    shake.value = withSequence(
      withTiming(-motion.shakeOffset, { duration: motion.shakeMs }),
      withTiming(motion.shakeOffset, { duration: motion.shakeMs }),
      withTiming(0, { duration: motion.shakeMs }),
    );
  }, [blockedSeq, reducedMotion, shake]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  const cells = useMemo(
    () =>
      Array.from({ length: gridSize * gridSize }, (_, index) => ({
        row: Math.floor(index / gridSize),
        col: index % gridSize,
      })),
    [gridSize],
  );

  return (
    <Animated.View
      accessible
      accessibilityLabel={describeBoard(tiles, gridSize)}
      accessibilityHint="Use the move actions, or swipe, to slide every tile."
      accessibilityActions={MOVE_ACTIONS}
      onAccessibilityAction={(event) => {
        onMove(event.nativeEvent.actionName as Direction);
      }}
      style={[
        styles.board,
        shakeStyle,
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
              borderRadius: metrics.cellRadius,
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
          cornerRadius={metrics.cellRadius}
          fontSize={metrics.fontSize(tile.value)}
          duration={duration}
        />
      ))}
      {children ? <View style={styles.overlay}>{children}</View> : null}
    </Animated.View>
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
