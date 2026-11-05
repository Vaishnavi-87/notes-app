import { SearchIcon } from './Icons.jsx'

export function NoResults({ query, onClear }) {
  return (
    <section className="state-panel">
      <span className="state-panel__icon">
        <SearchIcon width="28" height="28" />
      </span>
      <h2 className="state-panel__title">No results</h2>
      <p className="state-panel__text">
        Nothing matches “{query.trim()}”. Try a different word or search the note content instead.
      </p>
      <button type="button" className="button button--ghost" onClick={onClear}>
        Clear search
      </button>
    </section>
  )
}
