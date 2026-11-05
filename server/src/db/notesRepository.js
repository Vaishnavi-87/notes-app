import { getDb } from './connection.js'
import { ApiError } from '../utils/ApiError.js'

const COLUMNS = 'id, title, content, created_at, updated_at'

function toNote(row) {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// LIKE wildcards typed by the user must be escaped, otherwise "%" would match
// every note instead of searching for a literal percent sign.
function toLikePattern(term) {
  const escaped = term.replace(/[\\%_]/g, (character) => `\\${character}`)
  return `%${escaped}%`
}

export function listNotes(search = '') {
  const db = getDb()
  const term = search.trim()

  if (!term) {
    const rows = db
      .prepare(`SELECT ${COLUMNS} FROM notes ORDER BY updated_at DESC, id DESC`)
      .all()
    return rows.map(toNote)
  }

  const pattern = toLikePattern(term)
  const rows = db
    .prepare(
      `SELECT ${COLUMNS}
         FROM notes
        WHERE (title COLLATE NOCASE LIKE @pattern ESCAPE '\\')
           OR (content COLLATE NOCASE LIKE @pattern ESCAPE '\\')
        ORDER BY updated_at DESC, id DESC`,
    )
    .all({ pattern })
  return rows.map(toNote)
}

export function findNoteById(id) {
  const db = getDb()
  const row = db.prepare(`SELECT ${COLUMNS} FROM notes WHERE id = ?`).get(id)
  return row ? toNote(row) : null
}

export function insertNote({ title, content }) {
  const db = getDb()
  const now = new Date().toISOString()

  const result = db
    .prepare(
      `INSERT INTO notes (title, content, created_at, updated_at)
       VALUES (@title, @content, @now, @now)`,
    )
    .run({ title, content, now })

  return findNoteById(result.lastInsertRowid)
}

export function updateNote(id, { title, content }) {
  const db = getDb()
  const now = new Date().toISOString()

  const result = db
    .prepare(
      `UPDATE notes
          SET title = @title, content = @content, updated_at = @now
        WHERE id = @id`,
    )
    .run({ id, title, content, now })

  if (result.changes === 0) {
    throw ApiError.notFound(`Note ${id} was not found`)
  }

  return findNoteById(id)
}

export function removeNote(id) {
  const db = getDb()
  const result = db.prepare('DELETE FROM notes WHERE id = ?').run(id)

  if (result.changes === 0) {
    throw ApiError.notFound(`Note ${id} was not found`)
  }
}

export function countNotes() {
  const db = getDb()
  return db.prepare('SELECT COUNT(*) AS total FROM notes').get().total
}
