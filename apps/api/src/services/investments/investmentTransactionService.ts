import { AppError } from '../../middleware/errorHandler.js'
import { prisma } from '../../lib/prisma.js'
import type { CreateInvestmentTransactionInput } from '../../validation/investmentTransaction.js'

async function assertInvestmentExists(investmentId: string) {
  const investment = await prisma.investment.findUnique({ where: { id: investmentId } })
  if (!investment) {
    throw new AppError(404, 'Investment not found')
  }
}

export function listTransactions(investmentId: string) {
  return prisma.investmentTransaction.findMany({
    where: { investmentId },
    orderBy: { date: 'desc' },
  })
}

export async function createTransaction(
  investmentId: string,
  input: CreateInvestmentTransactionInput,
) {
  await assertInvestmentExists(investmentId)
  return prisma.investmentTransaction.create({ data: { ...input, investmentId } })
}

// Investment transactions form a history log — corrections happen by
// deleting and re-adding, not by editing a past event in place.
export async function deleteTransaction(investmentId: string, transactionId: string) {
  const transaction = await prisma.investmentTransaction.findUnique({
    where: { id: transactionId },
  })
  if (!transaction || transaction.investmentId !== investmentId) {
    throw new AppError(404, 'Investment transaction not found')
  }
  await prisma.investmentTransaction.delete({ where: { id: transactionId } })
}
