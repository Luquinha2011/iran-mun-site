// pages/api/admin-users.js
import { USERS } from './auth'

if (!global.blockedUsers) global.blockedUsers = new Set()
if (!global.dynamicUsers) global.dynamicUsers = []
if (!global.renamedUsers) global.renamedUsers = {}

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

  // Combine hardcoded + dynamically created users
  const allUsers = [...USERS, ...global.dynamicUsers]

  const users = allUsers.map(u => {
    // Apply any renames/edits stored in global.renamedUsers
    const overrides = global.renamedUsers[u.username] || {}
    return {
      username: overrides.username || u.username,
      name: overrides.name || u.name,
      role: u.role,
      blocked: global.blockedUsers.has(u.username) || u.blocked,
    }
  })

  return res.status(200).json({ users })
}
