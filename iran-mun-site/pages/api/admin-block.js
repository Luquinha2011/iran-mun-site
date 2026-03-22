// pages/api/admin-block.js
// Block or unblock a user — admin only

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { token, username, blocked } = req.body

  // Verify admin token
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8')
    const [, role] = decoded.split(':')
    if (role !== 'admin') return res.status(403).json({ error: 'Admin only' })
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }

  if (!username) return res.status(400).json({ error: 'Username required' })

  // Initialise global block list if needed
  if (!global.blockedUsers) global.blockedUsers = new Set()

  if (blocked) {
    global.blockedUsers.add(username)
  } else {
    global.blockedUsers.delete(username)
  }

  return res.status(200).json({ success: true, username, blocked })
}
