const STYLE_ID = 'doublo-focus-ring';

export function installFocusRing(light: string, dark: string): void {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) {
    return;
  }
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
:root { --doublo-focus: ${light}; }
@media (prefers-color-scheme: dark) { :root { --doublo-focus: ${dark}; } }
[role="button"]:focus-visible,
[role="radio"]:focus-visible,
[role="link"]:focus-visible {
  outline: 2px solid var(--doublo-focus);
  outline-offset: 2px;
}
[role="button"]:focus:not(:focus-visible),
[role="radio"]:focus:not(:focus-visible) {
  outline: none;
}
`;
  document.head.appendChild(style);
}
