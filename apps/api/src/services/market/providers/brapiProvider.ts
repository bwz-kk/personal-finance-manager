import { fetchWithTimeout } from '../fetchWithTimeout.js'
import type { MarketDataProvider } from '../types.js'

// brapi.dev's free, no-token tier covers a handful of common B3 tickers
// without limits and rate-limits others — see brapi.dev/faq. International
// stocks aren't covered by this provider; that's a documented limitation,
// not an oversight (see SPEC.md's Market section).
interface BrapiResponse {
  results?: { regularMarketPrice?: number }[]
}

export const brapiProvider: MarketDataProvider = {
  async fetchPrice(symbol) {
    const ticker = symbol.toUpperCase()
    const url = `https://brapi.dev/api/quote/${encodeURIComponent(ticker)}`

    const res = await fetchWithTimeout(url)
    const data = (await res.json()) as BrapiResponse
    const price = data.results?.[0]?.regularMarketPrice
    if (typeof price !== 'number') {
      throw new Error(`brapi.dev has no price for "${ticker}"`)
    }

    return { price: String(price), asOf: new Date(), source: 'brapi.dev' }
  },
}
