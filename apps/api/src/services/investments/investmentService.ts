import type { InvestmentTransactionType } from '@pfm/shared'
import { projectCdiIndexedValue } from '../../domain/cdiProjection.js'
import {
  CONTRIBUTION_TYPES,
  WITHDRAWAL_TYPES,
  calculateInvestmentReturn,
  summarizeInvestmentTransactions,
} from '../../domain/portfolioCalculator.js'
import { AppError } from '../../middleware/errorHandler.js'
import { prisma } from '../../lib/prisma.js'
import type { CreateInvestmentInput, UpdateInvestmentInput } from '../../validation/investment.js'
import { getCdiDailyRates } from '../market/cdiRateService.js'

function withComputedFields<T extends { currentValueMinor: number | null }>(
  investment: T,
  transactions: { type: InvestmentTransactionType; amountMinor: number; quantity: string | null }[],
) {
  const summary = summarizeInvestmentTransactions(transactions)
  const currentValueMinor = investment.currentValueMinor ?? 0
  const investmentReturn = calculateInvestmentReturn(summary.totalInvestedMinor, currentValueMinor)

  return { ...investment, ...summary, ...investmentReturn }
}

export async function listInvestments() {
  const investments = await prisma.investment.findMany({
    include: { transactions: true },
    orderBy: { name: 'asc' },
  })
  return investments.map(({ transactions, ...investment }) =>
    withComputedFields(investment, transactions),
  )
}

// Computed on demand (not stored/batched) — only called for the single
// investment detail view, never the list, so a per-request BCB round trip
// (cache-backed, see cdiRateService.ts) stays cheap.
async function getCdiProjectedValueMinor(
  cdiPercent: number,
  transactions: { type: InvestmentTransactionType; amountMinor: number; date: Date }[],
) {
  const events = transactions
    .filter((t) => CONTRIBUTION_TYPES.includes(t.type) || WITHDRAWAL_TYPES.includes(t.type))
    .map((t) => ({
      date: t.date,
      amountMinor: WITHDRAWAL_TYPES.includes(t.type) ? -t.amountMinor : t.amountMinor,
    }))
  if (events.length === 0) return 0

  const earliestDate = events.reduce((min, e) => (e.date < min ? e.date : min), events[0]!.date)
  const dailyRates = await getCdiDailyRates(earliestDate, new Date())
  return projectCdiIndexedValue(events, dailyRates, cdiPercent)
}

export async function getInvestment(id: string) {
  const investment = await prisma.investment.findUnique({
    where: { id },
    include: { transactions: { orderBy: { date: 'desc' } } },
  })
  if (!investment) {
    throw new AppError(404, 'Investment not found')
  }
  const { transactions, ...rest } = investment
  const cdiProjectedValueMinor = investment.cdiPercent
    ? await getCdiProjectedValueMinor(investment.cdiPercent, transactions)
    : null
  return { ...withComputedFields(rest, transactions), transactions, cdiProjectedValueMinor }
}

export function createInvestment(input: CreateInvestmentInput) {
  return prisma.investment.create({ data: input })
}

export async function updateInvestment(id: string, input: UpdateInvestmentInput) {
  const investment = await prisma.investment.findUnique({ where: { id } })
  if (!investment) {
    throw new AppError(404, 'Investment not found')
  }
  return prisma.investment.update({ where: { id }, data: input })
}

export async function deleteInvestment(id: string) {
  const investment = await prisma.investment.findUnique({
    where: { id },
    include: { transactions: true },
  })
  if (!investment) {
    throw new AppError(404, 'Investment not found')
  }
  // Deleting the investment cascades its InvestmentTransaction rows at the
  // DB level, which would silently orphan any cash Transaction they auto-
  // linked (see investmentTransactionService.ts) — clean those up too.
  const cashTransactionIds = investment.transactions
    .map((t) => t.cashTransactionId)
    .filter((cashTxId): cashTxId is string => cashTxId !== null)
  await prisma.$transaction([
    prisma.investment.delete({ where: { id } }),
    prisma.transaction.deleteMany({ where: { id: { in: cashTransactionIds } } }),
  ])
}
