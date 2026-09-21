# Doublo — Online Leaderboard & Authentication (Phase 2) Plan

Serverless, AWS-native, free-tier-friendly. Adds accounts (Google / Apple / GitHub) and global
leaderboards on top of the existing offline game, reusing the seams already in the app
(`auth-service`, `leaderboard-service`).

---

## 1. Goals

- Sign in with **Google, Apple, and GitHub**.
- Submit finished games to a **global leaderboard**; show **top N** and **the player's rank**.
- Per grid size / win target / time period boards (e.g. weekly, all-time).
- Migrate the existing **anonymous device score** into the account on first sign-in.
- Solid security: least-privilege IAM, encryption at rest, JWT-protected API, secrets in a vault.
- Stay within AWS free tier at small/medium scale; scale to zero when idle.

---

## 2. High-level architecture

```
Expo app (iOS / Android / web)
   │  Sign in (OAuth + PKCE via Cognito Hosted UI)
   ▼
Amazon Cognito User Pool ── identity providers: Google · Apple · GitHub(*)
   │  issues JWT (access + id + refresh)
   ▼
API Gateway (HTTP API) ── JWT authorizer (validates Cognito token) ── WAF / throttling
   │
   ▼
AWS Lambda (Node 20 + TypeScript)  ── handlers: submitScore, getLeaderboard, getMyRank, getMe
   │  least-privilege IAM
   ▼
DynamoDB (single table + GSI for ranking)  ── encryption at rest, PITR backups
   │
   └── Secrets Manager / SSM (OAuth client secrets)   CloudWatch (logs, alarms, X-Ray)

(*) GitHub is not OIDC-native — see §3.
```

---

## 3. Authentication service (the core decision)

**Recommended: Amazon Cognito User Pool** (AWS-native, fits IaC, 50k MAU free).

- **Google** — native Cognito social provider. ✅ straightforward.
- **Apple** — native "Sign in with Apple" provider. ✅ straightforward (needs Apple Developer account + a Services ID + key).
- **GitHub** — ⚠️ the catch: GitHub is **OAuth 2.0, not OpenID Connect**, and Cognito only federates OIDC/SAML/native social. So GitHub needs a **thin OIDC bridge**: a tiny Lambda + API Gateway that wraps GitHub's OAuth (`/authorize`, `/token`, `/userinfo`, JWKS) to look OIDC-compliant, registered in Cognito as a generic OIDC provider. This is a known, well-documented pattern (small, deployable via the same IaC).

Client uses **PKCE** (public client, no client secret in the app) via Cognito Hosted UI through
`expo-auth-session`. Tokens stored in **expo-secure-store** (Keychain/Keystore); refresh handled by the client.

**Alternative (if GitHub-native simplicity matters more than staying pure-AWS):** a managed auth provider
(**Auth0 / Clerk / Supabase Auth**) supports Google + Apple + GitHub out of the box with less code, at the
cost of a third-party dependency and possible cost above free limits. The API + DynamoDB stay the same;
only the token issuer/authorizer changes.

> Decision needed (A): **Cognito + GitHub OIDC-bridge** (recommended, all-AWS) **or** a managed provider (Auth0/Clerk) for simpler GitHub.

---

## 4. Data model — DynamoDB single table (`doublo`)

| Item | PK | SK | Key attributes |
|---|---|---|---|
| User profile | `USER#<userId>` | `PROFILE` | displayName, provider, avatarUrl, deviceIds[] |
| User best (per board) | `USER#<userId>` | `BEST#<boardId>` | score, maxTile |
| Score submission | `USER#<userId>` | `SCORE#<ts>` | score, maxTile, moves, durationMs, gridSize, winTarget |
| Leaderboard entry | `LB#<boardId>` | `USER#<userId>` | score, maxTile, displayName |

`userId` = Cognito `sub`. `boardId` encodes config + period, e.g. `g4-w2048-ALL`, `g4-w2048-WEEK#2026-W24`.

**Ranking without Redis — GSI1:**
- `GSI1PK = LB#<boardId>`, `GSI1SK = score` (Number).
- **Top N** = query GSI1 by board, `ScanIndexForward=false`, `Limit=N`.
- **A user's rank** = query GSI1 for `score > myScore`, `Select=COUNT` → rank = count + 1.
- Time-scoped boards expire via a DynamoDB **TTL** attribute (weekly/daily auto-reset, no cron).
- At larger scale, swap the COUNT-rank query for atomic **score-bucket counters** (O(1) approx rank).

Security: encryption at rest (AWS-managed KMS), Point-in-Time Recovery, on-demand billing.

---

## 5. API (Lambda + API Gateway HTTP API)

All write/identity routes require a valid Cognito JWT (HTTP API **JWT authorizer**). Validation with
shared Zod schemas. Consistent envelopes (`{ data }` / `{ error: { code, message } }`).

| Method & path | Auth | Purpose |
|---|---|---|
| `POST /v1/scores` | ✅ | Submit a finished game; upsert best; update leaderboard entry if improved |
| `GET /v1/leaderboard?board=<id>&limit=50` | optional | Top N for a board |
| `GET /v1/me` | ✅ | Profile + bests |
| `GET /v1/me/rank?board=<id>` | ✅ | Caller's rank |
| `POST /v1/me/link-device` | ✅ | Merge anonymous device best into the account |

One Lambda per handler (or a single router Lambda) — Node 20 + TypeScript, esbuild-bundled.

---

## 6. Infrastructure as Code + security

**Recommended IaC: AWS CDK (TypeScript)** — same language as the app, type-safe, easy least-privilege.
(Alternatives: AWS SAM or Terraform.)

Security controls baked into the stack:
- **IAM least privilege** — each Lambda gets only the DynamoDB actions it needs, scoped to the table + GSI ARNs.
- **Cognito** — PKCE public client, short access tokens (1h) + rotating refresh; MFA optional.
- **API Gateway** — JWT authorizer, per-route **throttling/rate limits**, strict **CORS allowlist** (`https://doublo.sviara.com`), payload size limits.
- **WAF** (optional) on the API for IP rate limiting / abuse rules.
- **Secrets** — Google/Apple/GitHub client secrets in **AWS Secrets Manager** (or SSM SecureString), never in code; injected at deploy.
- **Data** — DynamoDB encryption at rest + PITR; no PII beyond display name; never log tokens/PII.
- **Observability** — CloudWatch logs + alarms, X-Ray tracing, structured logs.
- **CI/CD** — GitHub Actions deploys the CDK stack via OIDC role assumption (no long-lived AWS keys in CI).

> Decision needed (B): IaC tool — **CDK (recommended)** / SAM / Terraform.

---

## 7. Client integration (Expo app)

- Add `expo-auth-session` + `expo-secure-store`. New `auth-service` (real): sign-in/out, token storage, refresh, current user.
- Swap `getLeaderboardService()` local impl for a **RemoteLeaderboardService** (HTTP) behind the existing interface — UI mostly unchanged.
- New screens/sections: **Sign in** (Google / Apple / GitHub buttons), **Leaderboard** (top N + your rank), profile/display name.
- On first sign-in, call `link-device` to merge the local best (the anonymous `deviceId` we already store).
- Feature flag `EXPO_PUBLIC_ONLINE_ENABLED` gates all of this; offline play still works with no account.

---

## 8. Anti-cheat

- Phase 1: server-side plausibility checks (score consistent with maxTile, move count, duration; per-user rate limits + idempotency keys).
- Optional later: client submits a compact **move log**; a Lambda replays it through the **shared pure engine** (`game/engine.ts`) to confirm the score is reachable. (This is why the engine has no RN imports.)

---

## 9. Repo / code structure

To share the engine + Zod schemas between app and backend (single source of truth):

```
doublo/                      (npm workspaces monorepo)
├── apps/mobile/             current Expo app (moved here)
├── packages/shared/         engine + schemas + constants (consumed by app AND backend)
├── services/api/            Lambda handlers (TypeScript)
└── infra/                   AWS CDK app (stacks: auth, data, api)
```

> Decision needed (C): convert to **npm workspaces monorepo** (recommended; shares the engine for anti-cheat) **or** keep the app as-is and give the backend its own copy of schemas.

---

## 10. Milestones

1. **Infra skeleton** — CDK stacks: DynamoDB table + GSI, Cognito user pool/client, HTTP API + 1 Lambda, IAM. Deploy to a dev account.
2. **Auth** — Google + Apple in Cognito; GitHub OIDC-bridge Lambda; app sign-in via expo-auth-session; tokens in SecureStore.
3. **Scores + leaderboard** — `POST /scores`, `GET /leaderboard`, `GET /me/rank`; RemoteLeaderboardService in the app; device-score migration.
4. **Periods + anti-cheat** — weekly/daily boards (TTL), plausibility checks, rate limits, WAF.
5. **Hardening + CI/CD** — alarms, tracing, GitHub Actions OIDC deploy, load test, free-tier cost check.

---

## 11. Cost (small/medium scale)

Lambda (1M req free), DynamoDB (25 GB + 25 RCU/WCU always-free), Cognito (50k MAU free),
API Gateway HTTP API (1M req/mo free 12 months). Effectively $0 until meaningful traffic.

---

## 12. Decisions needed from you (before I build)

- **A. Auth provider:** Cognito + GitHub OIDC-bridge (all-AWS, recommended) **or** managed (Auth0/Clerk) for easier GitHub.
- **B. IaC tool:** AWS CDK (recommended) / SAM / Terraform.
- **C. Repo structure:** npm workspaces monorepo with shared engine (recommended) / keep app as-is + duplicate schemas.
- **D. AWS account:** do you have an AWS account + region preference? (e.g. `ap-south-1` / `us-east-1`)
- **E. Apple Developer account** available? (required for Sign in with Apple)
