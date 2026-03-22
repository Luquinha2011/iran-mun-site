// pages/admin.js — Admin Panel (admin role only)
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

const BADGE = (
  <div style={{
    position: 'fixed', top: 10, left: 10, zIndex: 9999,
    background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600,
    padding: '4px 10px', borderRadius: 20,
    fontFamily: "'Source Sans 3', sans-serif", letterSpacing: 0.5,
    pointerEvents: 'none',
  }}>✦ Made by Luquinha</div>
)

export default function AdminPanel({ user, logout }) {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionStatus, setActionStatus] = useState('')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [createForm, setCreateForm] = useState({ username: '', password: '', role: 'basic', name: '' })
  const [editForm, setEditForm] = useState({ username: '', newUsername: '', newName: '', newPassword: '' })

  useEffect(() => {
    if (!user) return
    if (user.role !== 'admin') { router.push('/'); return }
    fetchUsers()
  }, [user])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('mun_token')
      const res = await fetch('/api/admin-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      const data = await res.json()
      if (data.users) setUsers(data.users)
    } catch {
      setActionStatus('Failed to load users.')
    } finally {
      setLoading(false)
    }
  }

  const toggleBlock = async (username, currentlyBlocked) => {
    setActionStatus(`${currentlyBlocked ? 'Unblocking' : 'Blocking'} ${username}...`)
    try {
      const token = localStorage.getItem('mun_token')
      const res = await fetch('/api/admin-block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, username, blocked: !currentlyBlocked })
      })
      const data = await res.json()
      if (data.success) {
        setUsers(prev =>
          prev.map(u =>
            u.username === username ? { ...u, blocked: !currentlyBlocked } : u
          )
        )
        setActionStatus(`${username} has been ${!currentlyBlocked ? 'blocked' : 'unblocked'}.`)
      } else {
        setActionStatus(data.error || 'Action failed.')
      }
    } catch {
      setActionStatus('Request failed.')
    }
  }

  const deleteUser = async (username) => {
    if (!confirm(`Are you sure you want to delete "${username}"? This cannot be undone.`)) return
    setActionStatus(`Deleting ${username}...`)
    try {
      const token = localStorage.getItem('mun_token')
      const res = await fetch('/api/admin-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, username })
      })
      const data = await res.json()
      if (data.success) {
        setActionStatus(`✅ "${username}" deleted successfully.`)
        fetchUsers()
      } else {
        setActionStatus('❌ ' + (data.error || 'Failed to delete.'))
      }
    } catch {
      setActionStatus('❌ Request failed.')
    }
  }

  const ROLE_COLORS = { admin: '#c9a84c', plus: '#009EDB', basic: '#555' }
  const ROLE_LABELS = { admin: 'Admin', plus: 'Plus', basic: 'Basic' }

  const filteredUsers = users.filter(u => {
    if (filter !== 'all' && u.role !== filter) return false
    if (
      search &&
      !u.username.toLowerCase().includes(search.toLowerCase()) &&
      !u.name.toLowerCase().includes(search.toLowerCase())
    ) return false
    return true
  })

  const stats = {
    total: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    plus: users.filter(u => u.role === 'plus').length,
    basic: users.filter(u => u.role === 'basic').length,
    blocked: users.filter(u => u.blocked).length,
  }

  const s = {
    page: { minHeight: '100vh', background: '#0a1628', fontFamily: "'Source Sans 3', sans-serif", color: 'white' },
    header: { background: 'linear-gradient(135deg, #003a6b, #005f8e)', padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)' },
    title: { fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900 },
    content: { maxWidth: 1100, margin: '0 auto', padding: '28px 24px' },
    card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 20, marginBottom: 20 },
    statCard: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 16, textAlign: 'center' },
    label: { fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 },
    value: { fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: '#009EDB' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
    th: { padding: '10px 14px', textAlign: 'left', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.08)' },
    td: { padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' },
    input: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', padding: '8px 14px', borderRadius: 6, fontSize: 13, outline: 'none', fontFamily: "'Source Sans 3', sans-serif" },
    filterBtn: (active) => ({ background: active ? '#009EDB' : 'rgba(255,255,255,0.06)', border: '1px solid ' + (active ? '#009EDB' : 'rgba(255,255,255,0.12)'), color: active ? 'white' : 'rgba(255,255,255,0.5)', padding: '6px 14px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 600 }),
    blockBtn: (blocked) => ({ background: blocked ? 'rgba(39,174,96,0.15)' : 'rgba(192,57,43,0.15)', border: '1px solid ' + (blocked ? 'rgba(39,174,96,0.4)' : 'rgba(192,57,43,0.4)'), color: blocked ? '#2ecc71' : '#e74c3c', padding: '5px 14px', borderRadius: 5, fontSize: 12, cursor: 'pointer', fontWeight: 700 }),
    deleteBtn: { background: 'rgba(192,57,43,0.2)', border: '1px solid rgba(192,57,43,0.4)', color: '#e74c3c', padding: '5px 14px', borderRadius: 5, fontSize: 12, cursor: 'pointer', fontWeight: 700 },
    sectionTitle: { fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 14 },
    fieldLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 },
  }

  if (!user || user.role !== 'admin') return null

  return (
    <>
      <Head><title>Admin Panel — MUN Toolkit</title></Head>
      <div style={s.page}>
        {BADGE}
        <div style={s.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 28 }}>🇺🇳</span>
            <div>
              <div style={s.title}>MUN Toolkit — Admin Panel</div>
            </div>
          </div>
          <button onClick={logout}>Sign Out</button>
        </div>

        <div style={s.content}>
          <div>Total Users: {stats.total}</div>

          {filteredUsers.map(u => (
            <div key={u.username}>
              {u.username} — {u.role}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
