import { Router } from 'express'
import { budgetRouter } from './budgets.js'
import { categoryRouter } from './categories.js'
import { transactionRouter } from './transactions.js'

export const router = Router()

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

router.use('/categories', categoryRouter)
router.use('/transactions', transactionRouter)
router.use('/budgets', budgetRouter)
