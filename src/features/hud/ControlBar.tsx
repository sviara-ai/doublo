import { Pressable, StyleSheet, Text, View } from 'react-native';
import { clearWebFocus } from '@/lib/focus';
import type { Colors } from '@/theme/colors';
import { useThemedStyles } from '@/theme/useTheme';
import { font, radius, spacing } from '@/theme/tokens';

interface Props {
  canUndo: boolean;
  onUndo: () => void;
  onSettings: () => void;
}

interface ChipProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

function Chip({ label, onPress, disabled = false }: ChipProps) {
  const styles = useThemedStyles(makeStyles);
  const handlePress = () => {
    clearWebFocus();
    onPress();
  };
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.chip,
        pressed && !disabled && styles.chipPressed,
        disabled && styles.chipDisabled,
      ]}
    >
      <Text style={styles.chipLabel}>{label}</Text>
    </Pressable>
  );
}

export function ControlBar({ canUndo, onUndo, onSettings }: Props) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.row}>
      <Chip label="↶ Undo (Ad)" onPress={onUndo} disabled={!canUndo} />
      <Chip label="⚙ Settings" onPress={onSettings} />
    </View>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    row: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: spacing.sm,
    },
    chip: {
      flexShrink: 1,
      minHeight: 40,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.hairline,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chipPressed: {
      backgroundColor: colors.boardCell,
    },
    chipDisabled: {
      opacity: 0.45,
    },
    chipLabel: {
      color: colors.text,
      fontSize: font.sm,
      fontWeight: '700',
    },
  });
