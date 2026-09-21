import { useCallback, useEffect, useRef } from 'react';
import {
  TIME_ATTACK_MS,
  TIME_ATTACK_TICK_MS,
  transientClearMs,
} from '@/game/constants';
import {
  applyMove,
  canMove,
  clearTransientFlags,
  hasWon,
  maxTileValue,
  relieveBoard,
  spawnTile,
} from '@/game/engine';
import { persistGame, resumeOrStart, startNewGame } from '@/game/session';
import { clearSavedGame } from '@/data/game-repository';
import { playBlockedHaptic, playMoveHaptic } from '@/lib/haptics';
import { playScoreSound, preloadSound } from '@/lib/sound';
import { getAdService } from '@/services/ad-service';
import { getDeviceId } from '@/services/auth-service';
import { buildScoreEntry } from '@/services/score-service';
import { useGameStore } from '@/store/game-store';
import { useSettingsStore } from '@/store/settings-store';
import { useStatsStore } from '@/store/stats-store';
import { useTrophyStore } from '@/store/trophy-store';
import type { Direction, GameMode, Tile } from '@/shared/types';

export function useGameController(requestedMode?: GameMode) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mode = useGameStore((state) => state.mode);

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
    void useTrophyStore.getState().hydrate();
    await resumeOrStart(requestedMode);
  }, [requestedMode]);

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
        mode: useGameStore.getState().mode,
      });
      await useStatsStore.getState().recordGame(entry);
      await clearSavedGame();
    },
    [],
  );

  useEffect(() => {
    if (mode !== 'timeAttack') {
      return undefined;
    }
    const interval = setInterval(() => {
      const state = useGameStore.getState();
      if (state.status !== 'playing') {
        return;
      }
      const remaining = Math.max(
        0,
        TIME_ATTACK_MS - (Date.now() - state.startedAt),
      );
      state.set({ timeLeftMs: remaining });
      if (remaining === 0) {
        state.set({ status: 'over' });
        void finalizeGame(
          state.tiles,
          state.score,
          state.moves,
          state.startedAt,
        );
      }
    }, TIME_ATTACK_TICK_MS);
    return () => clearInterval(interval);
  }, [mode, finalizeGame]);

  const move = useCallback(
    (direction: Direction) => {
      const state = useGameStore.getState();
      if (state.status !== 'playing') {
        return;
      }
      const { gridSize, winTarget } = state;
      const settings = useSettingsStore.getState();
      const result = applyMove(state.tiles, direction, gridSize);

      if (!result.moved) {
        state.set({ blockedSeq: state.blockedSeq + 1 });
        if (settings.hapticsEnabled) {
          playBlockedHaptic();
        }
        return;
      }

      const spawned = spawnTile(result.tiles, gridSize, state.nextTileId);
      const spawnedTiles = spawned.tile
        ? [...result.tiles, spawned.tile]
        : result.tiles;
      const isZen = state.mode === 'zen';
      const blocked = !canMove(spawnedTiles, gridSize);
      const tiles =
        isZen && blocked ? relieveBoard(spawnedTiles, gridSize) : spawnedTiles;
      const score = state.score + result.scoreGained;
      const moves = state.moves + 1;
      const won = !state.keepPlaying && hasWon(tiles, winTarget);
      const status = won ? 'won' : blocked && !isZen ? 'over' : 'playing';

      useGameStore.getState().set({
        tiles,
        nextTileId: spawned.nextTileId,
        score,
        moves,
        status,
        lastGain: result.scoreGained,
        lastMultiplier: result.multiplier,
        gainSeq: state.gainSeq + 1,
        previous: {
          tiles: clearTransientFlags(state.tiles),
          score: state.score,
          moves: state.moves,
          keepPlaying: state.keepPlaying,
          nextTileId: state.nextTileId,
        },
      });

      if (settings.hapticsEnabled) {
        playMoveHaptic(result.mergeCount > 0);
      }
      if (result.mergeCount > 0 && settings.soundEnabled) {
        playScoreSound(result.topMergedValue, result.mergeCount);
      }
      useTrophyStore.getState().award(maxTileValue(tiles));

      if (status === 'over') {
        void finalizeGame(tiles, score, moves, state.startedAt);
      } else {
        useStatsStore.getState().updateBest(score);
        void persistGame();
      }

      clearPendingCleanup();
      timer.current = setTimeout(() => {
        const current = useGameStore.getState();
        current.set({ tiles: clearTransientFlags(current.tiles) });
      }, transientClearMs(settings.animationSpeed));
    },
    [clearPendingCleanup, finalizeGame],
  );

  const undo = useCallback(async () => {
    const initial = useGameStore.getState();
    if (!initial.previous || initial.mode === 'pure') {
      return;
    }
    const granted = await getAdService().showRewardedAd();
    if (!granted) {
      return;
    }
    const state = useGameStore.getState();
    const snapshot = state.previous;
    if (!snapshot || state.status === 'over') {
      return;
    }
    clearPendingCleanup();
    state.set({
      tiles: snapshot.tiles,
      nextTileId: snapshot.nextTileId,
      score: snapshot.score,
      moves: snapshot.moves,
      status: 'playing',
      keepPlaying: snapshot.keepPlaying,
      previous: null,
      lastGain: 0,
      lastMultiplier: 1,
    });
    void persistGame();
  }, [clearPendingCleanup]);

  const continueAfterWin = useCallback(() => {
    clearPendingCleanup();
    const state = useGameStore.getState();
    if (state.mode !== 'zen' && !canMove(state.tiles, state.gridSize)) {
      state.set({ keepPlaying: true, status: 'over' });
      void finalizeGame(state.tiles, state.score, state.moves, state.startedAt);
      return;
    }
    state.set({ keepPlaying: true, status: 'playing' });
    void persistGame();
  }, [clearPendingCleanup, finalizeGame]);

  return { move, newGame, undo, continueAfterWin };
}
