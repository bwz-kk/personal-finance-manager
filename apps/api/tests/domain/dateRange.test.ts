import { describe, expect, it } from 'vitest'
import { monthDateRange } from '../../src/domain/dateRange.js'

describe('monthDateRange', () => {
  it('returns the first day of the month through the first day of the next month', () => {
    const { start, end } = monthDateRange('2026-03')
    expect(start.toISOString()).toBe('2026-03-01T00:00:00.000Z')
    expect(end.toISOString()).toBe('2026-04-01T00:00:00.000Z')
  })

  it('rolls over correctly from December to January', () => {
    const { start, end } = monthDateRange('2026-12')
    expect(start.toISOString()).toBe('2026-12-01T00:00:00.000Z')
    expect(end.toISOString()).toBe('2027-01-01T00:00:00.000Z')
  })

  it('handles February in a leap year', () => {
    const { start, end } = monthDateRange('2028-02')
    expect(start.toISOString()).toBe('2028-02-01T00:00:00.000Z')
    expect(end.toISOString()).toBe('2028-03-01T00:00:00.000Z')
  })

  it('rejects a malformed month string', () => {
    expect(() => monthDateRange('2026-3')).toThrow()
    expect(() => monthDateRange('March 2026')).toThrow()
  })
})
