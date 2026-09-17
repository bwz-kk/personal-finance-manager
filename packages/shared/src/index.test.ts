import { describe, expect, it } from 'vitest'
import { decimalInputToMinorUnits, formatMinorUnits, minorUnitsToDecimalInput } from './index'

describe('formatMinorUnits', () => {
  it('formats a positive amount as BRL', () => {
    expect(formatMinorUnits(150000)).toBe('R$\xa01.500,00')
  })

  it('formats zero', () => {
    expect(formatMinorUnits(0)).toBe('R$\xa00,00')
  })

  it('formats a negative amount', () => {
    expect(formatMinorUnits(-500)).toBe('-R$\xa05,00')
  })

  it('formats a non-BRL currency when passed explicitly', () => {
    expect(formatMinorUnits(150000, 'USD')).toContain('1.500,00')
  })
})

describe('decimalInputToMinorUnits', () => {
  it('converts a simple decimal string', () => {
    expect(decimalInputToMinorUnits('10.5')).toBe(1050)
  })

  it('converts a whole number string', () => {
    expect(decimalInputToMinorUnits('10')).toBe(1000)
  })

  it('rounds sub-cent precision', () => {
    expect(decimalInputToMinorUnits('10.556')).toBe(1056)
  })

  it('handles zero', () => {
    expect(decimalInputToMinorUnits('0')).toBe(0)
  })

  it('handles negative values', () => {
    expect(decimalInputToMinorUnits('-10.5')).toBe(-1050)
  })
})

describe('minorUnitsToDecimalInput', () => {
  it('is the inverse of decimalInputToMinorUnits for whole cents', () => {
    expect(minorUnitsToDecimalInput(1050)).toBe('10.50')
  })

  it('handles zero', () => {
    expect(minorUnitsToDecimalInput(0)).toBe('0.00')
  })

  it('handles negative values', () => {
    expect(minorUnitsToDecimalInput(-1050)).toBe('-10.50')
  })
})
