import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Branding } from '@/components/ui/Branding';
import { useColors } from '@/theme/useTheme';

export default function RootLayout() {
  const colors = useColors();
  const tree = (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={styles.stack}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
              animation: 'fade',
            }}
          />
        </View>
        <SafeAreaView
          edges={['bottom']}
          style={{ backgroundColor: colors.background }}
        >
          <Branding />
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );

  if (Platform.OS === 'web') {
    return <View style={styles.root}>{tree}</View>;
  }

  return (
    <GestureHandlerRootView style={styles.root}>{tree}</GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  stack: {
    flex: 1,
  },
});
