# HANDOFF.md

Snapshot for picking this project back up. For product scope see
[`SPEC.md`](SPEC.md); for engineering conventions see [`CLAUDE.md`](CLAUDE.md);
for technical rationale see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Current state

`phase-9-polish` pushed, PR #4 open into `master`
(https://github.com/bwz-kk/personal-finance-manager/pull/4), not yet merged.
`master` itself is still at `54476ee` (Phases 1–8, unchanged this session).

All six Phase 9 (Polish) items from SPEC.md are done on that branch: error
handling, accessibility, frontend testing, a performance audit, developer
experience, and documentation (including `README.md`, which had been
intentionally absent until now, and a new MIT `LICENSE`). Once PR #4 merges,
Phase 9 — and the whole phased plan — is complete.

Local branches `phase-7-market`, `phase-8-dashboard`, `claude-design`, and
`worktree-agent-ac0a8777fe7cfb61d` are still fully merged and safe to delete
(`git branch -d <name>`) — still left as-is, nobody's asked for that cleanup
yet.

## Key decisions made this session (Phase 9)

**Error handling**: every page already had its own loading/error/empty state
via React Query — that part of "error handling" was already solid. The
actual gap was a render-time crash (a component throwing) having nothing to
catch it. Added one root `ErrorBoundary` (class component under a thin
functional wrapper for i18n/hooks access) wrapping the router `Outlet` in
`Layout.tsx`, keyed by `location.pathname` so navigating away resets it —
nav and the language switcher survive a crash on one page.

**Accessibility**: `Modal` and `ConfirmDialog` are the two components every
add/edit/delete flow routes through (5+ pages). Neither managed focus at
all. Added a shared `apps/web/src/hooks/useDialogA11y.ts`: focuses the first
focusable element on mount, restores focus to whatever was focused before on
unmount, Escape calls the dismiss callback. Relies on both components only
ever being conditionally rendered (mount = open, unmount = close) — if either
ever switches to an always-rendered+hidden pattern, this hook needs an
`isOpen` param instead. Existing forms/icon-only controls already had good
`<label>`/`aria-label` coverage — no gap there.

**Frontend test infra**: `apps/web` had a `test` script but no jsdom, no
React Testing Library, 0 tests. Added them — but discovered vitest bundles
its **own** Vite (7.3.6) that's type-incompatible under `tsc -b` with this
repo's root Vite (8.3.0, rolldown-vite) when the `test` config field is
merged into the same `vite.config.ts` object (Plugin type mismatch between
the two nested Vite installs). Fixed by keeping `test` config in a
**separate** `apps/web/vitest.config.ts` instead — no `react()`/`tailwindcss()`
plugins needed there since Vite's core esbuild transform already handles
`.tsx` (tsconfig has `"jsx": "react-jsx"`) and CSS Modules without them.
`packages/shared` had no test script at all despite owning
`formatMinorUnits`/`decimalInputToMinorUnits`/`minorUnitsToDecimalInput` —
the round-trip conversions every money input form depends on — gave it one.
Root `npm test` now runs `packages/shared` → `apps/api` → `apps/web` in
sequence (87 tests total: 12 + 64 + 11).

**Performance**: audited for N+1 queries (found one — `budgetService.ts`
runs one `aggregate` per budget row via `Promise.all` — but against local
SQLite with realistically-few budget rows per month, it's not a measurable
problem), unbounded queries, and bundle size (764KB / 220KB gzip, single
chunk — normal for a single-user local app opened by one person, not
internet-facing at scale). Deliberately did **not** add code-splitting or
query batching — no evidence either would produce a user-visible
improvement at this app's actual scale. Documented the audit rather than
manufacturing speculative work.

**Dev experience**: env vars were already well-documented via
`.env.example` in both apps — nothing to add there. The actual gap was no
Node version pin (`.nvmrc` + `engines`), added with a floor of 22 to match
`apps/api`'s existing `@types/node` lower bound.

**License**: repo had none; asked the user, added MIT (`LICENSE` +
`"license": "MIT"` in root `package.json`). The repo was already public on
GitHub before this session.

## Things caught by review this session (already fixed)

- Nothing caught by a review pass this session — Phase 9 work was
  incremental, verified (typecheck/lint/format/test + live Chrome checks)
  after each item rather than reviewed in bulk at the end.

## Verification baseline

Everything on `phase-9-polish` passes `npm run typecheck && npm run lint &&
npm run test && npm run format:check` — 87 tests across 3 workspaces (12
`packages/shared`, 64 `apps/api`, 11 `apps/web` — the last two new this
session). `apps/web`'s production build (`npm run build`) also verified
clean. Live-verified in Chrome: forced a render crash on the Goals page to
confirm the `ErrorBoundary` fallback (both languages) and that navigating
away and back recovers cleanly; confirmed `Modal` autofocus (typed into the
first field without clicking it) and Escape-to-close on the Goals "Add"
dialog.
