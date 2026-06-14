import { Platform } from 'react-native';

export function clearWebFocus(): void {
  if (Platform.OS !== 'web') {
    return;
  }
  const active = document.activeElement;
  if (active instanceof HTMLElement) {
    active.blur();
  }
}
