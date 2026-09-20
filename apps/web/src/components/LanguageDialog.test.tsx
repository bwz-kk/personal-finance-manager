import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { LanguageProvider } from '../i18n/LanguageContext'
import { LanguageDialog } from './LanguageDialog'

function renderDialog() {
  render(
    <LanguageProvider>
      <LanguageDialog />
    </LanguageProvider>,
  )
}

describe('LanguageDialog', () => {
  it('shows the current language on the trigger', () => {
    renderDialog()
    expect(screen.getByRole('button', { name: /english/i })).toBeInTheDocument()
  })

  it('opens a dialog listing both languages', async () => {
    renderDialog()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /english/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /português \(br\)/i })).toBeInTheDocument()
  })

  it('switches language and closes on selecting a row', async () => {
    renderDialog()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /english/i }))
    await user.click(screen.getByRole('button', { name: /português \(br\)/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /português \(br\)/i })).toBeInTheDocument()
  })
})
