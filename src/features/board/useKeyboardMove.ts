import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import type { Direction } from '@/shared/types';

const keyMap: Record<string, Direction> = {
  ArrowUp: 'up',
  w: 'up',
  W: 'up',
  ArrowDown: 'down',
  s: 'down',
  S: 'down',
  ArrowLeft: 'left',
  a: 'left',
  A: 'left',
  ArrowRight: 'right',
  d: 'right',
  D: 'right',
};

export function useKeyboardMove(
  onMove: (direction: Direction) => void,
  enabled: boolean,
): void {
  const onMoveRef = useRef(onMove);

  useEffect(() => {
    onMoveRef.current = onMove;
  }, [onMove]);

  useEffect(() => {
    if (Platform.OS !== 'web' || !enabled) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const direction = keyMap[event.key];
      if (!direction || event.repeat) {
        return;
      }
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      onMoveRef.current(direction);
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [enabled]);
}
