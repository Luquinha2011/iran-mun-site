// pages/api/admin-users.js
import { USERS } from './auth'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { token } = req.body

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8')
    const [, role] = decoded.split(':')
    if (role !== 'admin') return res.status(403).json({ error: 'Admin only' })
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }

  const dynamicUsers = (await redis.get('dynamicUsers')) || []
  const renamedUsers = (await redis.get('renamedUsers')) || {}
  const blockedUsers = (await redis.smembers('blockedUsers')) || []

  const allUsers = [...USERS, ...dynamicUsers]

  const users = allUsers.map(u => {
    const overrides = renamedUsers[u.username] || {}
    return {
      username: overrides.username || u.username,
      name: overrides.name || u.name,
      role: u.role,
      blocked: blockedUsers.includes(u.username) || u.blocked,
    }
  })

  return res.status(200).json({ users })
}
