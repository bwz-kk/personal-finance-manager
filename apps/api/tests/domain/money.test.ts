import { describe, expect, it } from 'vitest'
import { fromMinorUnits, sumMinor, toMinorUnits } from '../../src/domain/money.js'

describe('money', () => {
  it('converts decimal amounts to minor units', () => {
    expect(toMinorUnits(10.5)).toBe(1050)
    expect(toMinorUnits('0.01')).toBe(1)
    expect(toMinorUnits(0)).toBe(0)
  })

  it('converts minor units back to decimal amounts', () => {
    expect(fromMinorUnits(1050)).toBe(10.5)
    expect(fromMinorUnits(0)).toBe(0)
  })

  it('avoids floating point drift on repeated addition', () => {
    const cents = Array(3).fill(toMinorUnits(0.1))
    expect(sumMinor(cents)).toBe(30)
  })

  it('sums negative and positive minor-unit values', () => {
    expect(sumMinor([1000, -300, -150])).toBe(550)
  })
})
