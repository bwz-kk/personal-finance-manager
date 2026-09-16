import { Prisma } from '@prisma/client'
import { AppError } from '../../middleware/errorHandler.js'
import { prisma } from '../../lib/prisma.js'
import type { CreateCategoryInput, UpdateCategoryInput } from '../../validation/category.js'

export function listCategories() {
  return prisma.category.findMany({ orderBy: [{ type: 'asc' }, { name: 'asc' }] })
}

export async function createCategory(input: CreateCategoryInput) {
  try {
    return await prisma.category.create({ data: input })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new AppError(
        409,
        `A ${input.type.toLowerCase()} category named "${input.name}" already exists`,
      )
    }
    throw err
  }
}

export async function updateCategory(id: string, input: UpdateCategoryInput) {
  const category = await prisma.category.findUnique({ where: { id } })
  if (!category) {
    throw new AppError(404, 'Category not found')
  }

  try {
    return await prisma.category.update({ where: { id }, data: input })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new AppError(
        409,
        `A ${category.type.toLowerCase()} category named "${input.name}" already exists`,
      )
    }
    throw err
  }
}

export async function deleteCategory(id: string) {
  const category = await prisma.category.findUnique({ where: { id } })
  if (!category) {
    throw new AppError(404, 'Category not found')
  }
  if (category.isSystem) {
    throw new AppError(400, 'System categories cannot be deleted')
  }

  try {
    await prisma.category.delete({ where: { id } })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
      throw new AppError(409, 'Category is still used by existing transactions or budgets')
    }
    throw err
  }
}
