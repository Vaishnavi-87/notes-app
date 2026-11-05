import { Router } from 'express'
import {
  createNote,
  deleteNote,
  getNoteById,
  getNotes,
  updateNote,
} from '../controllers/notesController.js'
import { parseNoteId, validateNote } from '../middleware/validateNote.js'

export const notesRouter = Router()

notesRouter.get('/', getNotes)
notesRouter.post('/', validateNote, createNote)
notesRouter.get('/:id', parseNoteId, getNoteById)
notesRouter.put('/:id', parseNoteId, validateNote, updateNote)
notesRouter.delete('/:id', parseNoteId, deleteNote)
