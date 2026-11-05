import { GridIcon, ListIcon } from './Icons.jsx'

const VIEWS = [
  { value: 'grid', label: 'Grid view', Icon: GridIcon },
  { value: 'list', label: 'List view', Icon: ListIcon },
]

export function ViewToggle({ view, onChange }) {
  return (
    <div className="view-toggle" role="group" aria-label="Note layout">
      {VIEWS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          className="view-toggle__button"
          onClick={() => onChange(value)}
          aria-pressed={view === value}
          aria-label={label}
          title={label}
        >
          <Icon />
        </button>
      ))}
    </div>
  )
}
