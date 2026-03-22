// pages/api/admin-delete.js
import { USERS } from './auth'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { token, username } = req.body

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8')
    const [, adminRole] = decoded.split(':')
    if (adminRole !== 'admin') return res.status(403).json({ error: 'Admin only' })
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }

  if (username === 'admin') {
    return res.status(403).json({ error: 'Cannot delete the main admin account' })
  }

  const isHardcoded = USERS.find(u => u.username === username)
  if (isHardcoded) {
    return res.status(403).json({ error: 'Cannot delete hardcoded accounts — use block instead' })
  }

  const dynamicUsers = (await redis.get('dynamicUsers')) || []
  const filtered = dynamicUsers.filter(u => u.username !== username)
  await redis.set('dynamicUsers', filtered)

  return res.status(200).json({ success: true })
}
