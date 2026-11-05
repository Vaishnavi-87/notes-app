import { NoteIcon, PlusIcon } from './Icons.jsx'

export function EmptyState({ onCreate }) {
  return (
    <section className="state-panel">
      <span className="state-panel__icon">
        <NoteIcon />
      </span>
      <h2 className="state-panel__title">No notes yet</h2>
      <p className="state-panel__text">
        Nothing has been written down so far. Create your first note to start collecting ideas,
        links and reminders.
      </p>
      <button type="button" className="button button--primary" onClick={onCreate}>
        <PlusIcon />
        Create your first note
      </button>
    </section>
  )
}
