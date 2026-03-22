export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' })

  const dynamicUsers = (await redis.get('dynamicUsers')) || []
  const renamedUsers = (await redis.get('renamedUsers')) || {}
  const blockedUsers = (await redis.smembers('blockedUsers')) || []
  const terminatedUsers = (await redis.smembers('terminatedUsers')) || []

  const allUsers = [...USERS, ...dynamicUsers]

  const user = allUsers.find(u => {
    const overrides = renamedUsers[u.username] || {}
    const effectiveUsername = overrides.username || u.username
    const effectivePassword = overrides.password || u.password
    return effectiveUsername.toLowerCase() === username.toLowerCase() && effectivePassword === password
  })

  if (!user) return res.status(401).json({ error: 'Invalid username or password' })

  const overrides = renamedUsers[user.username] || {}
  const effectiveUsername = overrides.username || user.username
  const effectiveName = overrides.name || user.name

  if (terminatedUsers.includes(user.username)) {
    return res.status(403).json({ error: 'TERMINATED' })
  }

  if (blockedUsers.includes(user.username) || user.blocked) {
    return res.status(403).json({ error: 'BLOCKED' })
  }

  const token = Buffer.from(`${user.username}:${user.role}:${Date.now()}`).toString('base64')
  return res.status(200).json({ token, username: effectiveUsername, name: effectiveName, role: user.role })
}
