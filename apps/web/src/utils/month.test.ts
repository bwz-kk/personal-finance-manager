import { describe, expect, it } from 'vitest'
import { shiftMonth } from './month'

describe('shiftMonth', () => {
  it('advances within a year', () => {
    expect(shiftMonth('2026-03', 1)).toBe('2026-04')
  })

  it('goes back within a year', () => {
    expect(shiftMonth('2026-03', -1)).toBe('2026-02')
  })

  it('rolls over to the next year', () => {
    expect(shiftMonth('2026-12', 1)).toBe('2027-01')
  })

  it('rolls back to the previous year', () => {
    expect(shiftMonth('2026-01', -1)).toBe('2025-12')
  })

  it('handles multi-month deltas across a year boundary', () => {
    expect(shiftMonth('2026-11', 3)).toBe('2027-02')
  })

  it('is a no-op with delta 0', () => {
    expect(shiftMonth('2026-06', 0)).toBe('2026-06')
  })
})
