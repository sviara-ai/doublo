import { useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { config } from '@/config';
import { MODE_LABELS } from '@/game/constants';
import { formatDuration, formatPlayedAt } from '@/lib/format';
import { goHomeOrBack } from '@/lib/navigation';
import type { Colors } from '@/theme/colors';
import { useScreenMetrics } from '@/theme/layout';
import { useThemedStyles } from '@/theme/useTheme';
import { font, layout, radius, spacing } from '@/theme/tokens';
import { useStatsStore } from '@/store/stats-store';

interface SummaryProps {
  label: string;
  value: number;
}

function Summary({ label, value }: SummaryProps) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${label} ${value}`}
      style={styles.summaryItem}
    >
      <Text
        style={styles.summaryValue}
        numberOfLines={1}
        adjustsFontSizeToFit
        importantForAccessibility="no"
      >
        {value}
      </Text>
      <Text style={styles.summaryLabel} importantForAccessibility="no">
        {label}
      </Text>
    </View>
  );
}

export default function HistoryScreen() {
  const router = useRouter();
  const history = useStatsStore((state) => state.history);
  const best = useStatsStore((state) => state.best);
  const gamesPlayed = useStatsStore((state) => state.gamesPlayed);
  const hydrate = useStatsStore((state) => state.hydrate);
  const styles = useThemedStyles(makeStyles);
  const metrics = useScreenMetrics();

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <View
        style={[
          styles.content,
          {
            maxWidth: metrics.contentMaxWidth,
            paddingHorizontal: metrics.horizontalPadding + spacing.sm,
            paddingBottom: metrics.isShort ? spacing.lg : spacing.xl,
          },
        ]}
      >
        <ScreenHeader title="Scores" onBack={() => goHomeOrBack(router)} />

        <Card title="SUMMARY">
          <View style={styles.summary}>
            <Summary label="BEST" value={best} />
            <View style={styles.divider} />
            <Summary label="GAMES" value={gamesPlayed} />
          </View>
          {config.onlineEnabled ? null : (
            <Text style={styles.soon}>
              Global leaderboard coming soon. Only Pure games will rank.
            </Text>
          )}
        </Card>

        <Text style={styles.listHeading}>RECENT GAMES</Text>
        <FlatList
          style={styles.list}
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No games yet. Play your first round!
            </Text>
          }
          renderItem={({ item }) => (
            <View
              accessible
              accessibilityRole="text"
              accessibilityLabel={`${item.score} points, highest tile ${item.maxTile}, ${item.moves} moves, played ${formatPlayedAt(item.createdAt)}`}
              style={styles.entry}
            >
              <View style={styles.entryMain} importantForAccessibility="no">
                <Text
                  style={styles.entryScore}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {item.score}
                </Text>
                {item.mode ? (
                  <View style={styles.modeTag}>
                    <Text style={styles.modeTagLabel}>
                      {MODE_LABELS[item.mode]}
                    </Text>
                  </View>
                ) : null}
              </View>
              <View style={styles.entryDetail} importantForAccessibility="no">
                <Text style={styles.entryMeta}>
                  max {item.maxTile} · {item.moves} moves
                </Text>
                <Text style={styles.entryDate}>
                  {formatPlayedAt(item.createdAt)} ·{' '}
                  {formatDuration(item.durationMs)}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    content: {
      flex: 1,
      width: '100%',
      maxWidth: layout.maxContentWidth,
      alignSelf: 'center',
      gap: spacing.md,
    },
    summary: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    summaryItem: {
      flex: 1,
      alignItems: 'center',
      gap: spacing.xs / 2,
    },
    summaryValue: {
      color: colors.text,
      fontSize: font.xl,
      fontWeight: '800',
      maxWidth: '100%',
    },
    summaryLabel: {
      color: colors.textMuted,
      fontSize: font.xs,
      fontWeight: '700',
      letterSpacing: 1,
    },
    divider: {
      width: 1,
      alignSelf: 'stretch',
      backgroundColor: colors.hairline,
    },
    soon: {
      textAlign: 'center',
      color: colors.textMuted,
      fontSize: font.xs,
      fontWeight: '600',
    },
    listHeading: {
      color: colors.textMuted,
      fontSize: font.xs,
      fontWeight: '700',
      letterSpacing: 1,
      paddingHorizontal: spacing.xs,
    },
    list: {
      flex: 1,
    },
    listContent: {
      gap: spacing.sm,
      paddingBottom: spacing.lg,
    },
    empty: {
      textAlign: 'center',
      color: colors.textMuted,
      marginTop: spacing.xxl,
    },
    entry: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.hairline,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    entryMain: {
      flexShrink: 1,
      gap: spacing.xs,
      alignItems: 'flex-start',
    },
    entryScore: {
      fontSize: font.lg,
      fontWeight: '800',
      color: colors.text,
    },
    modeTag: {
      borderRadius: radius.sm,
      backgroundColor: colors.track,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs / 2,
    },
    modeTagLabel: {
      color: colors.textMuted,
      fontSize: font.xs,
      fontWeight: '700',
    },
    entryDetail: {
      flexShrink: 1,
      alignItems: 'flex-end',
      gap: spacing.xs,
    },
    entryMeta: {
      fontSize: font.sm,
      color: colors.textMuted,
      textAlign: 'right',
    },
    entryDate: {
      fontSize: font.xs,
      color: colors.textMuted,
      textAlign: 'right',
    },
  });
