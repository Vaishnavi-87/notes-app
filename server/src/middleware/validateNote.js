import { ApiError } from '../utils/ApiError.js'

export const TITLE_MAX_LENGTH = 100
export const CONTENT_MAX_LENGTH = 20000

export function validateNote(req, res, next) {
  const body = req.body ?? {}

  if (typeof body !== 'object' || Array.isArray(body)) {
    return next(ApiError.badRequest('Request body must be a JSON object'))
  }

  if (typeof body.title !== 'string') {
    return next(ApiError.badRequest('Title is required'))
  }

  const title = body.title.trim()

  if (title.length === 0) {
    return next(ApiError.badRequest('Title is required'))
  }

  if (title.length > TITLE_MAX_LENGTH) {
    return next(
      ApiError.badRequest(`Title must be ${TITLE_MAX_LENGTH} characters or fewer`),
    )
  }

  if (typeof body.content !== 'string') {
    return next(ApiError.badRequest('Content is required'))
  }

  const content = body.content.trim()

  if (content.length === 0) {
    return next(ApiError.badRequest('Content is required'))
  }

  if (content.length > CONTENT_MAX_LENGTH) {
    return next(
      ApiError.badRequest(`Content must be ${CONTENT_MAX_LENGTH} characters or fewer`),
    )
  }

  req.note = { title, content }
  return next()
}

export function parseNoteId(req, res, next) {
  const rawId = String(req.params.id ?? '')

  if (!/^\d+$/.test(rawId)) {
    return next(ApiError.badRequest('Note id must be a positive integer'))
  }

  const id = Number.parseInt(rawId, 10)

  if (!Number.isSafeInteger(id) || id < 1) {
    return next(ApiError.badRequest('Note id must be a positive integer'))
  }

  req.noteId = id
  return next()
}
