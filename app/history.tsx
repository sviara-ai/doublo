import { useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { config } from '@/config';
import { palette } from '@/theme/colors';
import { useStatsStore } from '@/store/stats-store';

interface SummaryProps {
  label: string;
  value: number;
}

function Summary({ label, value }: SummaryProps) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

export default function HistoryScreen() {
  const router = useRouter();
  const history = useStatsStore((state) => state.history);
  const best = useStatsStore((state) => state.best);
  const gamesPlayed = useStatsStore((state) => state.gamesPlayed);
  const hydrate = useStatsStore((state) => state.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Scores</Text>
      <View style={styles.summary}>
        <Summary label="Best" value={best} />
        <Summary label="Games" value={gamesPlayed} />
      </View>
      {config.onlineEnabled ? null : (
        <Text style={styles.soon}>Global leaderboard coming soon</Text>
      )}
      <FlatList
        style={styles.list}
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.empty}>No games yet. Play your first round!</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Text style={styles.entryScore}>{item.score}</Text>
            <Text style={styles.entryMeta}>
              max {item.maxTile} · {item.moves} moves
            </Text>
          </View>
        )}
      />
      <Button label="Back" variant="ghost" onPress={() => router.back()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: palette.text,
    textAlign: 'center',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
  },
  summaryItem: {
    backgroundColor: palette.card,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  summaryValue: {
    color: palette.textInverse,
    fontSize: 26,
    fontWeight: '800',
  },
  summaryLabel: {
    color: palette.textInverse,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  soon: {
    textAlign: 'center',
    color: palette.muted,
    marginTop: 16,
  },
  list: {
    flex: 1,
    marginTop: 16,
  },
  listContent: {
    gap: 10,
    paddingBottom: 16,
  },
  empty: {
    textAlign: 'center',
    color: palette.muted,
    marginTop: 40,
  },
  entry: {
    backgroundColor: '#eee4da',
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  entryScore: {
    fontSize: 20,
    fontWeight: '800',
    color: palette.text,
  },
  entryMeta: {
    fontSize: 14,
    color: palette.muted,
  },
});
