import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Modal } from './Modal'

function Harness() {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open</button>
      {open && (
        <Modal title="Test modal" onClose={() => setOpen(false)}>
          <input aria-label="First field" />
          <button>Second field</button>
        </Modal>
      )}
    </div>
  )
}

describe('Modal', () => {
  it('focuses the first focusable element on open', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByText('Open'))
    expect(screen.getByLabelText('First field')).toHaveFocus()
  })

  it('closes on Escape', async () => {
    const onClose = vi.fn()
    render(
      <Modal title="Test modal" onClose={onClose}>
        <input aria-label="Field" />
      </Modal>,
    )
    const user = userEvent.setup()
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('restores focus to the trigger after closing', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const openButton = screen.getByText('Open')
    await user.click(openButton)
    await user.keyboard('{Escape}')
    expect(openButton).toHaveFocus()
  })
})
