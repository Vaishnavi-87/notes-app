import { getDb } from './connection.js'
import { env } from '../config/env.js'
import { countNotes } from './notesRepository.js'

const db = getDb()

console.log(`Database ready at ${env.databaseFile}`)
console.log(`Schema applied: notes (${countNotes()} rows)`)
db.close()
