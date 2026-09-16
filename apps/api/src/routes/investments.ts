import { Router } from 'express'
import * as investmentController from '../controllers/investmentController.js'
import * as investmentTransactionController from '../controllers/investmentTransactionController.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const investmentRouter = Router()

investmentRouter.get('/', asyncHandler(investmentController.list))
investmentRouter.post('/', asyncHandler(investmentController.create))
investmentRouter.get('/:id', asyncHandler(investmentController.get))
investmentRouter.patch('/:id', asyncHandler(investmentController.update))
investmentRouter.delete('/:id', asyncHandler(investmentController.remove))

investmentRouter.get('/:id/transactions', asyncHandler(investmentTransactionController.list))
investmentRouter.post('/:id/transactions', asyncHandler(investmentTransactionController.create))
investmentRouter.delete(
  '/:id/transactions/:transactionId',
  asyncHandler(investmentTransactionController.remove),
)
