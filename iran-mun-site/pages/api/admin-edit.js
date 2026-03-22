// pages/api/admin-edit.js
import { USERS } from './auth'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { token, username, newUsername, newName, newPassword } = req.body

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8')
    const [, adminRole] = decoded.split(':')
    if (adminRole !== 'admin') return res.status(403).json({ error: 'Admin only' })
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }

  if (!username) return res.status(400).json({ error: 'Current username is required' })
  if (!newUsername && !newName && !newPassword) {
    return res.status(400).json({ error: 'Provide at least one field to change' })
  }

  const dynamicUsers = (await redis.get('dynamicUsers')) || []
  const renamedUsers = (await redis.get('renamedUsers')) || {}
  const allUsers = [...USERS, ...dynamicUsers]

  const match = allUsers.find(u => {
    const effective = (renamedUsers[u.username]?.username) || u.username
    return effective.toLowerCase() === username.toLowerCase()
  })

  if (!match) return res.status(404).json({ error: `User "${username}" not found` })

  if (newUsername) {
    const taken = allUsers.find(u => {
      const effective = (renamedUsers[u.username]?.username) || u.username
      return effective.toLowerCase() === newUsername.toLowerCase() &&
             u.username.toLowerCase() !== match.username.toLowerCase()
    })
    if (taken) return res.status(400).json({ error: `Username "${newUsername}" is already taken` })
  }

  const originalKey = match.username
  const dynIndex = dynamicUsers.findIndex(u => u.username === originalKey)

  if (dynIndex !== -1) {
    if (newUsername) dynamicUsers[dynIndex].username = newUsername
    if (newName) dynamicUsers[dynIndex].name = newName
    if (newPassword) dynamicUsers[dynIndex].password = newPassword
    await redis.set('dynamicUsers', dynamicUsers)
    return res.status(200).json({ success: true })
  }

  if (!renamedUsers[originalKey]) renamedUsers[originalKey] = {}
  if (newUsername) renamedUsers[originalKey].username = newUsername
  if (newName) renamedUsers[originalKey].name = newName
  if (newPassword) renamedUsers[originalKey].password = newPassword
  await redis.set('renamedUsers', renamedUsers)

  return res.status(200).json({ success: true })
}
