# Personal Finance Manager

A local-first personal finance manager: track income and expenses, set
budgets, manage investments separately from ordinary spending, get a
configurable (non-advisory) investment suggestion, track goals, and watch
market assets you don't own.

**This application is not financial advice.** The investment planner is a
configurable calculator over your own numbers, not a recommendation from a
financial professional.

## Local-first, by design

All financial data lives in a SQLite file on your machine. There is no cloud
database, no hosted backend, and no account system — this project is not a
SaaS product. Nothing about your transactions, investments, or goals is ever
sent anywhere except to the market-data providers you configure (and those
calls only ever request public price data, never your financial data). See
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full design.

## Stack

- **Frontend**: React, TypeScript, Vite, React Router, TanStack Query,
  Recharts, CSS Modules.
- **Backend**: Node.js, TypeScript, Express, Zod.
- **Database**: SQLite via Prisma.
- **Tooling**: ESLint, Prettier, Vitest.

## Project layout

```
apps/api/       Express REST API, Prisma schema, domain/business logic
apps/web/       React frontend
packages/shared/ Types shared between api and web
docs/           Architecture notes
```

## Getting started

Requires Node.js 20+ and npm.

```bash
npm install

cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

npm run prisma:migrate   # creates the local SQLite database
npm run dev              # runs the API (http://localhost:4000) and web (http://localhost:5173)
```

### Environment variables

| App | File            | Variable       | Purpose                                                         |
| --- | --------------- | -------------- | --------------------------------------------------------------- |
| api | `apps/api/.env` | `DATABASE_URL` | SQLite file path (Prisma connection string)                     |
| api | `apps/api/.env` | `HOST`         | API bind address (default `127.0.0.1` — keep it localhost-only) |
| api | `apps/api/.env` | `PORT`         | API port (default `4000`)                                       |
| api | `apps/api/.env` | `CORS_ORIGIN`  | Allowed origin for the web app                                  |
| web | `apps/web/.env` | `VITE_API_URL` | Base URL the frontend uses to call the API                      |

`.env` files are gitignored. Only the `.env.example` templates are committed.
No API keys are required for the default market-data providers.

## Scripts

Run from the repo root (they orchestrate the workspaces):

- `npm run dev` — API + web dev servers together.
- `npm run build` — production builds for both apps.
- `npm run test` — runs the test suite (heaviest coverage is on
  `apps/api/src/domain`, since that's where financial calculations live).
- `npm run lint` / `npm run format` — ESLint / Prettier across the repo.
- `npm run typecheck` — TypeScript project-wide, no emit.
- `npm run prisma:migrate` — apply Prisma migrations to the local database.

## Security

See [`SECURITY.md`](SECURITY.md) for this project's threat model (local-first,
single-user, no auth), how to report an issue, and data-handling notes
(backups, file permissions).

### Repository security setup (for maintainers)

These are one-click GitHub settings, not code — turned on for this repo's
`main` branch:

- **Secret scanning + push protection** (Settings → Code security) — blocks
  pushes containing a leaked key/token, catching an accidentally-unignored
  `.env` before it hits history.
- **CodeQL default setup** (Settings → Code security) — static analysis for
  the JS/TS in this repo, no workflow file to author.
- **Dependabot alerts + security updates** (Settings → Code security) — auto
  PRs for known-vulnerable dependencies.
- **Branch protection on `main`** (Settings → Branches) — require PRs and
  passing CI checks before merge. Required-reviewer counts and CODEOWNERS are
  skipped here — this is a solo-maintained project.

### Dependency install scripts (`allowScripts`)

Recent npm versions (11.16+) gate a package's `preinstall`/`postinstall`
scripts behind explicit approval — see the `allowScripts` block in
`package.json`. It's currently advisory (npm still runs the scripts and just
warns), but is expected to become enforced in a future npm major version.
Review `npm install-scripts ls` before approving; only approve scripts you
recognize as necessary (e.g. Prisma's client generation, esbuild's platform
binary fetch).

`prisma` and `@prisma/client` are pinned to an exact version (`6.12.0`, not a
semver range) rather than left to float, because a newer Prisma pulled in a
high-severity `deepmerge-ts` vulnerability transitively via `@prisma/config`.
Don't bump prisma via a routine `npm update` or accept a Dependabot PR for it
without checking `npm audit` first — it's pinned deliberately, not
accidentally stale.

## Development status

Built incrementally, phase by phase — see the implementation plan in the
project history. Early phases (foundation, core transactions) land first;
investments, the planner, goals, and market data follow.
