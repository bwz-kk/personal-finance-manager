import { z } from 'zod'
import { monthSchema } from './budget.js'

export const dashboardQuerySchema = z.object({
  month: monthSchema.optional(),
})
