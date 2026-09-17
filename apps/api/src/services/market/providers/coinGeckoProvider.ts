import { fetchWithTimeout } from '../fetchWithTimeout.js'
import type { MarketDataProvider } from '../types.js'

// CoinGecko's price endpoint needs the coin's id (e.g. "bitcoin"), not its
// ticker (e.g. "BTC"). This maps the common tickers a user would type as a
// watchlist symbol; an unmapped symbol falls back to its lowercased form,
// which works if the user enters the CoinGecko id directly (e.g. "solana").
const TICKER_TO_ID: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  USDT: 'tether',
  USDC: 'usd-coin',
  BNB: 'binancecoin',
  SOL: 'solana',
  ADA: 'cardano',
  DOGE: 'dogecoin',
  XRP: 'ripple',
}

interface CoinGeckoResponse {
  [id: string]: { [currency: string]: number }
}

export const coinGeckoProvider: MarketDataProvider = {
  async fetchPrice(symbol, baseCurrency) {
    const id = TICKER_TO_ID[symbol.toUpperCase()] ?? symbol.toLowerCase()
    const vsCurrency = baseCurrency.toLowerCase()
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(id)}&vs_currencies=${encodeURIComponent(vsCurrency)}`

    const res = await fetchWithTimeout(url)
    const data = (await res.json()) as CoinGeckoResponse
    const price = data[id]?.[vsCurrency]
    if (typeof price !== 'number') {
      throw new Error(`CoinGecko has no price for "${id}" in "${vsCurrency}"`)
    }

    return { price: String(price), asOf: new Date(), source: 'coingecko' }
  },
}
