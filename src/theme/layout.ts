import { useWindowDimensions } from 'react-native';
import { layout as layoutTokens } from './tokens';

const MAX_BOARD = 480;
const MIN_BOARD = 168;
const MIN_BOARD_WIDTH = 144;
const SCREEN_PADDING = 16;
const NARROW_SCREEN_PADDING = 12;
const HEIGHT_FRACTION = 0.62;
const SHORT_HEIGHT_FRACTION = 0.54;
const VERY_SHORT_HEIGHT_FRACTION = 0.48;
const LANDSCAPE_HEIGHT_FRACTION = 0.84;
const LANDSCAPE_WIDTH_FRACTION = 0.52;
const NARROW_WIDTH = 380;
const SHORT_HEIGHT = 700;
const VERY_SHORT_HEIGHT = 480;
const WIDE_WIDTH = 720;
const LANDSCAPE_MIN_WIDTH = 560;
const CELL_GAP_FRACTION = 0.12;
const CELL_RADIUS_FRACTION = 0.12;
const MIN_CELL_GAP = 6;

export interface BoardMetrics {
  boardSize: number;
  cellSize: number;
  cellGap: number;
  cellRadius: number;
  position: (index: number) => number;
  fontSize: (value: number) => number;
}

export interface ScreenMetrics {
  width: number;
  height: number;
  isNarrow: boolean;
  isShort: boolean;
  isWide: boolean;
  isLandscape: boolean;
  horizontalPadding: number;
  verticalPadding: number;
  contentMaxWidth: number;
}

function isLandscapeLayout(width: number, height: number): boolean {
  return width > height && width >= LANDSCAPE_MIN_WIDTH;
}

export function useScreenMetrics(): ScreenMetrics {
  const { width, height } = useWindowDimensions();
  const isNarrow = width < NARROW_WIDTH;
  const isShort = height < SHORT_HEIGHT;
  const isWide = width >= WIDE_WIDTH;
  const isLandscape = isLandscapeLayout(width, height);
  const horizontalPadding = isNarrow ? NARROW_SCREEN_PADDING : SCREEN_PADDING;
  const verticalPadding = isShort ? NARROW_SCREEN_PADDING : SCREEN_PADDING;
  const contentMaxWidth =
    isWide || isLandscape
      ? layoutTokens.maxWideContentWidth
      : layoutTokens.maxContentWidth;

  return {
    width,
    height,
    isNarrow,
    isShort,
    isWide,
    isLandscape,
    horizontalPadding,
    verticalPadding,
    contentMaxWidth,
  };
}

export function useBoardMetrics(gridSize: number): BoardMetrics {
  const { width, height } = useWindowDimensions();
  const landscape = isLandscapeLayout(width, height);
  const screenPadding =
    width < NARROW_WIDTH ? NARROW_SCREEN_PADDING : SCREEN_PADDING;
  const heightFraction = landscape
    ? LANDSCAPE_HEIGHT_FRACTION
    : height < VERY_SHORT_HEIGHT
      ? VERY_SHORT_HEIGHT_FRACTION
      : height < SHORT_HEIGHT
        ? SHORT_HEIGHT_FRACTION
        : HEIGHT_FRACTION;
  const widthLimit = landscape
    ? width * LANDSCAPE_WIDTH_FRACTION
    : Math.max(0, width - screenPadding * 2);
  const heightLimit = height * heightFraction;
  const available = Math.min(widthLimit, heightLimit, MAX_BOARD);
  const minimumBoard = Math.min(
    MIN_BOARD,
    Math.max(MIN_BOARD_WIDTH, widthLimit),
  );
  const boardSize = Math.max(minimumBoard, available);
  const cellGap = Math.max(
    MIN_CELL_GAP,
    Math.round((boardSize * CELL_GAP_FRACTION) / gridSize),
  );
  const cellSize = (boardSize - cellGap * (gridSize + 1)) / gridSize;
  const cellRadius = cellSize * CELL_RADIUS_FRACTION;

  const position = (index: number) => cellGap + index * (cellSize + cellGap);
  const fontSize = (value: number) => {
    if (value >= 1024) {
      return cellSize * 0.3;
    }
    if (value >= 128) {
      return cellSize * 0.36;
    }
    return cellSize * 0.46;
  };

  return { boardSize, cellSize, cellGap, cellRadius, position, fontSize };
}
