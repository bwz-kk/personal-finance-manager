const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Average expense per elapsed day in [periodStart, periodEnd). "Elapsed"
 * caps at periodEnd (a past month divides by its full length) and floors at
 * 1 (day one of the current month divides by itself, never by zero).
 */
export function averageDailySpendingMinor(
  expenseMinor: number,
  periodStart: Date,
  periodEnd: Date,
  now: Date = new Date(),
): number {
  const cappedNow = now.getTime() < periodEnd.getTime() ? now : periodEnd
  const elapsedDays = Math.max(1, Math.ceil((cappedNow.getTime() - periodStart.getTime()) / DAY_MS))
  return Math.round(expenseMinor / elapsedDays)
}
