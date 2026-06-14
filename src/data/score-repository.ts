import {
  ScoreBoardSchema,
  type ScoreBoard,
  type ScoreEntry,
} from '@/shared/schemas';
import { readJson, writeJson } from './storage';

const KEY = 'doublo.scoreboard.v1';
const HISTORY_LIMIT = 50;
const EMPTY: ScoreBoard = { best: 0, gamesPlayed: 0, history: [] };

export async function loadScoreBoard(): Promise<ScoreBoard> {
  const data = await readJson(KEY, ScoreBoardSchema);
  return data ?? EMPTY;
}

export async function saveScoreBoard(board: ScoreBoard): Promise<void> {
  await writeJson(KEY, ScoreBoardSchema, board);
}

export function appendEntry(board: ScoreBoard, entry: ScoreEntry): ScoreBoard {
  return {
    best: Math.max(board.best, entry.score),
    gamesPlayed: board.gamesPlayed + 1,
    history: [entry, ...board.history].slice(0, HISTORY_LIMIT),
  };
}
