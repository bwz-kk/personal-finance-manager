# Personal Finance Manager

A local-first, single-user personal finance app: transactions, budgets,
investments, an investment-suggestion planner, financial goals, and a
market/watchlist for prices you want to track.

## Local-first, not a SaaS product

This app runs entirely on your own machine. There is no cloud backend, no
hosted deployment, and no account system — the API server only binds to
`127.0.0.1` and is never meant to be reachable over a network. All financial
data lives in a local SQLite file that never leaves your computer, and
nothing here is sent to any external service, including the AI tools used to
develop this project. See [`SECURITY.md`](SECURITY.md) for the full threat
model and data-handling notes.

**This is not financial advice.** The investment planner suggests an
investable amount based on your own income, spending, and configurable
settings — it's a calculator, not professional guidance.

## Tech stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS v4 + shadcn/ui,
  Recharts for charts.
- **Backend**: Node.js, TypeScript, Express, a REST API.
- **Database**: SQLite via Prisma.
- **Testing**: Vitest (+ React Testing Library for the frontend).

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the layering
(controllers → services → domain → Prisma) and the money-precision strategy,
and [`CLAUDE.md`](CLAUDE.md) for engineering conventions.

## Getting started

### Prerequisites

- Node.js 22+ (see [`.nvmrc`](.nvmrc); run `nvm use` if you use nvm)

### Setup

```bash
git clone https://github.com/bwz-kk/personal-finance-manager.git
cd personal-finance-manager
npm install

# Copy the env templates and adjust if needed (defaults work as-is for local dev)
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Create the local SQLite database and apply migrations
npm run prisma:migrate

# Seed default income/expense categories
npm run prisma:seed

# Start both the API (http://localhost:4000) and the web app (http://localhost:5173)
npm run dev
```

## Project structure

```
apps/
  api/     Express REST API — controllers, services, domain logic, Prisma schema
  web/     React frontend (Vite)
packages/
  shared/  Types and display-formatting helpers shared by both apps
docs/
  ARCHITECTURE.md   Technical rationale: money precision, layering, market-data providers
design/
  README.md         Design system derived from the app's real components/tokens
```

## Scripts

Run from the repo root (npm workspaces):

| Script                            | What it does                                                    |
| --------------------------------- | --------------------------------------------------------------- |
| `npm run dev`                     | Start the API and web app together                              |
| `npm run build`                   | Build both apps for production                                  |
| `npm test`                        | Run all test suites (`packages/shared`, `apps/api`, `apps/web`) |
| `npm run typecheck`               | Type-check both apps                                            |
| `npm run lint`                    | Lint the whole repo                                             |
| `npm run format` / `format:check` | Prettier write / check                                          |
| `npm run prisma:migrate`          | Apply Prisma migrations (dev)                                   |
| `npm run prisma:seed`             | Seed default categories                                         |

## Documentation

- [`SPEC.md`](SPEC.md) — product spec and phased implementation plan
- [`CLAUDE.md`](CLAUDE.md) — engineering conventions and working method
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — technical architecture and rationale
- [`SECURITY.md`](SECURITY.md) — threat model, vulnerability reporting, data handling
- [`design/README.md`](design/README.md) — visual design system

## Status

Phases 1–8 of the implementation plan are complete; Phase 9 (polish) is in
progress. See [`SPEC.md`](SPEC.md#status) for phase-by-phase detail.

## License

[MIT](LICENSE)
