import crypto from 'crypto'

// Mark this module as server-only since it uses Node.js crypto module
// This prevents it from being imported in edge middleware
declare const __TURBOPACK_EDGE__: boolean | undefined

export const CREDENTIALS = {
  username: 'powerade',
  password: 'Mundial2026!',
}

export const SESSION_COOKIE_NAME = 'powerade_session'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

const AUTH_SECRET = process.env.AUTH_SECRET ?? 'powerade-mundial-2026-secret-key-32c'

export function signSession(username: string): string {
  const ts = Date.now().toString()
  const hmac = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(username + ts)
    .digest('hex')
  return `${username}:${ts}:${hmac}`
}

export function verifySession(token: string): { username: string } | null {
  try {
    const parts = token.split(':')
    if (parts.length !== 3) return null

    const [username, ts, sig] = parts
    if (!username || !ts || !sig) return null

    const expected = crypto
      .createHmac('sha256', AUTH_SECRET)
      .update(username + ts)
      .digest('hex')

    if (sig !== expected) return null

    return { username }
  } catch {
    return null
  }
}
