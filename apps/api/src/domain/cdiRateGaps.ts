export interface CdiCacheBounds {
  /** Oldest cached date, or null if nothing is cached yet. */
  earliest: Date | null
  /** Newest cached date, or null if nothing is cached yet. */
  latest: Date | null
}

export interface DateRange {
  from: Date
  to: Date
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
}

/** Returns the sub-range(s) of [from, to] that aren't covered by what's
 * already cached, so a caller fetches only what it's missing.
 *
 * Checks both ends of the cached window, not just the latest date — a
 * request whose `from` predates everything cached so far (e.g. an older
 * investment viewed after a newer one already populated the cache) still
 * needs its own head gap fetched, even though `to` may already be covered.
 * Assumes the cache has no gaps of its own once populated (every fetch
 * upserts every day the provider returns for the range it was given), so
 * checking just the two boundaries is enough. */
export function missingCdiRanges(bounds: CdiCacheBounds, from: Date, to: Date): DateRange[] {
  if (!bounds.earliest || !bounds.latest) {
    return [{ from, to }]
  }

  const ranges: DateRange[] = []
  if (from.getTime() < bounds.earliest.getTime()) {
    ranges.push({ from, to: addDays(bounds.earliest, -1) })
  }
  if (to.getTime() > bounds.latest.getTime()) {
    ranges.push({ from: addDays(bounds.latest, 1), to })
  }
  return ranges
}
