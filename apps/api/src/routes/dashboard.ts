import { Router } from 'express'
import * as dashboardController from '../controllers/dashboardController.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const dashboardRouter = Router()

dashboardRouter.get('/', asyncHandler(dashboardController.get))
