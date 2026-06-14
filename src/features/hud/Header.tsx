import { Pressable, StyleSheet, Text, View } from 'react-native';
import { clearWebFocus } from '@/lib/focus';
import type { Colors } from '@/theme/colors';
import { useThemedStyles } from '@/theme/useTheme';
import { font, spacing } from '@/theme/tokens';

interface Props {
  onBack: () => void;
  onRestart: () => void;
}

export function Header({ onBack, onRestart }: Props) {
  const styles = useThemedStyles(makeStyles);
  const handleBack = () => {
    clearWebFocus();
    onBack();
  };
  const handleRestart = () => {
    clearWebFocus();
    onRestart();
  };
  return (
    <View style={styles.header}>
      <Pressable accessibilityRole="button" onPress={handleBack} hitSlop={12}>
        <Text style={styles.nav}>Back</Text>
      </Pressable>
      <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
        Doublo
      </Text>
      <Pressable accessibilityRole="button" onPress={handleRestart} hitSlop={12}>
        <Text style={styles.nav}>New</Text>
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
      paddingHorizontal: spacing.xs,
      gap: spacing.md,
    },
    title: {
      fontSize: font.xl,
      fontWeight: '800',
      color: colors.text,
      flexShrink: 1,
      textAlign: 'center',
    },
    nav: {
      fontSize: font.md,
      fontWeight: '700',
      color: colors.primary,
    },
  });
