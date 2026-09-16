import { Router } from 'express'
import * as budgetController from '../controllers/budgetController.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const budgetRouter = Router()

budgetRouter.get('/', asyncHandler(budgetController.list))
budgetRouter.post('/', asyncHandler(budgetController.create))
budgetRouter.patch('/:id', asyncHandler(budgetController.update))
budgetRouter.delete('/:id', asyncHandler(budgetController.remove))
