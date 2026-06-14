import { useCallback, useEffect, useRef } from 'react';
import * as Haptics from 'expo-haptics';
import { TRANSIENT_CLEAR_MS } from '@/game/constants';
import {
  applyMove,
  canMove,
  clearTransientFlags,
  createInitialTiles,
  getNextId,
  hasWon,
  maxTileValue,
  setNextId,
  spawnTile,
} from '@/game/engine';
import {
  clearSavedGame,
  loadSavedGame,
  saveGame,
} from '@/data/game-repository';
import { getDeviceId } from '@/services/auth-service';
import { buildScoreEntry } from '@/services/score-service';
import { useGameStore } from '@/store/game-store';
import { useStatsStore } from '@/store/stats-store';
import type { Direction } from '@/shared/types';

export function useGameController() {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persistCurrent = useCallback(async () => {
    const state = useGameStore.getState();
    if (state.status === 'over') {
      await clearSavedGame();
      return;
    }
    await saveGame({
      tiles: clearTransientFlags(state.tiles),
      score: state.score,
      moves: state.moves,
      startedAt: state.startedAt,
      status: state.status === 'won' ? 'won' : 'playing',
      keepPlaying: state.keepPlaying,
      nextTileId: getNextId(),
    });
  }, []);

  const newGame = useCallback(() => {
    const tiles = createInitialTiles();
    useGameStore.getState().set({
      tiles,
      score: 0,
      moves: 0,
      startedAt: Date.now(),
      status: 'playing',
      keepPlaying: false,
      hydrated: true,
    });
    void persistCurrent();
  }, [persistCurrent]);

  const bootstrap = useCallback(async () => {
    void useStatsStore.getState().hydrate();
    if (useGameStore.getState().hydrated) {
      return;
    }
    const saved = await loadSavedGame();
    if (saved) {
      setNextId(saved.nextTileId);
      useGameStore.getState().set({
        tiles: saved.tiles,
        score: saved.score,
        moves: saved.moves,
        startedAt: saved.startedAt,
        status: saved.status,
        keepPlaying: saved.keepPlaying,
        hydrated: true,
      });
    } else {
      newGame();
    }
  }, [newGame]);

  useEffect(() => {
    void bootstrap();
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [bootstrap]);

  const finalizeGame = useCallback(
    async (tiles: Parameters<typeof maxTileValue>[0], score: number, moves: number, startedAt: number) => {
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
      const result = applyMove(state.tiles, direction);
      if (!result.moved) {
        return;
      }
      const spawned = spawnTile(result.tiles);
      const tiles = spawned ? [...result.tiles, spawned] : result.tiles;
      const score = state.score + result.scoreGained;
      const moves = state.moves + 1;
      const won = !state.keepPlaying && hasWon(tiles);
      const blocked = !canMove(tiles);
      const status = won ? 'won' : blocked ? 'over' : 'playing';

      useGameStore.getState().set({ tiles, score, moves, status });
      void useStatsStore.getState().updateBest(score);
      void Haptics.selectionAsync();

      if (status === 'over') {
        void finalizeGame(tiles, score, moves, state.startedAt);
      } else {
        void persistCurrent();
      }

      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        const current = useGameStore.getState();
        current.set({ tiles: clearTransientFlags(current.tiles) });
      }, TRANSIENT_CLEAR_MS);
    },
    [finalizeGame, persistCurrent],
  );

  const continueAfterWin = useCallback(() => {
    useGameStore.getState().set({ keepPlaying: true, status: 'playing' });
    void persistCurrent();
  }, [persistCurrent]);

  return { move, newGame, continueAfterWin };
}
