# Architecture

## Overview

Local-first personal finance manager. Three deployable pieces, run only on the
user's own machine:

- `apps/web` — React + TypeScript + Vite frontend.
- `apps/api` — Node + TypeScript + Express REST API.
- SQLite database file, managed by Prisma, never leaves disk and is never
  committed to git.

`packages/shared` holds TypeScript types/enums consumed by both apps (kept in
sync manually with `apps/api/prisma/schema.prisma` — there is no codegen step
for this yet, since the enum set is small and changes rarely; if that stops
being true, generating shared types from the Prisma schema is the next step).

## Layering (backend)

```
Frontend
    ↓ REST
Controllers        — HTTP request/response only: parse input, call a service,
                      shape the response. No business logic.
    ↓
Services            — orchestration: fetch/persist via Prisma, call domain
                      functions, assemble the result.
    ↓
Domain              — pure functions, no Prisma import, no I/O. Given plain
                      data in, returns a plain result. This is where every
                      financial calculation lives and where the heaviest test
                      coverage lives (apps/api/tests/domain).
    ↓
Prisma Client → SQLite
```

The backend is the single source of truth for every financial calculation
(balances, budget progress, portfolio returns, the investment-planner
recommendation). The frontend never re-derives these numbers — it only
formats what the API returns for display (`packages/shared`'s
`formatMinorUnits` is formatting, not a calculation).

## Money precision

All currency amounts are stored and passed around as **integer minor units**
(R$10.50 → `1050`), in fields suffixed `Minor` (e.g. `amountMinor`). This
avoids IEEE-754 floating point drift for the arithmetic that matters most
(sums, budget totals, portfolio value).

Fractional quantities that need more precision than cents — crypto amounts,
fractional shares, prices per unit — are **not** stored using Prisma's
`Decimal` type. SQLite has no true arbitrary-precision numeric type; Prisma's
`Decimal` maps to a SQLite column with `NUMERIC` affinity, which can silently
lose precision past roughly 15 significant digits
([prisma#20635](https://github.com/prisma/prisma/issues/20635)). Instead,
those fields are stored as **decimal strings** (e.g. `quantity: "0.00034521"`)
and parsed with [`decimal.js`](https://github.com/MikeMcl/decimal.js) inside
`apps/api/src/domain`, the only place that does quantity arithmetic.

## Market data isolation

```
External provider (CoinGecko / brapi.dev / FX API)
    ↓
MarketDataProvider (interface, apps/api/src/services/market)
    ↓ concrete implementations, one per provider
MarketService — on provider failure, falls back to MarketPriceCache
    (last-known price + timestamp) instead of failing the request
    ↓
API routes → Frontend
```

Nothing outside `services/market` knows which external API is in use. Adding
or swapping a provider means adding one file and registering it — the
database schema and the rest of the app are unaffected. `MarketPriceCache` is
what keeps a provider outage from becoming an application error: local
financial data is never blocked on a third-party API being up.

## Currency handling

Cash transactions (`Transaction`, `Budget`, `Goal`) assume a single base
currency (`BRL` by default, configurable). Investments and watchlist items
each carry their own `currency` field, and portfolio totals are grouped and
shown **per currency** — amounts in different currencies are never silently
summed together. Explicit conversion (with a rate source and timestamp) is a
deliberately deferred feature; see the plan's risk notes.

## What's intentionally not here

- No authentication — single local user, no network exposure.
- No cloud database, no hosted backend, no Docker.
- No bank/brokerage integrations.
- No currency-conversion engine in v1 (see above).
