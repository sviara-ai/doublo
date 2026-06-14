import type { Router } from 'expo-router';
import { clearWebFocus } from './focus';

export function goHomeOrBack(router: Router): void {
  clearWebFocus();
  if (router.canGoBack()) {
    router.back();
    return;
  }
  router.replace('/');
}
