import type { Request, Response } from 'express'
import {
  createInvestmentTransactionSchema,
  investmentIdOnlyParamSchema,
  investmentTransactionParamsSchema,
} from '../validation/investmentTransaction.js'
import * as investmentTransactionService from '../services/investments/investmentTransactionService.js'

export async function list(req: Request, res: Response) {
  const { id } = investmentIdOnlyParamSchema.parse(req.params)
  const transactions = await investmentTransactionService.listTransactions(id)
  res.json(transactions)
}

export async function create(req: Request, res: Response) {
  const { id } = investmentIdOnlyParamSchema.parse(req.params)
  const input = createInvestmentTransactionSchema.parse(req.body)
  const transaction = await investmentTransactionService.createTransaction(id, input)
  res.status(201).json(transaction)
}

export async function remove(req: Request, res: Response) {
  const { id, transactionId } = investmentTransactionParamsSchema.parse(req.params)
  await investmentTransactionService.deleteTransaction(id, transactionId)
  res.status(204).send()
}
