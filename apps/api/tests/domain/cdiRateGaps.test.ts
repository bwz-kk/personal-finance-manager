import { describe, expect, it } from 'vitest'
import { missingCdiRanges } from '../../src/domain/cdiRateGaps.js'

const d = (s: string) => new Date(s)

describe('missingCdiRanges', () => {
  it('needs the whole range when nothing is cached', () => {
    const result = missingCdiRanges(
      { earliest: null, latest: null },
      d('2026-01-01'),
      d('2026-01-10'),
    )
    expect(result).toEqual([{ from: d('2026-01-01'), to: d('2026-01-10') }])
  })

  it('needs nothing when the cache already fully covers the range', () => {
    const bounds = { earliest: d('2026-01-01'), latest: d('2026-01-31') }
    const result = missingCdiRanges(bounds, d('2026-01-05'), d('2026-01-10'))
    expect(result).toEqual([])
  })

  it('needs a tail gap when the range extends past what is cached', () => {
    const bounds = { earliest: d('2026-01-01'), latest: d('2026-01-10') }
    const result = missingCdiRanges(bounds, d('2026-01-01'), d('2026-01-20'))
    expect(result).toEqual([{ from: d('2026-01-11'), to: d('2026-01-20') }])
  })

  it('needs a head gap when the range starts before what is cached — the bug this fixes', () => {
    // An older investment queried after a newer one already cached a later
    // window. Regression case: the old logic only checked the latest
    // cached date and would have wrongly reported this range as covered.
    const bounds = { earliest: d('2026-06-01'), latest: d('2026-06-30') }
    const result = missingCdiRanges(bounds, d('2020-01-01'), d('2026-06-30'))
    expect(result).toEqual([{ from: d('2020-01-01'), to: d('2026-05-31') }])
  })

  it('needs both a head and a tail gap when the range straddles both sides', () => {
    const bounds = { earliest: d('2026-01-10'), latest: d('2026-01-20') }
    const result = missingCdiRanges(bounds, d('2026-01-01'), d('2026-01-31'))
    expect(result).toEqual([
      { from: d('2026-01-01'), to: d('2026-01-09') },
      { from: d('2026-01-21'), to: d('2026-01-31') },
    ])
  })

  it('treats exact boundary equality as fully covered', () => {
    const bounds = { earliest: d('2026-01-01'), latest: d('2026-01-31') }
    const result = missingCdiRanges(bounds, d('2026-01-01'), d('2026-01-31'))
    expect(result).toEqual([])
  })
})
