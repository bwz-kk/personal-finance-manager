# HANDOFF.md

Snapshot for picking this project back up. For product scope see
[`SPEC.md`](SPEC.md); for engineering conventions see [`CLAUDE.md`](CLAUDE.md);
for technical rationale see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Current state

**[v0.1.0](https://github.com/bwz-kk/personal-finance-manager/releases/tag/v0.1.0)
released** (`21bd02c`, tag `v0.1.0`) — first public release. Version bumped
`0.0.0` → `0.1.0` across all workspace `package.json` files.

SPEC.md's phased plan is complete (see prior handoff history below for
Phase 9). Three more PRs have since merged into `master`, and one design
exploration was closed unmerged:

- **PR #6** (`feature/investments-cash-cdi`) — CDI (Brazilian interbank
  rate) reference/return projection on the Investments tab (new
  `CdiDailyRate` model, `cdiRateService.ts` caching against the BCB SGS API,
  pure `projectCdiIndexedValue` domain function), and BRL investment
  transactions now auto-create a linked cash `Transaction` (BUY/DEPOSIT →
  expense, SELL/WITHDRAWAL/DIVIDEND/INTEREST → income) so investing actually
  deducts from cash balance instead of a separate ad-hoc formula.
- **PR #7** (`feature/daily-spending-tab`) — new "Daily Spending" nav tab
  (`/daily-spending`): average daily spending for the selected month
  (`averageDailySpendingMinor` domain function, elapsed-days-in-month
  denominator) plus the same average broken out per category, with a bar
  chart.
- **PR #9** (`feature/language-dialog`) — replaced the two-button EN/PT-BR
  toggle with a shadcn `Dialog` picker (`LanguageDialog.tsx`): one trigger
  button showing the current language, opens a dialog listing both with
  flags. Added the shadcn `dialog.tsx` primitive (`npx shadcn add dialog`,
  no new npm dependency — `@base-ui/react` was already installed).
- **PR #8** (`feature/mesh-background`) — **closed unmerged, branch
  deleted.** A background-visual exploration (drifting mesh blobs →
  translucent card backgrounds → a diagonal "cosmic light beam" built via
  the superpowers visual-companion tool against user-supplied reference
  screenshots → user rejected the beam, reverted to blobs → then asked to
  remove the blobs too). Net effect on `master`: **none** — no background
  decoration, no `--bg-card` token. If background/visual-polish work comes
  up again, start fresh; don't resurrect this branch's approach without
  re-confirming direction with the user first (three rounds of "not quite"
  on this one).

Each PR went through this app's usual `/review` → fix → merge cycle; review
findings for #6 and #9 are summarized below since they're genuine
correctness/coverage fixes, not style nits.

## Review findings fixed (not bugs anymore, but worth knowing why)

**PR #6 — Critical: `getCdiDailyRates` cache-gap detection.** The original
caching logic only checked whether the single globally-latest cached CDI
date covered the request, not whether the request's start date did. Any
investment whose date range predated another already-cached window (e.g.
two CDI investments opened months apart) got a silently truncated/wrong
projection. Fixed by extracting a pure `missingCdiRanges` function
(`apps/api/src/domain/cdiRateGaps.ts`) that checks both ends of the cached
window, with a named regression test for exactly this scenario.

**PR #6 — Important: currency case sensitivity.** `investment.currency ===
'BRL'` relied on frontend `.toUpperCase()` only, not enforced at the Zod
boundary — violates this repo's "never trust frontend validation alone"
rule. Fixed with `.transform((s) => s.toUpperCase())` in the validation
schema.

**PR #9 — Suggestions:** no test file existed for `LanguageDialog.tsx`
despite this repo's convention of testing small interactive components
(`Modal.test.tsx`, `ConfirmDialog.test.tsx`); added one. Also added a
one-line comment explaining why the trigger mixes inline `style` (this
app's `--border`/`--text` tokens) with Tailwind utility classes (shadcn's
own tokens) — intentional per the two-token-system split documented in
`CLAUDE.md`, not an oversight.

## Key decisions made this session

**CDI + cash-deduction scope** was clarified with the user up front via
`superpowers:brainstorming` (bounded path) before writing any code, per
`CLAUDE.md`'s rule to ask before financial-calculation-affecting changes:
CDI became a full live-rate return-projection feature (not just a label),
and cash-deduction became auto-linked `Transaction` rows (not a formula).
A backfill script (`apps/api/scripts/backfillInvestmentCashLinks.ts`) was
written and run once so the visible cash balance didn't jump when the old
`dashboardService.ts` ad-hoc `brlInvestedMinor` subtraction was removed in
favor of the new auto-linked transactions (which also fixed a pre-existing
Dashboard-vs-Transactions balance inconsistency as a bonus).

**Daily Spending scope**: started as a single dashboard stat card, then
the user asked for it as its own tab instead (better UX than a lone number
buried in the bento grid), then asked for a per-category breakdown too.
Each step reused the existing `/dashboard` endpoint/query rather than
adding new backend surface, until the per-category ask required extending
the endpoint's `spendingByCategory` entries with `averageDailyMinor`.

**Background/visual work needs the visual-companion tool, not text-only
iteration.** The PR #8 exploration burned many rounds because early
iterations were built from a text description of what the user wanted
("gradients and mockups") before reference images existed; once actual
reference screenshots were provided, mockups converged faster (though
still didn't survive contact with a real full-width viewport — see below).
For any future "make it look like X" request, ask for or generate visual
mockups via the brainstorming skill's visual-companion tool before writing
app code.

**Mockup-to-real-viewport scaling is not automatic.** Twice this session
(the original mesh blobs, and the "cosmic beam"), a design that looked
right in the visual-companion tool's small preview box (~800×380px)
rendered as barely-visible or wrongly-proportioned on a real ~1500px-wide
desktop viewport. Fixed the beam case by switching from a
rotated/oversized rectangle (tuned in absolute px against the small
mockup) to a plain `linear-gradient(angle, ...)` — a gradient's bright
stop is corner-to-corner by construction and its percentage stops scale
with the box automatically, no manual trig needed. Prefer that technique
over rotated/positioned decorative elements for any future full-viewport
background effect; always verify against a real desktop width (`resize_window`
to ~1512×900) in the browser tool, not just the mockup preview, before
calling a background design done.

**Dev server survives branch switches, but its CSS Modules cache can
desync.** Mid-session, switching branches several times under the running
`npm run dev` process (started by the user, not this session) left
`Layout.module.css`'s compiled output empty (`export default {}`) even
though the file on disk was valid — confirmed via `npx vite build`
succeeding and `lightningcss` parsing the file standalone without error.
Fix was `touch vite.config.ts` to force Vite's dev server to fully
restart, which is non-destructive to the user's terminal session. If a
CSS Module's classes silently stop applying (elements render with
`className=""`) after several git-branch switches under a live dev
server, check the raw served module (`curl
localhost:5173/src/path/File.module.css`) before assuming the CSS itself
is broken.

## Verification baseline

`master` at `21bd02c` (`v0.1.0`): `npm run typecheck && npm run lint &&
npm run test && npm run format:check` all pass — 89 `apps/api` domain
tests + 12 `packages/shared` tests + 25 `apps/web` tests (126 total).
Pre-release repo scan found no committed secrets, `.env` files, DB files,
or build artifacts. Live-Chrome verification this session covered: CDI
reference/refresh and projected value on the Investments tab,
investment-transaction cash auto-deduction, the Daily Spending tab
(overall average, per-category cards, bar chart) in both languages, and
the language dialog (opens, lists both languages, switches and closes on
selection) at both a small and a ~1512×900 desktop viewport.
