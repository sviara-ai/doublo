import { useEffect, useState } from 'react';
import { Appearance, Platform } from 'react-native';

export type Scheme = 'light' | 'dark';

const DARK_QUERY = '(prefers-color-scheme: dark)';

function normalize(value: string | null | undefined): Scheme {
  return value === 'dark' ? 'dark' : 'light';
}

function readScheme(): Scheme {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
  }
  return normalize(Appearance.getColorScheme());
}

let current: Scheme = normalize(Appearance.getColorScheme());
const listeners = new Set<(scheme: Scheme) => void>();

function publish(next: Scheme): void {
  if (current === next) {
    return;
  }
  current = next;
  listeners.forEach((listener) => listener(current));
}

Appearance.addChangeListener(({ colorScheme }) => {
  publish(normalize(colorScheme));
});

if (Platform.OS === 'web' && typeof window !== 'undefined' && window.matchMedia) {
  window
    .matchMedia(DARK_QUERY)
    .addEventListener('change', (event) =>
      publish(event.matches ? 'dark' : 'light'),
    );
}

export function useScheme(): Scheme {
  const [value, setValue] = useState<Scheme>(current);

  useEffect(() => {
    publish(readScheme());
    listeners.add(setValue);
    setValue(current);
    return () => {
      listeners.delete(setValue);
    };
  }, []);

  return value;
}
