import { PlusIcon } from './Icons.jsx'

export function Header({ onCreate }) {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="app-header__brand">
          <span className="app-header__mark" aria-hidden="true">
            N
          </span>
          <div>
            <h1 className="app-header__title">Notes</h1>
            <p className="app-header__subtitle">Everything you jot down, in one place.</p>
          </div>
        </div>

        <button type="button" className="button button--primary" onClick={onCreate}>
          <PlusIcon />
          <span className="button__label">New note</span>
        </button>
      </div>
    </header>
  )
}
