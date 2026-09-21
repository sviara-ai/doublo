import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useInteractive } from '@/hooks/useInteractive';
import type { Colors } from '@/theme/colors';
import { useThemedStyles } from '@/theme/useTheme';
import { font, radius, spacing } from '@/theme/tokens';
import { useGameStore } from '@/store/game-store';

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
  const { hovered, interactiveProps } = useInteractive();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      {...interactiveProps}
      style={({ pressed }) => [
        styles.chip,
        hovered && !disabled && styles.chipHovered,
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
  const mode = useGameStore((state) => state.mode);
  return (
    <View style={styles.row}>
      {mode === 'pure' ? (
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>RANKED · NO UNDO</Text>
        </View>
      ) : (
        <Chip label="Undo (Ad)" onPress={onUndo} disabled={!canUndo} />
      )}
      <Chip label="Settings" onPress={onSettings} />
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
    chipHovered: {
      backgroundColor: colors.hover,
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
    badge: {
      minHeight: 40,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeLabel: {
      color: colors.primary,
      fontSize: font.xs,
      fontWeight: '800',
      letterSpacing: 0.6,
    },
  });
