import { Dimensions } from 'react-native';
import { BOARD_SIZE } from '@/game/constants';

const window = Dimensions.get('window');

export const boardSize = Math.min(window.width - 32, 420);
export const cellGap = 10;
export const cellSize = (boardSize - cellGap * (BOARD_SIZE + 1)) / BOARD_SIZE;

export function cellPosition(index: number): number {
  return cellGap + index * (cellSize + cellGap);
}

export function fontSizeForValue(value: number): number {
  if (value >= 1024) {
    return cellSize * 0.3;
  }
  if (value >= 128) {
    return cellSize * 0.36;
  }
  return cellSize * 0.46;
}
