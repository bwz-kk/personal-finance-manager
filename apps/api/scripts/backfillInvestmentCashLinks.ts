// One-time migration: creates the linked cash Transaction for every
// existing BRL InvestmentTransaction that doesn't have one yet, so removing
// dashboardService's old brlInvestedMinor formula (see HANDOFF.md) doesn't
// change anyone's current cash balance number. Safe to re-run — only rows
// with cashTransactionId still null are touched.
//
// Run with: npx tsx apps/api/scripts/backfillInvestmentCashLinks.ts
import { PrismaClient } from '@prisma/client'
import { investmentCashEffect } from '../src/domain/investmentCashEffect.js'

const prisma = new PrismaClient()

const CASH_EFFECT_CATEGORY = { EXPENSE: 'Investments', INCOME: 'Investment Returns' } as const

async function main() {
  const categoryIds: Record<'EXPENSE' | 'INCOME', string> = { EXPENSE: '', INCOME: '' }
  for (const type of ['EXPENSE', 'INCOME'] as const) {
    const category = await prisma.category.findUnique({
      where: { name_type: { name: CASH_EFFECT_CATEGORY[type], type } },
    })
    if (!category) {
      throw new Error(
        `Run "npm run prisma:seed" first — missing category ${CASH_EFFECT_CATEGORY[type]}`,
      )
    }
    categoryIds[type] = category.id
  }

  const unlinked = await prisma.investmentTransaction.findMany({
    where: { cashTransactionId: null },
    include: { investment: true },
  })

  let linked = 0
  for (const tx of unlinked) {
    if (tx.investment.currency !== 'BRL') continue
    const cashEffect = investmentCashEffect(tx.type)
    if (!cashEffect) continue

    await prisma.$transaction(async (db) => {
      const cashTransaction = await db.transaction.create({
        data: {
          type: cashEffect,
          amountMinor: tx.amountMinor,
          currency: tx.investment.currency,
          description: `Investment: ${tx.investment.name}`,
          date: tx.date,
          categoryId: categoryIds[cashEffect],
        },
      })
      await db.investmentTransaction.update({
        where: { id: tx.id },
        data: { cashTransactionId: cashTransaction.id },
      })
    })
    linked++
  }

  console.log(`Backfilled ${linked} investment transaction(s) with a linked cash transaction.`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err)
    await prisma.$disconnect()
    process.exit(1)
  })
