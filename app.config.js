// Dynamic Expo config — reads AdMob App IDs from environment variables.
// Set ADMOB_ANDROID_APP_ID and ADMOB_IOS_APP_ID as EAS secrets (never commit real values).
// https://docs.expo.dev/build-reference/variables/

const baseConfig = require('./app.json');

// Google's public test App IDs (safe to commit, used when env vars are absent)
const TEST_ANDROID_APP_ID = 'ca-app-pub-3940256099942544~3347511713';
const TEST_IOS_APP_ID    = 'ca-app-pub-3940256099942544~1458002511';

module.exports = {
  ...baseConfig.expo,
  owner: 'sviara',
  icon: './assets/icon.png',
  extra: {
    eas: { projectId: '73ad3b8b-30d5-4e1e-b9de-f52c1d23ee00' },
  },
  android: {
    ...baseConfig.expo.android,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#1a1a2e',
    },
  },
  web: {
    ...baseConfig.expo.web,
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-asset',
    'expo-font',
    [
      'expo-build-properties',
      {
        android: {
          targetSdkVersion: 35,
          compileSdkVersion: 35,
        },
      },
    ],
    [
      'react-native-google-mobile-ads',
      {
        androidAppId: process.env.ADMOB_ANDROID_APP_ID ?? TEST_ANDROID_APP_ID,
        iosAppId:     process.env.ADMOB_IOS_APP_ID     ?? TEST_IOS_APP_ID,
        delayAppMeasurementInit: true,
      },
    ],
  ],
};
