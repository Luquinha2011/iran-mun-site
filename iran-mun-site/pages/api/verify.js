// pages/api/verify.js
import { USERS } from './auth'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { token } = req.body
  if (!token) return res.status(401).json({ error: 'No token' })

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8')
    const [username, role, timestamp] = decoded.split(':')

    const age = Date.now() - parseInt(timestamp)
    if (age > 24 * 60 * 60 * 1000) return res.status(401).json({ error: 'Session expired' })

    // Load dynamic users and renames from Redis
    const dynamicUsers = (await redis.get('dynamicUsers')) || []
    const renamedUsers = (await redis.get('renamedUsers')) || {}
    const blockedUsers = (await redis.smembers('blockedUsers')) || []

    const allUsers = [...USERS, ...dynamicUsers]

    // Find user by original username (as stored in token)
    const user = allUsers.find(u => u.username === username && u.role === role)
    if (!user) return res.status(401).json({ error: 'Invalid token' })

    // Check Redis block list using original username
    if (blockedUsers.includes(username) || user.blocked) {
      return res.status(403).json({ error: 'Account blocked' })
    }

    // Return effective (possibly renamed) display info
    const overrides = renamedUsers[username] || {}
    return res.status(200).json({
      username: overrides.username || user.username,
      name: overrides.name || user.name,
      role: user.role
    })
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
