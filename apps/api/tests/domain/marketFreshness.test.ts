import { describe, expect, it } from 'vitest'
import { isPriceStale } from '../../src/domain/marketFreshness.js'

const HOUR = 60 * 60 * 1000
const now = new Date('2026-09-17T12:00:00.000Z')

describe('isPriceStale', () => {
  it('is not stale immediately after being cached', () => {
    expect(isPriceStale(now, now, 24 * HOUR)).toBe(false)
  })

  it('is not stale just under the threshold', () => {
    const asOf = new Date(now.getTime() - 23 * HOUR)
    expect(isPriceStale(asOf, now, 24 * HOUR)).toBe(false)
  })

  it('is not stale exactly at the threshold (boundary is exclusive)', () => {
    const asOf = new Date(now.getTime() - 24 * HOUR)
    expect(isPriceStale(asOf, now, 24 * HOUR)).toBe(false)
  })

  it('is stale just past the threshold', () => {
    const asOf = new Date(now.getTime() - 24 * HOUR - 1)
    expect(isPriceStale(asOf, now, 24 * HOUR)).toBe(true)
  })

  it('is stale well past the threshold', () => {
    const asOf = new Date(now.getTime() - 7 * 24 * HOUR)
    expect(isPriceStale(asOf, now, 24 * HOUR)).toBe(true)
  })

  it('is never stale when asOf is in the future (clock skew)', () => {
    const asOf = new Date(now.getTime() + HOUR)
    expect(isPriceStale(asOf, now, 24 * HOUR)).toBe(false)
  })
})
