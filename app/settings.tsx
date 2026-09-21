import { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Overlay } from '@/components/ui/Overlay';
import {
  ANIMATION_SPEED_OPTIONS,
  GRID_SIZE_OPTIONS,
  START_TILE_OPTIONS,
  WIN_TARGET_OPTIONS,
} from '@/game/constants';
import { startNewGame } from '@/game/session';
import { clearWebFocus } from '@/lib/focus';
import { goHomeOrBack } from '@/lib/navigation';
import type { GameSettings } from '@/shared/schemas';
import type { Colors } from '@/theme/colors';
import { useScreenMetrics } from '@/theme/layout';
import { useThemedStyles } from '@/theme/useTheme';
import { font, layout, radius, spacing } from '@/theme/tokens';
import { useGameStore } from '@/store/game-store';
import { useSettingsStore } from '@/store/settings-store';

interface OptionRowProps {
  title: string;
  options: readonly (string | number)[];
  value: string | number;
  format?: (option: string | number) => string;
  onSelect: (option: string | number) => void;
}

function OptionRow({ title, options, value, format, onSelect }: OptionRowProps) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.group} accessibilityRole="radiogroup">
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.options}>
        {options.map((option) => {
          const selected = option === value;
          const label = format ? format(option) : String(option);
          return (
            <Pressable
              key={String(option)}
              accessibilityRole="radio"
              accessibilityLabel={`${title}, ${label}`}
              accessibilityState={{ selected, checked: selected }}
              onPress={() => {
                clearWebFocus();
                onSelect(option);
              }}
              style={({ pressed }) => [
                styles.option,
                selected && styles.optionSelected,
                pressed && !selected && styles.optionPressed,
              ]}
            >
              <Text
                style={[
                  styles.optionLabel,
                  selected && styles.optionLabelSelected,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

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
        <View style={styles.topbar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={12}
            onPress={() => goHomeOrBack(router)}
          >
            <Text style={styles.back}>‹ Back</Text>
          </Pressable>
        </View>
        <Text style={styles.title} accessibilityRole="header">
          Settings
        </Text>
        <Text style={styles.note}>
          Changing the grid, starting tiles, or target starts a new game.
        </Text>

        <OptionRow
          title="Grid size"
          options={GRID_SIZE_OPTIONS}
          value={gridSize}
          format={(option) => `${option}×${option}`}
          onSelect={(option) => {
            requestStructural({ gridSize: option as number }, gridSize, option);
          }}
        />
        <OptionRow
          title="Starting tiles"
          options={START_TILE_OPTIONS}
          value={startTiles}
          onSelect={(option) => {
            requestStructural(
              { startTiles: option as number },
              startTiles,
              option,
            );
          }}
        />
        <OptionRow
          title="Win target"
          options={WIN_TARGET_OPTIONS}
          value={winTarget}
          onSelect={(option) => {
            requestStructural(
              { winTarget: option as number },
              winTarget,
              option,
            );
          }}
        />
        <OptionRow
          title="Animation"
          options={ANIMATION_SPEED_OPTIONS}
          value={animationSpeed}
          format={(option) =>
            String(option).charAt(0).toUpperCase() + String(option).slice(1)
          }
          onSelect={(option) => {
            void update({
              animationSpeed: option as GameSettings['animationSpeed'],
            });
          }}
        />
        <OptionRow
          title="Sound"
          options={['On', 'Off']}
          value={soundEnabled ? 'On' : 'Off'}
          onSelect={(option) => {
            void update({ soundEnabled: option === 'On' });
          }}
        />
        {Platform.OS === 'web' ? null : (
          <OptionRow
            title="Vibration"
            options={['On', 'Off']}
            value={hapticsEnabled ? 'On' : 'Off'}
            onSelect={(option) => {
              void update({ hapticsEnabled: option === 'On' });
            }}
          />
        )}

        <Button label="Done" onPress={() => goHomeOrBack(router)} />
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
      alignSelf: 'center',
      paddingVertical: spacing.xl,
      gap: spacing.lg,
    },
    topbar: {
      width: '100%',
      alignItems: 'flex-start',
    },
    back: {
      fontSize: font.md,
      fontWeight: '700',
      color: colors.primary,
    },
    title: {
      fontSize: font.title,
      fontWeight: '800',
      color: colors.text,
      textAlign: 'center',
    },
    note: {
      fontSize: font.sm,
      color: colors.textMuted,
      textAlign: 'center',
    },
    group: {
      width: '100%',
      gap: spacing.sm,
    },
    groupTitle: {
      fontSize: font.md,
      fontWeight: '700',
      color: colors.text,
    },
    options: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    option: {
      minHeight: layout.optionMinHeight,
      minWidth: layout.optionMinWidth,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.hairline,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionPressed: {
      backgroundColor: colors.boardCell,
    },
    optionSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    optionLabel: {
      fontSize: font.md,
      fontWeight: '700',
      color: colors.text,
    },
    optionLabelSelected: {
      color: colors.textInverse,
    },
  });
