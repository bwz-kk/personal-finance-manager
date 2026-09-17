import { useEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * Focuses the first focusable element on mount, restores focus to whatever
 * was focused before on unmount, and calls onDismiss on Escape. Assumes the
 * caller only mounts this while the dialog is open (conditional render).
 */
export function useDialogA11y<T extends HTMLElement>(onDismiss: () => void) {
  const panelRef = useRef<T>(null)
  const onDismissRef = useRef(onDismiss)
  onDismissRef.current = onDismiss

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onDismissRef.current()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [])

  return panelRef
}
