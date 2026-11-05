import fs from 'node:fs'
import { env } from '../config/env.js'

// Removes the SQLite file (including WAL sidecars) so the next db:init run
// starts from a clean database.
for (const suffix of ['', '-wal', '-shm']) {
  const file = `${env.databaseFile}${suffix}`
  if (fs.existsSync(file)) {
    fs.rmSync(file)
    console.log(`Removed ${file}`)
  }
}

console.log('Database reset. Run "npm run db:init" to recreate the schema.')
