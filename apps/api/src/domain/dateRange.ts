/** The current month as "YYYY-MM", in UTC. */
export function currentMonth(): string {
  return new Date().toISOString().slice(0, 7)
}

/** "YYYY-MM" -> the exclusive [start, end) Date range covering that month, in UTC. */
export function monthDateRange(month: string): { start: Date; end: Date } {
  const match = /^(\d{4})-(\d{2})$/.exec(month)
  if (!match) {
    throw new Error(`Invalid month "${month}", expected "YYYY-MM"`)
  }
  const year = Number(match[1])
  const monthIndex = Number(match[2]) - 1

  const start = new Date(Date.UTC(year, monthIndex, 1))
  const end = new Date(Date.UTC(year, monthIndex + 1, 1))
  return { start, end }
}
