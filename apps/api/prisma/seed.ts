import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const DEFAULT_INCOME_CATEGORIES = ['Salary', 'Freelance', 'Other Income']

const DEFAULT_EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Education',
  'Entertainment',
  'Subscriptions',
  'Shopping',
  'Other',
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
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err)
    await prisma.$disconnect()
    process.exit(1)
  })
