import type { InvestmentTransactionType } from '@pfm/shared'
import {
  calculateInvestmentReturn,
  summarizeInvestmentTransactions,
} from '../../domain/portfolioCalculator.js'
import { AppError } from '../../middleware/errorHandler.js'
import { prisma } from '../../lib/prisma.js'
import type { CreateInvestmentInput, UpdateInvestmentInput } from '../../validation/investment.js'

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

export async function getInvestment(id: string) {
  const investment = await prisma.investment.findUnique({
    where: { id },
    include: { transactions: { orderBy: { date: 'desc' } } },
  })
  if (!investment) {
    throw new AppError(404, 'Investment not found')
  }
  const { transactions, ...rest } = investment
  return { ...withComputedFields(rest, transactions), transactions }
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
  const investment = await prisma.investment.findUnique({ where: { id } })
  if (!investment) {
    throw new AppError(404, 'Investment not found')
  }
  await prisma.investment.delete({ where: { id } })
}
