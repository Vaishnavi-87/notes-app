import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const schemaPath = path.join(currentDir, 'schema.sql')

let cachedSchema = null

export function readSchema() {
  if (cachedSchema === null) {
    cachedSchema = fs.readFileSync(schemaPath, 'utf8')
  }
  return cachedSchema
}
