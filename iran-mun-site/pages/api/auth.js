// pages/api/auth.js
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

// ─── ROLES ───────────────────────────────────────────────────────────────────
// admin   → everything + admin panel (block/unblock accounts)
// plus    → Iran + China pages + AI briefing + chatbot
// basic   → Iran + China pages — read only, no AI features
// ─────────────────────────────────────────────────────────────────────────────

const USERS = [
  { username: 'admin',    password: 'MunAdmin2026!',  role: 'admin',  name: 'Admin',      blocked: false },
]

export { USERS }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' })

  const dynamicUsers = (await redis.get('dynamicUsers')) || []
  const renamedUsers = (await redis.get('renamedUsers')) || {}
  const blockedUsers = (await redis.smembers('blockedUsers')) || []

  const allUsers = [...USERS, ...dynamicUsers]

  const user = allUsers.find(u => {
    const overrides = renamedUsers[u.username] || {}
    const effectiveUsername = overrides.username || u.username
    const effectivePassword = overrides.password || u.password
    return effectiveUsername.toLowerCase() === username.toLowerCase() && effectivePassword === password
  })

  if (!user) return res.status(401).json({ error: 'Invalid username or password' })

  const overrides = renamedUsers[user.username] || {}
  const effectiveUsername = overrides.username || user.username
  const effectiveName = overrides.name || user.name
  const isBlocked = blockedUsers.includes(user.username) || user.blocked

  if (isBlocked) return res.status(403).json({ error: 'This account has been blocked. Contact your administrator.' })

  const token = Buffer.from(`${user.username}:${user.role}:${Date.now()}`).toString('base64')
  return res.status(200).json({ token, username: effectiveUsername, name: effectiveName, role: user.role })
}
