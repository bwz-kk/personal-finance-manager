import { calculateBalance } from '../../domain/balanceCalculator.js'
import { currentMonth, monthDateRange } from '../../domain/dateRange.js'
import { bucketMinorByMonth, trailingMonths } from '../../domain/monthlySeries.js'
import { CONTRIBUTION_TYPES, WITHDRAWAL_TYPES } from '../../domain/portfolioCalculator.js'
import { prisma } from '../../lib/prisma.js'
import { listBudgets } from '../budgets/budgetService.js'
import { getPortfolio } from '../investments/portfolioService.js'
import { listWatchlist } from '../market/marketService.js'
import { getPlan } from '../planner/plannerService.js'
import { getSummary, listTransactions } from '../transactions/transactionService.js'
import { transactionQuerySchema } from '../../validation/transaction.js'

const RECENT_TRANSACTIONS_LIMIT = 8
const TREND_MONTHS = 6

// This module composes the existing services — no new financial calculation
// lives here, per docs/ARCHITECTURE.md's "backend is the sole source of
// truth, one calculation per concern" rule. It's assembly, not math.
export async function getDashboard(month: string = currentMonth()) {
  const { start: periodStart, end: periodEnd } = monthDateRange(month)

  const [allTransactions, period, portfolio, budgets, plan, recentTransactions, watchlist] =
    await Promise.all([
      prisma.transaction.findMany({ select: { type: true, amountMinor: true } }),
      getSummary({ dateFrom: periodStart, dateTo: periodEnd }),
      getPortfolio(),
      listBudgets(month),
      getPlan(month),
      listTransactions(transactionQuerySchema.parse({})),
      listWatchlist(),
    ])

  // Cash balance only nets against BRL-denominated investment contributions
  // — Transaction rows are BRL-only (see docs/ARCHITECTURE.md's "Currency
  // handling"), so a USD/EUR investment's contributions are never subtracted
  // from a BRL balance. That would silently mix currencies.
  const brlInvestedMinor =
    portfolio.groups.find((g) => g.currency === 'BRL')?.totalInvestedMinor ?? 0
  const cashBalanceMinor = calculateBalance(allTransactions).balanceMinor - brlInvestedMinor

  const months = trailingMonths(month, TREND_MONTHS)
  const { start: trendStart } = monthDateRange(months[0]!)
  const { end: trendEnd } = monthDateRange(months[months.length - 1]!)

  const trendTransactions = await prisma.transaction.findMany({
    where: { date: { gte: trendStart, lt: trendEnd } },
    select: { type: true, amountMinor: true, date: true },
  })
  const monthlyIncome = bucketMinorByMonth(
    trendTransactions.filter((t) => t.type === 'INCOME'),
    months,
  )
  const monthlyExpense = bucketMinorByMonth(
    trendTransactions.filter((t) => t.type === 'EXPENSE'),
    months,
  )
  const monthlyTrend = months.map((m, i) => ({
    month: m,
    incomeMinor: monthlyIncome[i]!.amountMinor,
    expenseMinor: monthlyExpense[i]!.amountMinor,
  }))

  const trendInvestmentTx = await prisma.investmentTransaction.findMany({
    where: { date: { gte: trendStart, lt: trendEnd } },
    select: { type: true, amountMinor: true, date: true },
  })
  const contributions = bucketMinorByMonth(
    trendInvestmentTx.filter((t) => CONTRIBUTION_TYPES.includes(t.type)),
    months,
  )
  const withdrawals = bucketMinorByMonth(
    trendInvestmentTx.filter((t) => WITHDRAWAL_TYPES.includes(t.type)),
    months,
  )
  const investmentContributionsByMonth = months.map((m, i) => ({
    month: m,
    netContributedMinor: contributions[i]!.amountMinor - withdrawals[i]!.amountMinor,
  }))

  const spendingByCategoryRaw = await prisma.transaction.groupBy({
    by: ['categoryId'],
    where: { type: 'EXPENSE', date: { gte: periodStart, lt: periodEnd } },
    _sum: { amountMinor: true },
  })
  const categories = await prisma.category.findMany({
    where: { id: { in: spendingByCategoryRaw.map((r) => r.categoryId) } },
  })
  const categoryById = new Map(categories.map((c) => [c.id, c]))
  const spendingByCategory = spendingByCategoryRaw
    .map((row) => ({
      categoryId: row.categoryId,
      categoryName: categoryById.get(row.categoryId)?.name ?? row.categoryId,
      amountMinor: row._sum.amountMinor ?? 0,
    }))
    .sort((a, b) => b.amountMinor - a.amountMinor)

  return {
    month,
    cashBalanceMinor,
    period,
    portfolio,
    plan,
    budgets,
    recentTransactions: recentTransactions.slice(0, RECENT_TRANSACTIONS_LIMIT),
    watchlist,
    spendingByCategory,
    monthlyTrend,
    investmentContributionsByMonth,
  }
}
