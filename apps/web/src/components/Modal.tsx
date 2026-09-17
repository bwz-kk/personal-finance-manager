import type { ReactNode } from 'react'
import { useDialogA11y } from '../hooks/useDialogA11y'
import styles from './Modal.module.css'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ title, onClose, children }: ModalProps) {
  const panelRef = useDialogA11y<HTMLDivElement>(onClose)
  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title">{title}</h2>
        {children}
      </div>
    </div>
  )
}
