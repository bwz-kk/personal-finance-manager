import type { InvestmentTransactionType } from '@pfm/shared'

/** How an InvestmentTransaction type moves cash, if at all. BUY/DEPOSIT take
 * cash out; SELL/WITHDRAWAL/DIVIDEND/INTEREST bring cash in; OTHER is too
 * ambiguous to auto-link. */
export function investmentCashEffect(type: InvestmentTransactionType): 'EXPENSE' | 'INCOME' | null {
  if (type === 'BUY' || type === 'DEPOSIT') return 'EXPENSE'
  if (type === 'SELL' || type === 'WITHDRAWAL' || type === 'DIVIDEND' || type === 'INTEREST') {
    return 'INCOME'
  }
  return null
}
