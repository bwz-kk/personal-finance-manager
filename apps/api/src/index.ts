import 'dotenv/config'
import { createApp } from './app.js'
import { env } from './config/env.js'

const app = createApp()

// Bound to localhost only — this app has no auth and is never meant to be
// reachable from the network. See SECURITY.md.
app.listen(env.PORT, env.HOST, () => {
  console.log(`API listening on http://${env.HOST}:${env.PORT}`)
})
