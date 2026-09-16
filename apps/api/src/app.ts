import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import { router } from './routes/index.js'

export function createApp() {
  const app = express()

  app.use(cors({ origin: env.CORS_ORIGIN }))
  app.use(express.json({ limit: '100kb' }))
  app.use('/api', router)
  app.use(errorHandler)

  return app
}
