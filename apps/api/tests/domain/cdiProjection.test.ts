import { describe, expect, it } from 'vitest'
import { projectCdiIndexedValue } from '../../src/domain/cdiProjection.js'

const d = (s: string) => new Date(s)

describe('projectCdiIndexedValue', () => {
  it('returns the raw principal when there are no rate days to compound', () => {
    const result = projectCdiIndexedValue([{ date: d('2026-01-01'), amountMinor: 100000 }], [], 100)
    expect(result).toBe(100000)
  })

  it('compounds a single contribution over one rate day', () => {
    const result = projectCdiIndexedValue(
      [{ date: d('2026-01-01'), amountMinor: 100000 }],
      [{ date: d('2026-01-02'), ratePercent: '1' }],
      100,
    )
    expect(result).toBe(101000)
  })

  it('compounds over multiple rate days in sequence', () => {
    const result = projectCdiIndexedValue(
      [{ date: d('2026-01-01'), amountMinor: 100000 }],
      [
        { date: d('2026-01-02'), ratePercent: '1' },
        { date: d('2026-01-03'), ratePercent: '1' },
      ],
      100,
    )
    expect(result).toBe(102010)
  })

  it('scales daily growth by cdiPercent', () => {
    const result = projectCdiIndexedValue(
      [{ date: d('2026-01-01'), amountMinor: 100000 }],
      [{ date: d('2026-01-02'), ratePercent: '1' }],
      50,
    )
    expect(result).toBe(100500)
  })

  it('zero cdiPercent means no growth regardless of rates', () => {
    const result = projectCdiIndexedValue(
      [{ date: d('2026-01-01'), amountMinor: 100000 }],
      [{ date: d('2026-01-02'), ratePercent: '5' }],
      0,
    )
    expect(result).toBe(100000)
  })

  it('applies a withdrawal mid-stream before that day compounds', () => {
    const result = projectCdiIndexedValue(
      [
        { date: d('2026-01-01'), amountMinor: 100000 },
        { date: d('2026-01-02'), amountMinor: -50000 },
      ],
      [
        { date: d('2026-01-02'), ratePercent: '1' },
        { date: d('2026-01-03'), ratePercent: '1' },
      ],
      100,
    )
    expect(result).toBe(51005)
  })

  it('adds an event dated after every available rate day without compounding it', () => {
    const result = projectCdiIndexedValue(
      [{ date: d('2026-01-05'), amountMinor: 100000 }],
      [{ date: d('2026-01-01'), ratePercent: '1' }],
      100,
    )
    expect(result).toBe(100000)
  })
})
