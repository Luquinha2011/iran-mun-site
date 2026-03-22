// pages/api/admin-users.js
// Returns all users — admin only

import { USERS } from './auth'

// In-memory block list (resets on server restart — for persistence use a DB)
// We use a global variable to share state across requests
if (!global.blockedUsers) global.blockedUsers = new Set()

export { }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { token } = req.body

  // Verify admin token
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8')
    const [username, role] = decoded.split(':')
    if (role !== 'admin') return res.status(403).json({ error: 'Admin only' })
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }

  const users = USERS.map(u => ({
    username: u.username,
    name: u.name,
    role: u.role,
    blocked: global.blockedUsers.has(u.username) || u.blocked,
  }))

  return res.status(200).json({ users })
}
