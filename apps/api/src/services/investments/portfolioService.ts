import { calculatePortfolio } from '../../domain/portfolioCalculator.js'
import { listInvestments } from './investmentService.js'

export async function getPortfolio() {
  const investments = await listInvestments()
  const groups = calculatePortfolio(
    investments.map((i) => ({
      id: i.id,
      name: i.name,
      currency: i.currency,
      totalInvestedMinor: i.totalInvestedMinor,
      currentValueMinor: i.currentValueMinor ?? 0,
    })),
  )
  return { groups, investments }
}
