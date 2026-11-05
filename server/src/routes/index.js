import { Router } from 'express'
import { notesRouter } from './notes.routes.js'
import { countNotes } from '../db/notesRepository.js'

export const apiRouter = Router()

apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', notes: countNotes(), uptime: process.uptime() })
})

apiRouter.use('/notes', notesRouter)
