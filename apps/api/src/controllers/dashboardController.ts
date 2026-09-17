import type { Request, Response } from 'express'
import { dashboardQuerySchema } from '../validation/dashboard.js'
import { getDashboard } from '../services/dashboard/dashboardService.js'

export async function get(req: Request, res: Response) {
  const query = dashboardQuerySchema.parse(req.query)
  res.json(await getDashboard(query.month))
}
