import { Router } from 'express'
import * as plannerController from '../controllers/plannerController.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const plannerRouter = Router()

plannerRouter.get('/', asyncHandler(plannerController.getPlan))
plannerRouter.get('/config', asyncHandler(plannerController.getConfig))
plannerRouter.patch('/config', asyncHandler(plannerController.updateConfig))
