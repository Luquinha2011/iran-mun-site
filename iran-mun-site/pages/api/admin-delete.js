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

  if (username === 'admin' || username === 'luquinha') {
    return res.status(403).json({ error: 'Cannot delete the main admin account' })
  }

  const dynamicUsers = (await redis.get('dynamicUsers')) || []
  const renamedUsers = (await redis.get('renamedUsers')) || {}

  // Find by effective (display) username — search dynamic users first
  const dynMatch = dynamicUsers.find(u => {
    const effective = renamedUsers[u.username]?.username || u.username
    return effective.toLowerCase() === username.toLowerCase()
  })

  // If not found in dynamic users, check if it's a hardcoded user being blocked instead
  if (!dynMatch) {
    const hardcodedMatch = USERS.find(u => {
      const effective = renamedUsers[u.username]?.username || u.username
      return effective.toLowerCase() === username.toLowerCase()
    })
    if (hardcodedMatch) {
      return res.status(403).json({ error: 'Hardcoded accounts cannot be deleted — use Block instead' })
    }
    return res.status(404).json({ error: `User "${username}" not found` })
  }

  const originalKey = dynMatch.username

  // Remove from dynamic users
  const filtered = dynamicUsers.filter(u => u.username !== originalKey)
  await redis.set('dynamicUsers', filtered)

  // Clean up renames and blocks
  if (renamedUsers[originalKey]) {
    delete renamedUsers[originalKey]
    await redis.set('renamedUsers', renamedUsers)
  }
  await redis.srem('blockedUsers', originalKey)

  return res.status(200).json({ success: true })
}
