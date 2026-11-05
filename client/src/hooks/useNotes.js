import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { notesApi } from '../services/api.js'
import { useDebounce } from './useDebounce.js'

const SEARCH_DEBOUNCE_MS = 300

// The API returns notes ordered by most recently updated, so the client keeps
// the same ordering while it reconciles optimistic records with the response.
function byRecency(a, b) {
  if (a.updatedAt === b.updatedAt) return Number(b.id) - Number(a.id)
  return a.updatedAt < b.updatedAt ? 1 : -1
}

function createTempId() {
  return `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function useNotes() {
  const [notes, setNotes] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [isFetching, setIsFetching] = useState(false)

  const search = useDebounce(query, SEARCH_DEBOUNCE_MS)
  const requestId = useRef(0)
  const hasLoadedOnce = useRef(false)
  const notesRef = useRef(notes)

  useEffect(() => {
    notesRef.current = notes
  }, [notes])

  const load = useCallback(async (term) => {
    const currentRequest = ++requestId.current

    if (!hasLoadedOnce.current) {
      setStatus('loading')
    }
    setIsFetching(true)

    try {
      const result = await notesApi.list(term)
      if (currentRequest !== requestId.current) return

      setNotes(result.notes)
      setTotalCount(result.total)
      setError(null)
      setStatus('ready')
      hasLoadedOnce.current = true
    } catch (requestError) {
      if (currentRequest !== requestId.current) return

      setError(requestError.message)
      setStatus('error')
      toast.error(requestError.message)
    } finally {
      if (currentRequest === requestId.current) setIsFetching(false)
    }
  }, [])

  useEffect(() => {
    load(search)
  }, [load, search])

  const createNote = useCallback(
    async (values) => {
      const tempId = createTempId()
      const now = new Date().toISOString()
      const optimisticNote = {
        id: tempId,
        title: values.title,
        content: values.content,
        createdAt: now,
        updatedAt: now,
        isPending: true,
      }

      setNotes((current) => [optimisticNote, ...current].sort(byRecency))

      try {
        const created = await notesApi.create(values)

        setNotes((current) =>
          current.map((note) => (note.id === tempId ? created : note)).sort(byRecency),
        )

        toast.success('Note created')

        // Re-read the list so the server's ordering, counts and filter results
        // replace the optimistic view.
        await load(search)
        return created
      } catch (requestError) {
        setNotes((current) => current.filter((note) => note.id !== tempId))
        toast.error(requestError.message)
        throw requestError
      }
    },
    [load, search],
  )

  const updateNote = useCallback(
    async (id, values) => {
      const previous = notesRef.current.find((note) => note.id === id)
      const optimisticUpdatedAt = new Date().toISOString()

      setNotes((current) =>
        current
          .map((note) =>
            note.id === id
              ? { ...note, ...values, updatedAt: optimisticUpdatedAt, isPending: true }
              : note,
          )
          .sort(byRecency),
      )

      try {
        const updated = await notesApi.update(id, values)

        setNotes((current) =>
          current.map((note) => (note.id === id ? updated : note)).sort(byRecency),
        )

        toast.success('Note updated')
        await load(search)
        return updated
      } catch (requestError) {
        if (previous) {
          setNotes((current) =>
            current.map((note) => (note.id === id ? previous : note)).sort(byRecency),
          )
        }
        toast.error(requestError.message)
        throw requestError
      }
    },
    [load, search],
  )

  const deleteNote = useCallback(
    async (id) => {
      const previous = notesRef.current.find((note) => note.id === id)

      setNotes((current) => current.filter((note) => note.id !== id))

      try {
        await notesApi.remove(id)

        toast.success('Note deleted')
        await load(search)
      } catch (requestError) {
        if (previous) {
          setNotes((current) =>
            [...current.filter((note) => note.id !== id), previous].sort(byRecency),
          )
        }
        toast.error(requestError.message)
        throw requestError
      }
    },
    [load, search],
  )

  const refresh = useCallback(() => load(search), [load, search])

  return {
    notes,
    totalCount,
    status,
    error,
    query,
    setQuery,
    isSearching: search.trim().length > 0,
    isFetching,
    isSearchPending: query.trim() !== search.trim(),
    createNote,
    updateNote,
    deleteNote,
    refresh,
  }
}
