import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// "Investments" and "Investment Returns" back the auto-linked cash
// Transaction created when a BRL investment moves cash — see
// investmentTransactionService.ts.
const DEFAULT_INCOME_CATEGORIES = ['Salary', 'Freelance', 'Other Income', 'Investment Returns']

const DEFAULT_EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Education',
  'Entertainment',
  'Subscriptions',
  'Shopping',
  'Other',
  'Investments',
]

async function main() {
  for (const name of DEFAULT_INCOME_CATEGORIES) {
    await prisma.category.upsert({
      where: { name_type: { name, type: 'INCOME' } },
      update: {},
      create: { name, type: 'INCOME', isSystem: true },
    })
  }

  for (const name of DEFAULT_EXPENSE_CATEGORIES) {
    await prisma.category.upsert({
      where: { name_type: { name, type: 'EXPENSE' } },
      update: {},
      create: { name, type: 'EXPENSE', isSystem: true },
    })
  }

  // Pre-populated so the current CDI rate is visible on the Investments tab
  // without the user having to know to add it via the Market/Watchlist tab.
  await prisma.watchlistItem.upsert({
    where: { symbol: 'CDI' },
    update: {},
    create: { symbol: 'CDI', label: 'CDI', assetClass: 'INDICATOR' },
  })
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err)
    await prisma.$disconnect()
    process.exit(1)
  })
