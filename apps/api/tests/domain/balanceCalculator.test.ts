import { describe, expect, it } from 'vitest'
import { calculateBalance } from '../../src/domain/balanceCalculator.js'

describe('calculateBalance', () => {
  it('returns zero totals for no transactions', () => {
    expect(calculateBalance([])).toEqual({
      incomeMinor: 0,
      expenseMinor: 0,
      balanceMinor: 0,
    })
  })

  it('sums income and expenses separately', () => {
    const result = calculateBalance([
      { type: 'INCOME', amountMinor: 200000 },
      { type: 'EXPENSE', amountMinor: 30000 },
      { type: 'EXPENSE', amountMinor: 15000 },
    ])
    expect(result).toEqual({
      incomeMinor: 200000,
      expenseMinor: 45000,
      balanceMinor: 155000,
    })
  })

  it('allows balance to go negative when expenses exceed income', () => {
    const result = calculateBalance([
      { type: 'INCOME', amountMinor: 1000 },
      { type: 'EXPENSE', amountMinor: 5000 },
    ])
    expect(result.balanceMinor).toBe(-4000)
  })

  it('ignores zero-amount transactions without affecting totals', () => {
    const result = calculateBalance([
      { type: 'INCOME', amountMinor: 0 },
      { type: 'EXPENSE', amountMinor: 0 },
    ])
    expect(result).toEqual({ incomeMinor: 0, expenseMinor: 0, balanceMinor: 0 })
  })
})
