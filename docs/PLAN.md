# Doublo — Build Plan

A 2048-style merge game for iOS and Android. Phase 1 ships offline with local history and
no login. The architecture is built so Phase 2 (accounts + live competitive leaderboards) is
an additive change, not a rewrite.

## Aim

- Simple, polished, fast merge game on the App Store and Play Store.
- Phase 1: fully offline. Scores and history saved locally. No account needed.
- Phase 2: optional sign-in, online score submission, live global/friends ranking.

## Tech Stack

| Concern | Choice | Why |
|---|---|---|
| App framework | Expo (SDK 52) + React Native + TypeScript | One codebase, both stores, EAS build/submit |
| Routing | expo-router | File-based, typed, deep-link ready (needed for Phase 2 invites) |
| Animation | react-native-reanimated | 60fps tile slide/merge on the native thread |
| Gestures | react-native-gesture-handler | Reliable swipe detection |
| State | zustand | Minimal client/UI + game state |
| Validation | zod | One schema validates all persisted/IO data |
| Local storage | @react-native-async-storage/async-storage | Saved game + scores (non-sensitive) |
| Haptics | expo-haptics | Tactile feedback on each move |

## Architecture

```
UI (app/, features/)  ->  hooks/useGameController  ->  game/engine (pure)
                                  |                           |
                                  v                           v
                          store/ (zustand)              data/ repositories
                                                              |
                                                        services/ (auth, score, leaderboard)
```

- `game/engine.ts` is pure TypeScript with no React Native imports. It is fully unit-tested and
  can be reused on the Phase 2 server to validate submitted scores (anti-cheat).
- The UI never contains game logic; the controller hook orchestrates engine + store + persistence.
- Persistence and identity sit behind small interfaces so Phase 2 swaps implementations only.

## Phase 2 readiness (already in place)

- **Anonymous identity now.** `auth-service.getDeviceId()` generates and stores a stable id. Every
  saved score carries this `userId`. Phase 2 links that id to a real account — no data migration.
- **Leaderboard-shaped records.** `ScoreEntry` already has `userId, score, maxTile, moves,
  durationMs, createdAt` — exactly what a ranking API needs.
- **Service seam.** `getLeaderboardService()` returns a local implementation today. Phase 2 returns
  a `RemoteLeaderboardService` (HTTP) behind the same interface; UI is unchanged.
- **Config flag.** `EXPO_PUBLIC_ONLINE_ENABLED` gates online features. Flip it on in Phase 2.

## Phase 2 plan (not built yet) — serverless, free-tier AWS

Goal: stay inside the AWS Always-Free / 12-month free tier at small/medium scale. No servers to run,
no monthly database bill. Everything is pay-per-request and scales to zero when idle.

> Note: this is a deliberate, project-specific deviation from the workspace default backend
> (NestJS + Postgres). A casual game leaderboard is a great fit for serverless + a key-value store,
> and it keeps hosting effectively free.

### Components

| Concern | AWS service | Free tier |
|---|---|---|
| Compute | AWS Lambda (Node 20 + TypeScript) | 1M requests + 400k GB-s / month, always free |
| API | API Gateway HTTP API (or Lambda Function URLs for $0) | 1M requests / month (12 months) |
| Database | DynamoDB (on-demand) | 25 GB storage + 25 RCU/WCU, always free |
| Auth | Amazon Cognito (Apple / Google federation) | 50k monthly active users, always free |
| IaC / deploy | AWS SAM (or CDK in TypeScript) | free |

### DynamoDB single-table design (`doublo`)

One table, item types by key pattern:

| Item | PK | SK | Notes |
|---|---|---|---|
| Profile | `USER#<userId>` | `PROFILE` | display name, linked Cognito sub |
| User best | `USER#<userId>` | `BEST` | best score, max tile |
| Score history | `USER#<userId>` | `SCORE#<ts>` | one item per finished game |
| Leaderboard entry | `LB#<boardId>` | `USER#<userId>` | one best entry per user per board |

Ranking without Redis — use a GSI:

- **GSI1**: `GSI1PK = LB#<boardId>` (e.g. `LB#GLOBAL`, `LB#WEEK#2026-W24`), `GSI1SK = score` (Number).
- **Top N**: query GSI1 by board, `ScanIndexForward=false`, `Limit=N` → top scores directly.
- **A user's rank**: query GSI1 by board with `GSI1SK > userScore`, `Select=COUNT` → rank = count + 1.
- Boards are time-scoped by id (`GLOBAL`, `WEEK#<iso-week>`, `DAY#<date>`) so weekly/daily resets are free —
  just write to a new board id; old ones expire via a DynamoDB TTL attribute.

At larger scale, replace the per-user COUNT-rank query with score-bucket counters (atomic
`ADD` on bucket items) for O(1) approximate rank. Top-N stays a single GSI query throughout.

### Auth

- Amazon Cognito user pool with Sign in with Apple + Google.
- Lambdas authorize via the Cognito JWT (API Gateway JWT authorizer — no custom token code).
- The Phase 1 anonymous `deviceId` is sent on first sign-in and linked to the Cognito `sub`,
  migrating the player's local best score into their account.

### Endpoints (Lambda handlers)

- `POST /v1/scores` — submit a finished game; validate, upsert user best, update leaderboard entry if improved.
- `GET /v1/leaderboard?scope=global|friends&period=all|weekly|daily&limit=50` — top N.
- `GET /v1/me/rank?scope=...&period=...` — caller's rank.

### Anti-cheat

- Phase 1: lightweight server checks (score consistent with max tile and move count, per-device rate limits).
- Optional later: clients submit a compact move log; the Lambda replays it through the **shared pure
  engine** (same `game/engine.ts`) to confirm the score is reachable. Reusing the engine is exactly why
  it has no React Native imports.

### Client wiring (no UI changes)

- Add `RemoteLeaderboardService` (calls the HTTP API) and a Cognito-backed auth service; register them
  behind the existing `getLeaderboardService()` / auth seams.
- Flip `EXPO_PUBLIC_ONLINE_ENABLED=true` and set `EXPO_PUBLIC_API_URL` to the API Gateway URL.

## Running

```
cd doublo
npm install
npx expo start
```

Press `i` (iOS simulator), `a` (Android emulator), or scan the QR with Expo Go.

## Quality checks

```
npm run typecheck   # strict TypeScript
npm run lint        # eslint-config-expo
```

This version ships without unit tests to stay lightweight. The engine in `src/game/` is pure and
test-ready; reintroduce tests before public launch / Phase 2.

## Store submission checklist (before release)

1. Add `assets/icon.png` (1024x1024) and an adaptive icon + splash; reference them in `app.json`.
2. Create an Expo/EAS account: `npx eas login`.
3. `npx eas build --platform ios` and `--platform android`.
4. `npx eas submit` for each store. Fill privacy labels (Phase 1 collects no personal data).
