import { Decimal } from 'decimal.js'

/** Sum decimal-string quantities (crypto amounts, fractional shares).
 * Missing/null entries count as zero. Returns a decimal string. */
export function sumQuantities(values: Array<string | null | undefined>): string {
  const total = values.reduce((sum, value) => sum.plus(value ?? '0'), new Decimal(0))
  return total.toString()
}
