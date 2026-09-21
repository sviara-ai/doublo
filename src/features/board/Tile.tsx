import { memo, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { tileColor } from '@/theme/tiles';
import { motion } from '@/theme/tokens';
import { describeTile } from './board-a11y';
import type { Tile as TileModel } from '@/shared/types';

interface Props {
  tile: TileModel;
  x: number;
  y: number;
  size: number;
  cornerRadius: number;
  fontSize: number;
  duration: number;
}

function TileView({
  tile,
  x,
  y,
  size,
  cornerRadius,
  fontSize,
  duration,
}: Props) {
  const tx = useSharedValue(x);
  const ty = useSharedValue(y);
  const scale = useSharedValue(tile.isNew ? 0 : 1);
  const opacity = useSharedValue(1);
  const popMs = duration === 0 ? 0 : motion.popMs;

  useEffect(() => {
    tx.value = withTiming(x, { duration });
    ty.value = withTiming(y, { duration });
  }, [x, y, duration, tx, ty]);

  useEffect(() => {
    if (tile.isNew) {
      scale.value = withTiming(1, { duration });
    }
  }, [tile.isNew, duration, scale]);

  useEffect(() => {
    if (tile.justMerged) {
      scale.value = withSequence(
        withTiming(motion.popScale, { duration: popMs }),
        withTiming(1, { duration: popMs }),
      );
    }
  }, [tile.justMerged, popMs, scale]);

  useEffect(() => {
    if (tile.merging) {
      opacity.value = withTiming(0, { duration });
    }
  }, [tile.merging, duration, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const colors = tileColor(tile.value);
  const zIndex = tile.merging ? 1 : tile.justMerged ? 3 : 2;

  return (
    <Animated.View
      accessibilityRole="text"
      accessibilityLabel={describeTile(tile)}
      accessibilityElementsHidden={tile.merging}
      importantForAccessibility={tile.merging ? 'no-hide-descendants' : 'yes'}
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          borderRadius: cornerRadius,
          backgroundColor: colors.background,
          zIndex,
        },
        animatedStyle,
      ]}
    >
      <Text
        style={[styles.value, { color: colors.color, fontSize }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {tile.value}
      </Text>
    </Animated.View>
  );
}

export const Tile = memo(
  TileView,
  (prev, next) =>
    prev.tile.id === next.tile.id &&
    prev.tile.value === next.tile.value &&
    prev.x === next.x &&
    prev.y === next.y &&
    prev.size === next.size &&
    prev.cornerRadius === next.cornerRadius &&
    prev.fontSize === next.fontSize &&
    prev.duration === next.duration &&
    prev.tile.isNew === next.tile.isNew &&
    prev.tile.justMerged === next.tile.justMerged &&
    prev.tile.merging === next.tile.merging,
);

const styles = StyleSheet.create({
  tile: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontWeight: '800',
    maxWidth: '90%',
  },
});
