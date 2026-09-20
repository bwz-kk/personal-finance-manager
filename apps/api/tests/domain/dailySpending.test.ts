import { describe, expect, it } from 'vitest'
import { averageDailySpendingMinor } from '../../src/domain/dailySpending.js'

describe('averageDailySpendingMinor', () => {
  const periodStart = new Date('2026-09-01T00:00:00Z')
  const periodEnd = new Date('2026-10-01T00:00:00Z')

  it('divides by elapsed days mid-month', () => {
    const now = new Date('2026-09-19T12:00:00Z')
    expect(averageDailySpendingMinor(190000, periodStart, periodEnd, now)).toBe(10000)
  })

  it('divides by the full period once it has ended', () => {
    const now = new Date('2026-11-01T00:00:00Z')
    expect(averageDailySpendingMinor(300000, periodStart, periodEnd, now)).toBe(10000)
  })

  it('floors elapsed days at 1 on day one', () => {
    const now = new Date('2026-09-01T00:00:00Z')
    expect(averageDailySpendingMinor(5000, periodStart, periodEnd, now)).toBe(5000)
  })

  it('returns 0 for zero spending', () => {
    const now = new Date('2026-09-19T00:00:00Z')
    expect(averageDailySpendingMinor(0, periodStart, periodEnd, now)).toBe(0)
  })

  it('floors elapsed days at 1 for a future period', () => {
    const now = new Date('2026-08-01T00:00:00Z')
    expect(averageDailySpendingMinor(0, periodStart, periodEnd, now)).toBe(0)
  })
})
