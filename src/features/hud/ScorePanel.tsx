import { StyleSheet, Text, View } from 'react-native';
import type { Colors } from '@/theme/colors';
import { useThemedStyles } from '@/theme/useTheme';
import { font, layout, radius, spacing } from '@/theme/tokens';
import { useGameStore } from '@/store/game-store';
import { useStatsStore } from '@/store/stats-store';

interface StatProps {
  label: string;
  value: number;
}

function Stat({ label, value }: StatProps) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.stat}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

export function ScorePanel() {
  const styles = useThemedStyles(makeStyles);
  const score = useGameStore((state) => state.score);
  const best = useStatsStore((state) => state.best);
  return (
    <View style={styles.row}>
      <Stat label="SCORE" value={score} />
      <Stat label="BEST" value={best} />
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
      gap: spacing.md,
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
  });
