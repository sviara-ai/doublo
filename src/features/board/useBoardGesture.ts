import { Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import type { Direction } from '@/shared/types';

const SWIPE_THRESHOLD = 24;

export function createSwipeGesture(onSwipe: (direction: Direction) => void) {
  return Gesture.Pan().onEnd((event) => {
    'worklet';
    const { translationX, translationY } = event;
    if (
      Math.abs(translationX) < SWIPE_THRESHOLD &&
      Math.abs(translationY) < SWIPE_THRESHOLD
    ) {
      return;
    }
    if (Math.abs(translationX) > Math.abs(translationY)) {
      runOnJS(onSwipe)(translationX > 0 ? 'right' : 'left');
    } else {
      runOnJS(onSwipe)(translationY > 0 ? 'down' : 'up');
    }
  });
}
