import { Router } from 'express'
import * as transactionController from '../controllers/transactionController.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const transactionRouter = Router()

transactionRouter.get('/summary', asyncHandler(transactionController.summary))
transactionRouter.get('/', asyncHandler(transactionController.list))
transactionRouter.post('/', asyncHandler(transactionController.create))
transactionRouter.get('/:id', asyncHandler(transactionController.get))
transactionRouter.patch('/:id', asyncHandler(transactionController.update))
transactionRouter.delete('/:id', asyncHandler(transactionController.remove))
