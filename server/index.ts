import 'dotenv/config'
import { app } from './app.ts'
import { closeDb, ensureDb } from './db.ts'
import { logMailConfigStatus } from './mail.ts'

const PORT = Number(process.env.PORT) || 3001

async function start() {
  try {
    await ensureDb()
    console.log('Neon PostgreSQL connected')
    logMailConfigStatus()
  } catch (err) {
    console.error('Failed to connect to Neon PostgreSQL:', err)
    process.exit(1)
  }

  const server = app.listen(PORT, () => {
    console.log(`API server running at http://localhost:${PORT}`)
  })

  const shutdown = async () => {
    server.close()
    await closeDb()
    process.exit(0)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

start()
