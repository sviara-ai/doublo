import { useCallback, useEffect, useRef } from 'react';
import { transientClearMs } from '@/game/constants';
import {
  applyMove,
  canMove,
  clearTransientFlags,
  getNextId,
  hasWon,
  maxTileValue,
  setNextId,
  spawnTile,
} from '@/game/engine';
import { persistGame, resumeOrStart, startNewGame } from '@/game/session';
import { clearSavedGame } from '@/data/game-repository';
import { playMoveHaptic } from '@/lib/haptics';
import { playScoreSound, preloadSound } from '@/lib/sound';
import { getAdService } from '@/services/ad-service';
import { getDeviceId } from '@/services/auth-service';
import { buildScoreEntry } from '@/services/score-service';
import { useGameStore } from '@/store/game-store';
import { useSettingsStore } from '@/store/settings-store';
import { useStatsStore } from '@/store/stats-store';
import type { Direction, Tile } from '@/shared/types';

export function useGameController() {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPendingCleanup = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const newGame = useCallback(() => {
    clearPendingCleanup();
    startNewGame();
  }, [clearPendingCleanup]);

  const bootstrap = useCallback(async () => {
    preloadSound();
    await useSettingsStore.getState().hydrate();
    void useStatsStore.getState().hydrate();
    await resumeOrStart();
  }, []);

  useEffect(() => {
    void bootstrap();
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [bootstrap]);

  const finalizeGame = useCallback(
    async (tiles: Tile[], score: number, moves: number, startedAt: number) => {
      const userId = await getDeviceId();
      const entry = buildScoreEntry({
        userId,
        score,
        maxTile: maxTileValue(tiles),
        moves,
        durationMs: Date.now() - startedAt,
      });
      await useStatsStore.getState().recordGame(entry);
      await clearSavedGame();
    },
    [],
  );

  const move = useCallback(
    (direction: Direction) => {
      const state = useGameStore.getState();
      if (state.status !== 'playing') {
        return;
      }
      const { gridSize, winTarget } = state;
      const snapshotNextId = getNextId();
      const result = applyMove(state.tiles, direction, gridSize);
      if (!result.moved) {
        return;
      }
      const spawned = spawnTile(result.tiles, gridSize);
      const tiles = spawned ? [...result.tiles, spawned] : result.tiles;
      const score = state.score + result.scoreGained;
      const moves = state.moves + 1;
      const won = !state.keepPlaying && hasWon(tiles, winTarget);
      const blocked = !canMove(tiles, gridSize);
      const status = won ? 'won' : blocked ? 'over' : 'playing';

      useGameStore.getState().set({
        tiles,
        score,
        moves,
        status,
        previous: {
          tiles: clearTransientFlags(state.tiles),
          score: state.score,
          moves: state.moves,
          keepPlaying: state.keepPlaying,
          nextTileId: snapshotNextId,
        },
      });
      playMoveHaptic(result.scoreGained > 0);
      if (result.scoreGained > 0 && useSettingsStore.getState().soundEnabled) {
        playScoreSound();
      }

      if (status === 'over') {
        void finalizeGame(tiles, score, moves, state.startedAt);
      } else {
        void useStatsStore.getState().updateBest(score);
        void persistGame();
      }

      clearPendingCleanup();
      const speed = useSettingsStore.getState().animationSpeed;
      timer.current = setTimeout(() => {
        const current = useGameStore.getState();
        current.set({ tiles: clearTransientFlags(current.tiles) });
      }, transientClearMs(speed));
    },
    [clearPendingCleanup, finalizeGame],
  );

  const undo = useCallback(async () => {
    const state = useGameStore.getState();
    if (!state.previous || state.status !== 'playing') {
      return;
    }
    const granted = await getAdService().showRewardedAd();
    if (!granted) {
      return;
    }
    clearPendingCleanup();
    const snapshot = state.previous;
    setNextId(snapshot.nextTileId);
    useGameStore.getState().set({
      tiles: snapshot.tiles,
      score: snapshot.score,
      moves: snapshot.moves,
      status: 'playing',
      keepPlaying: snapshot.keepPlaying,
      previous: null,
    });
    void persistGame();
  }, [clearPendingCleanup]);

  const continueAfterWin = useCallback(() => {
    clearPendingCleanup();
    const state = useGameStore.getState();
    if (!canMove(state.tiles, state.gridSize)) {
      state.set({ keepPlaying: true, status: 'over' });
      void finalizeGame(state.tiles, state.score, state.moves, state.startedAt);
      return;
    }
    state.set({ keepPlaying: true, status: 'playing' });
    void persistGame();
  }, [clearPendingCleanup, finalizeGame]);

  return { move, newGame, undo, continueAfterWin };
}
