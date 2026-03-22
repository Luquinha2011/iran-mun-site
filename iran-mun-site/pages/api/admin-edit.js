// pages/api/admin-edit.js
import { USERS } from './auth'

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

  if (!username) return res.status(400).json({ error: 'Current username is required' })
  if (!newUsername && !newName && !newPassword) {
    return res.status(400).json({ error: 'Provide at least one field to change' })
  }

  // Check if the new username is already taken
  if (newUsername) {
    const allUsers = [...USERS, ...global.dynamicUsers]
    const taken = allUsers.find(u => {
      const effective = (global.renamedUsers[u.username]?.username) || u.username
      return effective.toLowerCase() === newUsername.toLowerCase() && u.username.toLowerCase() !== username.toLowerCase()
    })
    if (taken) return res.status(400).json({ error: `Username "${newUsername}" is already taken` })
  }

  // Find the original username key — needed because the table shows the display name
  // The user might type the *current display name* which may already be a renamed value
  // So we search both original and overridden usernames
  const allUsers = [...USERS, ...global.dynamicUsers]

  // Try to find by current effective username (post-rename)
  const match = allUsers.find(u => {
    const effective = (global.renamedUsers[u.username]?.username) || u.username
    return effective.toLowerCase() === username.toLowerCase()
  })

  if (!match) return res.status(404).json({ error: `User "${username}" not found` })

  const originalKey = match.username

  // If it's a dynamic user, edit in place directly
  const dynIndex = global.dynamicUsers.findIndex(u => u.username === originalKey)
  if (dynIndex !== -1) {
    if (newUsername) global.dynamicUsers[dynIndex].username = newUsername
    if (newName) global.dynamicUsers[dynIndex].name = newName
    if (newPassword) global.dynamicUsers[dynIndex].password = newPassword
    return res.status(200).json({ success: true })
  }

  // For hardcoded users, store overrides
  if (!global.renamedUsers[originalKey]) global.renamedUsers[originalKey] = {}
  if (newUsername) global.renamedUsers[originalKey].username = newUsername
  if (newName) global.renamedUsers[originalKey].name = newName
  if (newPassword) global.renamedUsers[originalKey].password = newPassword

  return res.status(200).json({ success: true })
}
