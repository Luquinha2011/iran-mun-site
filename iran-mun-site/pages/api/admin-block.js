// pages/api/admin-block.js
import { USERS } from './auth'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { token, username, blocked } = req.body

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8')
    const [, role] = decoded.split(':')
    if (role !== 'admin') return res.status(403).json({ error: 'Admin only' })
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }

  // Find the original key for this user — could be a renamed or dynamic user
  const dynamicUsers = (await redis.get('dynamicUsers')) || []
  const renamedUsers = (await redis.get('renamedUsers')) || {}
  const allUsers = [...USERS, ...dynamicUsers]

  // Find by effective (display) username
  const match = allUsers.find(u => {
    const effective = renamedUsers[u.username]?.username || u.username
    return effective.toLowerCase() === username.toLowerCase()
  })

  // Use original key for blocking so admin-users.js can find it
  const originalKey = match ? match.username : username

  if (blocked) {
    await redis.sadd('blockedUsers', originalKey)
  } else {
    await redis.srem('blockedUsers', originalKey)
  }

  return res.status(200).json({ success: true })
}
