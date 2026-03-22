// pages/api/admin-create.js
import { USERS } from './auth'

if (!global.dynamicUsers) global.dynamicUsers = []

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { token, username, password, role, name } = req.body

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8')
    const [, adminRole] = decoded.split(':')
    if (adminRole !== 'admin') return res.status(403).json({ error: 'Admin only' })
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }

  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Username, password and role are required' })
  }

  // Check against both hardcoded and dynamic users
  const allUsers = [...USERS, ...global.dynamicUsers]
  if (allUsers.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    return res.status(400).json({ error: `Username "${username}" already exists` })
  }

  global.dynamicUsers.push({
    username,
    password,
    role,
    name: name || username,
    blocked: false,
  })

  return res.status(200).json({ success: true })
}
