import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { BannerAdUnit } from '@/components/ads/BannerAdUnit';
import type { Colors } from '@/theme/colors';
import { useScreenMetrics } from '@/theme/layout';
import { useThemedStyles } from '@/theme/useTheme';
import { font, layout, radius, spacing } from '@/theme/tokens';
import { useSettingsStore } from '@/store/settings-store';
import { useStatsStore } from '@/store/stats-store';

export default function HomeScreen() {
  const router = useRouter();
  const best = useStatsStore((state) => state.best);
  const gamesPlayed = useStatsStore((state) => state.gamesPlayed);
  const hydrate = useStatsStore((state) => state.hydrate);
  const winTarget = useSettingsStore((state) => state.winTarget);
  const hydrateSettings = useSettingsStore((state) => state.hydrate);
  const styles = useThemedStyles(makeStyles);
  const metrics = useScreenMetrics();

  useEffect(() => {
    void hydrate();
    void hydrateSettings();
  }, [hydrate, hydrateSettings]);

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
        <View style={styles.hero}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>{winTarget}</Text>
          </View>
          <Text
            style={[styles.title, metrics.isNarrow && styles.titleCompact]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            Doublo
          </Text>
          <Text style={styles.tagline}>Swipe, merge, and double the tiles.</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>BEST</Text>
            <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
              {best}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>GAMES</Text>
            <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
              {gamesPlayed}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button label="Play" onPress={() => router.push('/game')} />
          <Button
            label="Scores"
            variant="ghost"
            onPress={() => router.push('/history')}
          />
          <Button
            label="Settings"
            variant="ghost"
            onPress={() => router.push('/settings')}
          />
        </View>
      </ScrollView>

      {/* Banner ad anchored to the bottom of the home screen */}
      <BannerAdUnit />
    </SafeAreaView>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    scroll: { flex: 1, width: '100%' },
    content: {
      flexGrow: 1, width: '100%', maxWidth: layout.maxContentWidth,
      alignSelf: 'center', alignItems: 'center', justifyContent: 'center',
      gap: spacing.xxl, paddingHorizontal: spacing.xl, paddingVertical: spacing.xxl,
    },
    hero: { alignItems: 'center', gap: spacing.md },
    logo: {
      width: 96, height: 96, borderRadius: radius.lg,
      backgroundColor: colors.primary, alignItems: 'center',
      justifyContent: 'center', marginBottom: spacing.sm,
    },
    logoText: { color: colors.textInverse, fontSize: font.lg, fontWeight: '800' },
    title: { fontSize: font.hero, fontWeight: '800', color: colors.text, letterSpacing: 0.5 },
    titleCompact: { fontSize: font.title },
    tagline: { fontSize: font.md, color: colors.textMuted, textAlign: 'center' },
    stats: { flexDirection: 'row', justifyContent: 'center', gap: spacing.md },
    statCard: {
      minWidth: layout.scoreStatMinWidth, alignItems: 'center',
      backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.hairline,
      borderRadius: radius.md, paddingVertical: spacing.md, paddingHorizontal: spacing.xl,
    },
    statLabel: { color: colors.textMuted, fontSize: font.xs, fontWeight: '700', letterSpacing: 1 },
    statValue: { color: colors.text, fontSize: font.xl, fontWeight: '800', maxWidth: '100%' },
    actions: { width: '100%', maxWidth: layout.maxButtonWidth, alignItems: 'center', gap: spacing.md },
  });
