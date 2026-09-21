import { clearTransientFlags, createInitialTiles } from './engine';
import { TIME_ATTACK_MS } from './constants';
import {
  clearSavedGame,
  loadSavedGame,
  saveGame,
} from '@/data/game-repository';
import { useGameStore } from '@/store/game-store';
import { useSettingsStore } from '@/store/settings-store';
import type { GameMode } from '@/shared/types';

export function startNewGame(mode?: GameMode): void {
  const { gridSize, startTiles, winTarget } = useSettingsStore.getState();
  const nextMode = mode ?? useGameStore.getState().mode;
  const initial = createInitialTiles(gridSize, startTiles);
  useGameStore.getState().set({
    tiles: initial.tiles,
    nextTileId: initial.nextTileId,
    score: 0,
    moves: 0,
    startedAt: Date.now(),
    status: 'playing',
    keepPlaying: false,
    hydrated: true,
    gridSize,
    winTarget,
    mode: nextMode,
    timeLeftMs: TIME_ATTACK_MS,
    previous: null,
    lastGain: 0,
    lastMultiplier: 1,
  });
  void persistGame();
}

export async function persistGame(): Promise<void> {
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
    nextTileId: state.nextTileId,
    gridSize: state.gridSize,
    winTarget: state.winTarget,
    mode: state.mode,
  });
}

export async function resumeOrStart(mode?: GameMode): Promise<void> {
  const current = useGameStore.getState();
  if (current.hydrated) {
    if (mode !== undefined && current.mode !== mode) {
      startNewGame(mode);
    }
    return;
  }
  const { gridSize, winTarget } = useSettingsStore.getState();
  const saved = await loadSavedGame();
  const modeMatches = mode === undefined || saved?.mode === mode;
  if (
    saved &&
    modeMatches &&
    saved.gridSize === gridSize &&
    saved.winTarget === winTarget
  ) {
    useGameStore.getState().set({
      tiles: saved.tiles,
      nextTileId: saved.nextTileId,
      score: saved.score,
      moves: saved.moves,
      startedAt: saved.startedAt,
      status: saved.status,
      keepPlaying: saved.keepPlaying,
      hydrated: true,
      gridSize: saved.gridSize,
      winTarget: saved.winTarget,
      mode: saved.mode,
      timeLeftMs: TIME_ATTACK_MS,
      previous: null,
      lastGain: 0,
      lastMultiplier: 1,
    });
  } else {
    startNewGame(mode);
  }
}
