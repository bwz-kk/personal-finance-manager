import type { CdiDailyRate as CdiDailyRateRow } from '@prisma/client'
import { missingCdiRanges } from '../../domain/cdiRateGaps.js'
import { prisma } from '../../lib/prisma.js'
import { fetchWithTimeout } from './fetchWithTimeout.js'

const SERIES_CODE = 12 // BCB SGS: CDI, % per business day

interface BcbEntry {
  data: string // "dd/MM/yyyy"
  valor: string
}

function parseBcbDate(ddmmyyyy: string): Date {
  const [day, month, year] = ddmmyyyy.split('/').map(Number)
  return new Date(Date.UTC(year!, month! - 1, day))
}

function formatBcbDate(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${day}/${month}/${date.getUTCFullYear()}`
}

async function fetchRange(from: Date, to: Date): Promise<{ date: Date; ratePercent: string }[]> {
  const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${SERIES_CODE}/dados?dataInicial=${formatBcbDate(from)}&dataFinal=${formatBcbDate(to)}&formato=json`
  const res = await fetchWithTimeout(url)
  const data = (await res.json()) as BcbEntry[]
  return data.map((entry) => ({ date: parseBcbDate(entry.data), ratePercent: entry.valor }))
}

function toDomain(row: CdiDailyRateRow) {
  return { date: row.date, ratePercent: row.ratePercent }
}

/** Returns the daily CDI rate for every business day from `from` to `to`
 * (inclusive), fetching only whatever isn't already cached. Never
 * re-downloads a day it already has — same "survive the provider going
 * down" philosophy as MarketPriceCache, just shaped for a date range
 * instead of a single latest value. Checks both ends of what's cached (see
 * missingCdiRanges), not just the latest date, so an older investment
 * queried after a newer one already populated the cache still gets its own
 * missing head range fetched instead of silently reusing an unrelated
 * window. */
export async function getCdiDailyRates(from: Date, to: Date) {
  const [earliest, latest] = await Promise.all([
    prisma.cdiDailyRate.findFirst({ orderBy: { date: 'asc' } }),
    prisma.cdiDailyRate.findFirst({ orderBy: { date: 'desc' } }),
  ])
  const gaps = missingCdiRanges(
    { earliest: earliest?.date ?? null, latest: latest?.date ?? null },
    from,
    to,
  )

  for (const gap of gaps) {
    let fetched: { date: Date; ratePercent: string }[] = []
    try {
      fetched = await fetchRange(gap.from, gap.to)
    } catch {
      // BCB is down or unreachable — skip this gap and fall back to
      // whatever's cached for it rather than failing the whole projection.
      continue
    }
    if (fetched.length > 0) {
      await prisma.$transaction(
        fetched.map((entry) =>
          prisma.cdiDailyRate.upsert({
            where: { date: entry.date },
            create: entry,
            update: entry,
          }),
        ),
      )
    }
  }

  const all = await prisma.cdiDailyRate.findMany({
    where: { date: { gte: from, lte: to } },
    orderBy: { date: 'asc' },
  })
  return all.map(toDomain)
}
