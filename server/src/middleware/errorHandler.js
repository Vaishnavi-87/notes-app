import { env } from '../config/env.js'

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error)
  }

  if (error?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body is not valid JSON' })
  }

  if (error?.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request body is too large' })
  }

  const status = error?.status ?? error?.statusCode ?? 500

  if (status >= 500) {
    console.error(error)
    return res
      .status(500)
      .json({ error: 'Something went wrong while processing the request' })
  }

  const message = error?.message || 'Request could not be processed'

  if (!env.isProduction && status === 403) {
    console.warn(`Rejected request from origin: ${req.headers.origin}`)
  }

  return res.status(status).json({ error: message })
}
