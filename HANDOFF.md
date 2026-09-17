# HANDOFF.md

Snapshot for picking this project back up. For product scope see
[`SPEC.md`](SPEC.md); for engineering conventions see [`CLAUDE.md`](CLAUDE.md);
for technical rationale see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Current state

`master` itself is unchanged this session — still at `54476ee` (Phases 1–8).
Two open PRs, **stacked** (the second depends on the first merging first):

- **PR #4** (`phase-9-polish` → `master`,
  https://github.com/bwz-kk/personal-finance-manager/pull/4) — Phase 9
  (Polish): error handling (root `ErrorBoundary`), accessibility
  (`useDialogA11y`: autofocus/Escape/focus-restore/Tab-trap in `Modal` and
  `ConfirmDialog`), frontend test infra (vitest+jsdom+RTL in `apps/web`,
  first tests in `packages/shared`), a performance audit (documented, no
  changes — no real problem at this app's scale), `.nvmrc`/`engines`,
  `README.md` (was intentionally absent until now), MIT `LICENSE`. Reviewed
  by a subagent mid-session, which found a real gap (Tab wasn't trapped
  despite `aria-modal="true"`) and a coverage gap (`ConfirmDialog` had zero
  tests despite the same wiring as `Modal`) — both fixed, pushed.
- **PR #5** (`ui-polish-skiper` → `master`,
  https://github.com/bwz-kk/personal-finance-manager/pull/5) — UI polish:
  `AnimatedNumber` (new `framer-motion` dep) for Dashboard stat-card
  count-up, shared `--shadow-sm`/`--shadow-lg`/`--motion-standard` tokens
  applied to cards/modals/hover states, and a full bento-grid restructure
  of the Dashboard with a gradient-fade hero balance card. **This branch
  merged `phase-9-polish` into itself** to get its test infra (jsdom/RTL
  didn't exist on `master` yet) — so its diff includes all of PR #4's
  commits until #4 merges. Rebase `ui-polish-skiper` onto `master` after #4
  lands, for a clean PR #5 diff.

Local branches `phase-7-market`, `phase-8-dashboard`, `claude-design`, and
`worktree-agent-ac0a8777fe7cfb61d` are still fully merged and safe to delete
(`git branch -d <name>`) — still nobody's asked for that cleanup.

## Key decisions made this session

**Phase 9 scope** was decomposed and confirmed with the user up front, in
order: error handling → accessibility → frontend tests → performance audit
→ dev experience → docs/README. Each shipped as its own commit on
`phase-9-polish`, verified (typecheck/lint/format/test, + live in Chrome)
before moving to the next.

**Subagent review + research, run in parallel**: once PR #4 was open, one
subagent reviewed it (found the Tab-trap and `ConfirmDialog` test gaps
above) while a second researched Skiper UI (skiper-ui.com) for the
UI-polish work, so the two didn't block each other.

**Skiper UI findings**: it's a shadcn-style copy-paste component registry
(`npx shadcn add @skiper-ui/skiperN`), no runtime npm package. It has **no**
table, chart, or dialog components — confirmed by the research subagent, so
those stay on shadcn/Base UI, untouched. Its two applicable pieces for this
app: an animated-number pattern (→ `AnimatedNumber`, new `framer-motion`
dep) and the motion signature already sitting unused in the vendored
`apps/web/src/components/ui/skiper-ui/skiper40.tsx` (300ms
`cubic-bezier(0.4,0,0.2,1)`, `motion-reduce:`-aware) — now actually applied
via a shared `--motion-standard` token instead of sitting idle.

**Design-reference photos** (`~/Pictures/financial-manager/`, two files):
a mobile fintech app with a lime-green radial-gradient-glow background, and
a desktop "FinFlex" dashboard with a mixed-size bento card grid + gradient
hero balance card. User explicitly chose to **keep this app's existing
blue/green/red accent tokens** rather than adopt the reference's lime-green
palette — the gradient-fade and bento-grid _structure_ were adopted, not
the color scheme. `design/README.md`'s documented `--shadow-sm`/`--shadow-lg`
two-step elevation ladder was already specified but never wired to any real
CSS before this session — now it is.

**Frontend styling** (prior session): Tailwind CSS v4 + shadcn/ui added to
`apps/web` **alongside** the CSS Modules every page still uses — not a
migration. shadcn's tokens live under a `--sc-` prefix in `index.css`
specifically so they never collide with this app's pre-existing
`--bg`/`--accent`/`--border`/etc. tokens.

**Claude Design**: a separate `claude-design` branch (merged, PR #1)
produced `design/README.md` — a design system derived from the app's real
code/tokens. Design/UI work continues to get its own branch, independent
of phase branches (this session's `ui-polish-skiper` follows that, aside
from the one-time test-infra merge noted above).

## Things caught by review this session (already fixed)

- `useDialogA11y` set `aria-modal="true"` on `Modal`/`ConfirmDialog` but
  never trapped Tab — a keyboard user could tab past the last control into
  the page behind an open dialog. Fixed: Tab now cycles within the panel.
- `ConfirmDialog` — the component behind every destructive delete flow —
  had zero test coverage despite the same `useDialogA11y` wiring as
  `Modal`. Added autofocus/Escape/confirm/Tab-trap tests for it (and
  Tab-trap tests for `Modal`, previously only implicitly covered).
- `packages/shared` pinned `vitest ^3.2.7` while `apps/api`/`apps/web`
  pinned `^3.0.4` — aligned to `^3.0.4`.
- The budget progress-bar track used `--bg-subtle`, which this session's
  own shadow pass made identical to the card background it sits inside —
  invisible. Changed the track to `--border`.

## Verification baseline

`master` itself: everything still passes `npm run typecheck && npm run
lint && npm run test && npm run format:check` (64 domain tests, unchanged —
`master` has no frontend tests yet, those are on PR #4).

On `phase-9-polish` (PR #4): same commands, 87 tests (12 `packages/shared` +
64 `apps/api` + 11 `apps/web`), plus live-Chrome verification of the
`ErrorBoundary` fallback and `Modal` focus/Escape behavior.

On `ui-polish-skiper` (PR #5, includes #4's commits): 97 tests (adds 10 more
`apps/web` tests — `ConfirmDialog` + `AnimatedNumber`), `npm run build`
clean, live-Chrome verification of the gradient hero card, animated
count-up on month navigation, and both the 2-column and 1-column responsive
breakpoints (the 4-column desktop breakpoint above 900px was **not**
visually confirmed — the browser-automation tool's viewport is fixed-size
in this environment and window-resize had no effect on it).
