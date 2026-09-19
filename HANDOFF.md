# HANDOFF.md

Snapshot for picking this project back up. For product scope see
[`SPEC.md`](SPEC.md); for engineering conventions see [`CLAUDE.md`](CLAUDE.md);
for technical rationale see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Current state

Both PRs from the last session are merged into `master`:

- **PR #4** (`phase-9-polish`) — Phase 9 (Polish): error handling (root
  `ErrorBoundary`), accessibility (`useDialogA11y`: autofocus/Escape/
  focus-restore/Tab-trap in `Modal` and `ConfirmDialog`), frontend test infra
  (vitest+jsdom+RTL in `apps/web`, first tests in `packages/shared`), a
  performance audit (documented, no changes needed at this app's scale),
  `.nvmrc`/`engines`, `README.md`, MIT `LICENSE`.
- **PR #5** (`ui-polish-skiper`, rebased onto `master` after #4 merged for a
  clean diff) — UI polish: `AnimatedNumber` (new `framer-motion` dep) for
  Dashboard stat-card count-up, shared `--shadow-sm`/`--shadow-lg`/
  `--motion-standard` tokens applied to cards/modals/hover states, and a
  bento-grid restructure of the Dashboard with a gradient-fade hero balance
  card.

**Phase 9 is complete — SPEC.md's whole phased plan is now done.**

A second review pass (two subagents, one per PR) caught two more real bugs
before merge, both fixed:

- `useDialogA11y`'s `FOCUSABLE_SELECTOR` matched disabled elements. A dialog
  whose first focusable child is disabled (e.g. `BudgetForm`'s category
  `<select>` in edit mode) silently failed to autofocus, and the Tab-trap's
  boundary check could never match that disabled element, so Shift+Tab
  escaped the modal backward instead of wrapping. Fixed: selector now
  excludes `:disabled`. Regression test added to `Modal.test.tsx`.
- `ConfirmDialog.module.css`'s `.danger:hover` was unreachable — beaten by
  `.actions button:hover` on a specificity tie (that rule's type selector
  won the tiebreak) — so the destructive delete button never showed its
  darkened hover state. Fixed by scoping it `.actions .danger:hover`.

Local branches `phase-7-market`, `phase-8-dashboard`, `claude-design`,
`phase-9-polish`, `ui-polish-skiper`, and `worktree-agent-ac0a8777fe7cfb61d`
are all fully merged and safe to delete (`git branch -d <name>`) — nobody's
asked for that cleanup yet.

## Known follow-ups (not bugs, flagged by review, not yet acted on)

- Dashboard's count-up animation doesn't fire when navigating to a
  not-yet-cached month — `useDashboard` has no `placeholderData`, so the
  whole grid unmounts/remounts with the final value already set. Fix would
  be `placeholderData: (prev) => prev` on the query (TanStack Query v5).
- The hero balance card's gradient highlight corner drops white-text
  contrast below WCAG AA (~2.4:1 vs. the 4.5:1 minimum) in roughly the
  top-left ~15% of the card.
- `AnimatedNumber.test.tsx` only covers the synchronous first-render output;
  no test drives an actual value change or the reduced-motion path.

## Key decisions made across these two sessions

**Phase 9 scope** was decomposed and confirmed with the user up front, in
order: error handling → accessibility → frontend tests → performance audit
→ dev experience → docs/README. Each shipped as its own commit, verified
(typecheck/lint/format/test, + live in Chrome) before moving to the next.

**Subagent review + research, run in parallel**: once each PR was open, a
subagent reviewed it while, for PR #5, a second researched Skiper UI
(skiper-ui.com) so the two didn't block each other. A second review pass
after both PRs were open (one subagent per PR) caught the two bugs listed
above.

**Skiper UI findings**: it's a shadcn-style copy-paste component registry
(`npx shadcn add @skiper-ui/skiperN`), no runtime npm package. It has **no**
table, chart, or dialog components — those stay on shadcn/Base UI,
untouched. Its two applicable pieces for this app: an animated-number
pattern (→ `AnimatedNumber`) and the motion signature already sitting unused
in the vendored `apps/web/src/components/ui/skiper-ui/skiper40.tsx` (300ms
`cubic-bezier(0.4,0,0.2,1)`, `motion-reduce:`-aware) — now applied via a
shared `--motion-standard` token.

**Design-reference photos** (`~/Pictures/financial-manager/`): a mobile
fintech app with a lime-green radial-gradient-glow background, and a desktop
"FinFlex" dashboard with a mixed-size bento card grid + gradient hero
balance card. User explicitly chose to **keep this app's existing
blue/green/red accent tokens** rather than adopt the reference's lime-green
palette — the gradient-fade and bento-grid _structure_ were adopted, not the
color scheme.

**Frontend styling** (prior session): Tailwind CSS v4 + shadcn/ui added to
`apps/web` **alongside** the CSS Modules every page still uses — not a
migration. shadcn's tokens live under a `--sc-` prefix in `index.css`
specifically so they never collide with this app's pre-existing
`--bg`/`--accent`/`--border`/etc. tokens.

**Claude Design**: a separate `claude-design` branch (merged, PR #1)
produced `design/README.md` — a design system derived from the app's real
code/tokens. Design/UI work continues to get its own branch, independent of
phase branches.

## Verification baseline

`master` at `9df9bc8`: `npm run typecheck && npm run lint && npm run test &&
npm run format:check` all pass — 64 `apps/api` domain tests + 12
`packages/shared` tests + 22 `apps/web` tests (97 total), `npm run build`
clean. Live-Chrome verification from the prior session covered the
`ErrorBoundary` fallback, `Modal`/`ConfirmDialog` focus/Escape behavior, the
gradient hero card, animated count-up, and the 2-column/1-column responsive
breakpoints — the 4-column desktop breakpoint (>900px) was **not** visually
confirmed (the browser-automation tool's viewport was fixed-size and
unresponsive to resize commands in that environment).
