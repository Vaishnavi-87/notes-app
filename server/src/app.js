import fs from 'node:fs'
import path from 'node:path'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { apiRouter } from './routes/index.js'
import { corsOptionsDelegate } from './middleware/cors.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFoundHandler } from './middleware/notFound.js'
import { requestLogger } from './middleware/requestLogger.js'
import { env } from './config/env.js'

export function createApp() {
  const app = express()

  app.set('trust proxy', 1)
  app.disable('x-powered-by')

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:'],
          connectSrc: ["'self'", ...env.clientOrigins],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  )

  app.use(cors(corsOptionsDelegate))
  app.use(express.json({ limit: '100kb' }))
  app.use(requestLogger)

  app.use('/api', apiRouter)

  serveBuiltClient(app)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}

// When the client has been built, the API can serve it as a single app.
function serveBuiltClient(app) {
  const indexFile = path.join(env.clientDist, 'index.html')

  if (!fs.existsSync(indexFile)) return

  app.use(express.static(env.clientDist))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    res.sendFile(indexFile)
  })
}
