import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'
import { env } from '../config/env.js'
import { readSchema } from './schema.js'

let instance = null

export function getDb() {
  if (instance) return instance

  fs.mkdirSync(path.dirname(env.databaseFile), { recursive: true })
  instance = new Database(env.databaseFile)
  instance.pragma('journal_mode = WAL')
  instance.pragma('foreign_keys = ON')
  applySchema(instance)
  return instance
}

function applySchema(database) {
  database.exec(readSchema())
}

export function closeDb() {
  if (!instance) return
  instance.close()
  instance = null
}
