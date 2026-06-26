const baseConfig = require('./app.json');

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
      targetSdkVersion: 35,
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
      'react-native-google-mobile-ads',
      {
        androidAppId: process.env.ADMOB_ANDROID_APP_ID,
        iosAppId:     process.env.ADMOB_IOS_APP_ID,
        delayAppMeasurementInit: true,
      },
    ],
  ],
};
