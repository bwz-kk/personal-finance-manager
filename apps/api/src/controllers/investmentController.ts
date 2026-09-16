import type { Request, Response } from 'express'
import {
  createInvestmentSchema,
  investmentIdParamSchema,
  updateInvestmentSchema,
} from '../validation/investment.js'
import * as investmentService from '../services/investments/investmentService.js'

export async function list(_req: Request, res: Response) {
  const investments = await investmentService.listInvestments()
  res.json(investments)
}

export async function get(req: Request, res: Response) {
  const { id } = investmentIdParamSchema.parse(req.params)
  const investment = await investmentService.getInvestment(id)
  res.json(investment)
}

export async function create(req: Request, res: Response) {
  const input = createInvestmentSchema.parse(req.body)
  const investment = await investmentService.createInvestment(input)
  res.status(201).json(investment)
}

export async function update(req: Request, res: Response) {
  const { id } = investmentIdParamSchema.parse(req.params)
  const input = updateInvestmentSchema.parse(req.body)
  const investment = await investmentService.updateInvestment(id, input)
  res.json(investment)
}

export async function remove(req: Request, res: Response) {
  const { id } = investmentIdParamSchema.parse(req.params)
  await investmentService.deleteInvestment(id)
  res.status(204).send()
}
