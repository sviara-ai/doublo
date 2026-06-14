import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { palette } from '@/theme/colors';
import { useStatsStore } from '@/store/stats-store';

export default function HomeScreen() {
  const router = useRouter();
  const best = useStatsStore((state) => state.best);
  const hydrate = useStatsStore((state) => state.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>Doublo</Text>
        <Text style={styles.tagline}>Swipe. Merge. Double to 2048.</Text>
      </View>
      <View style={styles.actions}>
        <Text style={styles.best}>Best {best}</Text>
        <Button label="Play" onPress={() => router.push('/game')} />
        <Button
          label="Scores"
          variant="ghost"
          onPress={() => router.push('/history')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 72,
  },
  hero: {
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 64,
    fontWeight: '800',
    color: palette.text,
  },
  tagline: {
    fontSize: 16,
    color: palette.muted,
  },
  actions: {
    alignItems: 'center',
    gap: 14,
  },
  best: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.muted,
    marginBottom: 8,
  },
});
