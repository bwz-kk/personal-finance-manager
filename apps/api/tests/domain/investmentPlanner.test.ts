import { describe, expect, it } from 'vitest'
import { calculateInvestmentPlan } from '../../src/domain/investmentPlanner.js'
import type { InvestmentPlanConfigInput } from '../../src/domain/investmentPlanner.js'

const baseConfig: InvestmentPlanConfigInput = {
  minMonthlyInvestmentMinor: 0,
  targetInvestmentRate: 0.25,
  minCashBufferMinor: 20000, // R$200
  maxPercentOfAvailableCash: 0.9,
  expectedRecurringExpensesMinor: 0,
}

describe('calculateInvestmentPlan', () => {
  it('matches the spec example shape: income 2000, expenses 1300, available 700', () => {
    const result = calculateInvestmentPlan({
      incomeMinor: 200000,
      actualExpensesMinor: 130000,
      config: baseConfig,
    })
    expect(result.availableMinor).toBe(70000)
    // target 25% of income = 500, buffer cap = 700-200 = 500, percent cap = 630
    // target and buffer tie at 500 -> buffer reported (more restrictive tie priority)
    expect(result.suggestedMinor).toBe(50000)
    expect(result.remainingBufferMinor).toBe(20000)
  })

  it('is bound by the target investment rate when caps have plenty of room', () => {
    const result = calculateInvestmentPlan({
      incomeMinor: 1000000,
      actualExpensesMinor: 100000,
      config: { ...baseConfig, minCashBufferMinor: 0, maxPercentOfAvailableCash: 1 },
    })
    expect(result.targetFromRateMinor).toBe(250000)
    expect(result.suggestedMinor).toBe(250000)
    expect(result.bindingConstraint).toBe('targetRate')
  })

  it('is capped by the minimum cash buffer when the target would eat into it', () => {
    const result = calculateInvestmentPlan({
      incomeMinor: 300000,
      actualExpensesMinor: 0,
      config: { ...baseConfig, targetInvestmentRate: 0.9, minCashBufferMinor: 280000 },
    })
    // available = 300000, target = 270000, but buffer requires 280000 stay untouched
    expect(result.availableMinor).toBe(300000)
    expect(result.maxByBufferMinor).toBe(20000)
    expect(result.suggestedMinor).toBe(20000)
    expect(result.bindingConstraint).toBe('cappedByBuffer')
    expect(result.remainingBufferMinor).toBe(280000)
  })

  it('is capped by the max-percent-of-available ceiling', () => {
    const result = calculateInvestmentPlan({
      incomeMinor: 300000,
      actualExpensesMinor: 0,
      config: {
        ...baseConfig,
        targetInvestmentRate: 0.9,
        minCashBufferMinor: 0,
        maxPercentOfAvailableCash: 0.2,
      },
    })
    expect(result.availableMinor).toBe(300000)
    expect(result.maxByPercentMinor).toBe(60000)
    expect(result.suggestedMinor).toBe(60000)
    expect(result.bindingConstraint).toBe('cappedByMaxPercent')
  })

  it('raises to the configured minimum when there is room under the buffer', () => {
    const result = calculateInvestmentPlan({
      incomeMinor: 100000,
      actualExpensesMinor: 0,
      config: { ...baseConfig, targetInvestmentRate: 0.01, minMonthlyInvestmentMinor: 30000 },
    })
    // target = 1000 (way below the 30000 floor), but buffer cap = 100000-20000 = 80000, room exists
    expect(result.targetFromRateMinor).toBe(1000)
    expect(result.suggestedMinor).toBe(30000)
    expect(result.bindingConstraint).toBe('raisedToMinimum')
  })

  it('does not raise to the minimum past what the buffer allows', () => {
    const result = calculateInvestmentPlan({
      incomeMinor: 100000,
      actualExpensesMinor: 0,
      config: {
        ...baseConfig,
        targetInvestmentRate: 0.01,
        minMonthlyInvestmentMinor: 500000, // way more than available
        minCashBufferMinor: 20000,
      },
    })
    // available - buffer = 80000, so the floor cannot be honored past that
    expect(result.suggestedMinor).toBe(80000)
    expect(result.bindingConstraint).toBe('cappedByBuffer')
  })

  it('suggests zero when expenses meet or exceed income (no available cash)', () => {
    const result = calculateInvestmentPlan({
      incomeMinor: 100000,
      actualExpensesMinor: 100000,
      config: baseConfig,
    })
    expect(result.availableMinor).toBe(0)
    expect(result.suggestedMinor).toBe(0)
    expect(result.bindingConstraint).toBe('insufficientFunds')
  })

  it('suggests zero and never goes negative when expenses exceed income', () => {
    const result = calculateInvestmentPlan({
      incomeMinor: 100000,
      actualExpensesMinor: 150000,
      config: baseConfig,
    })
    expect(result.availableMinor).toBe(-50000)
    expect(result.suggestedMinor).toBe(0)
    expect(result.bindingConstraint).toBe('insufficientFunds')
    expect(result.remainingBufferMinor).toBe(-50000)
  })

  it('reserves expectedRecurringExpensesMinor out of available cash', () => {
    const result = calculateInvestmentPlan({
      incomeMinor: 200000,
      actualExpensesMinor: 100000,
      config: { ...baseConfig, expectedRecurringExpensesMinor: 50000 },
    })
    // available = 200000 - 100000 - 50000 = 50000, not 100000
    expect(result.availableMinor).toBe(50000)
  })

  it('handles zero income cleanly', () => {
    const result = calculateInvestmentPlan({
      incomeMinor: 0,
      actualExpensesMinor: 0,
      config: baseConfig,
    })
    expect(result.availableMinor).toBe(0)
    expect(result.suggestedMinor).toBe(0)
    expect(result.bindingConstraint).toBe('insufficientFunds')
  })

  it('handles a 0% target investment rate (suggests zero unless a minimum is set)', () => {
    const result = calculateInvestmentPlan({
      incomeMinor: 500000,
      actualExpensesMinor: 0,
      config: { ...baseConfig, targetInvestmentRate: 0 },
    })
    expect(result.targetFromRateMinor).toBe(0)
    expect(result.suggestedMinor).toBe(0)
  })

  it('handles a 100% target investment rate capped by the buffer', () => {
    const result = calculateInvestmentPlan({
      incomeMinor: 500000,
      actualExpensesMinor: 0,
      config: { ...baseConfig, targetInvestmentRate: 1, minCashBufferMinor: 100000 },
    })
    expect(result.targetFromRateMinor).toBe(500000)
    expect(result.suggestedMinor).toBe(400000)
    expect(result.bindingConstraint).toBe('cappedByBuffer')
  })

  it('never suggests a negative amount even with a negative minimum-buffer shortfall', () => {
    const result = calculateInvestmentPlan({
      incomeMinor: 50000,
      actualExpensesMinor: 0,
      config: { ...baseConfig, minCashBufferMinor: 1000000 },
    })
    expect(result.maxByBufferMinor).toBe(0)
    expect(result.suggestedMinor).toBe(0)
  })
})
