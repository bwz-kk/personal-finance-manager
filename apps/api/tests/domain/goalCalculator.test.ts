import { describe, expect, it } from 'vitest'
import { calculateGoalProgress } from '../../src/domain/goalCalculator.js'

describe('calculateGoalProgress', () => {
  it('calculates remaining amount and progress under the target', () => {
    const result = calculateGoalProgress(180000, 75000)
    expect(result).toEqual({
      targetAmountMinor: 180000,
      currentAmountMinor: 75000,
      remainingMinor: 105000,
      progressPct: 42,
      isComplete: false,
    })
  })

  it('handles zero progress', () => {
    const result = calculateGoalProgress(100000, 0)
    expect(result.remainingMinor).toBe(100000)
    expect(result.progressPct).toBe(0)
    expect(result.isComplete).toBe(false)
  })

  it('marks a goal complete when current meets the target exactly', () => {
    const result = calculateGoalProgress(100000, 100000)
    expect(result.remainingMinor).toBe(0)
    expect(result.progressPct).toBe(100)
    expect(result.isComplete).toBe(true)
  })

  it('caps progress at 100% and remaining at 0 when overfunded', () => {
    const result = calculateGoalProgress(100000, 150000)
    expect(result.remainingMinor).toBe(0)
    expect(result.progressPct).toBe(100)
    expect(result.isComplete).toBe(true)
  })

  it('does not divide by zero when the target is zero', () => {
    const result = calculateGoalProgress(0, 0)
    expect(result.progressPct).toBe(0)
    expect(result.isComplete).toBe(false)
  })
})
