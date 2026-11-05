import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'

const LOCALHOST_ORIGIN = /^http:\/\/localhost(:\d+)?$/
const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']

function isSameOrigin(req, origin) {
  if (!req.headers.host) return false

  try {
    return new URL(origin).host === req.headers.host
  } catch {
    return false
  }
}

function isAllowedOrigin(req, origin) {
  if (env.clientOrigins.includes(origin)) return true

  // The API can serve the built client itself, and browsers attach an Origin
  // header to those asset requests because they are loaded with `crossorigin`.
  if (isSameOrigin(req, origin)) return true

  return !env.isProduction && LOCALHOST_ORIGIN.test(origin)
}

// `cors` calls this delegate with the request, which is what lets the policy
// take the host into account instead of only a static list of origins.
export function corsOptionsDelegate(req, callback) {
  const origin = req.headers.origin
  const options = {
    methods: ALLOWED_METHODS,
    allowedHeaders: ['Content-Type'],
    maxAge: 600,
  }

  if (!origin) {
    return callback(null, { ...options, origin: true })
  }

  if (!isAllowedOrigin(req, origin)) {
    return callback(new ApiError('Origin is not allowed by the CORS policy', 403))
  }

  return callback(null, { ...options, origin })
}
