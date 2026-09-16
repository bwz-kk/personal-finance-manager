import type { Request, Response } from 'express'
import { planQuerySchema, updatePlanConfigSchema } from '../validation/planner.js'
import { currentMonth } from '../domain/dateRange.js'
import * as plannerService from '../services/planner/plannerService.js'

export async function getConfig(_req: Request, res: Response) {
  res.json(await plannerService.getConfig())
}

export async function updateConfig(req: Request, res: Response) {
  const input = updatePlanConfigSchema.parse(req.body)
  res.json(await plannerService.updateConfig(input))
}

export async function getPlan(req: Request, res: Response) {
  const query = planQuerySchema.parse(req.query)
  const month = query.month ?? currentMonth()
  res.json(await plannerService.getPlan(month))
}
