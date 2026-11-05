export function NoteGridSkeleton({ count = 6, viewMode = 'grid' }) {
  return (
    <div
      className={`note-grid${viewMode === 'list' ? ' note-grid--list' : ''}`}
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <div className="note-card note-card--skeleton" key={index}>
          <div className="skeleton skeleton--title" />
          <div className="skeleton skeleton--line" />
          <div className="skeleton skeleton--line skeleton--short" />
        </div>
      ))}
    </div>
  )
}
