import {
  clearTransientFlags,
  createInitialTiles,
  getNextId,
  setNextId,
} from './engine';
import {
  clearSavedGame,
  loadSavedGame,
  saveGame,
} from '@/data/game-repository';
import { useGameStore } from '@/store/game-store';
import { useSettingsStore } from '@/store/settings-store';

export function startNewGame(): void {
  const { gridSize, startTiles, winTarget } = useSettingsStore.getState();
  const tiles = createInitialTiles(gridSize, startTiles);
  useGameStore.getState().set({
    tiles,
    score: 0,
    moves: 0,
    startedAt: Date.now(),
    status: 'playing',
    keepPlaying: false,
    hydrated: true,
    gridSize,
    winTarget,
    previous: null,
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
    nextTileId: getNextId(),
    gridSize: state.gridSize,
    winTarget: state.winTarget,
  });
}

export async function resumeOrStart(): Promise<void> {
  if (useGameStore.getState().hydrated) {
    return;
  }
  const { gridSize, winTarget } = useSettingsStore.getState();
  const saved = await loadSavedGame();
  if (saved && saved.gridSize === gridSize && saved.winTarget === winTarget) {
    setNextId(saved.nextTileId);
    useGameStore.getState().set({
      tiles: saved.tiles,
      score: saved.score,
      moves: saved.moves,
      startedAt: saved.startedAt,
      status: saved.status,
      keepPlaying: saved.keepPlaying,
      hydrated: true,
      gridSize: saved.gridSize,
      winTarget: saved.winTarget,
      previous: null,
    });
  } else {
    startNewGame();
  }
}
