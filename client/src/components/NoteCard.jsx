import { formatDate, formatRelativeTime } from '../utils/date.js'
import { HighlightedText } from './HighlightedText.jsx'
import { PencilIcon, TrashIcon } from './Icons.jsx'

const PREVIEW_LENGTH = 180
const PREVIEW_CONTEXT = 60

function buildPreview(content, query) {
  const text = String(content ?? '').trim()
  if (!text) return ''

  const term = query.trim()
  const matchIndex = term ? text.toLowerCase().indexOf(term.toLowerCase()) : -1

  if (matchIndex === -1) {
    return text.length > PREVIEW_LENGTH
      ? `${text.slice(0, PREVIEW_LENGTH).trimEnd()}…`
      : text
  }

  // Keep the first matching phrase inside the preview so content matches are
  // visible (and highlighted) even when they are far into a long note.
  let start = Math.max(0, matchIndex - PREVIEW_CONTEXT)
  let end = Math.min(text.length, start + PREVIEW_LENGTH)

  if (end - start < PREVIEW_LENGTH) {
    start = Math.max(0, end - PREVIEW_LENGTH)
  }

  return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`
}

export function NoteCard({ note, query, onView, onEdit, onDelete }) {
  const text = String(note.content ?? '').trim()
  const preview = buildPreview(text, query)

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onView(note)
    }
  }

  function stopPropagation(event) {
    event.stopPropagation()
  }

  return (
    <article
      className={`note-card${note.isPending ? ' note-card--pending' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={`View note: ${note.title}`}
      onClick={() => onView(note)}
      onKeyDown={handleKeyDown}
    >
      <header className="note-card__header">
        <h3 className="note-card__title">
          <HighlightedText text={note.title} query={query} />
        </h3>
        <time
          className="note-card__timestamp"
          dateTime={note.updatedAt}
          title={`Updated ${formatDate(note.updatedAt)}`}
        >
          {formatRelativeTime(note.updatedAt)}
        </time>
      </header>

      <p className={`note-card__preview${text ? '' : ' note-card__preview--empty'}`}>
        {preview ? (
          <HighlightedText text={preview} query={query} />
        ) : (
          'No additional details.'
        )}
      </p>

      <footer
        className="note-card__footer"
        onClick={stopPropagation}
        onKeyDown={stopPropagation}
      >
        <span className="note-card__created">Created {formatDate(note.createdAt)}</span>
        <div className="note-card__actions">
          <button
            type="button"
            className="button button--ghost button--compact"
            onClick={() => onEdit(note)}
          >
            <PencilIcon />
            Edit
          </button>
          <button
            type="button"
            className="button button--ghost button--compact button--danger-ghost"
            onClick={() => onDelete(note)}
          >
            <TrashIcon />
            Delete
          </button>
        </div>
      </footer>
    </article>
  )
}
