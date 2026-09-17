import { describe, expect, it } from 'vitest'
import { bucketMinorByMonth, trailingMonths } from '../../src/domain/monthlySeries.js'

describe('trailingMonths', () => {
  it('returns the last N months ending at endMonth, oldest first', () => {
    expect(trailingMonths('2026-09', 3)).toEqual(['2026-07', '2026-08', '2026-09'])
  })

  it('rolls back across a year boundary', () => {
    expect(trailingMonths('2026-02', 3)).toEqual(['2025-12', '2026-01', '2026-02'])
  })

  it('handles count of 1', () => {
    expect(trailingMonths('2026-05', 1)).toEqual(['2026-05'])
  })
})

describe('bucketMinorByMonth', () => {
  const months = ['2026-07', '2026-08', '2026-09']

  it('sums entries into their month bucket', () => {
    const result = bucketMinorByMonth(
      [
        { date: new Date('2026-07-05'), amountMinor: 1000 },
        { date: new Date('2026-07-20'), amountMinor: 500 },
        { date: new Date('2026-09-01'), amountMinor: 2000 },
      ],
      months,
    )
    expect(result).toEqual([
      { month: '2026-07', amountMinor: 1500 },
      { month: '2026-08', amountMinor: 0 },
      { month: '2026-09', amountMinor: 2000 },
    ])
  })

  it('fills months with no entries as zero rather than omitting them', () => {
    const result = bucketMinorByMonth([], months)
    expect(result).toEqual([
      { month: '2026-07', amountMinor: 0 },
      { month: '2026-08', amountMinor: 0 },
      { month: '2026-09', amountMinor: 0 },
    ])
  })

  it('ignores entries outside the requested month range', () => {
    const result = bucketMinorByMonth([{ date: new Date('2025-01-01'), amountMinor: 999 }], months)
    expect(result.every((m) => m.amountMinor === 0)).toBe(true)
  })
})
