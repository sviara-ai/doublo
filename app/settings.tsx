import { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Overlay } from '@/components/ui/Overlay';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import {
  ANIMATION_SPEED_OPTIONS,
  GRID_SIZE_OPTIONS,
  START_TILE_OPTIONS,
  WIN_TARGET_OPTIONS,
} from '@/game/constants';
import { startNewGame } from '@/game/session';
import { goHomeOrBack } from '@/lib/navigation';
import type { GameSettings } from '@/shared/schemas';
import type { Colors } from '@/theme/colors';
import { useScreenMetrics } from '@/theme/layout';
import { useThemedStyles } from '@/theme/useTheme';
import { font, spacing } from '@/theme/tokens';
import { useGameStore } from '@/store/game-store';
import { useSettingsStore } from '@/store/settings-store';

const ON_OFF = [
  { value: 'On', label: 'On' },
  { value: 'Off', label: 'Off' },
] as const;

export default function SettingsScreen() {
  const router = useRouter();
  const styles = useThemedStyles(makeStyles);
  const metrics = useScreenMetrics();
  const gridSize = useSettingsStore((state) => state.gridSize);
  const startTiles = useSettingsStore((state) => state.startTiles);
  const winTarget = useSettingsStore((state) => state.winTarget);
  const animationSpeed = useSettingsStore((state) => state.animationSpeed);
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const hapticsEnabled = useSettingsStore((state) => state.hapticsEnabled);
  const hydrate = useSettingsStore((state) => state.hydrate);
  const update = useSettingsStore((state) => state.update);
  const movesPlayed = useGameStore((state) => state.moves);
  const [pending, setPending] = useState<Partial<GameSettings> | null>(null);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const applyStructural = async (partial: Partial<GameSettings>) => {
    await update(partial);
    startNewGame();
  };

  const requestStructural = (
    partial: Partial<GameSettings>,
    current: string | number,
    next: string | number,
  ) => {
    if (current === next) {
      return;
    }
    if (movesPlayed > 0) {
      setPending(partial);
      return;
    }
    void applyStructural(partial);
  };

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
        <ScreenHeader title="Settings" onBack={() => goHomeOrBack(router)} />

        <Card title="BOARD">
          <Text style={styles.note}>
            Changing any of these starts a new game.
          </Text>
          <SegmentedControl
            label="Grid size"
            options={GRID_SIZE_OPTIONS.map((size) => ({
              value: size,
              label: `${size}×${size}`,
            }))}
            value={gridSize}
            onChange={(next) => {
              requestStructural({ gridSize: next as number }, gridSize, next);
            }}
          />
          <SegmentedControl
            label="Starting tiles"
            options={START_TILE_OPTIONS.map((count) => ({
              value: count,
              label: String(count),
            }))}
            value={startTiles}
            onChange={(next) => {
              requestStructural(
                { startTiles: next as number },
                startTiles,
                next,
              );
            }}
          />
          <SegmentedControl
            label="Win target"
            options={WIN_TARGET_OPTIONS.map((target) => ({
              value: target,
              label: String(target),
            }))}
            value={winTarget}
            onChange={(next) => {
              requestStructural({ winTarget: next as number }, winTarget, next);
            }}
          />
        </Card>

        <Card title="FEEL">
          <SegmentedControl
            label="Animation"
            hint="How fast tiles slide"
            options={ANIMATION_SPEED_OPTIONS.map((speed) => ({
              value: speed,
              label: speed.charAt(0).toUpperCase() + speed.slice(1),
            }))}
            value={animationSpeed}
            onChange={(next) => {
              void update({
                animationSpeed: next as GameSettings['animationSpeed'],
              });
            }}
          />
          <SegmentedControl
            label="Sound"
            hint="Merge tones"
            options={ON_OFF}
            value={soundEnabled ? 'On' : 'Off'}
            onChange={(next) => {
              void update({ soundEnabled: next === 'On' });
            }}
          />
          {Platform.OS === 'web' ? null : (
            <SegmentedControl
              label="Vibration"
              hint="Haptics on every move"
              options={ON_OFF}
              value={hapticsEnabled ? 'On' : 'Off'}
              onChange={(next) => {
                void update({ hapticsEnabled: next === 'On' });
              }}
            />
          )}
        </Card>

        <View style={styles.footer}>
          <Button label="Done" onPress={() => goHomeOrBack(router)} />
        </View>
      </ScrollView>
      {pending ? (
        <Overlay
          title="Start a new game?"
          message="This setting changes the board, so your game in progress will end."
          actionLabel="Start new game"
          onAction={() => {
            const change = pending;
            setPending(null);
            void applyStructural(change);
          }}
          secondaryLabel="Keep playing"
          onSecondary={() => setPending(null)}
        />
      ) : null}
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
      alignSelf: 'center',
      paddingBottom: spacing.xxl,
      gap: spacing.lg,
    },
    note: {
      fontSize: font.sm,
      color: colors.textMuted,
    },
    footer: {
      width: '100%',
      alignItems: 'center',
      paddingTop: spacing.xs,
    },
  });
