import { Prisma } from '@prisma/client'
import { calculateBudgetProgress } from '../../domain/budgetCalculator.js'
import { monthDateRange } from '../../domain/dateRange.js'
import { AppError } from '../../middleware/errorHandler.js'
import { prisma } from '../../lib/prisma.js'
import type { CreateBudgetInput, UpdateBudgetInput } from '../../validation/budget.js'

export function currentMonth(): string {
  return new Date().toISOString().slice(0, 7)
}

async function spentMinorForCategory(categoryId: string, month: string): Promise<number> {
  const { start, end } = monthDateRange(month)
  const result = await prisma.transaction.aggregate({
    where: { categoryId, type: 'EXPENSE', date: { gte: start, lt: end } },
    _sum: { amountMinor: true },
  })
  return result._sum.amountMinor ?? 0
}

export async function listBudgets(month: string) {
  const budgets = await prisma.budget.findMany({
    where: { month },
    include: { category: true },
    orderBy: { category: { name: 'asc' } },
  })

  return Promise.all(
    budgets.map(async (budget) => {
      const spentMinor = await spentMinorForCategory(budget.categoryId, month)
      return { ...budget, ...calculateBudgetProgress(budget.limitMinor, spentMinor) }
    }),
  )
}

async function assertExpenseCategory(categoryId: string) {
  const category = await prisma.category.findUnique({ where: { id: categoryId } })
  if (!category) {
    throw new AppError(400, 'Category not found')
  }
  if (category.type !== 'EXPENSE') {
    throw new AppError(400, `Category "${category.name}" is not an expense category`)
  }
}

export async function createBudget(input: CreateBudgetInput) {
  await assertExpenseCategory(input.categoryId)

  try {
    const budget = await prisma.budget.create({ data: input, include: { category: true } })
    const spentMinor = await spentMinorForCategory(budget.categoryId, budget.month)
    return { ...budget, ...calculateBudgetProgress(budget.limitMinor, spentMinor) }
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new AppError(409, `A budget for this category already exists for ${input.month}`)
    }
    throw err
  }
}

export async function updateBudget(id: string, input: UpdateBudgetInput) {
  const budget = await prisma.budget.findUnique({ where: { id } })
  if (!budget) {
    throw new AppError(404, 'Budget not found')
  }

  const updated = await prisma.budget.update({
    where: { id },
    data: input,
    include: { category: true },
  })
  const spentMinor = await spentMinorForCategory(updated.categoryId, updated.month)
  return { ...updated, ...calculateBudgetProgress(updated.limitMinor, spentMinor) }
}

export async function deleteBudget(id: string) {
  const budget = await prisma.budget.findUnique({ where: { id } })
  if (!budget) {
    throw new AppError(404, 'Budget not found')
  }
  await prisma.budget.delete({ where: { id } })
}
