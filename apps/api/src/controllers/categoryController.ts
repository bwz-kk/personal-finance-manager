import type { Request, Response } from 'express'
import {
  createCategorySchema,
  categoryIdParamSchema,
  updateCategorySchema,
} from '../validation/category.js'
import * as categoryService from '../services/categories/categoryService.js'

export async function list(_req: Request, res: Response) {
  const categories = await categoryService.listCategories()
  res.json(categories)
}

export async function create(req: Request, res: Response) {
  const input = createCategorySchema.parse(req.body)
  const category = await categoryService.createCategory(input)
  res.status(201).json(category)
}

export async function update(req: Request, res: Response) {
  const { id } = categoryIdParamSchema.parse(req.params)
  const input = updateCategorySchema.parse(req.body)
  const category = await categoryService.updateCategory(id, input)
  res.json(category)
}

export async function remove(req: Request, res: Response) {
  const { id } = categoryIdParamSchema.parse(req.params)
  await categoryService.deleteCategory(id)
  res.status(204).send()
}
