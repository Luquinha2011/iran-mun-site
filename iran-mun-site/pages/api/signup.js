import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'users.json')

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { username, password, name } = req.body

  if (!username || !password) {
    return res.json({ error: 'Missing fields' })
  }

  const users = JSON.parse(fs.readFileSync(filePath))

  if (users.find(u => u.username === username)) {
    return res.json({ error: 'Username already exists' })
  }

  const newUser = {
    username,
    password,
    name: name || '',
    role: 'basic', // 👈 default
    blocked: false
  }

  users.push(newUser)
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2))

  res.json({ success: true })
}
