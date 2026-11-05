import { useState } from 'react'
import { useNotes } from './hooks/useNotes.js'
import { Header } from './components/Header.jsx'
import { SearchBar } from './components/SearchBar.jsx'
import { ViewToggle } from './components/ViewToggle.jsx'
import { NoteGrid } from './components/NoteGrid.jsx'
import { NoteGridSkeleton } from './components/NoteGridSkeleton.jsx'
import { NoteModal } from './components/NoteModal.jsx'
import { NoteViewModal } from './components/NoteViewModal.jsx'
import { ConfirmDialog } from './components/ConfirmDialog.jsx'
import { EmptyState } from './components/EmptyState.jsx'
import { NoResults } from './components/NoResults.jsx'
import { ErrorState } from './components/ErrorState.jsx'
import { ErrorBanner } from './components/ErrorBanner.jsx'

const VIEW_STORAGE_KEY = 'notes:view-mode'

function readStoredViewMode() {
  try {
    const stored = window.localStorage.getItem(VIEW_STORAGE_KEY)
    return stored === 'list' ? 'list' : 'grid'
  } catch {
    return 'grid'
  }
}

export default function App() {
  const {
    notes,
    totalCount,
    status,
    error,
    query,
    setQuery,
    isSearching,
    isFetching,
    isSearchPending,
    createNote,
    updateNote,
    deleteNote,
    refresh,
  } = useNotes()

  const [formState, setFormState] = useState(null)
  const [noteToDelete, setNoteToDelete] = useState(null)
  const [viewNoteId, setViewNoteId] = useState(null)
  const [viewMode, setViewMode] = useState(readStoredViewMode)

  const hasNotes = notes.length > 0
  const hasQuery = query.trim().length > 0
  const isInitialLoad = status === 'loading'
  const isBlockingError = status === 'error' && !hasNotes
  const viewNote = viewNoteId ? notes.find((note) => note.id === viewNoteId) : null

  function handleViewModeChange(mode) {
    setViewMode(mode)
    try {
      window.localStorage.setItem(VIEW_STORAGE_KEY, mode)
    } catch {
      // Layout preference is a nice-to-have; failing to persist it is harmless.
    }
  }

  function openCreateModal() {
    setFormState({ mode: 'create', note: null })
  }

  function openEditModal(note) {
    setViewNoteId(null)
    setFormState({ mode: 'edit', note })
  }

  function requestDelete(note) {
    setViewNoteId(null)
    setNoteToDelete(note)
  }

  async function handleFormSubmit(values) {
    if (formState.mode === 'edit') {
      await updateNote(formState.note.id, values)
    } else {
      await createNote(values)
    }
    setFormState(null)
  }

  async function handleConfirmDelete() {
    await deleteNote(noteToDelete.id)
    setNoteToDelete(null)
  }

  return (
    <div className="app">
      <Header onCreate={openCreateModal} />

      <main className="app__main">
        <div className="app__toolbar">
          <SearchBar
            value={query}
            onChange={setQuery}
            resultCount={notes.length}
            totalCount={totalCount}
            isSearching={isSearching}
            isSearchPending={isSearchPending}
          />
          <ViewToggle view={viewMode} onChange={handleViewModeChange} />
        </div>

        {status === 'error' && hasNotes && <ErrorBanner message={error} onRetry={refresh} />}

        {isInitialLoad && <NoteGridSkeleton viewMode={viewMode} />}

        {isBlockingError && <ErrorState message={error} onRetry={refresh} />}

        {status === 'ready' && !hasNotes && hasQuery && !isFetching && !isSearchPending && (
          <NoResults query={query} onClear={() => setQuery('')} />
        )}

        {status === 'ready' && !hasNotes && !hasQuery && !isFetching && !isSearchPending && (
          <EmptyState onCreate={openCreateModal} />
        )}

        {hasNotes && (
          <NoteGrid
            notes={notes}
            query={query}
            viewMode={viewMode}
            onView={(note) => setViewNoteId(note.id)}
            onEdit={openEditModal}
            onDelete={requestDelete}
          />
        )}
      </main>

      <footer className="app__footer">
        <p>Notes — built with React, Express and SQLite.</p>
      </footer>

      {formState && (
        <NoteModal
          note={formState.note}
          onSubmit={handleFormSubmit}
          onClose={() => setFormState(null)}
        />
      )}

      {viewNote && (
        <NoteViewModal
          note={viewNote}
          onEdit={openEditModal}
          onDelete={requestDelete}
          onClose={() => setViewNoteId(null)}
        />
      )}

      {noteToDelete && (
        <ConfirmDialog
          title="Delete note"
          message={`“${noteToDelete.title}” will be removed permanently. This cannot be undone.`}
          confirmLabel="Delete note"
          onConfirm={handleConfirmDelete}
          onCancel={() => setNoteToDelete(null)}
        />
      )}
    </div>
  )
}
