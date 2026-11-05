import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const serverRoot = path.resolve(currentDir, '..', '..')

function toPositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export const env = {
  port: toPositiveInt(process.env.PORT, 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  clientOrigins: (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  databaseFile: process.env.DATABASE_FILE
    ? path.resolve(serverRoot, process.env.DATABASE_FILE)
    : path.resolve(serverRoot, 'data', 'notes.db'),
  clientDist: path.resolve(serverRoot, '..', 'client', 'dist'),
}
