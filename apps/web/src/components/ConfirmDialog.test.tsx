import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { LanguageProvider } from '../i18n/LanguageContext'
import { ConfirmDialog } from './ConfirmDialog'

function renderDialog(onConfirm = vi.fn(), onCancel = vi.fn()) {
  render(
    <LanguageProvider>
      <ConfirmDialog
        title="Delete item"
        message="Are you sure?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </LanguageProvider>,
  )
  return { onConfirm, onCancel }
}

describe('ConfirmDialog', () => {
  it('autofocuses the Cancel button on open', () => {
    renderDialog()
    expect(screen.getByText('Cancel')).toHaveFocus()
  })

  it('calls onCancel on Escape', async () => {
    const { onCancel } = renderDialog()
    const user = userEvent.setup()
    await user.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onConfirm when the destructive button is clicked', async () => {
    const { onConfirm } = renderDialog()
    const user = userEvent.setup()
    await user.click(screen.getByText('Delete'))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('traps Tab: forward from the last button wraps to the first', async () => {
    renderDialog()
    const user = userEvent.setup()
    screen.getByText('Delete').focus()
    await user.tab()
    expect(screen.getByText('Cancel')).toHaveFocus()
  })

  it('traps Tab: shift+Tab from the first button wraps to the last', async () => {
    renderDialog()
    const user = userEvent.setup()
    expect(screen.getByText('Cancel')).toHaveFocus()
    await user.tab({ shift: true })
    expect(screen.getByText('Delete')).toHaveFocus()
  })
})
