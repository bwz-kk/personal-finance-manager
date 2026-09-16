// Types shared between apps/api and apps/web so request/response shapes stay
// in sync without duplication. Enum values must mirror apps/api/prisma/schema.prisma.

export const TRANSACTION_TYPES = ['INCOME', 'EXPENSE'] as const
export type TransactionType = (typeof TRANSACTION_TYPES)[number]

export const ASSET_TYPES = [
  'CDB',
  'TESOURO_DIRETO',
  'STOCK',
  'ETF',
  'CRYPTO',
  'FOREIGN_CURRENCY',
  'OTHER',
] as const
export type AssetType = (typeof ASSET_TYPES)[number]

export const INVESTMENT_TRANSACTION_TYPES = [
  'BUY',
  'SELL',
  'DEPOSIT',
  'WITHDRAWAL',
  'DIVIDEND',
  'INTEREST',
  'OTHER',
] as const
export type InvestmentTransactionType = (typeof INVESTMENT_TRANSACTION_TYPES)[number]

export const WATCHLIST_ASSET_CLASSES = ['CURRENCY', 'CRYPTO', 'STOCK', 'INDICATOR'] as const
export type WatchlistAssetClass = (typeof WATCHLIST_ASSET_CLASSES)[number]

/** Display-only formatting (not a financial calculation) — money math itself
 * lives solely in apps/api/src/domain. */
export function formatMinorUnits(minor: number, currency = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(minor / 100)
}

/** Unit conversion for form inputs (not a financial calculation): a decimal
 * string like "10.5" from a number input to integer minor units (1050). */
export function decimalInputToMinorUnits(value: string): number {
  return Math.round(Number.parseFloat(value) * 100)
}

/** The inverse: integer minor units back to a decimal string for prefilling
 * a form input, e.g. 1050 -> "10.50". */
export function minorUnitsToDecimalInput(minor: number): string {
  return (minor / 100).toFixed(2)
}
