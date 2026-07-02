import express from 'express'
import cors from 'cors'
import { ensureDb, getPortfolio, saveContactMessage, savePortfolio } from './db.ts'
import { logMailConfigStatus } from './mail.ts'
import { createSession, isValidSession } from './auth.ts'
import type { PortfolioData } from '../src/types/portfolio.ts'

const EDIT_USERNAME = process.env.EDIT_USERNAME || 'DhanalakshmiMuthuPerumal'

let startupLogged = false

export function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json({ limit: '1mb' }))

  app.use(async (_req, _res, next) => {
    try {
      await ensureDb()
      if (!startupLogged) {
        logMailConfigStatus()
        startupLogged = true
      }
      next()
    } catch (err) {
      next(err)
    }
  })

  app.use((err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (res.headersSent) {
      next(err)
      return
    }

    const message = err instanceof Error ? err.message : 'Internal server error'
    console.error('API error:', err)

    if (message.includes('DATABASE_URL')) {
      res.status(503).json({
        success: false,
        message: 'Server is missing DATABASE_URL. Add environment variables in Netlify.',
      })
      return
    }

    res.status(500).json({ success: false, message })
  })

  app.get('/api/health', async (_req, res) => {
    res.json({ status: 'ok', database: 'connected' })
  })

  app.get('/api/portfolio', async (_req, res) => {
    try {
      const data = await getPortfolio()
      res.json({ success: true, data })
    } catch (err) {
      console.error('GET /api/portfolio error:', err)
      res.status(500).json({ success: false, message: 'Failed to load portfolio' })
    }
  })

  app.post('/api/auth/verify', (req, res) => {
    const { username } = req.body as { username?: string }

    if (!username || username.trim() !== EDIT_USERNAME) {
      return res.status(401).json({ success: false, message: 'You are not able to edit' })
    }

    const token = createSession()
    res.json({ success: true, token })
  })

  app.put('/api/portfolio', async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const { data } = req.body as { data?: PortfolioData }

    if (!isValidSession(token)) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Please verify again.' })
    }

    if (!data) {
      return res.status(400).json({ success: false, message: 'Portfolio data is required' })
    }

    try {
      const saved = await savePortfolio(data)
      res.json({ success: true, data: saved })
    } catch (err) {
      console.error('PUT /api/portfolio error:', err)
      res.status(500).json({ success: false, message: 'Failed to save portfolio' })
    }
  })

  app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body as {
      name?: string
      email?: string
      message?: string
    }

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: 'Name, email, and message are required' })
    }

    const normalized = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalized.email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address' })
    }

    try {
      await saveContactMessage(normalized)

      try {
        const { sendContactEmail } = await import('./mail.ts')
        await sendContactEmail(normalized)
      } catch (emailErr) {
        const emailMessage =
          emailErr instanceof Error
            ? emailErr.message
            : 'Email could not be sent. Check SMTP settings in .env.'
        console.error('Contact email failed (message saved to database):', emailErr)
        return res.status(500).json({
          success: false,
          message: emailMessage,
        })
      }

      res.json({
        success: true,
        message: `Your message was sent successfully. A thank you email was sent to ${normalized.email}. Please check inbox and spam folder.`,
      })
    } catch (err) {
      console.error('POST /api/contact error:', err)
      res.status(500).json({ success: false, message: 'Failed to send your message' })
    }
  })

  return app
}

export const app = createApp()
