import { Platform, View, StyleSheet } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

// TODO: Replace with your real Banner ad unit ID from AdMob console
// AdMob -> your app -> Ad units -> Create ad unit -> Banner
const PRODUCTION_BANNER_ID = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : PRODUCTION_BANNER_ID;

export function BannerAdUnit() {
  // Do not render on web — AdMob is native-only
  if (Platform.OS === 'web') return null;

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
  container: {
    alignItems: 'center',
    width: '100%',
  },
});
