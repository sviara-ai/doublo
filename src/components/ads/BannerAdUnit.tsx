import { Platform, View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// Set EXPO_PUBLIC_ADMOB_BANNER_ID as an EAS secret — never commit real values.
// Falls back to Google's public test ID in dev and when the var is absent.
const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : (process.env.EXPO_PUBLIC_ADMOB_BANNER_ID ?? TestIds.ADAPTIVE_BANNER);

export function BannerAdUnit() {
  if (Platform.OS === 'web') return null; // also handled by BannerAdUnit.web.tsx
  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: false }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', width: '100%' },
});
