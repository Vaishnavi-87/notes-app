import { AlertIcon } from './Icons.jsx'

export function ErrorBanner({ message, onRetry }) {
  return (
    <div className="error-banner" role="alert">
      <AlertIcon width="20" height="20" />
      <p className="error-banner__text">{message}</p>
      <button type="button" className="button button--ghost button--compact" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}
