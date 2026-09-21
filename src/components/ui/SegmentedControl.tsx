import { Pressable, StyleSheet, Text, View } from 'react-native';
import { clearWebFocus } from '@/lib/focus';
import type { Colors } from '@/theme/colors';
import { useThemedStyles } from '@/theme/useTheme';
import { elevation, font, layout, radius, spacing } from '@/theme/tokens';

export interface SegmentOption {
  value: string | number;
  label: string;
}

interface Props {
  label: string;
  hint?: string;
  options: readonly SegmentOption[];
  value: string | number;
  onChange: (value: string | number) => void;
}

export function SegmentedControl({
  label,
  hint,
  options,
  value,
  onChange,
}: Props) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.group}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
      <View style={styles.track} accessibilityRole="radiogroup">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={String(option.value)}
              accessibilityRole="radio"
              accessibilityLabel={`${label}, ${option.label}`}
              accessibilityState={{ selected, checked: selected }}
              aria-checked={selected}
              onPress={() => {
                clearWebFocus();
                onChange(option.value);
              }}
              style={({ pressed }) => [
                styles.segment,
                selected && styles.segmentSelected,
                pressed && !selected && styles.segmentPressed,
              ]}
            >
              <Text
                style={[styles.text, selected && styles.textSelected]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {option.label}
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
    group: {
      width: '100%',
      gap: spacing.sm,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    label: {
      color: colors.text,
      fontSize: font.sm,
      fontWeight: '700',
    },
    hint: {
      color: colors.textMuted,
      fontSize: font.xs,
      fontWeight: '600',
      flexShrink: 1,
      textAlign: 'right',
    },
    track: {
      flexDirection: 'row',
      backgroundColor: colors.track,
      borderRadius: radius.md,
      padding: spacing.xs / 2,
      gap: spacing.xs / 2,
    },
    segment: {
      flex: 1,
      minHeight: layout.segmentHeight,
      paddingHorizontal: spacing.xs,
      borderRadius: radius.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    segmentPressed: {
      backgroundColor: colors.hover,
    },
    segmentSelected: {
      backgroundColor: colors.segmentActive,
      shadowColor: colors.shadow,
      ...elevation.card,
    },
    text: {
      color: colors.textMuted,
      fontSize: font.sm,
      fontWeight: '700',
    },
    textSelected: {
      color: colors.primary,
      fontWeight: '800',
    },
  });
