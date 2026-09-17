# HANDOFF.md

Snapshot for picking this project back up. For product scope see
[`SPEC.md`](SPEC.md); for engineering conventions see [`CLAUDE.md`](CLAUDE.md);
for technical rationale see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Current state

`master` at `54476ee` (+ nothing pending). Phases 1–8 complete and merged.
No open PRs. Repo: https://github.com/bwz-kk/personal-finance-manager.

Local branches `phase-7-market`, `phase-8-dashboard`, `claude-design`, and
`worktree-agent-ac0a8777fe7cfb61d` are all fully merged and safe to delete
locally (`git branch -d <name>`) — left as-is, not deleted, since nobody
asked for that cleanup.

Remaining phase: **9 (Polish)** — not started. `README.md` is still
intentionally absent; it gets written in Phase 9 once the app is otherwise
done (see SPEC.md's Status section for why).

## Key decisions made this session

**Workflow**: each phase in SPEC.md's phased plan is its own milestone —
own branch (`phase-N-<slug>`), PR into `master`, merged after review.
Decided partway through (after Phases 1–6 had already gone straight to
`master`); documented in CLAUDE.md's "Development process" section.
Phases 7 and 8 followed it (PRs #2, #3).

**Money precision**: integer minor units for currency (`amountMinor`), but
**decimal strings** — not Prisma's `Decimal` type — for fractional
quantities (crypto amounts, share counts). SQLite silently loses precision
past ~15 significant digits under Prisma's `Decimal`; decimal strings
parsed with `decimal.js` in the domain layer avoid that entirely. See
`docs/ARCHITECTURE.md`.

**i18n**: a from-scratch typed dictionary + React context
(`apps/web/src/i18n`), English default with a pt-BR toggle persisted to
`localStorage` — no library. Money formatting stays pt-BR/BRL regardless of
interface language (the app's financial data is BRL-centric).

**Market data providers** (Phase 7): CoinGecko (crypto), open.er-api.com
(currency — not exchangerate.host, which now requires a key), brapi.dev (BR
stocks only, no international coverage), Banco Central do Brasil SGS API
(SELIC/CDI/IPCA). All no-key, all through one `fetchWithTimeout` (8s).
Known accepted quirk: BCB's daily-lag publishing means indicators read
"stale" against the fixed 24h threshold almost immediately after a
successful refresh — not a bug, not fixed (YAGNI on a per-class threshold).

**Frontend styling** (this session, user-directed): added Tailwind CSS v4 +
shadcn/ui to `apps/web` **alongside** the CSS Modules every existing page
still uses — not a migration. shadcn's own design tokens live in
`index.css` under a `--sc-` prefix specifically so they can never collide
with this app's pre-existing `--bg`/`--accent`/`--border`/etc. tokens
(the shadcn init CLI's default merge tried to silently overwrite `--accent`
and `--border` with its own generic values — caught and fixed before
commit). New components go under `apps/web/src/components/ui`; the `@/`
path alias is configured in **both** `tsconfig.json` and
`tsconfig.app.json` (shadcn's CLI reads the former directly in this
monorepo layout, not the latter via `references`) — a real CLI quirk hit
during setup, worth remembering if `shadcn add` starts writing files to a
literal `apps/web/@/` folder again.

**Claude Design**: a separate `claude-design` branch (merged, PR #1)
produced `design/README.md` — a design system derived from the app's real
code/tokens, for UI/visual design work. Future design work should follow
the same pattern: its own branch, PR into `master`, independent of backend
phase work.

## Things caught by review this session (already fixed)

- `marketService.ts`'s `refreshItem` originally caught both the provider
  fetch AND the `MarketPriceCache` DB write in one try/catch, silently
  treating a real DB error as "provider is down." Fixed to only catch the
  provider fetch.
- `investmentPlanner.ts`'s buffer-vs-minimum tie-breaking mislabeled its
  own `bindingConstraint` in one edge case — caught by its own unit test
  before shipping.
- `button.tsx` (shadcn-generated) imported `cn` from the raw `cn` npm
  package instead of `@/lib/utils` like every other component — cosmetic
  but inconsistent; fixed.

## Verification baseline

Everything in `master` passes `npm run typecheck && npm run lint && npm run
test && npm run format:check` (64 domain tests as of Phase 8, 10 suites). Every phase
was also verified live — either via the Chrome browser tool or, on the one
session where the extension was disconnected, by cross-checking curl
responses against the compiled Vite module graph. `docs/ARCHITECTURE.md`
and `SPEC.md`'s per-phase entries have the specifics for each phase if you
need to know exactly what was checked and how.
