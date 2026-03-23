import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { token, username, newUsername, newName, newPassword } = req.body

  // ─── BASIC VALIDATION ─────────────────────────────────────
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!username) {
    return res.status(400).json({ error: 'Current username is required' })
  }

  // ─── LOAD EXISTING DATA ───────────────────────────────────
  try {
    const renamedUsers = (await redis.get('renamedUsers')) || {}

    // Existing override (if any)
    const existing = renamedUsers[username] || {}

    // ─── BUILD UPDATED OBJECT ───────────────────────────────
    const updatedUser = {
      ...existing,
    }

    if (newUsername && newUsername.trim() !== '') {
      updatedUser.username = newUsername.trim()
    }

    if (newName && newName.trim() !== '') {
      updatedUser.name = newName.trim()
    }

    if (newPassword && newPassword.trim() !== '') {
      updatedUser.password = newPassword.trim()
    }

    // If nothing was changed
    if (Object.keys(updatedUser).length === 0) {
      return res.status(400).json({ error: 'No changes provided' })
    }

    // ─── SAVE BACK TO REDIS ─────────────────────────────────
    renamedUsers[username] = updatedUser

    await redis.set('renamedUsers', renamedUsers)

    // ─── SUCCESS ────────────────────────────────────────────
    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      updated: updatedUser,
    })

  } catch (error) {
    console.error('ADMIN EDIT ERROR:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
