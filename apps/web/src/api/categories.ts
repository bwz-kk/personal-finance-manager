import type { TransactionType } from '@pfm/shared'
import { api } from './client'

export interface Category {
  id: string
  name: string
  type: TransactionType
  isSystem: boolean
  createdAt: string
}

export interface CreateCategoryInput {
  name: string
  type: TransactionType
}

export interface UpdateCategoryInput {
  name: string
}

export const categoriesApi = {
  list: () => api.get<Category[]>('/categories'),
  create: (input: CreateCategoryInput) => api.post<Category>('/categories', input),
  update: (id: string, input: UpdateCategoryInput) =>
    api.patch<Category>(`/categories/${id}`, input),
  remove: (id: string) => api.delete(`/categories/${id}`),
}
