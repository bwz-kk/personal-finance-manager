import { Decimal } from 'decimal.js'

/** Convert a decimal amount (e.g. 10.5) to integer minor units (1050). */
export function toMinorUnits(amount: number | string): number {
  return new Decimal(amount).times(100).round().toNumber()
}

/** Convert integer minor units (1050) back to a decimal amount (10.5). */
export function fromMinorUnits(minor: number): number {
  return new Decimal(minor).dividedBy(100).toNumber()
}

export function sumMinor(values: number[]): number {
  return values.reduce((total, value) => total + value, 0)
}
