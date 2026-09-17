/** Whether a cached market price is old enough that the UI should flag it
 * as possibly out of date. Pure so it's cheap to test every boundary case —
 * the actual fetch-or-fall-back-to-cache logic lives in services/market. */
export function isPriceStale(asOf: Date, now: Date, thresholdMs: number): boolean {
  return now.getTime() - asOf.getTime() > thresholdMs
}
