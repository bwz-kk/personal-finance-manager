import { Router } from 'express'
import * as goalController from '../controllers/goalController.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const goalRouter = Router()

goalRouter.get('/', asyncHandler(goalController.list))
goalRouter.post('/', asyncHandler(goalController.create))
goalRouter.get('/:id', asyncHandler(goalController.get))
goalRouter.patch('/:id', asyncHandler(goalController.update))
goalRouter.delete('/:id', asyncHandler(goalController.remove))
