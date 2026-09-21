import { useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
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
      <Text style={styles.summaryValue} importantForAccessibility="no">
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
            paddingVertical: metrics.isShort ? spacing.lg : spacing.xl,
          },
        ]}
      >
        <Text
          accessibilityRole="header"
          style={[styles.title, metrics.isNarrow && styles.titleCompact]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          Scores
        </Text>
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
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.empty}>No games yet. Play your first round!</Text>
          }
          renderItem={({ item }) => (
            <View
              accessible
              accessibilityRole="text"
              accessibilityLabel={`${item.score} points, highest tile ${item.maxTile}, ${item.moves} moves, played ${formatPlayedAt(item.createdAt)}`}
              style={styles.entry}
            >
              <Text
                style={styles.entryScore}
                numberOfLines={1}
                adjustsFontSizeToFit
                importantForAccessibility="no"
              >
                {item.score}
              </Text>
              <View style={styles.entryDetail} importantForAccessibility="no">
                <Text style={styles.entryMeta}>
                  max {item.maxTile} · {item.moves} moves
                </Text>
                <Text style={styles.entryDate}>
                  {item.mode ? `${MODE_LABELS[item.mode]} · ` : ''}
                  {formatPlayedAt(item.createdAt)} ·{' '}
                  {formatDuration(item.durationMs)}
                </Text>
              </View>
            </View>
          )}
        />
        <Button
          label="Back"
          variant="ghost"
          onPress={() => goHomeOrBack(router)}
        />
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      width: '100%',
      maxWidth: layout.maxContentWidth,
      alignSelf: 'center',
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xl,
    },
    title: {
      fontSize: font.title,
      fontWeight: '800',
      color: colors.text,
      textAlign: 'center',
    },
    titleCompact: {
      fontSize: font.xl,
    },
    summary: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: spacing.lg,
      marginTop: spacing.lg,
    },
    summaryItem: {
      backgroundColor: colors.cardNavy,
      borderRadius: radius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      alignItems: 'center',
      minWidth: layout.summaryMinWidth,
    },
    summaryValue: {
      color: colors.textInverse,
      fontSize: font.xl,
      fontWeight: '800',
    },
    summaryLabel: {
      color: colors.textInverse,
      fontSize: font.xs,
      fontWeight: '700',
      letterSpacing: 1,
    },
    soon: {
      textAlign: 'center',
      color: colors.textMuted,
      marginTop: spacing.lg,
    },
    list: {
      flex: 1,
      marginTop: spacing.lg,
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
      padding: spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    entryScore: {
      fontSize: font.lg,
      fontWeight: '800',
      color: colors.text,
      flexShrink: 1,
      minWidth: 72,
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
