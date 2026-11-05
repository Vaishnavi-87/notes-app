const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
).replace(/\/+$/, '')

const REQUEST_TIMEOUT_MS = 10000

export const ApiErrorKind = Object.freeze({
  NETWORK: 'network',
  TIMEOUT: 'timeout',
  VALIDATION: 'validation',
  HTTP: 'http',
  SERVER: 'server',
  UNKNOWN: 'unknown',
})

/**
 * Every failed request is normalised into this error type so the UI can make
 * decisions based on `kind`/`status` instead of inspecting raw fetch errors.
 */
export class ApiError extends Error {
  constructor(message, { status = 0, kind = ApiErrorKind.UNKNOWN, details = null, cause } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.kind = kind
    this.details = details
    if (cause) this.cause = cause
  }

  get isNetworkError() {
    return this.kind === ApiErrorKind.NETWORK || this.kind === ApiErrorKind.TIMEOUT
  }

  get isValidationError() {
    return this.kind === ApiErrorKind.VALIDATION
  }
}

export function toApiError(error) {
  if (error instanceof ApiError) return error

  if (error?.name === 'AbortError') {
    return new ApiError('The server took too long to respond. Please try again.', {
      kind: ApiErrorKind.TIMEOUT,
      cause: error,
    })
  }

  if (error instanceof TypeError) {
    return new ApiError('Cannot reach the server. Make sure the API is running.', {
      kind: ApiErrorKind.NETWORK,
      cause: error,
    })
  }

  return new ApiError(error?.message || 'Something went wrong. Please try again.', {
    kind: ApiErrorKind.UNKNOWN,
    cause: error,
  })
}

async function parseBody(response) {
  const raw = await response.text()
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return { error: raw }
  }
}

export async function request(path, { method = 'GET', body } = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    let response

    try {
      response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      })
    } catch (error) {
      throw toApiError(error)
    }

    const payload = await parseBody(response)

    if (!response.ok) {
      const message =
        payload?.error || `Request failed with status ${response.status}. Please try again.`

      throw new ApiError(message, {
        status: response.status,
        kind: response.status >= 500 ? ApiErrorKind.SERVER : ApiErrorKind.VALIDATION,
        details: payload,
      })
    }

    return payload
  } finally {
    clearTimeout(timeout)
  }
}

function toSearchQuery(search) {
  const term = search.trim()
  return term ? `?search=${encodeURIComponent(term)}` : ''
}

export const notesApi = {
  async list(search = '') {
    const payload = await request(`/notes${toSearchQuery(search)}`)
    const notes = payload?.notes ?? []
    return {
      notes,
      count: payload?.count ?? notes.length,
      total: payload?.total ?? payload?.count ?? notes.length,
    }
  },

  async get(id) {
    const payload = await request(`/notes/${id}`)
    return payload?.note
  },

  async create(values) {
    const payload = await request('/notes', { method: 'POST', body: values })
    return payload?.note
  },

  async update(id, values) {
    const payload = await request(`/notes/${id}`, { method: 'PUT', body: values })
    return payload?.note
  },

  async remove(id) {
    return request(`/notes/${id}`, { method: 'DELETE' })
  },
}
