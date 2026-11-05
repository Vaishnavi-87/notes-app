export class ApiError extends Error {
  constructor(message, status = 500) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }

  static badRequest(message) {
    return new ApiError(message, 400)
  }

  static notFound(message) {
    return new ApiError(message, 404)
  }
}
