// pages/api/verify.js
// Verifies a session token is still valid

import { USERS } from './auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { token } = req.body
  if (!token) return res.status(401).json({ error: 'No token' })

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8')
    const [username, role, timestamp] = decoded.split(':')

    // Token expires after 24 hours
    const age = Date.now() - parseInt(timestamp)
    if (age > 24 * 60 * 60 * 1000) {
      return res.status(401).json({ error: 'Session expired' })
    }

    const user = USERS.find(u => u.username === username && u.role === role)
    if (!user) return res.status(401).json({ error: 'Invalid token' })

    return res.status(200).json({
      username: user.username,
      name: user.name,
      role: user.role,
    })
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
