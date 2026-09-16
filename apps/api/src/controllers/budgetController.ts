import type { Request, Response } from 'express'
import {
  budgetIdParamSchema,
  budgetQuerySchema,
  createBudgetSchema,
  updateBudgetSchema,
} from '../validation/budget.js'
import { currentMonth } from '../domain/dateRange.js'
import * as budgetService from '../services/budgets/budgetService.js'

export async function list(req: Request, res: Response) {
  const query = budgetQuerySchema.parse(req.query)
  const month = query.month ?? currentMonth()
  const budgets = await budgetService.listBudgets(month)
  res.json(budgets)
}

export async function create(req: Request, res: Response) {
  const input = createBudgetSchema.parse(req.body)
  const budget = await budgetService.createBudget(input)
  res.status(201).json(budget)
}

export async function update(req: Request, res: Response) {
  const { id } = budgetIdParamSchema.parse(req.params)
  const input = updateBudgetSchema.parse(req.body)
  const budget = await budgetService.updateBudget(id, input)
  res.json(budget)
}

export async function remove(req: Request, res: Response) {
  const { id } = budgetIdParamSchema.parse(req.params)
  await budgetService.deleteBudget(id)
  res.status(204).send()
}
