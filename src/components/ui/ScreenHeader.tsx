import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { clearWebFocus } from '@/lib/focus';
import type { Colors } from '@/theme/colors';
import { useThemedStyles } from '@/theme/useTheme';
import { font, layout, radius, spacing } from '@/theme/tokens';

interface Props {
  title: string;
  onBack: () => void;
  trailing?: ReactNode;
}

export function ScreenHeader({ title, onBack, trailing }: Props) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.header}>
      <View style={styles.side}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          onPress={() => {
            clearWebFocus();
            onBack();
          }}
          style={({ pressed }) => [styles.back, pressed && styles.backPressed]}
        >
          <Text style={styles.backLabel}>‹</Text>
        </Pressable>
      </View>
      <Text
        accessibilityRole="header"
        style={styles.title}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {title}
      </Text>
      <View style={[styles.side, styles.sideEnd]}>{trailing}</View>
    </View>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    header: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
      paddingTop: spacing.md,
      paddingBottom: spacing.xs,
    },
    side: {
      minWidth: layout.headerSideWidth,
      justifyContent: 'center',
    },
    sideEnd: {
      alignItems: 'flex-end',
    },
    back: {
      width: layout.iconButtonSize,
      height: layout.iconButtonSize,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: colors.hairline,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backPressed: {
      backgroundColor: colors.hover,
    },
    backLabel: {
      color: colors.primary,
      fontSize: font.lg,
      fontWeight: '800',
      lineHeight: font.lg + 2,
    },
    title: {
      flex: 1,
      textAlign: 'center',
      fontSize: font.xl,
      fontWeight: '800',
      color: colors.text,
    },
  });
