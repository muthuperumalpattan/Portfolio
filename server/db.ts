import pg from 'pg'
import { existsSync, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { defaultPortfolio } from './defaults.ts'
import type { PortfolioData } from '../src/types/portfolio.ts'

const { Pool } = pg

let pool: pg.Pool | null = null
let initPromise: Promise<void> | null = null

function getPool(): pg.Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    })
  }

  return pool
}

function loadLegacyPortfolio(): PortfolioData | null {
  const legacyPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'portfolio.json')
  if (!existsSync(legacyPath)) return null

  try {
    return JSON.parse(readFileSync(legacyPath, 'utf-8')) as PortfolioData
  } catch {
    console.warn('Could not read legacy data/portfolio.json')
    return null
  }
}

async function initDb(): Promise<void> {
  const client = await getPool().connect()

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS portfolio (
        id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)

    const existing = await client.query<{ data: PortfolioData }>(
      'SELECT data FROM portfolio WHERE id = 1',
    )

    if (existing.rowCount === 0) {
      const seed = loadLegacyPortfolio() ?? defaultPortfolio
      await client.query('INSERT INTO portfolio (id, data) VALUES (1, $1::jsonb)', [
        JSON.stringify(seed),
      ])
      console.log('Seeded Neon database with portfolio data')
    }
  } finally {
    client.release()
  }
}

export function ensureDb(): Promise<void> {
  if (!initPromise) {
    initPromise = initDb()
  }
  return initPromise
}

export async function getPortfolio(): Promise<PortfolioData> {
  await ensureDb()

  const result = await getPool().query<{ data: PortfolioData }>(
    'SELECT data FROM portfolio WHERE id = 1',
  )

  if (result.rowCount === 0) {
    return defaultPortfolio
  }

  return result.rows[0].data
}

export async function savePortfolio(data: PortfolioData): Promise<PortfolioData> {
  await ensureDb()

  await getPool().query(
    `INSERT INTO portfolio (id, data, updated_at)
     VALUES (1, $1::jsonb, NOW())
     ON CONFLICT (id)
     DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
    [JSON.stringify(data)],
  )

  return data
}

export async function closeDb(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
    initPromise = null
  }
}

export interface ContactMessageInput {
  name: string
  email: string
  message: string
}

export async function saveContactMessage(input: ContactMessageInput): Promise<void> {
  await ensureDb()

  await getPool().query(
    `INSERT INTO contact_messages (name, email, message, created_at)
     VALUES ($1, $2, $3, NOW())`,
    [input.name, input.email, input.message],
  )
}
