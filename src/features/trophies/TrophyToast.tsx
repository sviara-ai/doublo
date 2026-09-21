import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { TROPHY_TOAST_MS } from '@/game/constants';
import type { Colors } from '@/theme/colors';
import { useThemedStyles } from '@/theme/useTheme';
import { font, motion, radius, spacing } from '@/theme/tokens';
import { useTrophyStore } from '@/store/trophy-store';

export function TrophyToast() {
  const styles = useThemedStyles(makeStyles);
  const pending = useTrophyStore((state) => state.pending);
  const clearPending = useTrophyStore((state) => state.clearPending);
  const reducedMotion = useReducedMotion();
  const fade = useSharedValue(0);
  const rise = useSharedValue(motion.floatRise);

  useEffect(() => {
    if (pending === null) {
      return undefined;
    }
    const duration = reducedMotion ? 0 : motion.pulseMs;
    fade.value = withTiming(1, { duration });
    rise.value = withTiming(0, { duration });
    const id = setTimeout(clearPending, TROPHY_TOAST_MS);
    return () => clearTimeout(id);
  }, [pending, clearPending, reducedMotion, fade, rise]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ translateY: rise.value }],
  }));

  if (pending === null) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityRole="alert"
      accessibilityLabel={`Trophy unlocked, ${pending} tile reached for the first time`}
      accessibilityLiveRegion="assertive"
      style={[styles.toast, animatedStyle]}
    >
      <Text style={styles.trophy} importantForAccessibility="no">
        🏆
      </Text>
      <Text style={styles.value} importantForAccessibility="no">
        {pending}
      </Text>
      <Text style={styles.caption} importantForAccessibility="no">
        First time!
      </Text>
    </Animated.View>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    toast: {
      position: 'absolute',
      top: spacing.xxl,
      alignSelf: 'center',
      zIndex: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.gold,
      borderRadius: radius.pill,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
    },
    trophy: {
      fontSize: font.lg,
    },
    value: {
      color: colors.gold,
      fontSize: font.lg,
      fontWeight: '800',
    },
    caption: {
      color: colors.textMuted,
      fontSize: font.sm,
      fontWeight: '700',
    },
  });
