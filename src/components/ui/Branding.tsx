import { StyleSheet, Text, View } from 'react-native';
import type { Colors } from '@/theme/colors';
import { useThemedStyles } from '@/theme/useTheme';
import { spacing } from '@/theme/tokens';

export function Branding() {
  const styles = useThemedStyles(makeStyles);
  const year = new Date().getFullYear();
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>
        © {year} <Text style={styles.brand}>Sviara</Text>
      </Text>
    </View>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    wrap: {
      width: '100%',
      alignItems: 'center',
      paddingVertical: spacing.xs,
    },
    text: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textMuted,
      letterSpacing: 0.3,
    },
    brand: {
      color: colors.primary,
      fontWeight: '800',
    },
  });
