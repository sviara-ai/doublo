import { Pressable, StyleSheet, Text } from 'react-native';
import { palette } from '@/theme/colors';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'solid' | 'ghost';
}

export function Button({ label, onPress, variant = 'solid' }: Props) {
  const isGhost = variant === 'ghost';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isGhost ? styles.ghost : styles.solid,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, isGhost && styles.ghostLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minWidth: 200,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solid: {
    backgroundColor: palette.button,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    color: palette.buttonText,
    fontSize: 18,
    fontWeight: '700',
  },
  ghostLabel: {
    color: palette.text,
  },
});
