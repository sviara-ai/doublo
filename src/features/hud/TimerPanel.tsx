import { StyleSheet, Text, View } from 'react-native';
import { TIME_ATTACK_WARNING_MS } from '@/game/constants';
import { formatClock } from '@/lib/format';
import type { Colors } from '@/theme/colors';
import { useThemedStyles } from '@/theme/useTheme';
import { font, layout, radius, spacing } from '@/theme/tokens';
import { useGameStore } from '@/store/game-store';

export function TimerPanel() {
  const styles = useThemedStyles(makeStyles);
  const mode = useGameStore((state) => state.mode);
  const timeLeftMs = useGameStore((state) => state.timeLeftMs);

  if (mode !== 'timeAttack') {
    return null;
  }

  const clock = formatClock(timeLeftMs);
  const isLow = timeLeftMs <= TIME_ATTACK_WARNING_MS;

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Time left ${clock}`}
      accessibilityLiveRegion="polite"
      style={styles.panel}
    >
      <Text style={styles.label} importantForAccessibility="no">
        TIME
      </Text>
      <Text
        style={[styles.value, isLow && styles.warning]}
        importantForAccessibility="no"
      >
        {clock}
      </Text>
    </View>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    panel: {
      minWidth: layout.scoreStatMinWidth,
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.hairline,
      borderRadius: radius.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
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
    },
    warning: {
      color: colors.danger,
    },
  });
