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
    fontFamily: "'Source Sans 3', sans-serif",
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

  const toggleBlock = async (username, blocked) => {
    try {
      const token = localStorage.getItem('mun_token')
      const res = await fetch('/api/admin-block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, username, blocked: !blocked })
      })
      const data = await res.json()
      if (data.success) fetchUsers()
    } catch {}
  }

  const deleteUser = async (username) => {
    if (!confirm(`Delete "${username}"?`)) return
    try {
      const token = localStorage.getItem('mun_token')
      const res = await fetch('/api/admin-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, username })
      })
      const data = await res.json()
      if (data.success) fetchUsers()
    } catch {}
  }

  const filteredUsers = users.filter(u => {
    if (filter !== 'all' && u.role !== filter) return false
    if (search && !u.username.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const s = {
    page: { minHeight: '100vh', background: '#0a1628', color: 'white', fontFamily: 'sans-serif' },
    header: { background: '#003a6b', padding: 20, display: 'flex', justifyContent: 'space-between' },
    content: { padding: 20, maxWidth: 1000, margin: '0 auto' },
    card: { background: '#111', padding: 20, borderRadius: 8, marginBottom: 20 },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: 10, borderBottom: '1px solid #333' },
    td: { padding: 10, borderBottom: '1px solid #222' },
    btn: { padding: '5px 10px', cursor: 'pointer', borderRadius: 4, border: 'none' }
  }

  if (!user || user.role !== 'admin') return null

  return (
    <>
      <Head><title>Admin Panel</title></Head>

      <div style={s.page}>
        {BADGE}

        <div style={s.header}>
          <h2>Admin Panel</h2>
          <button onClick={logout}>Sign Out</button>
        </div>

        <div style={s.content}>

          <div style={s.card}>
            <h3>Users ({filteredUsers.length})</h3>

            <input
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ marginBottom: 10 }}
            />

            <div>
              {['all', 'admin', 'plus', 'basic'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ marginRight: 5 }}>
                  {f}
                </button>
              ))}
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Username</th>
                    <th style={s.th}>Role</th>
                    <th style={s.th}>Status</th>
                    <th style={s.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.username}>
                      <td style={s.td}>{u.username}</td>
                      <td style={s.td}>{u.role}</td>
                      <td style={s.td}>{u.blocked ? 'Blocked' : 'Active'}</td>
                      <td style={s.td}>
                        <button onClick={() => toggleBlock(u.username, u.blocked)} style={s.btn}>
                          {u.blocked ? 'Unblock' : 'Block'}
                        </button>
                        <button onClick={() => deleteUser(u.username)} style={{ ...s.btn, marginLeft: 5 }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          </div>

        </div>
      </div>
    </>
  )
}
