import { describe, expect, it } from 'vitest'
import { investmentCashEffect } from '../../src/domain/investmentCashEffect.js'

describe('investmentCashEffect', () => {
  it.each([
    ['BUY', 'EXPENSE'],
    ['DEPOSIT', 'EXPENSE'],
    ['SELL', 'INCOME'],
    ['WITHDRAWAL', 'INCOME'],
    ['DIVIDEND', 'INCOME'],
    ['INTEREST', 'INCOME'],
    ['OTHER', null],
  ] as const)('%s -> %s', (type, expected) => {
    expect(investmentCashEffect(type)).toBe(expected)
  })
})
