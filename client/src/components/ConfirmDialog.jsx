import { useState } from 'react'
import { Modal } from './Modal.jsx'

export function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }) {
  const [isWorking, setIsWorking] = useState(false)

  async function handleConfirm() {
    setIsWorking(true)
    try {
      await onConfirm()
    } catch {
      // The error is surfaced as a toast; keep the dialog open so the user
      // can decide whether to retry.
    } finally {
      setIsWorking(false)
    }
  }

  return (
    <Modal
      title={title}
      onClose={isWorking ? () => {} : onCancel}
      size="small"
      footer={
        <>
          <button type="button" className="button button--ghost" onClick={onCancel} disabled={isWorking}>
            Cancel
          </button>
          <button
            type="button"
            className="button button--danger"
            onClick={handleConfirm}
            disabled={isWorking}
            data-modal-initial-focus
          >
            {isWorking ? 'Deleting…' : confirmLabel}
          </button>
        </>
      }
    >
      <p className="confirm__message">{message}</p>
    </Modal>
  )
}
