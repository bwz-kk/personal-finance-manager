import type { Request, Response } from 'express'
import { createGoalSchema, goalIdParamSchema, updateGoalSchema } from '../validation/goal.js'
import * as goalService from '../services/goals/goalService.js'

export async function list(_req: Request, res: Response) {
  res.json(await goalService.listGoals())
}

export async function get(req: Request, res: Response) {
  const { id } = goalIdParamSchema.parse(req.params)
  res.json(await goalService.getGoal(id))
}

export async function create(req: Request, res: Response) {
  const input = createGoalSchema.parse(req.body)
  const goal = await goalService.createGoal(input)
  res.status(201).json(goal)
}

export async function update(req: Request, res: Response) {
  const { id } = goalIdParamSchema.parse(req.params)
  const input = updateGoalSchema.parse(req.body)
  res.json(await goalService.updateGoal(id, input))
}

export async function remove(req: Request, res: Response) {
  const { id } = goalIdParamSchema.parse(req.params)
  await goalService.deleteGoal(id)
  res.status(204).send()
}
