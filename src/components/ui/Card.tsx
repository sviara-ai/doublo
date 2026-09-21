import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import type { Colors } from '@/theme/colors';
import { useThemedStyles } from '@/theme/useTheme';
import { elevation, font, radius, spacing } from '@/theme/tokens';

interface Props {
  children: ReactNode;
  title?: string;
  style?: ViewStyle;
}

export function Card({ children, title, style }: Props) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={[styles.card, style]}>
      {title ? (
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    card: {
      width: '100%',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.hairline,
      padding: spacing.lg,
      gap: spacing.md,
      shadowColor: colors.shadow,
      ...elevation.card,
    },
    title: {
      color: colors.textMuted,
      fontSize: font.xs,
      fontWeight: '700',
      letterSpacing: 1,
    },
  });
