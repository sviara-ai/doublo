import { Pressable, StyleSheet, Text, View } from 'react-native';
import { palette } from '@/theme/colors';

interface Props {
  onBack: () => void;
  onRestart: () => void;
}

export function Header({ onBack, onRestart }: Props) {
  return (
    <View style={styles.header}>
      <Pressable accessibilityRole="button" onPress={onBack} hitSlop={12}>
        <Text style={styles.nav}>Back</Text>
      </Pressable>
      <Text style={styles.title}>Doublo</Text>
      <Pressable accessibilityRole="button" onPress={onRestart} hitSlop={12}>
        <Text style={styles.nav}>New</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: palette.text,
  },
  nav: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.button,
  },
});
