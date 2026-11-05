import * as notes from '../db/notesRepository.js'
import { ApiError } from '../utils/ApiError.js'

export function getNotes(req, res) {
  const search = typeof req.query.search === 'string' ? req.query.search : ''
  const result = notes.listNotes(search)

  res.json({ notes: result, count: result.length, total: notes.countNotes() })
}

export function getNoteById(req, res) {
  const note = notes.findNoteById(req.noteId)

  if (!note) {
    throw ApiError.notFound(`Note ${req.noteId} was not found`)
  }

  res.json({ note })
}

export function createNote(req, res) {
  const note = notes.insertNote(req.note)
  res.status(201).json({ note })
}

export function updateNote(req, res) {
  const note = notes.updateNote(req.noteId, req.note)
  res.json({ note })
}

export function deleteNote(req, res) {
  const note = notes.findNoteById(req.noteId)

  if (!note) {
    throw ApiError.notFound(`Note ${req.noteId} was not found`)
  }

  notes.removeNote(req.noteId)
  res.status(204).end()
}
