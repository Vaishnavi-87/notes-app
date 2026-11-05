import { useEffect, useId, useRef } from 'react'
import { CloseIcon } from './Icons.jsx'

export function Modal({ title, description, onClose, children, footer, size = 'medium' }) {
  const titleId = useId()
  const panelRef = useRef(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onCloseRef.current()
    }

    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    const panel = panelRef.current
    if (!panel || panel.contains(document.activeElement)) return

    const target =
      panel.querySelector('[data-modal-initial-focus]') ??
      panel.querySelector('input, textarea, select, button')
    target?.focus()
  }, [])

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <div className="modal-backdrop" onMouseDown={handleBackdropClick}>
      <div
        className={`modal modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={panelRef}
      >
        <header className="modal__header">
          <h2 className="modal__title" id={titleId}>
            {title}
          </h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close dialog">
            <CloseIcon />
          </button>
        </header>

        {description && <p className="modal__description">{description}</p>}

        <div className="modal__body">{children}</div>

        {footer && <footer className="modal__footer">{footer}</footer>}
      </div>
    </div>
  )
}
