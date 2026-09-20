import { Decimal } from 'decimal.js'

export interface CdiPrincipalEvent {
  date: Date
  /** Positive = contribution (BUY/DEPOSIT), negative = withdrawal-like
   * outflow (SELL/WITHDRAWAL). */
  amountMinor: number
}

export interface CdiDailyRate {
  date: Date
  /** BCB SGS series 12 value: percent per business day, e.g. "0.041270". */
  ratePercent: string
}

/** Projects a CDI-indexed balance forward by compounding a running principal
 * day by day against `cdiPercent`% of the official daily CDI rate — the
 * standard method Brazilian banks use for CDB/LCI/LCA-style products.
 *
 * Only the days present in `dailyRates` compound (BCB only publishes
 * business days, so weekends/holidays are correctly skipped by simply not
 * appearing). A principal event dated on or before a given rate day is
 * folded in before that day's rate compounds, so it starts earning from
 * that same day. An event dated after every available rate day (e.g. BCB's
 * ~1-business-day publication lag hasn't caught up to "today" yet) is added
 * at the end without further compounding — a small, documented
 * approximation, not lost money. */
export function projectCdiIndexedValue(
  events: CdiPrincipalEvent[],
  dailyRates: CdiDailyRate[],
  cdiPercent: number,
): number {
  const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime())
  const sortedRates = [...dailyRates].sort((a, b) => a.date.getTime() - b.date.getTime())
  const cdiFraction = new Decimal(cdiPercent).dividedBy(100)

  let balance = new Decimal(0)
  let eventIndex = 0

  for (const rate of sortedRates) {
    while (
      eventIndex < sortedEvents.length &&
      sortedEvents[eventIndex]!.date.getTime() <= rate.date.getTime()
    ) {
      balance = balance.plus(sortedEvents[eventIndex]!.amountMinor)
      eventIndex++
    }
    const dailyGrowth = new Decimal(rate.ratePercent).dividedBy(100).times(cdiFraction)
    balance = balance.times(new Decimal(1).plus(dailyGrowth))
  }

  for (; eventIndex < sortedEvents.length; eventIndex++) {
    balance = balance.plus(sortedEvents[eventIndex]!.amountMinor)
  }

  return balance.round().toNumber()
}
