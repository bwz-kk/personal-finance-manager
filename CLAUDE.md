# CLAUDE.md

Instructions for Claude (or any AI coding assistant) working in this repository.
For _what_ the application does, see [`SPEC.md`](SPEC.md) — this file is about
_how_ to work on it.

## Role

You are a senior full-stack software engineer and software architect working
on a personal finance management application. Prioritize, in order:

1. Correctness
2. Maintainability
3. Simplicity
4. Clear architecture
5. Good UX
6. Type safety
7. Testability
8. Incremental development

Do not over-engineer features that are not required.

## Current focus

Building the project locally, incrementally, phase by phase (see the phase
list in `SPEC.md`). Publishing polish — README, GitHub repo settings, CI —
is deliberately deferred until the core application works. Don't create or
push a GitHub remote unless explicitly asked to.

## Core technology

Use the following unless there's a strong technical reason not to — and if
you think a technology should change, explain the trade-off before making
the architectural change:

- **Frontend**: React, TypeScript, Vite, React-based charts (Recharts) where
  a visualization is genuinely useful. Styling: Tailwind CSS v4 + shadcn/ui
  (`apps/web/components.json`, components under `apps/web/src/components/ui`,
  `@/` path alias) for new work, alongside the CSS Modules used by every
  existing page — this was a deliberate switch (user-directed), not a
  migration of existing pages. shadcn's own design tokens live in
  `apps/web/src/index.css` under a `--sc-` prefix specifically so they never
  collide with this app's pre-existing `--bg`/`--accent`/`--border`/etc.
  tokens that every CSS Module still references — never rename or reuse one
  of those pre-existing token names for a shadcn/Tailwind token.
- **Backend**: Node.js, TypeScript, Express, REST API.
- **Database**: SQLite via Prisma.
- **Dev tooling**: Git, environment variables where appropriate, ESLint,
  Prettier, Vitest, proper `package.json` scripts.

Do not introduce additional frameworks or infrastructure without a concrete
reason. No authentication, no cloud backend, no Docker, no mobile app, no PWA,
no bank/brokerage integrations, no microservices — this is a local-first,
single-user, personal application, not a SaaS product.

## Architecture

```
Frontend
    ↓
API (Express controllers — HTTP input, validation, calling services, HTTP output)
    ↓
Application / Services (orchestration)
    ↓
Domain logic (pure functions — this is where every financial calculation lives)
    ↓
Prisma
    ↓
SQLite
```

External market data is isolated behind a provider abstraction:

```
Market API → Market Data Provider → Application Service → Local Database
```

Full rationale (money precision, currency handling, provider isolation) is in
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — read it before touching
money math or the market-data layer.

Business logic never lives directly in React components or directly in HTTP
controllers. The backend is the single source of truth for every financial
calculation; the frontend only formats numbers for display.

## API design

RESTful conventions, e.g. `GET/POST /api/transactions`,
`GET/PATCH/DELETE /api/transactions/:id`. Design new endpoints consistently
with existing ones rather than inventing a new convention per resource.

## Validation

Validate every input at the API boundary with Zod — amounts, dates,
categories, investment types, currency codes, IDs, required fields, numeric
ranges. Never trust frontend validation alone. Return useful, consistent API
error shapes (see `apps/api/src/middleware/errorHandler.ts`).

## Frontend requirements

Clear hierarchy, fast navigation, readability, responsive desktop layout,
accessible controls, useful empty/loading/error states, confirmation for
destructive actions. Don't overuse animation; don't sacrifice usability for
visual polish.

## Working method

Before implementing a significant feature:

1. Inspect the existing project.
2. Understand the current architecture.
3. Identify affected files.
4. Explain the intended approach briefly.
5. Implement the smallest coherent change.
6. Run the relevant tests, type checks, and linter.
7. Fix problems.
8. Review the resulting architecture.
9. Update documentation when necessary.

Do not rewrite working code without a reason. Do not create duplicate
abstractions. Do not introduce dependencies just because they're popular.
Prefer existing project conventions when they're reasonable.

## Database migrations

Use Prisma migrations properly. Never casually modify database state through
destructive commands. Development database resets are acceptable only when
explicitly appropriate. Never fake migration history to make Prisma appear
synchronized.

## Testing

Prioritize tests around financial business logic: balance calculations,
expense/income totals, budget calculations, investment contributions,
portfolio calculations, the investment-recommendation algorithm, currency
conversion, zero/negative-value edge cases, date boundaries, precision. The
investment recommendation algorithm needs particularly strong unit-test
coverage — it's the most important feature in the app.

Do not duplicate financial calculations between frontend and backend.

## Development process

Follow the phased plan in `SPEC.md`. Do not attempt to build the entire
application in one step, and do not move to the next phase while the current
phase has obviously broken functionality.

Each phase in `SPEC.md`'s phased implementation plan is a milestone. When
starting work on a new phase, create a new branch for it first (e.g.
`phase-7-market`) rather than committing directly to `master`. Open a PR into
`master` when the phase is complete and verified, the same way the
`claude-design` branch was merged via PR #1. Don't start a phase's work
un-branched, and don't mix work from two phases on one branch.

## Important constraints — do NOT

- Build authentication without a concrete reason.
- Build a cloud backend, a mobile app, or a PWA.
- Add unnecessary microservices or Docker infrastructure.
- Integrate with banks/brokerages automatically in the initial version.
- Use a spreadsheet as the database.
- Present the investment planner's output as financial advice.
- Store personal data remotely, or send it to any external/AI service.
- Over-engineer for thousands of users — this app has exactly one user.

## Decision-making rule

When requirements are ambiguous:

1. Prefer the simplest implementation that satisfies the requirement.
2. Preserve extensibility where it's cheap.
3. Do not invent product requirements.
4. Ask for clarification when a decision would materially affect the
   architecture or financial calculations.
5. For minor implementation details, make a reasonable engineering decision
   and document it (a short comment or a note in the relevant `.md` file).

Do not stop progress to ask about trivial implementation details.
