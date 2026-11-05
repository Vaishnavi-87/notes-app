import { createApp } from './app.js'
import { env } from './config/env.js'
import { closeDb, getDb } from './db/connection.js'

getDb()

const app = createApp()

const server = app.listen(env.port, () => {
  console.log(`Notes API listening on http://localhost:${env.port}`)
  console.log(`Health check: http://localhost:${env.port}/api/health`)
})

function shutdown(signal) {
  console.log(`\n${signal} received, shutting down.`)
  server.close(() => {
    closeDb()
    process.exit(0)
  })
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
