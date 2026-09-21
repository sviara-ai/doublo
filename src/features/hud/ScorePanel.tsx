import { useEffect, useRef, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import type { Colors } from '@/theme/colors';
import { useThemedStyles } from '@/theme/useTheme';
import { font, layout, motion, radius, spacing } from '@/theme/tokens';
import { useGameStore } from '@/store/game-store';
import { useStatsStore } from '@/store/stats-store';

interface StatProps {
  label: string;
  value: number;
  children?: ReactNode;
}

function Stat({ label, value, children }: StatProps) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${label} ${value}`}
      accessibilityLiveRegion="polite"
      style={styles.stat}
    >
      <Text style={styles.label} importantForAccessibility="no">
        {label}
      </Text>
      <Text
        style={styles.value}
        numberOfLines={1}
        adjustsFontSizeToFit
        importantForAccessibility="no"
      >
        {value}
      </Text>
      {children}
    </View>
  );
}

function ScoreGain() {
  const lastGain = useGameStore((state) => state.lastGain);
  const gainSeq = useGameStore((state) => state.gainSeq);
  const styles = useThemedStyles(makeStyles);
  const reducedMotion = useReducedMotion();
  const rise = useSharedValue(0);
  const fade = useSharedValue(0);

  useEffect(() => {
    if (gainSeq === 0 || lastGain <= 0 || reducedMotion) {
      return;
    }
    rise.value = 0;
    fade.value = 1;
    rise.value = withTiming(-motion.floatRise, { duration: motion.floatMs });
    fade.value = withTiming(0, { duration: motion.floatMs });
  }, [gainSeq, lastGain, reducedMotion, rise, fade]);

  const floatStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ translateY: rise.value }],
  }));

  if (lastGain <= 0) {
    return null;
  }

  return (
    <Animated.Text
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.gain, floatStyle]}
    >
      +{lastGain}
    </Animated.Text>
  );
}

function BestStat() {
  const best = useStatsStore((state) => state.best);
  const styles = useThemedStyles(makeStyles);
  const reducedMotion = useReducedMotion();
  const pop = useSharedValue(1);
  const previousBest = useRef(best);

  useEffect(() => {
    const improved = best > previousBest.current;
    previousBest.current = best;
    if (!improved || reducedMotion) {
      return;
    }
    pop.value = withSequence(
      withTiming(motion.pulseScale, { duration: motion.pulseMs }),
      withTiming(1, { duration: motion.pulseMs }),
    );
  }, [best, reducedMotion, pop]);

  const popStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pop.value }],
  }));

  return (
    <Animated.View style={[styles.popWrap, popStyle]}>
      <Stat label="BEST" value={best} />
    </Animated.View>
  );
}

export function ScorePanel() {
  const styles = useThemedStyles(makeStyles);
  const score = useGameStore((state) => state.score);
  return (
    <View style={styles.row}>
      <Stat label="SCORE" value={score}>
        <ScoreGain />
      </Stat>
      <BestStat />
    </View>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    row: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'flex-start',
      gap: spacing.md,
    },
    popWrap: {
      flexGrow: 1,
      flexShrink: 1,
      maxWidth: layout.scoreStatMaxWidth,
    },
    stat: {
      backgroundColor: colors.cardNavy,
      borderRadius: radius.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.xl,
      alignItems: 'center',
      minWidth: layout.scoreStatMinWidth,
      maxWidth: layout.scoreStatMaxWidth,
      flexGrow: 1,
      flexShrink: 1,
    },
    label: {
      color: colors.textInverse,
      fontSize: font.xs,
      fontWeight: '700',
      letterSpacing: 1,
    },
    value: {
      color: colors.textInverse,
      fontSize: font.lg,
      fontWeight: '800',
      maxWidth: '100%',
    },
    gain: {
      position: 'absolute',
      top: spacing.xs,
      color: colors.accent,
      fontSize: font.md,
      fontWeight: '800',
    },
  });
