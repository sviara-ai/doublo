import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
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
import { font, radius, spacing } from '@/theme/tokens';
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
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.options}>
        {options.map((option) => {
          const selected = option === value;
          return (
            <Pressable
              key={String(option)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
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
                {format ? format(option) : String(option)}
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
  const hydrate = useSettingsStore((state) => state.hydrate);
  const update = useSettingsStore((state) => state.update);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const applyStructural = async (partial: Partial<GameSettings>) => {
    await update(partial);
    startNewGame();
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
            hitSlop={12}
            onPress={() => goHomeOrBack(router)}
          >
            <Text style={styles.back}>‹ Back</Text>
          </Pressable>
        </View>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.note}>
          Changing the grid, starting tiles, or target starts a new game.
        </Text>

        <OptionRow
          title="Grid size"
          options={GRID_SIZE_OPTIONS}
          value={gridSize}
          format={(option) => `${option}×${option}`}
          onSelect={(option) => {
            void applyStructural({ gridSize: option as number });
          }}
        />
        <OptionRow
          title="Starting tiles"
          options={START_TILE_OPTIONS}
          value={startTiles}
          onSelect={(option) => {
            void applyStructural({ startTiles: option as number });
          }}
        />
        <OptionRow
          title="Win target"
          options={WIN_TARGET_OPTIONS}
          value={winTarget}
          onSelect={(option) => {
            void applyStructural({ winTarget: option as number });
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

        <Button
          label="Done"
          onPress={() => goHomeOrBack(router)}
        />
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
      minHeight: 44,
      minWidth: 64,
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
