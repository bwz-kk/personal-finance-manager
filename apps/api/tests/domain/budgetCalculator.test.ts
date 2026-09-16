import { describe, expect, it } from 'vitest'
import { calculateBudgetProgress } from '../../src/domain/budgetCalculator.js'

describe('calculateBudgetProgress', () => {
  it('calculates remaining budget and progress under the limit', () => {
    const result = calculateBudgetProgress(50000, 38000)
    expect(result).toEqual({
      limitMinor: 50000,
      spentMinor: 38000,
      remainingMinor: 12000,
      progressPct: 76,
      isOverspent: false,
    })
  })

  it('flags overspending when spent exceeds the limit', () => {
    const result = calculateBudgetProgress(50000, 60000)
    expect(result.remainingMinor).toBe(-10000)
    expect(result.progressPct).toBe(120)
    expect(result.isOverspent).toBe(true)
  })

  it('handles zero spending', () => {
    const result = calculateBudgetProgress(50000, 0)
    expect(result).toEqual({
      limitMinor: 50000,
      spentMinor: 0,
      remainingMinor: 50000,
      progressPct: 0,
      isOverspent: false,
    })
  })

  it('treats exactly hitting the limit as not overspent', () => {
    const result = calculateBudgetProgress(50000, 50000)
    expect(result.progressPct).toBe(100)
    expect(result.isOverspent).toBe(false)
  })

  it('does not divide by zero when the limit is zero', () => {
    expect(calculateBudgetProgress(0, 0).progressPct).toBe(0)
    expect(calculateBudgetProgress(0, 100).progressPct).toBe(0)
    expect(calculateBudgetProgress(0, 100).isOverspent).toBe(true)
  })
})
