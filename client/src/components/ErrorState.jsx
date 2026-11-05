import { AlertIcon } from './Icons.jsx'

export function ErrorState({ message, onRetry }) {
  return (
    <section className="state-panel state-panel--error">
      <span className="state-panel__icon">
        <AlertIcon />
      </span>
      <h2 className="state-panel__title">We could not load your notes</h2>
      <p className="state-panel__text">{message}</p>
      <button type="button" className="button button--primary" onClick={onRetry}>
        Try again
      </button>
    </section>
  )
}
