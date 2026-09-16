export function currentMonth(): string {
  return new Date().toISOString().slice(0, 7)
}

export function shiftMonth(month: string, delta: number): string {
  const [year, monthNum] = month.split('-').map(Number)
  const date = new Date(Date.UTC(year, monthNum - 1 + delta, 1))
  return date.toISOString().slice(0, 7)
}
