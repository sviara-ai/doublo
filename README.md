# Doublo

A 2048-style merge game for iOS and Android, built with Expo + React Native + TypeScript.

Swipe to slide tiles; equal tiles merge and double. Reach 2048 to win, then keep going for a high score.

## Quick start

```
npm install
npx expo start
```

Then press `i` for the iOS simulator, `a` for the Android emulator, or scan the QR code with the Expo Go app.

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Start the Expo dev server |
| `npm run ios` / `npm run android` | Start on a simulator/emulator |
| `npm run web` | Start in the browser |
| `npm run typecheck` | Strict TypeScript check |
| `npm run lint` | Lint with eslint-config-expo |

## Project layout

```
app/                 expo-router screens (home, game, history)
src/game/            pure game engine (no UI imports)
src/hooks/           useGameController orchestrates engine + store + persistence
src/store/           zustand state (game, stats)
src/features/        UI: board, tiles, HUD
src/components/ui/   shared primitives (Button, Overlay)
src/data/            AsyncStorage repositories (saved game, scoreboard)
src/services/        auth (device id), score, leaderboard (Phase 2 seam)
src/lib/             platform-safe wrappers (haptics)
src/shared/          shared types and zod schemas
src/theme/           colors (light/dark), tiles, tokens, responsive layout
```

See [docs/PLAN.md](docs/PLAN.md) for the full plan and Phase 2 roadmap.
