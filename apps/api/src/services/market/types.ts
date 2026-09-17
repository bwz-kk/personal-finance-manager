/** Every concrete provider implements this. Nothing outside services/market
 * knows which external API backs a given asset class — see
 * docs/ARCHITECTURE.md's "Market data isolation" section. */
export interface MarketPrice {
  price: string // decimal string
  asOf: Date
  source: string
}

export interface MarketDataProvider {
  fetchPrice(symbol: string, baseCurrency: string): Promise<MarketPrice>
}
