import { sumMinor } from './money.js'

export interface MonthlyAmount {
  date: Date
  amountMinor: number
}

/** Buckets minor-unit amounts by "YYYY-MM" (UTC), summed within each month,
 * and fills in every month in [start, end] with 0 even if it had no rows —
 * so a chart never silently skips a quiet month. Ordered oldest first. */
export function bucketMinorByMonth(
  entries: MonthlyAmount[],
  monthsRange: string[],
): { month: string; amountMinor: number }[] {
  const byMonth = new Map<string, number[]>()
  for (const month of monthsRange) byMonth.set(month, [])

  for (const entry of entries) {
    const month = entry.date.toISOString().slice(0, 7)
    const bucket = byMonth.get(month)
    if (bucket) bucket.push(entry.amountMinor)
  }

  return monthsRange.map((month) => ({ month, amountMinor: sumMinor(byMonth.get(month) ?? []) }))
}

/** The `count` months ending at `endMonth` ("YYYY-MM"), oldest first,
 * inclusive of endMonth. */
export function trailingMonths(endMonth: string, count: number): string[] {
  const match = /^(\d{4})-(\d{2})$/.exec(endMonth)
  if (!match) {
    throw new Error(`Invalid month "${endMonth}", expected "YYYY-MM"`)
  }
  const year = Number(match[1])
  const monthIndex = Number(match[2]) - 1

  const months: string[] = []
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(year, monthIndex - i, 1))
    months.push(d.toISOString().slice(0, 7))
  }
  return months
}
