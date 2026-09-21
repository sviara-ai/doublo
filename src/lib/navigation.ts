import type { Router } from 'expo-router';

export function goHomeOrBack(router: Router): void {
  if (router.canGoBack()) {
    router.back();
    return;
  }
  router.replace('/');
}
