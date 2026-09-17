import { fetchWithTimeout } from '../fetchWithTimeout.js'
import type { MarketDataProvider } from '../types.js'

// Banco Central do Brasil's open SGS data series — no key required. Series
// codes: https://dadosabertos.bcb.gov.br
const SERIES_CODES: Record<string, number> = {
  SELIC: 11,
  CDI: 12,
  IPCA: 433,
}

interface BcbEntry {
  data: string // "dd/MM/yyyy"
  valor: string
}

function parseBcbDate(ddmmyyyy: string): Date {
  const [day, month, year] = ddmmyyyy.split('/').map(Number)
  return new Date(Date.UTC(year!, month! - 1, day))
}

export const bcbIndicatorProvider: MarketDataProvider = {
  async fetchPrice(symbol) {
    const code = SERIES_CODES[symbol.toUpperCase()]
    if (!code) {
      throw new Error(
        `Unknown economic indicator "${symbol}" — supported: ${Object.keys(SERIES_CODES).join(', ')}`,
      )
    }

    const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${code}/dados/ultimos/1?formato=json`
    const res = await fetchWithTimeout(url)
    const data = (await res.json()) as BcbEntry[]
    const latest = data[0]
    if (!latest?.valor) {
      throw new Error(`BCB has no recent data for "${symbol}"`)
    }

    return { price: latest.valor, asOf: parseBcbDate(latest.data), source: 'bcb.gov.br' }
  },
}
