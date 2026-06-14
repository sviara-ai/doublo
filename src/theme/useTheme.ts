import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, lightColors, type Colors } from './colors';

export function useColors(): Colors {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkColors : lightColors;
}

export function useThemedStyles<T>(factory: (colors: Colors) => T): T {
  const colors = useColors();
  return useMemo(() => factory(colors), [colors, factory]);
}
