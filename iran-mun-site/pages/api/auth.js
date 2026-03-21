// pages/api/auth.js

// ─── TEAM MEMBERS ─────────────────────────────────────────────────────────────
// Roles: 'admin' | 'delegate' | 'viewer'
// admin    → full access: read, chatbot, AI briefing, Update All Sections
// delegate → read + chatbot only
// viewer   → read only, no AI features

const USERS = [

  // ── ADMIN ──────────────────────────────────────────────────────────────────
  { username: 'admin',      password: 'iran2026admin',   role: 'admin',    name: 'Admin' },

  // ── DELEGATES ──────────────────────────────────────────────────────────────
  { username: 'delegate1',  password: 'Del@iran01',      role: 'delegate', name: 'Delegate 1' },
  { username: 'delegate2',  password: 'Del@iran02',      role: 'delegate', name: 'Delegate 2' },
  { username: 'delegate3',  password: 'Del@iran03',      role: 'delegate', name: 'Delegate 3' },
  { username: 'delegate4',  password: 'Del@iran04',      role: 'delegate', name: 'Delegate 4' },
  { username: 'delegate5',  password: 'Del@iran05',      role: 'delegate', name: 'Delegate 5' },
  { username: 'delegate6',  password: 'Del@iran06',      role: 'delegate', name: 'Delegate 6' },
  { username: 'delegate7',  password: 'Del@iran07',      role: 'delegate', name: 'Delegate 7' },
  { username: 'delegate8',  password: 'Del@iran08',      role: 'delegate', name: 'Delegate 8' },

  // ── VIEWERS ────────────────────────────────────────────────────────────────
  { username: 'viewer1',    password: 'View@iran01',     role: 'viewer',   name: 'Viewer 1' },
  { username: 'viewer2',    password: 'View@iran02',     role: 'viewer',   name: 'Viewer 2' },
  { username: 'viewer3',    password: 'View@iran03',     role: 'viewer',   name: 'Viewer 3' },
  { username: 'viewer4',    password: 'View@iran04',     role: 'viewer',   name: 'Viewer 4' },

]
// ──────────────────────────────────────────────────────────────────────────────
// TO ADD A USER: copy any line above, change username/password/name, save, commit.
// TO REMOVE A USER: delete their line, save, commit.
// ──────────────────────────────────────────────────────────────────────────────

export { USERS }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' })
  }

  const user = USERS.find(
    u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
  )

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' })
  }

  const token = Buffer.from(`${user.username}:${user.role}:${Date.now()}`).toString('base64')

  return res.status(200).json({
    token,
    username: user.username,
    name: user.name,
    role: user.role,
  })
}
