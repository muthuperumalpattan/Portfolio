import type { PortfolioData } from '../types/portfolio'

const API_BASE = '/api'

export async function fetchPortfolio(): Promise<PortfolioData> {
  const res = await fetch(`${API_BASE}/portfolio`)
  if (!res.ok) throw new Error('Failed to fetch portfolio')
  const json = await res.json()
  return json.data as PortfolioData
}

export async function verifyUsername(username: string): Promise<string> {
  const res = await fetch(`${API_BASE}/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  })

  const json = await res.json()

  if (!res.ok || !json.success) {
    throw new Error(json.message || 'You are not able to edit')
  }

  return json.token as string
}

export async function savePortfolio(data: PortfolioData, token: string): Promise<PortfolioData> {
  const res = await fetch(`${API_BASE}/portfolio`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data }),
  })

  const json = await res.json()

  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to save portfolio')
  }

  return json.data as PortfolioData
}

export interface ContactFormPayload {
  name: string
  email: string
  message: string
}

export async function submitContactMessage(payload: ContactFormPayload): Promise<string> {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const json = await res.json()

  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to send your message')
  }

  return (json.message as string) || 'Message sent successfully'
}
