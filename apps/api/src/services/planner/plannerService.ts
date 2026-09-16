import { calculateBalance } from '../../domain/balanceCalculator.js'
import { monthDateRange } from '../../domain/dateRange.js'
import { calculateInvestmentPlan } from '../../domain/investmentPlanner.js'
import { prisma } from '../../lib/prisma.js'
import type { UpdatePlanConfigInput } from '../../validation/planner.js'

const CONFIG_ID = 'singleton'

export async function getConfig() {
  const existing = await prisma.investmentPlanConfig.findUnique({ where: { id: CONFIG_ID } })
  return existing ?? prisma.investmentPlanConfig.create({ data: { id: CONFIG_ID } })
}

export function updateConfig(input: UpdatePlanConfigInput) {
  return prisma.investmentPlanConfig.upsert({
    where: { id: CONFIG_ID },
    create: { id: CONFIG_ID, ...input },
    update: input,
  })
}

export async function getPlan(month: string) {
  const { start, end } = monthDateRange(month)
  const transactions = await prisma.transaction.findMany({
    where: { date: { gte: start, lt: end } },
    select: { type: true, amountMinor: true },
  })
  const { incomeMinor, expenseMinor } = calculateBalance(transactions)

  const config = await getConfig()
  const plan = calculateInvestmentPlan({
    incomeMinor,
    actualExpensesMinor: expenseMinor,
    config: {
      minMonthlyInvestmentMinor: config.minMonthlyInvestmentMinor,
      targetInvestmentRate: config.targetInvestmentRate,
      minCashBufferMinor: config.minCashBufferMinor,
      maxPercentOfAvailableCash: config.maxPercentOfAvailableCash,
      expectedRecurringExpensesMinor: config.expectedRecurringExpensesMinor,
    },
  })

  return { month, ...plan }
}
