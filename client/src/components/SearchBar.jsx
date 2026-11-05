import { CloseIcon, SearchIcon } from './Icons.jsx'

export function SearchBar({ value, onChange, resultCount, totalCount, isSearching, isSearchPending }) {
  const term = value.trim()
  const total = Math.max(totalCount, resultCount)
  const label = isSearching
    ? `${resultCount} of ${total} notes`
    : `${total} ${total === 1 ? 'note' : 'notes'}`

  return (
    <div className="search-bar">
      <label className="visually-hidden" htmlFor="note-search">
        Search notes by title or content
      </label>

      <div className="search-bar__field">
        <SearchIcon className="search-bar__icon" />
        <input
          id="note-search"
          className="search-bar__input"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search titles and content…"
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            className="search-bar__clear"
            onClick={() => onChange('')}
            aria-label="Clear search"
            title="Clear search"
          >
            <CloseIcon />
          </button>
        )}
      </div>

      <p className="search-bar__status" role="status" aria-live="polite">
        {isSearchPending ? 'Searching…' : label}
        {isSearching && term && !isSearchPending ? ` for “${term}”` : ''}
      </p>
    </div>
  )
}
