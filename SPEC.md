# SPEC.md — Product Specification

Personal finance manager, local-first, single-user. For engineering process
and constraints, see [`CLAUDE.md`](CLAUDE.md). For technical architecture
and the money-precision strategy, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Status

Phase 1 (Foundation) through Phase 7 (Market) are complete and merged to
`master` (PR #2). Phase 8 (Dashboard & analytics) is implemented on branch
`phase-8-dashboard`, pending PR review. The repo is public on GitHub
(https://github.com/bwz-kk/personal-finance-manager). A `claude-design`
branch produced `design/README.md` (a design system derived from the app's
real code/tokens), merged via PR #1. `README.md` is still temporarily
removed; it'll be rewritten once the core application is done — Phase 9.

Starting with Phase 7, each phase in the phased implementation plan below is
its own milestone: it gets its own branch (named `phase-N-<slug>`) and merges
into `master` via PR when complete and verified, rather than committing
directly to `master` — see `CLAUDE.md`'s "Development process" section.

Phase 2 delivered: Category CRUD (with default seeded categories, system
categories protected from deletion), Transaction CRUD with filtering/sorting/
searching/date-range/category-filter, a pure `calculateBalance` domain
function (tested for zero/negative/mixed cases), a `/api/transactions/summary`
endpoint, and a working Transactions page (list, filters, add/edit form,
delete confirmation, inline category management). Dashboard remains a stub —
that's Phase 8.

The frontend also has a lightweight i18n layer (`apps/web/src/i18n`): a typed
string dictionary + React context, no external library, English default with
a pt-BR toggle persisted to `localStorage`. New UI text should go through
`useLanguage().t` rather than being hardcoded — see
`apps/web/src/i18n/translations.ts` for the pattern. Money formatting
(`formatMinorUnits`) is intentionally not tied to this — it stays pt-BR/BRL
formatting regardless of interface language, since the app's financial data
is BRL-centric.

Phase 3 delivered: `Budget` CRUD scoped to a `"YYYY-MM"` month, an expense-only
constraint (a budget must reference an EXPENSE category), a pure
`calculateBudgetProgress` domain function (spent/limit/remaining/progress%/
overspent, tested including the zero-limit divide-by-zero edge case) and a
pure `monthDateRange` helper (tested for month-boundary and year-rollover
correctness) used to aggregate the real spend per category from
`Transaction` rows via Prisma's `aggregate`. The Budgets page has month
navigation, add/edit/delete, a progress bar, and an overspend indicator — all
verified live via Chrome (create → overspend rendering → edit → delete),
translated in both languages.

Phase 4 delivered: `Investment` + `InvestmentTransaction` CRUD. The schema
was tightened first — `Investment.quantity`/`purchasePriceMinor` were dropped
(migration `drop_investment_manual_quantity`) since they'd have been a second,
conflicting source of truth alongside the transaction history; quantity and
invested principal are now always computed fresh from `InvestmentTransaction`
rows via `summarizeInvestmentTransactions` (BUY/DEPOSIT add, SELL/WITHDRAWAL
subtract, DIVIDEND/INTEREST/OTHER are informational only — documented in the
domain module). `currentValueMinor` stays the one manual mark-to-market field
per `docs/ARCHITECTURE.md`. `calculateInvestmentReturn` and `calculatePortfolio`
group strictly by currency — never summed across currencies — both pure and
unit-tested (34 domain tests total now), including the divide-by-zero and
empty-portfolio edge cases. Investment transactions are an append-only
history: create + delete only, no edit (correct a mistake by deleting and
re-adding). The Investments page has portfolio-by-currency summary cards,
per-investment cards with expandable transaction history, and add/edit/delete
for both — verified live via Chrome including a real two-currency portfolio
(BRL + USD, confirmed never mixed).

Phase 5 delivered: `calculateInvestmentPlan`, the app's most important
calculation per this spec — given actual month income/expenses (reusing
`calculateBalance` and `monthDateRange`, no duplicated logic) and the
singleton `InvestmentPlanConfig`, it derives a suggested investment amount
that's the most restrictive of three caps (target-investment-rate, minimum-
cash-buffer, max-%-of-available-cash), then raises to a configured minimum
only if the buffer leaves room for it. Every result reports a
`bindingConstraint` so the suggestion is always explainable, never presented
as advice (explicit disclaimer in the UI), and the user can freely invest a
different amount (nothing blocks entering any amount when actually recording
an `InvestmentTransaction`). 13 dedicated domain tests — including one that
caught a real mislabeling bug in the buffer-vs-minimum tie-breaking logic
before it shipped — plus the full 47-test domain suite passing. The Planner
page has month navigation, a live-recomputing strategy-settings panel, and
the full explainable breakdown, verified live via Chrome (changing the
buffer setting correctly re-capped the suggestion and updated the displayed
reason in real time).

Phase 6 delivered: `Goal` CRUD with a pure `calculateGoalProgress` domain
function (remaining amount, progress %, complete flag — capped at 100% when
overfunded, divide-by-zero guarded, 5 unit tests; 52-test domain suite
passing). `currentAmountMinor` stays a plain editable field per the decision
recorded during Phase 5 — no linked-contributions table, and goals do not
yet factor into the planner's available-cash calculation (the spec marks
that integration optional; it's a documented future extension, not built to
avoid inventing an unspecified monthly-allocation model). The Goals page
matches the spec's own example exactly (R$750/R$1,800 → R$1,050 remaining)
and correctly caps an overfunded goal's bar at 100% with a "Complete"
label — both verified live via Chrome.

Phase 7 delivered: the `MarketDataProvider` interface
(`apps/api/src/services/market/types.ts`) plus four concrete providers, one
per `WatchlistAssetClass` — CoinGecko (crypto), open.er-api.com (currency;
not exchangerate.host, which now requires a key), brapi.dev (BR stocks), and
the Banco Central do Brasil SGS API (SELIC/CDI/IPCA indicators) — all no-key,
all going through a shared `fetchWithTimeout` (8s) so a hung request can
never hang the app. A pure `isPriceStale` domain function (6 unit tests,
including the future-asOf clock-skew case) flags a cached price as possibly
outdated; the service layer never throws on a provider failure — it falls
back to `MarketPriceCache` and marks the result stale, and a `refresh-all`
batch never fails over one bad symbol (58-test domain suite passing).
`GET /api/market/watchlist` never makes a live call — it only reads the
cache, so viewing the watchlist works offline; refreshing is an explicit,
separate action (`POST .../refresh` or `.../refresh-all`). All four
providers were verified against their real, live APIs (not mocked) during
development — BTC/BRL, USD/BRL, SELIC and PETR4 all returned real current
values. One honest quirk, not a bug: BCB publishes daily indicator data with
a ~1-day lag, so SELIC/CDI/IPCA read as "stale" against the fixed 24h
threshold almost immediately after a successful refresh — accepted as-is
rather than adding a per-asset-class threshold (YAGNI). International
stocks are not covered (brapi.dev is BR-only) — a documented limitation, not
an oversight. The Market page's frontend was verified live via Chrome
(extension reconnected in a follow-up session): add-item form, a real
CoinGecko refresh that changed both price and timestamp on click,
refresh-all, delete with confirmation, and the empty state — all correct,
no console errors.

Phase 8 delivered: a `GET /api/dashboard` endpoint that's pure composition,
not new financial logic — it calls the existing transaction/budget/planner/
portfolio/market services and assembles their results, per
`docs/ARCHITECTURE.md`'s one-calculation-per-concern rule. The only real
decision was cash balance: `calculateBalance(allTransactions)` nets against
BRL-denominated investment contributions only (`portfolio.groups.find(g =>
g.currency === 'BRL')`), since `Transaction` rows are BRL-only per
`docs/ARCHITECTURE.md`'s currency handling — a USD/EUR investment's
contributions are never subtracted from the BRL balance, which would
silently mix currencies. Two small pure domain additions support the time-
series charts: `trailingMonths` and `bucketMinorByMonth` (6 unit tests,
including a month-boundary rollover and an out-of-range-entries case) — the
6-month trend and investment-contributions charts are zero-filled for
quiet months rather than skipping them. `CONTRIBUTION_TYPES`/
`WITHDRAWAL_TYPES` were exported from `portfolioCalculator.ts` (previously
module-private) so the dashboard reuses the exact same BUY/DEPOSIT-vs-SELL/
WITHDRAWAL classification Phase 4 established, instead of redefining it.
64-test domain suite passing. The Dashboard page shows cash balance,
portfolio value and invested amount per currency, period income/expenses,
available cash, and the suggested investment, plus six Recharts
visualizations (income vs. expenses, monthly trend, spending by category,
portfolio allocation, investment contributions) and three list panels
(budget status, recent transactions, watchlist) — replacing the placeholder
stub. Verified live via Chrome against realistic seeded data (multiple
months of transactions, a budget, an investment, a watchlist item): every
figure cross-checked against the raw API response, pt-BR toggle correctly
translates chart labels too (they're derived from `t.dashboard.*`, not
hardcoded), and month navigation correctly re-fetches — no console errors.

## Project context

A personal finance manager, built primarily for personal use, with source
published on GitHub eventually for continuous maintenance and improvement.
The application runs locally. Personal financial data must remain local — no
cloud database, no hosted backend. The project should still be structured
professionally enough that the architecture, code quality, database design,
and development practices demonstrate real-world software engineering
ability. This is not a SaaS product.

## Product goal

The application answers three questions:

1. **Where is my money going?** Track income and expenses, provide useful
   spending analysis.
2. **How much can I invest?** Analyze income, spending, recurring expenses,
   budgets, and available cash to calculate a suggested investable amount.
   This is a configurable financial-planning mechanism, **not** financial
   advice.
3. **What is happening with my investments and the assets I follow?** Track
   investments actually owned, separately from market assets/indicators
   merely being monitored.

## Core application structure

### Dashboard

High-level overview, prioritizing useful information over visual decoration:
current cash balance, current investment portfolio value, total income/
expenses for the selected period, amount invested, available amount,
suggested investment amount, budget status, recent transactions, relevant
market/watchlist information.

### Transactions

Record income (salary, freelance, other) and expenses (food, transportation,
education, entertainment, subscriptions, shopping, other). Each transaction:
amount, description, date, type, category, optional notes. Support create,
edit, delete, filtering, sorting, searching, date ranges, category filtering.

### Categories

Stored in the database, not hardcoded in the UI. Income categories, expense
categories, custom categories. Categories can be added/modified without
changing application code.

### Budgets

Monthly spending limits, e.g. Food: spent R$380 / budget R$500 / 76%
progress — calculated from actual transactions, not entered manually.
Support monthly budgets, category-specific budgets, budget progress,
overspending detection, remaining budget. The backend is the sole source of
truth for this calculation — never duplicate it in the frontend.

### Investment system

Investments are modeled separately from ordinary expenses. An investment
contribution moves money from available cash into an asset — it is **not**
an expense. Example:

```
Income:                +R$2,000
Food:                    -R$300
Transport:                -R$150
Investment contribution:  -R$500   (reduces cash, increases invested assets)
```

### Investments

Assets actually owned: CDB, Tesouro Direto, stocks, ETFs, crypto, foreign
currency, other. Fields as relevant: name, asset type, institution/broker,
currency, quantity, purchase price, invested amount, current value, purchase
date, notes. Not every asset type has the same characteristics — the model
supports different asset types without a specialized table per type.

### Investment transactions

Investment history represented through transactions/events: BUY, SELL,
DEPOSIT, WITHDRAWAL, DIVIDEND, INTEREST, OTHER. Investment history is
calculated from these events, not from manually overwritten balances.

### Investment planning

One of the most important features. Estimates how much can reasonably be
invested in a given month based on actual financial situation. Example:

```
Income:                R$2,000
Expected/actual expenses:  R$1,300
Available:              R$700
Suggested investment:      R$500
Remaining buffer:          R$200
```

The calculation must **not** be a single hardcoded percentage — it's a
configurable strategy. Potential parameters: minimum monthly investment,
target investment rate, minimum cash buffer, maximum percentage of available
cash to invest, expected recurring expenses, optional goal-based
contributions. The recommendation must be explainable — "Suggested
investment: R$500" needs enough accompanying detail to show how the app
arrived at that number. Never present it as professional financial advice.
The user can always override the suggested amount.

### Financial goals

E.g. "Buy a new monitor" — target R$1,800, current R$750, remaining R$1,050,
target date December 2026. Show progress; optionally factor goals into the
available-investment calculation.

### Market / watchlist

Separate section for assets/indicators being _monitored_, distinct from
assets actually _owned_: currencies (USD/BRL, EUR/BRL), crypto (BTC/BRL,
ETH/BRL), interest rates/indicators (CDI, SELIC, IPCA), stocks (Brazilian and
international where supported). Extensible to new assets later.

### Market data

Preferably from external APIs. Constraints: personal financial data stays
local; API credentials never hardcoded, always via environment variables;
external API failures must never corrupt local financial data; unavailable
market data must degrade gracefully; the app must not be completely
dependent on real-time market data. Market-data fetching is isolated from
the core financial domain behind a provider/service abstraction, so the
provider can be replaced later without touching the database or UI.

### Portfolio

Combines actual investments into a portfolio view: total invested, current
portfolio value, absolute return, percentage return, asset allocation,
investment history, contributions over time. Never silently mix currencies
(BRL, USD, EUR, BTC, ...) — conversions must be explicit.

### Financial analytics

Useful visualizations: income vs. expenses, spending by category, monthly
spending trends, investment contributions, portfolio allocation, portfolio
value over time, budget utilization. Charts communicate information, not
decoration.

## Data integrity

Financial calculations are critical — do not rely on JavaScript
floating-point arithmetic where precision matters. Monetary values are
stored as integer minor units (R$10.50 → 1050 centavos). Be consistent
throughout backend and database. See `docs/ARCHITECTURE.md` for the full
strategy, including why fractional quantities use decimal-string fields
instead of Prisma's `Decimal` type on SQLite.

## Privacy

Never: upload personal transactions to a remote server, send personal
financial data to an AI service, commit the SQLite database to git, commit
`.env` files containing secrets, log sensitive financial information
unnecessarily. Provide `.env.example` files and a correctly configured
`.gitignore`. See [`SECURITY.md`](SECURITY.md) for the full threat model.

## Phased implementation plan

1. **Foundation** — project structure, React app, Node API, TypeScript
   config, Prisma, SQLite, environment configuration, linting, formatting,
   basic testing setup. _(Done.)_
2. **Financial core** — categories, income, expenses, transactions, balance
   calculation. _(Done.)_
3. **Budgets** — monthly budgets, category budgets, budget calculations.
   _(Done.)_
4. **Investments** — investments, investment transactions, portfolio
   calculations. _(Done.)_
5. **Investment planner** — available cash calculation, investment strategy,
   suggested investment, configurable safety buffer, explanation of
   recommendation. _(Done.)_
6. **Goals** — financial goals and progress. _(Done.)_
7. **Market** — watchlist, market data provider abstraction, currency
   tracking, crypto, economic indicators. _(Done.)_
8. **Dashboard & analytics** — unified dashboard and useful charts.
   _(Done.)_
9. **Polish** — error handling, testing, accessibility, performance,
   documentation, developer experience, UI consistency. This is also where
   `README.md` gets rewritten and GitHub publishing happens.

Do not move to the next phase while the current phase has obviously broken
functionality.

## API design examples (not mandatory, design consistently)

```
GET    /api/transactions
POST   /api/transactions
GET    /api/transactions/:id
PATCH  /api/transactions/:id
DELETE /api/transactions/:id

GET    /api/investments
POST   /api/investments
PATCH  /api/investments/:id
DELETE /api/investments/:id

GET    /api/budgets
POST   /api/budgets

GET    /api/goals
POST   /api/goals

GET    /api/market/watchlist
GET    /api/market/:symbol

GET    /api/dashboard
```

## GitHub quality (deferred to Phase 9)

When it's time to publish: good README, architecture documentation, setup
instructions, environment variable documentation, database setup
instructions, development scripts, clear folder structure, `.gitignore`,
`.env.example`, tests, meaningful commit history. The README should explain
the local-first philosophy and clearly state the app is for personal
financial tracking, not professional financial advice.
