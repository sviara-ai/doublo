import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { TIME_ATTACK_WARNING_MS } from '@/game/constants';
import { formatClock } from '@/lib/format';
import type { Colors } from '@/theme/colors';
import { useThemedStyles } from '@/theme/useTheme';
import { font, motion, spacing } from '@/theme/tokens';
import { useGameStore } from '@/store/game-store';
import { useStatsStore } from '@/store/stats-store';

function Divider() {
  const styles = useThemedStyles(makeStyles);
  return <View style={styles.divider} />;
}

function ScoreStat() {
  const styles = useThemedStyles(makeStyles);
  const score = useGameStore((state) => state.score);
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Score ${score}`}
      accessibilityLiveRegion="polite"
      style={styles.stat}
    >
      <Text style={styles.label} importantForAccessibility="no">
        SCORE
      </Text>
      <Text
        style={styles.value}
        numberOfLines={1}
        adjustsFontSizeToFit
        importantForAccessibility="no"
      >
        {score}
      </Text>
      <ScoreGain />
    </View>
  );
}

function ScoreGain() {
  const lastGain = useGameStore((state) => state.lastGain);
  const lastMultiplier = useGameStore((state) => state.lastMultiplier);
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
      {lastMultiplier > 1 ? (
        <Text style={styles.chain}> ×{lastMultiplier}</Text>
      ) : null}
    </Animated.Text>
  );
}

function BestStat() {
  const styles = useThemedStyles(makeStyles);
  const best = useStatsStore((state) => state.best);
  const loaded = useStatsStore((state) => state.loaded);
  const reducedMotion = useReducedMotion();
  const pop = useSharedValue(1);
  const previousBest = useRef<number | null>(null);

  useEffect(() => {
    if (!loaded) {
      return;
    }
    const previous = previousBest.current;
    previousBest.current = best;
    if (previous === null || best <= previous || reducedMotion) {
      return;
    }
    pop.value = withSequence(
      withTiming(motion.pulseScale, { duration: motion.pulseMs }),
      withTiming(1, { duration: motion.pulseMs }),
    );
  }, [best, loaded, reducedMotion, pop]);

  const popStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pop.value }],
  }));

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Best ${best}`}
      accessibilityLiveRegion="polite"
      style={styles.stat}
    >
      <Text style={styles.label} importantForAccessibility="no">
        BEST
      </Text>
      <Animated.Text
        style={[styles.value, popStyle]}
        numberOfLines={1}
        adjustsFontSizeToFit
        importantForAccessibility="no"
      >
        {best}
      </Animated.Text>
    </View>
  );
}

function TimeStat() {
  const styles = useThemedStyles(makeStyles);
  const timeLeftMs = useGameStore((state) => state.timeLeftMs);
  const clock = formatClock(timeLeftMs);
  const isLow = timeLeftMs <= TIME_ATTACK_WARNING_MS;
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Time left ${clock}`}
      accessibilityLiveRegion="polite"
      style={styles.stat}
    >
      <Text style={styles.label} importantForAccessibility="no">
        TIME
      </Text>
      <Text
        style={[styles.value, isLow && styles.warning]}
        numberOfLines={1}
        adjustsFontSizeToFit
        importantForAccessibility="no"
      >
        {clock}
      </Text>
    </View>
  );
}

export function ScorePanel() {
  const styles = useThemedStyles(makeStyles);
  const mode = useGameStore((state) => state.mode);
  return (
    <View style={styles.row}>
      <ScoreStat />
      <Divider />
      <BestStat />
      {mode === 'timeAttack' ? (
        <>
          <Divider />
          <TimeStat />
        </>
      ) : null}
    </View>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    row: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
    },
    stat: {
      flex: 1,
      alignItems: 'center',
      gap: spacing.xs / 2,
    },
    divider: {
      width: 1,
      alignSelf: 'stretch',
      backgroundColor: colors.hairline,
    },
    label: {
      color: colors.textMuted,
      fontSize: font.xs,
      fontWeight: '700',
      letterSpacing: 1,
    },
    value: {
      color: colors.text,
      fontSize: font.lg,
      fontWeight: '800',
      maxWidth: '100%',
    },
    warning: {
      color: colors.danger,
    },
    gain: {
      position: 'absolute',
      top: 0,
      color: colors.primary,
      fontSize: font.sm,
      fontWeight: '800',
    },
    chain: {
      color: colors.gold,
      fontSize: font.sm,
      fontWeight: '800',
    },
  });
