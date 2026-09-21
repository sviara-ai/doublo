import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Branding } from '@/components/ui/Branding';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { installFocusRing } from '@/lib/focus-ring';
import { darkColors, lightColors } from '@/theme/colors';
import { useColors } from '@/theme/useTheme';

installFocusRing(lightColors.focusRing, darkColors.focusRing);

export default function RootLayout() {
  const colors = useColors();
  const tree = (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={styles.stack}>
          <ErrorBoundary>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
                animation: 'fade',
              }}
            />
          </ErrorBoundary>
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
