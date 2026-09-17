import type { InvestmentPlanConstraint } from './planner'
import type { Budget } from './budgets'
import type { Transaction } from './transactions'
import type { Portfolio } from './investments'
import type { WatchlistItem } from './market'
import { api } from './client'

export interface DashboardPeriod {
  incomeMinor: number
  expenseMinor: number
  balanceMinor: number
}

export interface DashboardPlan {
  month: string
  incomeMinor: number
  actualExpensesMinor: number
  expectedRecurringExpensesMinor: number
  availableMinor: number
  targetFromRateMinor: number
  maxByBufferMinor: number
  maxByPercentMinor: number
  suggestedMinor: number
  remainingBufferMinor: number
  bindingConstraint: InvestmentPlanConstraint
}

export interface SpendingByCategoryEntry {
  categoryId: string
  categoryName: string
  amountMinor: number
}

export interface MonthlyTrendEntry {
  month: string
  incomeMinor: number
  expenseMinor: number
}

export interface InvestmentContributionEntry {
  month: string
  netContributedMinor: number
}

export interface Dashboard {
  month: string
  cashBalanceMinor: number
  period: DashboardPeriod
  portfolio: Portfolio
  plan: DashboardPlan
  budgets: Budget[]
  recentTransactions: Transaction[]
  watchlist: WatchlistItem[]
  spendingByCategory: SpendingByCategoryEntry[]
  monthlyTrend: MonthlyTrendEntry[]
  investmentContributionsByMonth: InvestmentContributionEntry[]
}

export const dashboardApi = {
  get: (month: string) => api.get<Dashboard>(`/dashboard?month=${month}`),
}
