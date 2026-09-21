import { useMemo } from 'react';
import { useScheme } from './color-scheme';
import { darkColors, lightColors, type Colors } from './colors';

export function useColors(): Colors {
  const scheme = useScheme();
  return scheme === 'dark' ? darkColors : lightColors;
}

export function useThemedStyles<T>(factory: (colors: Colors) => T): T {
  const colors = useColors();
  return useMemo(() => factory(colors), [colors, factory]);
}
