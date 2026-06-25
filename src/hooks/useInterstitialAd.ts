import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

// Set EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID as an EAS secret — never commit real values.
const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : (process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID ?? TestIds.INTERSTITIAL);

const SHOW_EVERY_N_GAMES = 3;

export function useInterstitialAd() {
  const adRef = useRef<InterstitialAd | null>(null);
  const isLoadedRef = useRef(false);
  const countRef = useRef(0);

  if (Platform.OS === 'web') {
    return { showAdThenCallback: (cb: () => void) => cb() };
  }

  useEffect(() => {
    const ad = InterstitialAd.createForAdRequest(adUnitId, { requestNonPersonalizedAdsOnly: false });
    adRef.current = ad;
    const unsubLoaded = ad.addAdEventListener(AdEventType.LOADED, () => { isLoadedRef.current = true; });
    const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => { isLoadedRef.current = false; ad.load(); });
    const unsubError  = ad.addAdEventListener(AdEventType.ERROR,  () => { isLoadedRef.current = false; });
    ad.load();
    return () => { unsubLoaded(); unsubClosed(); unsubError(); };
  }, []);

  const showAdThenCallback = (callback: () => void) => {
    countRef.current += 1;
    if (adRef.current && isLoadedRef.current && countRef.current % SHOW_EVERY_N_GAMES === 0) {
      const unsub = adRef.current.addAdEventListener(AdEventType.CLOSED, () => { unsub(); callback(); });
      adRef.current.show();
    } else {
      callback();
    }
  };

  return { showAdThenCallback };
}
