import { describe, expect, it } from 'vitest'
import {
  calculateInvestmentReturn,
  calculatePortfolio,
  summarizeInvestmentTransactions,
} from '../../src/domain/portfolioCalculator.js'

describe('summarizeInvestmentTransactions', () => {
  it('sums BUY as invested principal and quantity', () => {
    const summary = summarizeInvestmentTransactions([
      { type: 'BUY', amountMinor: 100000, quantity: '2.5' },
    ])
    expect(summary).toEqual({ totalInvestedMinor: 100000, quantity: '2.5' })
  })

  it('adds DEPOSIT and subtracts WITHDRAWAL/SELL', () => {
    const summary = summarizeInvestmentTransactions([
      { type: 'DEPOSIT', amountMinor: 50000, quantity: null },
      { type: 'BUY', amountMinor: 100000, quantity: '2' },
      { type: 'SELL', amountMinor: 30000, quantity: '0.5' },
      { type: 'WITHDRAWAL', amountMinor: 20000, quantity: null },
    ])
    expect(summary.totalInvestedMinor).toBe(50000 + 100000 - 30000 - 20000)
    expect(summary.quantity).toBe('1.5')
  })

  it('excludes DIVIDEND, INTEREST, and OTHER from invested total and quantity', () => {
    const summary = summarizeInvestmentTransactions([
      { type: 'BUY', amountMinor: 100000, quantity: '1' },
      { type: 'DIVIDEND', amountMinor: 5000, quantity: null },
      { type: 'INTEREST', amountMinor: 1000, quantity: null },
      { type: 'OTHER', amountMinor: 999, quantity: null },
    ])
    expect(summary.totalInvestedMinor).toBe(100000)
    expect(summary.quantity).toBe('1')
  })

  it('returns zero totals for no transactions', () => {
    expect(summarizeInvestmentTransactions([])).toEqual({
      totalInvestedMinor: 0,
      quantity: '0',
    })
  })

  it('handles a fully sold-out position (zero quantity, principal returned)', () => {
    const summary = summarizeInvestmentTransactions([
      { type: 'BUY', amountMinor: 100000, quantity: '1' },
      { type: 'SELL', amountMinor: 100000, quantity: '1' },
    ])
    expect(summary.totalInvestedMinor).toBe(0)
    expect(summary.quantity).toBe('0')
  })
})

describe('calculateInvestmentReturn', () => {
  it('calculates a positive return', () => {
    const result = calculateInvestmentReturn(100000, 120000)
    expect(result.absoluteReturnMinor).toBe(20000)
    expect(result.percentageReturn).toBe(20)
  })

  it('calculates a negative return', () => {
    const result = calculateInvestmentReturn(100000, 80000)
    expect(result.absoluteReturnMinor).toBe(-20000)
    expect(result.percentageReturn).toBe(-20)
  })

  it('does not divide by zero when nothing is invested', () => {
    expect(calculateInvestmentReturn(0, 0).percentageReturn).toBe(0)
    expect(calculateInvestmentReturn(0, 5000).percentageReturn).toBe(0)
    expect(calculateInvestmentReturn(0, 5000).absoluteReturnMinor).toBe(5000)
  })
})

describe('calculatePortfolio', () => {
  it('groups investments by currency and never mixes totals across currencies', () => {
    const groups = calculatePortfolio([
      {
        id: '1',
        name: 'Tesouro',
        currency: 'BRL',
        totalInvestedMinor: 100000,
        currentValueMinor: 110000,
      },
      {
        id: '2',
        name: 'ETF',
        currency: 'USD',
        totalInvestedMinor: 50000,
        currentValueMinor: 60000,
      },
      {
        id: '3',
        name: 'CDB',
        currency: 'BRL',
        totalInvestedMinor: 200000,
        currentValueMinor: 205000,
      },
    ])

    expect(groups).toHaveLength(2)
    const brl = groups.find((g) => g.currency === 'BRL')!
    const usd = groups.find((g) => g.currency === 'USD')!

    expect(brl.totalInvestedMinor).toBe(300000)
    expect(brl.currentValueMinor).toBe(315000)
    expect(usd.totalInvestedMinor).toBe(50000)
    expect(usd.currentValueMinor).toBe(60000)
  })

  it('computes allocation percentage within each currency group', () => {
    const [group] = calculatePortfolio([
      { id: '1', name: 'A', currency: 'BRL', totalInvestedMinor: 100000, currentValueMinor: 75000 },
      { id: '2', name: 'B', currency: 'BRL', totalInvestedMinor: 100000, currentValueMinor: 25000 },
    ])
    const a = group!.allocation.find((e) => e.investmentId === '1')!
    const b = group!.allocation.find((e) => e.investmentId === '2')!
    expect(a.allocationPct).toBe(75)
    expect(b.allocationPct).toBe(25)
  })

  it('returns an empty array for no investments', () => {
    expect(calculatePortfolio([])).toEqual([])
  })

  it('does not divide by zero when a currency group has zero current value', () => {
    const [group] = calculatePortfolio([
      { id: '1', name: 'A', currency: 'BRL', totalInvestedMinor: 0, currentValueMinor: 0 },
    ])
    expect(group!.allocation[0]!.allocationPct).toBe(0)
    expect(group!.percentageReturn).toBe(0)
  })
})
