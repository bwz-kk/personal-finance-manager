import type { CdiDailyRate as CdiDailyRateRow } from '@prisma/client'
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

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
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
 * instead of a single latest value. */
export async function getCdiDailyRates(from: Date, to: Date) {
  const cached = await prisma.cdiDailyRate.findMany({
    where: { date: { gte: from, lte: to } },
    orderBy: { date: 'asc' },
  })

  const latestCached = await prisma.cdiDailyRate.findFirst({ orderBy: { date: 'desc' } })
  const missingFrom =
    latestCached && latestCached.date.getTime() >= from.getTime()
      ? addDays(latestCached.date, 1)
      : from

  if (missingFrom.getTime() > to.getTime()) {
    return cached.map(toDomain)
  }

  let fetched: { date: Date; ratePercent: string }[] = []
  try {
    fetched = await fetchRange(missingFrom, to)
  } catch {
    // BCB is down or unreachable — fall back to whatever's cached rather
    // than failing the whole projection over a missing tail of days.
    return cached.map(toDomain)
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

  const all = await prisma.cdiDailyRate.findMany({
    where: { date: { gte: from, lte: to } },
    orderBy: { date: 'asc' },
  })
  return all.map(toDomain)
}
