import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useInteractive } from '@/hooks/useInteractive';
import type { Direction } from '@/shared/types';
import type { Colors } from '@/theme/colors';
import { useThemedStyles } from '@/theme/useTheme';
import { font, layout, radius, spacing } from '@/theme/tokens';

interface Props {
  onMove: (direction: Direction) => void;
  enabled: boolean;
}

interface MoveButtonProps {
  label: string;
  direction: Direction;
  onMove: (direction: Direction) => void;
  enabled: boolean;
}

function MoveButton({ label, direction, onMove, enabled }: MoveButtonProps) {
  const styles = useThemedStyles(makeStyles);
  const { hovered, interactiveProps } = useInteractive();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Move ${direction}`}
      disabled={!enabled}
      onPress={() => onMove(direction)}
      {...interactiveProps}
      style={({ pressed }) => [
        styles.button,
        !enabled && styles.buttonDisabled,
        hovered && enabled && styles.buttonHovered,
        pressed && enabled && styles.buttonPressed,
      ]}
    >
      <Text style={[styles.buttonLabel, !enabled && styles.buttonLabelDisabled]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function DesktopMovePad({ onMove, enabled }: Props) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <MoveButton
          label="↑"
          direction="up"
          enabled={enabled}
          onMove={onMove}
        />
      </View>
      <View style={styles.row}>
        <MoveButton
          label="←"
          direction="left"
          enabled={enabled}
          onMove={onMove}
        />
        <MoveButton
          label="↓"
          direction="down"
          enabled={enabled}
          onMove={onMove}
        />
        <MoveButton
          label="→"
          direction="right"
          enabled={enabled}
          onMove={onMove}
        />
      </View>
      <Text style={styles.hint}>Arrow keys or WASD</Text>
    </View>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    wrap: {
      alignItems: 'center',
      gap: spacing.xs,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.xs,
      justifyContent: 'center',
    },
    button: {
      width: layout.minTouchTarget,
      height: layout.minTouchTarget,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.hairline,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonHovered: {
      backgroundColor: colors.hover,
      borderColor: colors.primary,
    },
    buttonPressed: {
      backgroundColor: colors.boardCell,
    },
    buttonDisabled: {
      opacity: 0.45,
    },
    buttonLabel: {
      color: colors.text,
      fontSize: font.lg,
      fontWeight: '800',
      lineHeight: font.lg + 4,
    },
    buttonLabelDisabled: {
      color: colors.textMuted,
    },
    hint: {
      color: colors.textMuted,
      fontSize: font.xs,
      fontWeight: '700',
    },
  });
