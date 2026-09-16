import type { Prisma } from '@prisma/client'
import { calculateBalance } from '../../domain/balanceCalculator.js'
import { AppError } from '../../middleware/errorHandler.js'
import { prisma } from '../../lib/prisma.js'
import type {
  CreateTransactionInput,
  TransactionQuery,
  UpdateTransactionInput,
} from '../../validation/transaction.js'

async function assertCategoryMatchesType(categoryId: string, type: 'INCOME' | 'EXPENSE') {
  const category = await prisma.category.findUnique({ where: { id: categoryId } })
  if (!category) {
    throw new AppError(400, 'Category not found')
  }
  if (category.type !== type) {
    const article = (word: string) => (word === 'expense' ? 'an' : 'a')
    const categoryWord = category.type.toLowerCase()
    const transactionWord = type.toLowerCase()
    throw new AppError(
      400,
      `Category "${category.name}" is ${article(categoryWord)} ${categoryWord} category and cannot be used for ${article(transactionWord)} ${transactionWord} transaction`,
    )
  }
}

function buildWhere(filters: Partial<TransactionQuery>): Prisma.TransactionWhereInput {
  const where: Prisma.TransactionWhereInput = {}

  if (filters.type) where.type = filters.type
  if (filters.categoryId) where.categoryId = filters.categoryId
  if (filters.dateFrom || filters.dateTo) {
    where.date = {
      ...(filters.dateFrom && { gte: filters.dateFrom }),
      ...(filters.dateTo && { lte: filters.dateTo }),
    }
  }
  if (filters.search) {
    where.OR = [
      { description: { contains: filters.search } },
      { notes: { contains: filters.search } },
    ]
  }

  return where
}

export function listTransactions(query: TransactionQuery) {
  return prisma.transaction.findMany({
    where: buildWhere(query),
    orderBy: { [query.sortBy]: query.sortDir },
    include: { category: true },
  })
}

export async function getSummary(
  filters: Pick<TransactionQuery, 'dateFrom' | 'dateTo' | 'categoryId'>,
) {
  const transactions = await prisma.transaction.findMany({
    where: buildWhere(filters),
    select: { type: true, amountMinor: true },
  })
  return calculateBalance(transactions)
}

export function getTransaction(id: string) {
  return prisma.transaction.findUnique({ where: { id }, include: { category: true } })
}

export async function createTransaction(input: CreateTransactionInput) {
  await assertCategoryMatchesType(input.categoryId, input.type)
  return prisma.transaction.create({ data: input, include: { category: true } })
}

export async function updateTransaction(id: string, input: UpdateTransactionInput) {
  const existing = await prisma.transaction.findUnique({ where: { id } })
  if (!existing) {
    throw new AppError(404, 'Transaction not found')
  }

  const nextType = input.type ?? existing.type
  const nextCategoryId = input.categoryId ?? existing.categoryId
  await assertCategoryMatchesType(nextCategoryId, nextType)

  return prisma.transaction.update({ where: { id }, data: input, include: { category: true } })
}

export async function deleteTransaction(id: string) {
  const existing = await prisma.transaction.findUnique({ where: { id } })
  if (!existing) {
    throw new AppError(404, 'Transaction not found')
  }
  await prisma.transaction.delete({ where: { id } })
}
