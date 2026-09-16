import type { InvestmentTransactionType } from '@pfm/shared'
import { sumMinor } from './money.js'
import { sumQuantities } from './quantity.js'

export interface InvestmentTransactionLike {
  type: InvestmentTransactionType
  amountMinor: number
  quantity?: string | null
}

export interface InvestmentSummary {
  totalInvestedMinor: number
  quantity: string
}

// BUY/DEPOSIT add cash and (usually) units; SELL/WITHDRAWAL remove them.
// DIVIDEND/INTEREST/OTHER are informational history, not principal — they
// don't move the invested total or the held quantity.
const CONTRIBUTION_TYPES: InvestmentTransactionType[] = ['BUY', 'DEPOSIT']
const WITHDRAWAL_TYPES: InvestmentTransactionType[] = ['SELL', 'WITHDRAWAL']

export function summarizeInvestmentTransactions(
  transactions: InvestmentTransactionLike[],
): InvestmentSummary {
  const contributions = transactions.filter((t) => CONTRIBUTION_TYPES.includes(t.type))
  const withdrawals = transactions.filter((t) => WITHDRAWAL_TYPES.includes(t.type))

  const totalInvestedMinor =
    sumMinor(contributions.map((t) => t.amountMinor)) -
    sumMinor(withdrawals.map((t) => t.amountMinor))

  const quantity = sumQuantities([
    ...contributions.map((t) => t.quantity),
    ...withdrawals.map((t) => (t.quantity ? `-${t.quantity}` : null)),
  ])

  return { totalInvestedMinor, quantity }
}

export interface InvestmentReturn {
  totalInvestedMinor: number
  currentValueMinor: number
  absoluteReturnMinor: number
  percentageReturn: number
}

export function calculateInvestmentReturn(
  totalInvestedMinor: number,
  currentValueMinor: number,
): InvestmentReturn {
  const absoluteReturnMinor = currentValueMinor - totalInvestedMinor
  const percentageReturn =
    totalInvestedMinor > 0 ? (absoluteReturnMinor / totalInvestedMinor) * 100 : 0

  return { totalInvestedMinor, currentValueMinor, absoluteReturnMinor, percentageReturn }
}

export interface PortfolioInvestment {
  id: string
  name: string
  currency: string
  totalInvestedMinor: number
  currentValueMinor: number
}

export interface PortfolioAllocationEntry {
  investmentId: string
  name: string
  currentValueMinor: number
  allocationPct: number
}

export interface PortfolioGroup {
  currency: string
  totalInvestedMinor: number
  currentValueMinor: number
  absoluteReturnMinor: number
  percentageReturn: number
  allocation: PortfolioAllocationEntry[]
}

// Never mix currencies in one total — group first, then sum within each group.
export function calculatePortfolio(investments: PortfolioInvestment[]): PortfolioGroup[] {
  const byCurrency = new Map<string, PortfolioInvestment[]>()
  for (const investment of investments) {
    const group = byCurrency.get(investment.currency) ?? []
    group.push(investment)
    byCurrency.set(investment.currency, group)
  }

  return Array.from(byCurrency.entries())
    .map(([currency, group]) => {
      const totalInvestedMinor = sumMinor(group.map((i) => i.totalInvestedMinor))
      const currentValueMinor = sumMinor(group.map((i) => i.currentValueMinor))
      const { absoluteReturnMinor, percentageReturn } = calculateInvestmentReturn(
        totalInvestedMinor,
        currentValueMinor,
      )

      const allocation = group.map((i) => ({
        investmentId: i.id,
        name: i.name,
        currentValueMinor: i.currentValueMinor,
        allocationPct: currentValueMinor > 0 ? (i.currentValueMinor / currentValueMinor) * 100 : 0,
      }))

      return {
        currency,
        totalInvestedMinor,
        currentValueMinor,
        absoluteReturnMinor,
        percentageReturn,
        allocation,
      }
    })
    .sort((a, b) => a.currency.localeCompare(b.currency))
}
