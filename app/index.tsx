import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { BannerAdUnit } from '@/components/ads/BannerAdUnit';
import { ModePicker } from '@/features/modes/ModePicker';
import { TrophyShelf } from '@/features/trophies/TrophyShelf';
import type { GameMode } from '@/shared/types';
import type { Colors } from '@/theme/colors';
import { useScreenMetrics } from '@/theme/layout';
import { useThemedStyles } from '@/theme/useTheme';
import { font, layout, radius, spacing } from '@/theme/tokens';
import { useGameStore } from '@/store/game-store';
import { useSettingsStore } from '@/store/settings-store';
import { useStatsStore } from '@/store/stats-store';
import { useTrophyStore } from '@/store/trophy-store';

interface StatProps {
  label: string;
  value: number;
}

function Stat({ label, value }: StatProps) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${label} ${value}`}
      style={styles.stat}
    >
      <Text
        style={styles.statValue}
        numberOfLines={1}
        adjustsFontSizeToFit
        importantForAccessibility="no"
      >
        {value}
      </Text>
      <Text style={styles.statLabel} importantForAccessibility="no">
        {label}
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const best = useStatsStore((state) => state.best);
  const gamesPlayed = useStatsStore((state) => state.gamesPlayed);
  const hydrate = useStatsStore((state) => state.hydrate);
  const winTarget = useSettingsStore((state) => state.winTarget);
  const hydrateSettings = useSettingsStore((state) => state.hydrate);
  const hydrateTrophies = useTrophyStore((state) => state.hydrate);
  const styles = useThemedStyles(makeStyles);
  const metrics = useScreenMetrics();
  const [mode, setMode] = useState<GameMode>(
    () => useGameStore.getState().mode,
  );

  useEffect(() => {
    void hydrate();
    void hydrateSettings();
    void hydrateTrophies();
  }, [hydrate, hydrateSettings, hydrateTrophies]);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            maxWidth: metrics.contentMaxWidth,
            paddingHorizontal: metrics.horizontalPadding + spacing.sm,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brand}>
          <View
            accessible
            accessibilityRole="text"
            accessibilityLabel={`Win target ${winTarget}`}
            style={styles.mark}
          >
            <Text
              style={styles.markText}
              numberOfLines={1}
              adjustsFontSizeToFit
              importantForAccessibility="no"
            >
              {winTarget}
            </Text>
          </View>
          <View style={styles.brandText}>
            <Text
              accessibilityRole="header"
              style={styles.title}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              Doublo
            </Text>
            <Text style={styles.tagline} numberOfLines={1}>
              Swipe, merge, double.
            </Text>
          </View>
        </View>

        <Card title="YOUR RECORD">
          <View style={styles.stats}>
            <Stat label="BEST" value={best} />
            <View style={styles.divider} />
            <Stat label="GAMES" value={gamesPlayed} />
          </View>
          <View style={styles.shelfDivider} />
          <TrophyShelf />
        </Card>

        <Card title="MODE">
          <ModePicker value={mode} onChange={setMode} />
        </Card>

        <View style={styles.actions}>
          <Button
            label="Play"
            onPress={() => router.push(`/game?mode=${mode}`)}
          />
          <View style={styles.secondaryRow}>
            <Button
              label="Scores"
              variant="outline"
              inline
              onPress={() => router.push('/history')}
            />
            <Button
              label="Settings"
              variant="outline"
              inline
              onPress={() => router.push('/settings')}
            />
          </View>
        </View>
      </ScrollView>

      <BannerAdUnit />
    </SafeAreaView>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    scroll: { flex: 1, width: '100%' },
    content: {
      flexGrow: 1,
      width: '100%',
      maxWidth: layout.maxContentWidth,
      alignSelf: 'center',
      justifyContent: 'center',
      gap: spacing.lg,
      paddingVertical: spacing.xl,
    },
    brand: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    mark: {
      width: layout.brandMarkSize,
      height: layout.brandMarkSize,
      borderRadius: radius.md,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xs,
    },
    markText: {
      color: colors.textInverse,
      fontSize: font.sm,
      fontWeight: '800',
    },
    brandText: {
      flexShrink: 1,
    },
    title: {
      fontSize: font.title,
      fontWeight: '800',
      color: colors.text,
      letterSpacing: 0.5,
    },
    tagline: {
      fontSize: font.sm,
      color: colors.textMuted,
    },
    stats: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    stat: {
      flex: 1,
      alignItems: 'center',
      gap: spacing.xs / 2,
    },
    statValue: {
      color: colors.text,
      fontSize: font.xl,
      fontWeight: '800',
      maxWidth: '100%',
    },
    statLabel: {
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
    shelfDivider: {
      height: 1,
      width: '100%',
      backgroundColor: colors.hairline,
    },
    actions: {
      width: '100%',
      gap: spacing.sm,
      alignItems: 'center',
    },
    secondaryRow: {
      flexDirection: 'row',
      width: '100%',
      maxWidth: layout.maxButtonWidth,
      gap: spacing.sm,
    },
  });
