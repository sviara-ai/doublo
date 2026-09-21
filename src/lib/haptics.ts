import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export function playMoveHaptic(merged: boolean): void {
  if (Platform.OS === 'web') {
    return;
  }
  void Haptics.impactAsync(
    merged
      ? Haptics.ImpactFeedbackStyle.Medium
      : Haptics.ImpactFeedbackStyle.Light,
  );
}

export function playBlockedHaptic(): void {
  if (Platform.OS === 'web') {
    return;
  }
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}
