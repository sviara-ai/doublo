// Web stub — Metro picks this file on web builds instead of useInterstitialAd.ts
// react-native-google-mobile-ads has no web support, so we export a no-op here.
export function useInterstitialAd() {
  return { showAdThenCallback: (cb: () => void) => cb() };
}
