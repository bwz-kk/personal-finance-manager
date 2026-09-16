import { describe, expect, it } from 'vitest'
import { sumQuantities } from '../../src/domain/quantity.js'

describe('sumQuantities', () => {
  it('sums decimal-string quantities without float drift', () => {
    expect(sumQuantities(['0.1', '0.2'])).toBe('0.3')
  })

  it('treats null and undefined entries as zero', () => {
    expect(sumQuantities(['1', null, undefined, '2'])).toBe('3')
  })

  it('handles high-precision crypto amounts', () => {
    expect(sumQuantities(['0.00034521', '0.00012000'])).toBe('0.00046521')
  })

  it('supports negative deltas (sells/withdrawals)', () => {
    expect(sumQuantities(['1.5', '-0.5'])).toBe('1')
  })

  it('returns zero for an empty list', () => {
    expect(sumQuantities([])).toBe('0')
  })
})
