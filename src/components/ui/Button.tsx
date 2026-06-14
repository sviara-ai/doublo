import { Pressable, StyleSheet, Text } from 'react-native';
import { clearWebFocus } from '@/lib/focus';
import type { Colors } from '@/theme/colors';
import { useThemedStyles } from '@/theme/useTheme';
import { font, layout, radius, spacing } from '@/theme/tokens';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'solid' | 'ghost';
  disabled?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'solid',
  disabled = false,
}: Props) {
  const styles = useThemedStyles(makeStyles);
  const isGhost = variant === 'ghost';
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
        isGhost ? styles.ghost : styles.solid,
        pressed && !disabled && (isGhost ? styles.ghostPressed : styles.solidPressed),
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.label, isGhost && styles.ghostLabel]}>{label}</Text>
    </Pressable>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    base: {
      width: '100%',
      maxWidth: layout.maxButtonWidth,
      minHeight: layout.minTouchTarget,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: radius.md,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    solid: {
      backgroundColor: colors.primary,
    },
    solidPressed: {
      backgroundColor: colors.primaryPressed,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    ghostPressed: {
      opacity: 0.6,
    },
    disabled: {
      opacity: 0.45,
    },
    label: {
      color: colors.textInverse,
      fontSize: font.md,
      fontWeight: '700',
    },
    ghostLabel: {
      color: colors.primary,
    },
  });
