import { Component, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { startNewGame } from '@/game/session';
import type { Colors } from '@/theme/colors';
import { useThemedStyles } from '@/theme/useTheme';
import { font, layout, spacing } from '@/theme/tokens';
import { Button } from './Button';

interface FallbackProps {
  onReset: () => void;
}

function ErrorFallback({ onReset }: FallbackProps) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.wrap} accessibilityRole="alert">
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.body}>
        Your best score and history are safe. Start a fresh board to continue.
      </Text>
      <Button label="Start a new game" onPress={onReset} />
    </View>
  );
}

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  private handleReset = (): void => {
    startNewGame();
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return <ErrorFallback onReset={this.handleReset} />;
    }
    return this.props.children;
  }
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    wrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.lg,
      padding: spacing.xl,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: font.xl,
      fontWeight: '800',
      color: colors.text,
      textAlign: 'center',
    },
    body: {
      fontSize: font.md,
      color: colors.textMuted,
      textAlign: 'center',
      maxWidth: layout.maxProseWidth,
    },
  });
