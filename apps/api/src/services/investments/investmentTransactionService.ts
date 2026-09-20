import { investmentCashEffect } from '../../domain/investmentCashEffect.js'
import { AppError } from '../../middleware/errorHandler.js'
import { prisma } from '../../lib/prisma.js'
import type { CreateInvestmentTransactionInput } from '../../validation/investmentTransaction.js'

// Created by the seed script — see prisma/seed.ts. Investment cash-linking
// fails loudly (rather than silently skipping) if these are missing, since
// a silent skip would look like a bug ("why isn't my balance moving?").
const CASH_EFFECT_CATEGORY = { EXPENSE: 'Investments', INCOME: 'Investment Returns' } as const

async function getInvestmentOrThrow(investmentId: string) {
  const investment = await prisma.investment.findUnique({ where: { id: investmentId } })
  if (!investment) {
    throw new AppError(404, 'Investment not found')
  }
  return investment
}

async function getCashEffectCategoryId(type: 'EXPENSE' | 'INCOME') {
  const name = CASH_EFFECT_CATEGORY[type]
  const category = await prisma.category.findUnique({ where: { name_type: { name, type } } })
  if (!category) {
    throw new AppError(
      500,
      `System category "${name}" (${type}) is missing — run "npm run prisma:seed".`,
    )
  }
  return category.id
}

export function listTransactions(investmentId: string) {
  return prisma.investmentTransaction.findMany({
    where: { investmentId },
    orderBy: { date: 'desc' },
  })
}

// Auto-links a cash Transaction for BRL investments so buying/depositing
// debits cash and selling/withdrawing/dividends/interest credit it back,
// without the user double-entering the same money in two tabs. Non-BRL
// investments and OTHER-type transactions never link — see
// docs decision in HANDOFF.md.
export async function createTransaction(
  investmentId: string,
  input: CreateInvestmentTransactionInput,
) {
  const investment = await getInvestmentOrThrow(investmentId)
  const cashEffect = investment.currency === 'BRL' ? investmentCashEffect(input.type) : null

  if (!cashEffect) {
    return prisma.investmentTransaction.create({ data: { ...input, investmentId } })
  }

  const categoryId = await getCashEffectCategoryId(cashEffect)
  return prisma.$transaction(async (tx) => {
    const cashTransaction = await tx.transaction.create({
      data: {
        type: cashEffect,
        amountMinor: input.amountMinor,
        currency: investment.currency,
        description: `Investment: ${investment.name}`,
        date: input.date,
        categoryId,
      },
    })
    return tx.investmentTransaction.create({
      data: { ...input, investmentId, cashTransactionId: cashTransaction.id },
    })
  })
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

  await prisma.$transaction(async (tx) => {
    await tx.investmentTransaction.delete({ where: { id: transactionId } })
    if (transaction.cashTransactionId) {
      await tx.transaction.delete({ where: { id: transaction.cashTransactionId } })
    }
  })
}
