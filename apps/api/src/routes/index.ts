import { Router } from 'express'
import { budgetRouter } from './budgets.js'
import { categoryRouter } from './categories.js'
import { goalRouter } from './goals.js'
import { investmentRouter } from './investments.js'
import { marketRouter } from './market.js'
import { plannerRouter } from './planner.js'
import { transactionRouter } from './transactions.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { getPortfolio } from '../services/investments/portfolioService.js'

export const router = Router()

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

router.use('/categories', categoryRouter)
router.use('/transactions', transactionRouter)
router.use('/budgets', budgetRouter)
router.use('/investments', investmentRouter)
router.use('/planner', plannerRouter)
router.use('/goals', goalRouter)
router.use('/market', marketRouter)

router.get(
  '/portfolio',
  asyncHandler(async (_req, res) => {
    res.json(await getPortfolio())
  }),
)
