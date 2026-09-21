import { Pressable, StyleSheet, Text } from 'react-native';
import { clearWebFocus } from '@/lib/focus';
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
        styles.base,
        inline ? styles.inline : styles.block,
        styles[variant],
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
    solidPressed: {
      backgroundColor: colors.primaryPressed,
      borderColor: colors.primaryPressed,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    ghostPressed: {
      opacity: 0.6,
    },
    outline: {
      backgroundColor: colors.surface,
      borderColor: colors.hairline,
    },
    outlinePressed: {
      backgroundColor: colors.hover,
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
