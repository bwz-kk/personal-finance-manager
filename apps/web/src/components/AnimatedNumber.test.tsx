import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AnimatedNumber } from './AnimatedNumber'

describe('AnimatedNumber', () => {
  it('renders the correct formatted value immediately on first mount (no count-up from zero)', () => {
    render(<AnimatedNumber valueMinor={150000} />)
    expect(screen.getByText('R$ 1.500,00')).toBeInTheDocument()
  })

  it('formats a negative value correctly on mount', () => {
    render(<AnimatedNumber valueMinor={-500} />)
    expect(screen.getByText('-R$ 5,00')).toBeInTheDocument()
  })

  it('uses the given currency', () => {
    render(<AnimatedNumber valueMinor={150000} currency="USD" />)
    expect(screen.getByText((text) => text.includes('1.500,00'))).toBeInTheDocument()
  })
})
