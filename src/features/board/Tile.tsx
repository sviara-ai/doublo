import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { MOVE_DURATION_MS } from '@/game/constants';
import { tileColor } from '@/theme/colors';
import { cellPosition, cellSize, fontSizeForValue } from '@/theme/metrics';
import type { Tile as TileModel } from '@/shared/types';

interface Props {
  tile: TileModel;
}

export function Tile({ tile }: Props) {
  const x = useSharedValue(cellPosition(tile.col));
  const y = useSharedValue(cellPosition(tile.row));
  const scale = useSharedValue(tile.isNew ? 0 : 1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    x.value = withTiming(cellPosition(tile.col), { duration: MOVE_DURATION_MS });
    y.value = withTiming(cellPosition(tile.row), { duration: MOVE_DURATION_MS });
  }, [tile.col, tile.row, x, y]);

  useEffect(() => {
    if (tile.isNew) {
      scale.value = withTiming(1, { duration: MOVE_DURATION_MS });
    }
  }, [tile.isNew, scale]);

  useEffect(() => {
    if (tile.justMerged) {
      scale.value = withSequence(
        withTiming(1.12, { duration: 70 }),
        withTiming(1, { duration: 70 }),
      );
    }
  }, [tile.justMerged, scale]);

  useEffect(() => {
    if (tile.merging) {
      opacity.value = withTiming(0, { duration: MOVE_DURATION_MS });
    }
  }, [tile.merging, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const colors = tileColor(tile.value);
  const zIndex = tile.merging ? 1 : tile.justMerged ? 3 : 2;

  return (
    <Animated.View
      style={[
        styles.tile,
        { backgroundColor: colors.background, zIndex },
        animatedStyle,
      ]}
    >
      <Text
        style={[
          styles.value,
          { color: colors.color, fontSize: fontSizeForValue(tile.value) },
        ]}
      >
        {tile.value}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tile: {
    position: 'absolute',
    width: cellSize,
    height: cellSize,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontWeight: '800',
  },
});
