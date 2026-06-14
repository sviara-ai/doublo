import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import type { Colors } from '@/theme/colors';
import { useScreenMetrics } from '@/theme/layout';
import { useThemedStyles } from '@/theme/useTheme';
import { font, layout, spacing } from '@/theme/tokens';
import { useSettingsStore } from '@/store/settings-store';
import { useStatsStore } from '@/store/stats-store';

export default function HomeScreen() {
  const router = useRouter();
  const best = useStatsStore((state) => state.best);
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
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            maxWidth: metrics.contentMaxWidth,
            paddingHorizontal: metrics.horizontalPadding + spacing.sm,
            paddingVertical: metrics.isShort ? spacing.xl : spacing.xxl * 2,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text
            style={[styles.title, metrics.isNarrow && styles.titleCompact]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            Doublo
          </Text>
          <Text style={styles.tagline}>
            Swipe. Merge. Double to {winTarget}.
          </Text>
        </View>
        <View style={styles.actions}>
          <Text style={styles.best}>Best {best}</Text>
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
    </SafeAreaView>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
      width: '100%',
    },
    content: {
      flexGrow: 1,
      width: '100%',
      maxWidth: layout.maxContentWidth,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xxl * 2,
    },
    hero: {
      alignItems: 'center',
      gap: spacing.md,
    },
    title: {
      fontSize: font.hero,
      fontWeight: '800',
      color: colors.text,
    },
    titleCompact: {
      fontSize: font.title,
    },
    tagline: {
      fontSize: font.md,
      color: colors.textMuted,
      textAlign: 'center',
    },
    actions: {
      width: '100%',
      maxWidth: layout.maxButtonWidth,
      alignItems: 'center',
      gap: spacing.md,
    },
    best: {
      fontSize: font.md,
      fontWeight: '700',
      color: colors.textMuted,
      marginBottom: spacing.sm,
    },
  });
