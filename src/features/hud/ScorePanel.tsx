import { StyleSheet, Text, View } from 'react-native';
import { palette } from '@/theme/colors';
import { useGameStore } from '@/store/game-store';
import { useStatsStore } from '@/store/stats-store';

interface StatProps {
  label: string;
  value: number;
}

function Stat({ label, value }: StatProps) {
  return (
    <View style={styles.stat}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export function ScorePanel() {
  const score = useGameStore((state) => state.score);
  const best = useStatsStore((state) => state.best);
  return (
    <View style={styles.row}>
      <Stat label="SCORE" value={score} />
      <Stat label="BEST" value={best} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    backgroundColor: palette.card,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 22,
    alignItems: 'center',
    minWidth: 96,
  },
  label: {
    color: palette.textInverse,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  value: {
    color: palette.textInverse,
    fontSize: 24,
    fontWeight: '800',
  },
});
