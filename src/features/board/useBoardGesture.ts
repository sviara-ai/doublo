import { useMemo } from 'react';
import { PanResponder } from 'react-native';
import type { PanResponderGestureState } from 'react-native';
import type { Direction } from '@/shared/types';

const CLAIM_THRESHOLD = 8;
const SWIPE_THRESHOLD = 16;

function shouldClaim(gesture: PanResponderGestureState): boolean {
  return (
    Math.abs(gesture.dx) > CLAIM_THRESHOLD ||
    Math.abs(gesture.dy) > CLAIM_THRESHOLD
  );
}

function isSwipe(gesture: PanResponderGestureState): boolean {
  return (
    Math.abs(gesture.dx) >= SWIPE_THRESHOLD ||
    Math.abs(gesture.dy) >= SWIPE_THRESHOLD
  );
}

function toDirection(gesture: PanResponderGestureState): Direction {
  if (Math.abs(gesture.dx) > Math.abs(gesture.dy)) {
    return gesture.dx > 0 ? 'right' : 'left';
  }
  return gesture.dy > 0 ? 'down' : 'up';
}

export function useSwipeGesture(
  onSwipe: (direction: Direction) => void,
  enabled: boolean,
) {
  return useMemo(() => {
    let fired = false;
    return PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gesture) =>
        enabled && shouldClaim(gesture),
      onMoveShouldSetPanResponderCapture: (_, gesture) =>
        enabled && shouldClaim(gesture),
      onPanResponderGrant: () => {
        fired = false;
      },
      onPanResponderMove: (_, gesture) => {
        if (!enabled || fired || !isSwipe(gesture)) {
          return;
        }
        fired = true;
        onSwipe(toDirection(gesture));
      },
      onPanResponderRelease: () => {
        fired = false;
      },
      onPanResponderTerminate: () => {
        fired = false;
      },
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
    }).panHandlers;
  }, [enabled, onSwipe]);
}
