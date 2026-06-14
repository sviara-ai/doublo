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
| `npm test` | Run the game-engine unit tests |
| `npm run typecheck` | Strict TypeScript check |
| `npm run lint` | Lint with eslint-config-expo |

## Project layout

```
app/                 expo-router screens (home, game, history)
src/game/            pure game engine + tests (no UI imports)
src/hooks/           useGameController orchestrates engine + store + persistence
src/store/           zustand state (game, stats)
src/features/        UI: board, tiles, HUD
src/data/            AsyncStorage repositories (saved game, scoreboard)
src/services/        auth (device id), score, leaderboard (Phase 2 seam)
src/shared/          shared types and zod schemas
src/theme/           colors and layout metrics
```

See [docs/PLAN.md](docs/PLAN.md) for the full plan and Phase 2 roadmap.
