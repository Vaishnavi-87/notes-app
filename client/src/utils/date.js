const RELATIVE_STEPS = [
  { limit: 3600, divisor: 60, unit: 'minute' },
  { limit: 86400, divisor: 3600, unit: 'hour' },
  { limit: 604800, divisor: 86400, unit: 'day' },
  { limit: 2629800, divisor: 604800, unit: 'week' },
]

export function formatRelativeTime(isoString) {
  const timestamp = new Date(isoString).getTime()
  if (Number.isNaN(timestamp)) return ''

  const seconds = Math.round((Date.now() - timestamp) / 1000)
  if (seconds < 45) return 'just now'

  for (const step of RELATIVE_STEPS) {
    if (seconds < step.limit) {
      const amount = Math.floor(seconds / step.divisor)
      return `${amount} ${step.unit}${amount === 1 ? '' : 's'} ago`
    }
  }

  return formatDate(isoString)
}

export function formatDate(isoString) {
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(isoString) {
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}
