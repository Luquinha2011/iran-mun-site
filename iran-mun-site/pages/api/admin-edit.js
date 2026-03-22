// pages/api/admin-edit.js
if (!global.renamedUsers) global.renamedUsers = {}
if (!global.dynamicUsers) global.dynamicUsers = []

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

  if (!username) return res.status(400).json({ error: 'Username is required' })

  // Check if it's a dynamic user — edit in place
  const dynUser = global.dynamicUsers.find(u => u.username.toLowerCase() === username.toLowerCase())
  if (dynUser) {
    if (newUsername) dynUser.username = newUsername
    if (newName) dynUser.name = newName
    if (newPassword) dynUser.password = newPassword
    return res.status(200).json({ success: true })
  }

  // Otherwise store overrides for hardcoded users
  if (!global.renamedUsers[username]) global.renamedUsers[username] = {}
  if (newUsername) global.renamedUsers[username].username = newUsername
  if (newName) global.renamedUsers[username].name = newName
  if (newPassword) global.renamedUsers[username].password = newPassword

  return res.status(200).json({ success: true })
}
