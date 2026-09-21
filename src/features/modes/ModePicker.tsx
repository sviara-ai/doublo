import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  MODE_DESCRIPTIONS,
  MODE_LABELS,
  MODE_OPTIONS,
} from '@/game/constants';
import { clearWebFocus } from '@/lib/focus';
import type { GameMode } from '@/shared/types';
import type { Colors } from '@/theme/colors';
import { useThemedStyles } from '@/theme/useTheme';
import { font, layout, radius, spacing } from '@/theme/tokens';

interface Props {
  value: GameMode;
  onChange: (mode: GameMode) => void;
}

export function ModePicker({ value, onChange }: Props) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.wrap} accessibilityRole="radiogroup">
      <View style={styles.row}>
        {MODE_OPTIONS.map((mode) => {
          const selected = mode === value;
          return (
            <Pressable
              key={mode}
              accessibilityRole="radio"
              accessibilityLabel={`${MODE_LABELS[mode]}. ${MODE_DESCRIPTIONS[mode]}`}
              accessibilityState={{ selected, checked: selected }}
              aria-checked={selected}
              onPress={() => {
                clearWebFocus();
                onChange(mode);
              }}
              style={({ pressed }) => [
                styles.card,
                selected && styles.cardSelected,
                pressed && !selected && styles.cardPressed,
              ]}
            >
              <Text
                style={[styles.label, selected && styles.labelSelected]}
                importantForAccessibility="no"
              >
                {MODE_LABELS[mode]}
              </Text>
              <Text
                style={[
                  styles.description,
                  selected && styles.descriptionSelected,
                ]}
                importantForAccessibility="no"
              >
                {MODE_DESCRIPTIONS[mode]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}


const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    wrap: {
      width: '100%',
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    card: {
      minWidth: layout.modeCardMinWidth,
      minHeight: layout.modeCardMinHeight,
      flexGrow: 1,
      flexBasis: 0,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.hairline,
      backgroundColor: colors.track,
      gap: spacing.xs,
      justifyContent: 'center',
    },
    cardPressed: {
      backgroundColor: colors.boardCell,
    },
    cardSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    label: {
      color: colors.text,
      fontSize: font.md,
      fontWeight: '800',
    },
    labelSelected: {
      color: colors.textInverse,
    },
    description: {
      color: colors.textMuted,
      fontSize: font.xs,
      fontWeight: '600',
    },
    descriptionSelected: {
      color: colors.textInverse,
    },
  });
