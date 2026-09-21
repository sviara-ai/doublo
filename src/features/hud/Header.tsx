import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MODE_LABELS } from '@/game/constants';
import { clearWebFocus } from '@/lib/focus';
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

  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back to home"
        hitSlop={12}
        onPress={() => {
          clearWebFocus();
          onBack();
        }}
        style={({ pressed }) => [styles.icon, pressed && styles.iconPressed]}
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
        onPress={() => {
          clearWebFocus();
          onRestart();
        }}
        style={({ pressed }) => [styles.new, pressed && styles.newPressed]}
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
    iconPressed: {
      backgroundColor: colors.hover,
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
    newPressed: {
      backgroundColor: colors.hover,
    },
    newLabel: {
      color: colors.text,
      fontSize: font.sm,
      fontWeight: '700',
    },
  });
