import type { Request, Response } from 'express'
import {
  createTransactionSchema,
  transactionIdParamSchema,
  transactionQuerySchema,
  updateTransactionSchema,
} from '../validation/transaction.js'
import { AppError } from '../middleware/errorHandler.js'
import * as transactionService from '../services/transactions/transactionService.js'

export async function list(req: Request, res: Response) {
  const query = transactionQuerySchema.parse(req.query)
  const transactions = await transactionService.listTransactions(query)
  res.json(transactions)
}

export async function summary(req: Request, res: Response) {
  const query = transactionQuerySchema.parse(req.query)
  const result = await transactionService.getSummary(query)
  res.json(result)
}

export async function get(req: Request, res: Response) {
  const { id } = transactionIdParamSchema.parse(req.params)
  const transaction = await transactionService.getTransaction(id)
  if (!transaction) {
    throw new AppError(404, 'Transaction not found')
  }
  res.json(transaction)
}

export async function create(req: Request, res: Response) {
  const input = createTransactionSchema.parse(req.body)
  const transaction = await transactionService.createTransaction(input)
  res.status(201).json(transaction)
}

export async function update(req: Request, res: Response) {
  const { id } = transactionIdParamSchema.parse(req.params)
  const input = updateTransactionSchema.parse(req.body)
  const transaction = await transactionService.updateTransaction(id, input)
  res.json(transaction)
}

export async function remove(req: Request, res: Response) {
  const { id } = transactionIdParamSchema.parse(req.params)
  await transactionService.deleteTransaction(id)
  res.status(204).send()
}
