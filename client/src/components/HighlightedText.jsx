function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function HighlightedText({ text, query, className }) {
  const value = String(text ?? '')
  const term = query.trim()

  if (!term) {
    return <span className={className}>{value}</span>
  }

  const matcher = new RegExp(`(${escapeRegExp(term)})`, 'gi')
  const parts = value.split(matcher)

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.toLowerCase() === term.toLowerCase() ? (
          <mark className="note-highlight" key={`${part}-${index}`}>
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </span>
  )
}
