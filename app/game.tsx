import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Board } from '@/features/board/Board';
import { DesktopMovePad } from '@/features/board/DesktopMovePad';
import { useKeyboardMove } from '@/features/board/useKeyboardMove';
import { useSwipeGesture } from '@/features/board/useBoardGesture';
import { ControlBar } from '@/features/hud/ControlBar';
import { Header } from '@/features/hud/Header';
import { ScorePanel } from '@/features/hud/ScorePanel';
import { Overlay } from '@/components/ui/Overlay';
import { useGameController } from '@/hooks/useGameController';
import { goHomeOrBack } from '@/lib/navigation';
import { useGameStore } from '@/store/game-store';
import type { Colors } from '@/theme/colors';
import { useScreenMetrics } from '@/theme/layout';
import { useThemedStyles } from '@/theme/useTheme';
import { font, spacing } from '@/theme/tokens';

function contentJustify(isShort: boolean): ViewStyle['justifyContent'] {
  return isShort ? 'space-between' : 'space-evenly';
}

export default function GameScreen() {
  const router = useRouter();
  const { move, newGame, undo, continueAfterWin } = useGameController();
  const tiles = useGameStore((state) => state.tiles);
  const status = useGameStore((state) => state.status);
  const canUndo = useGameStore(
    (state) => state.previous !== null && state.status === 'playing',
  );
  const isPlaying = status === 'playing';
  const swipeHandlers = useSwipeGesture(move, isPlaying);
  const styles = useThemedStyles(makeStyles);
  const metrics = useScreenMetrics();
  const showDesktopControls = Platform.OS === 'web' && metrics.isWide;
  useKeyboardMove(move, isPlaying && showDesktopControls);

  const [overlayDismissed, setOverlayDismissed] = useState(false);
  useEffect(() => {
    if (status === 'playing') {
      setOverlayDismissed(false);
    }
  }, [status]);
  const closeOverlay = () => setOverlayDismissed(true);
  const showOverlay = !isPlaying && !overlayDismissed;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <View style={styles.container}>
        <View
          collapsable={false}
          {...swipeHandlers}
          style={[
            styles.content,
            {
              maxWidth: metrics.contentMaxWidth,
              paddingHorizontal: metrics.horizontalPadding + spacing.xs,
              paddingVertical: metrics.isShort ? spacing.sm : spacing.xl,
              justifyContent: contentJustify(metrics.isShort),
            },
          ]}
        >
          <Header onBack={() => goHomeOrBack(router)} onRestart={newGame} />
          <ScorePanel />
          <ControlBar
            canUndo={canUndo}
            onUndo={() => {
              void undo();
            }}
            onSettings={() => router.push('/settings')}
          />
          <Board tiles={tiles}>
            {showOverlay && status === 'over' ? (
              <Overlay
                title="Game Over"
                actionLabel="New Game"
                onAction={newGame}
                onClose={closeOverlay}
              />
            ) : null}
            {showOverlay && status === 'won' ? (
              <Overlay
                title="You win!"
                actionLabel="Keep Going"
                onAction={continueAfterWin}
                secondaryLabel="New Game"
                onSecondary={newGame}
                onClose={closeOverlay}
              />
            ) : null}
          </Board>
          {showDesktopControls ? (
            <DesktopMovePad onMove={move} enabled={isPlaying} />
          ) : (
            <Text style={styles.hint}>Swipe anywhere to move the tiles.</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.xl,
      gap: spacing.sm,
      userSelect: 'none',
    },
    hint: {
      fontSize: font.sm,
      color: colors.textMuted,
    },
  });
