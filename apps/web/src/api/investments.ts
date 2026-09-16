import type { AssetType, InvestmentTransactionType } from '@pfm/shared'
import { api } from './client'

export interface Investment {
  id: string
  name: string
  assetType: AssetType
  institution: string | null
  currency: string
  purchaseDate: string | null
  currentValueMinor: number | null
  watchlistSymbol: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  totalInvestedMinor: number
  quantity: string
  absoluteReturnMinor: number
  percentageReturn: number
}

export interface InvestmentDetail extends Investment {
  transactions: InvestmentTransaction[]
}

export interface InvestmentTransaction {
  id: string
  investmentId: string
  type: InvestmentTransactionType
  amountMinor: number
  quantity: string | null
  pricePerUnitMinor: number | null
  date: string
  notes: string | null
  createdAt: string
}

export interface InvestmentInput {
  name: string
  assetType: AssetType
  institution?: string
  currency: string
  currentValueMinor?: number
  notes?: string
}

export interface InvestmentTransactionInput {
  type: InvestmentTransactionType
  amountMinor: number
  quantity?: string
  date: string
  notes?: string
}

export interface PortfolioGroup {
  currency: string
  totalInvestedMinor: number
  currentValueMinor: number
  absoluteReturnMinor: number
  percentageReturn: number
  allocation: {
    investmentId: string
    name: string
    currentValueMinor: number
    allocationPct: number
  }[]
}

export interface Portfolio {
  groups: PortfolioGroup[]
  investments: Investment[]
}

export const investmentsApi = {
  list: () => api.get<Investment[]>('/investments'),
  get: (id: string) => api.get<InvestmentDetail>(`/investments/${id}`),
  create: (input: InvestmentInput) => api.post<Investment>('/investments', input),
  update: (id: string, input: Partial<InvestmentInput>) =>
    api.patch<Investment>(`/investments/${id}`, input),
  remove: (id: string) => api.delete(`/investments/${id}`),
  addTransaction: (investmentId: string, input: InvestmentTransactionInput) =>
    api.post<InvestmentTransaction>(`/investments/${investmentId}/transactions`, input),
  removeTransaction: (investmentId: string, transactionId: string) =>
    api.delete(`/investments/${investmentId}/transactions/${transactionId}`),
  portfolio: () => api.get<Portfolio>('/portfolio'),
}
