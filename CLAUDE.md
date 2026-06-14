# CLAUDE.md — Doublo

Project guide for **Doublo**, a 2048-style merge game (Expo + React Native + TypeScript) for iOS,
Android, and web. This file inherits the workspace standards in `../CLAUDE.md` and adds the rules
that are **mandatory and specific to this app**. When anything here conflicts with the root file,
this file wins for this project.

## Stack

Expo SDK 52 · expo-router · react-native-reanimated · react-native-gesture-handler ·
zustand · zod · AsyncStorage · expo-haptics.

## Folder structure (keep to it)

```
app/                     expo-router screens (home, game, history) — UI only
src/
  game/                  pure game engine (no RN imports) — the domain
  hooks/                 useGameController — orchestrates engine + store + persistence
  store/                 zustand state (game, stats)
  services/              auth (device id), score, leaderboard (Phase 2 seam)
  data/                  AsyncStorage repositories + storage helper
  features/              UI by feature: board/, hud/
  components/ui/         shared primitives: Button, Overlay
  lib/                   platform-safe wrappers (e.g. haptics)
  shared/                types + zod schemas
  theme/                 colors, tiles, tokens, layout, useTheme
```

Layering is strict: `game/` (pure) → `services/` + `data/` → `hooks/` → `features/` + `app/` (UI).
UI never contains game logic; the engine never imports React Native.

## Theming — MANDATORY, every time

- **Never hardcode a color, spacing, radius, or font size in a component.** Use the tokens:
  `@/theme/tokens` (`spacing`, `radius`, `font`, `layout`) and the active palette via the theme hook.
- **All colors come from the themed palette**, never a literal hex in a screen/component.
  - Component styles use the factory pattern: `const styles = useThemedStyles(makeStyles)` with
    `const makeStyles = (colors: Colors) => StyleSheet.create({ ... })`.
  - For a one-off color value in JSX, read it with `const colors = useColors()`.
- **Support light AND dark, driven by the system setting.** `useColors()` selects `lightColors` /
  `darkColors` from `useColorScheme()`. Both palettes in `@/theme/colors` must define the **same keys**.
  Never force a single scheme: `app.json` stays `"userInterfaceStyle": "automatic"` and the status bar
  stays `<StatusBar style="auto" />`.
- Add a new semantic color to **both** `lightColors` and `darkColors` (and the `Colors` interface) — never
  to just one. Tile colors live in `@/theme/tiles` and are intentionally scheme-independent.
- Brand: Sviara royal blue `#0060C7`, navy `#101A86`, ink `#00163F`. The UI is a light, blue-based theme;
  dark mode is the navy-dark equivalent.

## Responsiveness — MANDATORY, all devices

- **Never bake in screen dimensions.** The board derives its size every render from
  `useBoardMetrics()` (built on `useWindowDimensions`), so it adapts to phone, tablet, iPad
  (rotation/split view), and web (live browser resize).
- Tiles receive `x`, `y`, `size`, `fontSize` as props from the board metrics — they own no fixed sizing.
- Every screen wraps content in a centered container capped at `layout.maxContentWidth` and uses flex,
  so it looks correct from small phones to wide desktops. Use `SafeAreaView` for notches/insets.
- Must look correct on: small phone, large phone, tablet/iPad (portrait + landscape), and web at any width.

## Patterns

- **Hooks own orchestration** (`useGameController`); components are declarative and render from store state.
- **Services are the seam** for anything external (auth, leaderboard) — local implementations now, remote
  in Phase 2, same interface. Persistence goes through `data/` repositories, never AsyncStorage inline.
- **Platform-specific native APIs are wrapped** in `lib/` and guarded (e.g. `playMoveHaptic` no-ops on web).
  Never call a native-only API (haptics, etc.) directly in a component or hook.
- State: server/derived game state in stores via the controller; never read `process.env` outside `config/`.

## Code standards

- TypeScript strict, named exports, no `any`, no `as` without reason.
- **No comments in code** (this project's preference). Names carry intent.
- No magic numbers — use tokens. No dead code, no `console.log`.
- `npm run typecheck` and `npm run lint` must be clean before done.

## Testing

- **No test files in this version** (deliberate, to stay lightweight). The engine in `game/` is pure and
  test-ready; reintroduce unit tests before public launch / Phase 2. Do not add test tooling back unless asked.

## Run

```
npm install
npx expo start      # press w (web), or scan QR with Expo Go on a phone
```
