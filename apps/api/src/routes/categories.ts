import { Router } from 'express'
import * as categoryController from '../controllers/categoryController.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const categoryRouter = Router()

categoryRouter.get('/', asyncHandler(categoryController.list))
categoryRouter.post('/', asyncHandler(categoryController.create))
categoryRouter.patch('/:id', asyncHandler(categoryController.update))
categoryRouter.delete('/:id', asyncHandler(categoryController.remove))
