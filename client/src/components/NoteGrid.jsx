import { NoteCard } from './NoteCard.jsx'

export function NoteGrid({ notes, query, viewMode = 'grid', onView, onEdit, onDelete }) {
  return (
    <div className={`note-grid${viewMode === 'list' ? ' note-grid--list' : ''}`}>
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          query={query}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
