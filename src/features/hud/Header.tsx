import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MODE_LABELS } from '@/game/constants';
import { useInteractive } from '@/hooks/useInteractive';
import type { Colors } from '@/theme/colors';
import { useThemedStyles } from '@/theme/useTheme';
import { font, layout, radius, spacing } from '@/theme/tokens';
import { useGameStore } from '@/store/game-store';

interface Props {
  onBack: () => void;
  onRestart: () => void;
}

export function Header({ onBack, onRestart }: Props) {
  const styles = useThemedStyles(makeStyles);
  const mode = useGameStore((state) => state.mode);
  const back = useInteractive();
  const restart = useInteractive();

  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back to home"
        hitSlop={12}
        onPress={onBack}
        {...back.interactiveProps}
        style={({ pressed }) => [
          styles.icon,
          back.hovered && styles.iconHovered,
          pressed && styles.iconPressed,
        ]}
      >
        <Text style={styles.iconLabel}>‹</Text>
      </Pressable>

      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
          Doublo
        </Text>
        <Text style={styles.mode} numberOfLines={1}>
          {MODE_LABELS[mode]}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Start a new game"
        hitSlop={8}
        onPress={onRestart}
        {...restart.interactiveProps}
        style={({ pressed }) => [
          styles.new,
          restart.hovered && styles.newHovered,
          pressed && styles.newPressed,
        ]}
      >
        <Text style={styles.newLabel}>New</Text>
      </Pressable>
    </View>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      gap: spacing.sm,
    },
    icon: {
      width: layout.iconButtonSize,
      height: layout.iconButtonSize,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: colors.hairline,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconHovered: {
      backgroundColor: colors.hover,
      borderColor: colors.primary,
    },
    iconPressed: {
      backgroundColor: colors.track,
    },
    iconLabel: {
      color: colors.primary,
      fontSize: font.lg,
      fontWeight: '800',
      lineHeight: font.lg + 2,
    },
    center: {
      flex: 1,
      alignItems: 'center',
    },
    title: {
      fontSize: font.lg,
      fontWeight: '800',
      color: colors.text,
    },
    mode: {
      fontSize: font.xs,
      fontWeight: '700',
      color: colors.textMuted,
      letterSpacing: 0.8,
    },
    new: {
      minHeight: layout.iconButtonSize,
      paddingHorizontal: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.hairline,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    newHovered: {
      backgroundColor: colors.hover,
      borderColor: colors.primary,
    },
    newPressed: {
      backgroundColor: colors.track,
    },
    newLabel: {
      color: colors.text,
      fontSize: font.sm,
      fontWeight: '700',
    },
  });
