# Personal Finance Manager

A dark-first design system for the `bwz-kk/personal-finance-manager` app — a
personal finance manager with transactions, budgets, investments, a planner
and goals. Built from the app's real code (`master@b1cf5ba`, `apps/web`) and
extended into the layered, KPI-driven dashboard style shown in the reference
screens the team supplied, using the app's own colors, spacing and radii as
the seed rather than a new palette.

## Where this came from

The app itself ships very little visual design today: its Dashboard page is
a placeholder ("Coming soon"), and its six other screens (Transactions,
Budgets, Investments, Planner, Goals, Market) are plain forms and tables
styled with small, page-scoped CSS files. What IS real and consistent across
every one of those files is a small token set in `apps/web/src/index.css` —
`--bg`, `--bg-subtle`, `--border`, `--text`, `--text-muted`, `--accent`
(#2f6fed), `--success` (#1f9254) and `--danger` (#d1373f), each declared
for a light theme in `:root` and overridden for dark under
`prefers-color-scheme: dark` — plus a handful of repeated patterns: 6px
radius on almost every button and input, 8px on cards and dialogs, uppercase
12px labels above stat numbers, bold green/red text for income and expense
amounts, and a budget progress bar that fills blue and turns solid red past
100%.

This system takes those exact values and patterns as its foundation, then:

- reorders the two themes so **Dark is primary** (the reference dashboards
  are dark-first; the app's own dark theme becomes the default here, with
  Light as the secondary variant, unchanged from the source)
- adds a third surface tier (`surface-overlay`) and a shadow scale, since
  the source only ever separates surfaces with a border
- adds `warning` and the four `-soft` pill tokens, since the source has no
  third status color and no soft/tinted fills
- adds a `radius-full` pill radius and a `Display` type scale for
  dashboard-sized KPI numbers, since the source's largest text is a 1.4rem
  page title

Every other value below — the two real theme's colors, the type scale
derived from the CSS's actual `font-size` rules, the spacing scale and the
three border-radius steps — is taken as written. Nothing here was
approximated from the reference screenshots; only the real repository was
read. Where a value is new rather than sourced, its token's `usage` note
says so explicitly.

## Color

Two themes, dark first. `surface-page` → `surface-card` → `surface-overlay`
is the elevation ladder: page background, then a card or panel, then
anything that floats above the page (a modal, a dropdown). `border` draws a
visible edge (inputs, cards); `line` is for a quieter divider inside a card,
such as the rule between two rows in a list.

`accent` is the one interactive color: primary buttons, the active nav
item, links, and the primary series in a chart. `success` and `danger` are
almost never fills in this app — they're the color of a number itself (an
income amount, an expense amount, a positive or negative percentage), and,
for `danger` only, the fill of an over-budget progress bar. `warning` is
new, for a pending or needs-attention status. The four `-soft` tokens are
gentle tints of `accent`, `success` and `danger`, meant as pill backgrounds
behind a small metric (`+5.3%`) or a status word, so the pill reads as UI
chrome rather than a full-strength alert.

Two contrast gaps are inherited from the shipped app rather than corrected:
`accent` and `danger` used as plain text fall to 3.97:1 and 3.72:1 on the
dark theme's `surface-page` (the app's own colors, read verbatim), and
`success` falls to 3.96:1 on the light theme. All three still clear 3:1,
and none of them is the only cue for its meaning — an income row is also
prefixed by its category, an expense by its own row — but a future pass on
the source app could raise them.

## Type

One family throughout — the app's own system-font stack, since it ships no
custom font files. Four groups: `Display` (new, for KPI numbers), `Heading`
(the app's real page, dialog and section titles), `Label` (the app's real
uppercase stat labels and field labels) and `Body` (the app's real body
text and captions).

## Spacing & radius

Spacing is a 4px-based scale distilled from the gaps and padding actually
used across the app's CSS modules. Radius has three real steps — 4px, 6px
and 8px — plus one new pill radius (`radius-full`) for badges and filter
chips, which the app doesn't have yet.

## Elevation

`shadow-sm` and `shadow-lg` are new. The shipped app never uses a shadow —
every surface is separated by a 1px border — which reads fine on a mostly
flat, mostly light UI. The dark, card-dense dashboard this system targets
needs a lift cue in addition to the border, so a light shadow rides along
wherever a surface sits above the page (a stat tile) or above everything
(a modal, a dropdown).

## Components

Six hand-authored primitives, built from the real markup and CSS this app
already has (not a live bundle — see the note below on why):

- **NavItem** — the sidebar's real states (default, hover, active), from
  `Layout.tsx` and `Layout.module.css`.
- **StatTile** — new; a KPI card (label, big number, delta pill) for the
  dashboard the app doesn't have yet, styled from the app's real
  `stat-label` and delta-color patterns.
- **Button** — primary and secondary, from the shared button pattern
  repeated across `TransactionForm`, `Budgets` and `CategoryManager`.
- **Badge** — new; success/warning/danger status pills, extending the
  app's plain-text success/danger colors into a pill form.
- **TransactionRow** — an income/expense list row, from `Transactions.tsx`
  and its module CSS.
- **BudgetBar** — the real progress bar from `Budgets.module.css`,
  including its exact over-100%-turns-red behavior.

### Why these are hand-authored, not a live bundle

The app's actual components (`TransactionForm`, `BudgetForm`,
`InvestmentForm`, `CategoryManager`, `Modal`, `Layout`) are page-specific
forms wired to `@tanstack/react-query` hooks, a REST client and a language
context — not a standalone, importable component library. Building a live
`bundle.js` from them would mean either running the whole app's data layer
inside a static preview (out of scope for a design system, and not
something the team asked to run) or stripping them down until they no
longer matched the real code. Instead, each primitive above is written
directly from the real markup and CSS, credited to its source file, so it
stays an honest reflection of the app rather than a reinvention of it.

## Assets

`Logos/app-mark.svg` — the app's real favicon (`apps/web/public/favicon.svg`),
copied byte-for-byte.

## Not synced

- **Fonts**: none. The app declares only a system-font stack, no
  `@font-face` rules and no font files.
- **Components not built as a live bundle**: `TransactionForm`,
  `BudgetForm`, `InvestmentForm`, `InvestmentTransactionForm`,
  `CategoryManager`, `Modal`, `ConfirmDialog`, `Layout` — see above.
- **Dashboard content** (the actual KPI figures, chart data, transaction
  list and budget list in the reference screens) is illustrative only;
  `Dashboard.tsx` in the source is a placeholder with no real layout to
  read from, so `StatTile`, `TransactionRow` and `BudgetBar` are new
  compositions built from the app's real tokens and CSS patterns, not a
  transcription of an existing dashboard.

## Usage rules for an agent consuming this system

- Default to the **dark** theme; treat light as the secondary variant.
- Use `accent` only for the one primary action or the active nav state on a
  screen — it is not a general highlight color.
- Never hand-pick a hex for an amount or a delta: `success` for positive,
  `danger` for negative, `warning` for pending. Pair each with its `-soft`
  token only when it's a pill background, never as a full-bleed fill for
  body text.
- Keep `border` for anything that must read as a control or a card edge;
  use `line` only for a divider inside an already-bordered container.
- Don't introduce a shadow lighter or heavier than `shadow-sm` /
  `shadow-lg` — the whole point is a two-step ladder, not a bespoke one per
  component.

---

## Consuming this system (generated — do not edit)

Every path named below is under `project/` in this design system: read `project/api/tokens.md`, not `api/tokens.md`.

If the text above differs on what to load or read, follow this section.

6 components are documented without a runnable `components/bundle.js`: read each card and long README and build to those guidelines. Tokens: read the values from the token cards; a Slides deck or Design canvas also takes `tokens.json` by file path.

**Read, per thing:** a component’s props, parts and examples: `api/components/<Name>.md`; token values: `api/tokens.md`; stored assets and their paths: `api/assets/<Group>.md`. After this README, fetch the cards and fonts you need in ONE message as parallel calls — none depends on another.

**Two rules.** Before you use a thing — a component, a token group, an icon, an asset — read its card from the index below; a value you did not read from a card is a guess. `tokens.json`, `manifest.json`, `components/index.d.ts` and `design-system.json` are sources for tools: hand them over unread. `components/<Name>/README.md` and `assets/<Group>/README.md` are the long-form second read a card links to; `SKILL.md` and `artifact-type/` beside them are authoring guidance, not needed to consume the system.

## Index (generated — do not edit)

**Tokens**

- `api/tokens.md` — Every token: surface, text, fill, border, palette, type, spacing, radius, shadow. (9.1k)

**Icons and assets**

- `api/assets/Logos.md` — 2 files, by asset id. (0.8k)

**Components** (`api/components/<Name>.md`, 6)

- **Actions**: `Badge` — A small status pill — success, warning and danger — for a transaction or budget's state · `Button` — The app's one recurring button pattern, as primary, secondary and disabled
- **Dashboard**: `BudgetBar` — A budget progress bar that fills with accent under 100% and turns solid danger once spending passes the limit · `StatTile` — A KPI card: an uppercase label, a big figure, and an optional delta pill · `TransactionRow` — One row of a transaction list: a name, a category/date meta line, and a signed amount
- **Navigation**: `NavItem` — A sidebar navigation link, in its default, hover and active states
