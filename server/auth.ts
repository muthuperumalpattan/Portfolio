import { createHmac, randomBytes, timingSafeEqual } from 'crypto'

const SESSION_TTL = 2 * 60 * 60 * 1000 // 2 hours

function getSessionSecret(): string {
  return process.env.SESSION_SECRET || 'dev-only-change-in-production'
}

export function createSession(): string {
  const exp = Date.now() + SESSION_TTL
  const nonce = randomBytes(16).toString('hex')
  const payload = `${exp}.${nonce}`
  const sig = createHmac('sha256', getSessionSecret()).update(payload).digest('hex')
  return `${payload}.${sig}`
}

export function isValidSession(token: string | undefined): boolean {
  if (!token) return false

  const parts = token.split('.')
  if (parts.length !== 3) return false

  const [expStr, nonce, sig] = parts
  const exp = Number(expStr)
  if (!exp || Date.now() > exp) return false

  const payload = `${expStr}.${nonce}`
  const expected = createHmac('sha256', getSessionSecret()).update(payload).digest('hex')

  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  } catch {
    return false
  }
}
