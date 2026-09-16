# Security Policy

## Scope

This is a **local-first, single-user, no-auth** personal application. That
shapes the threat model — please read this before filing a report or
"fixing" something that looks like a gap but is a deliberate design choice:

- There is no login system and no multi-tenant data. The app assumes one
  person is using it on their own machine.
- The API server binds to `127.0.0.1` only (see `HOST` in
  `apps/api/.env.example`) and is never meant to be reachable over a network.
  There is no cloud backend and no hosted deployment of this project.
- The realistic remaining attack surface for a server like this is **not**
  "an attacker on the internet" — it's a malicious or compromised web page
  open in the _same browser_, making a background request to
  `http://127.0.0.1:<port>`. That's why CORS is scoped to the exact frontend
  origin (`CORS_ORIGIN`) rather than left open or omitted.
- Because of the above, things like rate limiting, CSRF tokens, and most of
  `helmet`'s browser-hardening headers (CSP, HSTS) are **not** meaningful
  protections here and are intentionally not included. If you're proposing to
  add them, please open an issue first — the answer may reasonably be "not
  applicable to this app's threat model."

If a change would genuinely expose the server beyond localhost, or would let
one local website read another site's local data through this API, that's a
real report — see below.

## Reporting a vulnerability

This is a solo-maintained hobby project. To report a security issue, open a
GitHub issue, or if it's sensitive, email raulrodolfi72@gmail.com directly
instead of filing a public issue. Please include steps to reproduce. There's
no bug bounty — this is a personal project, not a company.

## Supported versions

Only the latest commit on `main` is supported. There are no released
versions to backport fixes to.

## Data handling

- Financial data lives entirely in a local SQLite file
  (`apps/api/prisma/dev.db`), gitignored, never committed, never sent to any
  remote service — including AI tools used to develop this project.
- Back up the database file with SQLite's own backup mechanism (`VACUUM
INTO`, or the SQLite backup API) rather than a raw file copy. The database
  runs in WAL mode; copying just the `.db` file while the app is running (or
  without its `-wal`/`-shm` companion files) can produce a corrupt or
  stale snapshot.
- On a shared machine, restrict the database file to your own user account
  (e.g. `chmod 600 apps/api/prisma/dev.db`) — Prisma/SQLite don't do this for
  you, and it's not covered by `.gitignore`, which only keeps the file out of
  the repo, not off the filesystem.
- Market-data provider calls (see `docs/ARCHITECTURE.md`) only ever fetch
  public price data. They never transmit anything from your local database.
