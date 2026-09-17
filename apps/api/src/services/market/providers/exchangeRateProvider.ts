import { fetchWithTimeout } from '../fetchWithTimeout.js'
import type { MarketDataProvider } from '../types.js'

// open.er-api.com's free endpoint needs no API key. (exchangerate.host, an
// earlier common free choice, now requires one — see
// github.com/shand-j/mytradeportal/issues/158 — so this provider avoids it.)
interface OpenErApiResponse {
  result?: string
  rates?: Record<string, number>
}

export const exchangeRateProvider: MarketDataProvider = {
  async fetchPrice(symbol, baseCurrency) {
    const from = symbol.toUpperCase()
    const to = baseCurrency.toUpperCase()
    const url = `https://open.er-api.com/v6/latest/${encodeURIComponent(from)}`

    const res = await fetchWithTimeout(url)
    const data = (await res.json()) as OpenErApiResponse
    const rate = data.rates?.[to]
    if (typeof rate !== 'number') {
      throw new Error(`No exchange rate from "${from}" to "${to}"`)
    }

    return { price: String(rate), asOf: new Date(), source: 'open.er-api.com' }
  },
}
