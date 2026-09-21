import { Pressable, StyleSheet, Text } from 'react-native';
import { useInteractive } from '@/hooks/useInteractive';
import type { Colors } from '@/theme/colors';
import { useThemedStyles } from '@/theme/useTheme';
import { elevation, font, layout, radius, spacing } from '@/theme/tokens';

type Variant = 'solid' | 'ghost' | 'outline';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  inline?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'solid',
  disabled = false,
  inline = false,
}: Props) {
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
        styles.base,
        inline ? styles.inline : styles.block,
        styles[variant],
        hovered && !disabled && styles[`${variant}Hovered`],
        pressed && !disabled && styles[`${variant}Pressed`],
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.label, styles[`${variant}Label`]]}>{label}</Text>
    </Pressable>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    base: {
      minHeight: layout.minTouchTarget,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'transparent',
    },
    block: {
      width: '100%',
      maxWidth: layout.maxButtonWidth,
      alignSelf: 'center',
    },
    inline: {
      flex: 1,
      paddingHorizontal: spacing.md,
    },
    solid: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      shadowColor: colors.shadow,
      ...elevation.card,
    },
    solidHovered: {
      backgroundColor: colors.primaryPressed,
      borderColor: colors.primaryPressed,
    },
    solidPressed: {
      backgroundColor: colors.primaryPressed,
      borderColor: colors.primaryPressed,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    ghostHovered: {
      backgroundColor: colors.hover,
    },
    ghostPressed: {
      opacity: 0.6,
    },
    outline: {
      backgroundColor: colors.surface,
      borderColor: colors.hairline,
    },
    outlineHovered: {
      backgroundColor: colors.hover,
    },
    outlinePressed: {
      backgroundColor: colors.track,
    },
    disabled: {
      opacity: 0.45,
    },
    label: {
      fontSize: font.md,
      fontWeight: '700',
    },
    solidLabel: {
      color: colors.textInverse,
    },
    ghostLabel: {
      color: colors.primary,
    },
    outlineLabel: {
      color: colors.text,
    },
  });
