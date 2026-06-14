import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureDetector } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { Board } from '@/features/board/Board';
import { createSwipeGesture } from '@/features/board/useBoardGesture';
import { Header } from '@/features/hud/Header';
import { ScorePanel } from '@/features/hud/ScorePanel';
import { Overlay } from '@/components/ui/Overlay';
import { useGameController } from '@/hooks/useGameController';
import { useGameStore } from '@/store/game-store';
import { palette } from '@/theme/colors';
import { boardSize } from '@/theme/metrics';

export default function GameScreen() {
  const router = useRouter();
  const { move, newGame, continueAfterWin } = useGameController();
  const tiles = useGameStore((state) => state.tiles);
  const status = useGameStore((state) => state.status);
  const gesture = useMemo(() => createSwipeGesture(move), [move]);

  return (
    <SafeAreaView style={styles.container}>
      <Header onBack={() => router.back()} onRestart={newGame} />
      <ScorePanel />
      <GestureDetector gesture={gesture}>
        <View style={styles.boardWrap}>
          <Board tiles={tiles} />
          {status === 'over' ? (
            <Overlay title="Game Over" actionLabel="New Game" onAction={newGame} />
          ) : null}
          {status === 'won' ? (
            <Overlay
              title="You win!"
              actionLabel="Keep Going"
              onAction={continueAfterWin}
              secondaryLabel="New Game"
              onSecondary={newGame}
            />
          ) : null}
        </View>
      </GestureDetector>
      <Text style={styles.hint}>Swipe to move the tiles.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  boardWrap: {
    width: boardSize,
    height: boardSize,
  },
  hint: {
    fontSize: 14,
    color: palette.muted,
  },
});
