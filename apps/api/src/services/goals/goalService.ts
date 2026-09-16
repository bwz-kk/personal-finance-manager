import { calculateGoalProgress } from '../../domain/goalCalculator.js'
import { AppError } from '../../middleware/errorHandler.js'
import { prisma } from '../../lib/prisma.js'
import type { CreateGoalInput, UpdateGoalInput } from '../../validation/goal.js'

function withProgress<T extends { targetAmountMinor: number; currentAmountMinor: number }>(
  goal: T,
) {
  return { ...goal, ...calculateGoalProgress(goal.targetAmountMinor, goal.currentAmountMinor) }
}

export async function listGoals() {
  const goals = await prisma.goal.findMany({ orderBy: { createdAt: 'asc' } })
  return goals.map(withProgress)
}

export async function getGoal(id: string) {
  const goal = await prisma.goal.findUnique({ where: { id } })
  if (!goal) {
    throw new AppError(404, 'Goal not found')
  }
  return withProgress(goal)
}

export async function createGoal(input: CreateGoalInput) {
  const goal = await prisma.goal.create({ data: input })
  return withProgress(goal)
}

export async function updateGoal(id: string, input: UpdateGoalInput) {
  const existing = await prisma.goal.findUnique({ where: { id } })
  if (!existing) {
    throw new AppError(404, 'Goal not found')
  }
  const goal = await prisma.goal.update({ where: { id }, data: input })
  return withProgress(goal)
}

export async function deleteGoal(id: string) {
  const existing = await prisma.goal.findUnique({ where: { id } })
  if (!existing) {
    throw new AppError(404, 'Goal not found')
  }
  await prisma.goal.delete({ where: { id } })
}
