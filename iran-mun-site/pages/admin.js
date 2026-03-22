// pages/admin.js — Admin Panel
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

const BADGE = (
  <div style={{ position: 'fixed', top: 10, left: 10, zIndex: 9999, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, fontFamily: "'Source Sans 3', sans-serif", letterSpacing: 0.5, pointerEvents: 'none' }}>✦ Made by Luquinha</div>
)

const PROTECTED_ADMIN = 'luquinha'

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
      const res = await fetch('/api/admin-users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) })
      const data = await res.json()
      if (data.users) setUsers(data.users)
    } catch { setActionStatus('❌ Failed to load users.') }
    finally { setLoading(false) }
  }

  const toggleBlock = async (username, currentlyBlocked) => {
    if (username === PROTECTED_ADMIN) { setActionStatus('❌ Cannot modify main admin'); return }
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
        setActionStatus(`✅ ${username} has been ${!currentlyBlocked ? 'blocked' : 'unblocked'}.`)
        fetchUsers()
      } else {
        setActionStatus('❌ ' + (data.error || 'Action failed.'))
      }
    } catch { setActionStatus('❌ Request failed.') }
  }

  const deleteUser = async (username) => {
    if (username === PROTECTED_ADMIN) { setActionStatus('❌ Cannot delete main admin'); return }
    if (!confirm(`Delete "${username}"? This cannot be undone.`)) return
    setActionStatus(`Deleting ${username}...`)
    try {
      const token = localStorage.getItem('mun_token')
      const res = await fetch('/api/admin-delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, username }) })
      const data = await res.json()
      if (data.success) { setActionStatus(`✅ "${username}" deleted.`); fetchUsers() }
      else setActionStatus('❌ ' + (data.error || 'Failed to delete.'))
    } catch { setActionStatus('❌ Request failed.') }
  }

  const createUser = async () => {
    if (!createForm.username || !createForm.password) { setActionStatus('⚠️ Username & password required'); return }
    setActionStatus('Creating account...')
    try {
      const token = localStorage.getItem('mun_token')
      const res = await fetch('/api/admin-create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, ...createForm }) })
      const data = await res.json()
      if (data.success) { setActionStatus(`✅ Account "${createForm.username}" created.`); setCreateForm({ username: '', password: '', role: 'basic', name: '' }); fetchUsers() }
      else setActionStatus('❌ ' + (data.error || 'Failed to create.'))
    } catch { setActionStatus('❌ Request failed.') }
  }

  const editUser = async () => {
    if (!editForm.username) { setActionStatus('⚠️ Enter current username'); return }
    if (editForm.username === PROTECTED_ADMIN) { setActionStatus('❌ Cannot edit main admin'); return }
    if (!editForm.newUsername && !editForm.newName && !editForm.newPassword) { setActionStatus('⚠️ Fill in at least one field to change'); return }
    setActionStatus('Saving changes...')
    try {
      const token = localStorage.getItem('mun_token')
      const res = await fetch('/api/admin-edit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, ...editForm }) })
      const data = await res.json()
      if (data.success) { setActionStatus(`✅ "${editForm.username}" updated.`); setEditForm({ username: '', newUsername: '', newName: '', newPassword: '' }); fetchUsers() }
      else setActionStatus('❌ ' + (data.error || 'Failed to update.'))
    } catch { setActionStatus('❌ Request failed.') }
  }

  const filteredUsers = users.filter(u => {
    if (filter !== 'all' && u.role !== filter) return false
    if (search && !u.username.toLowerCase().includes(search.toLowerCase()) && !(u.name || '').toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const stats = {
    total: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    plus: users.filter(u => u.role === 'plus').length,
    basic: users.filter(u => u.role === 'basic').length,
    blocked: users.filter(u => u.blocked).length,
  }

  const ROLE_COLORS = { admin: '#c9a84c', plus: '#009EDB', basic: '#888' }
  const ROLE_LABELS = { admin: 'Admin', plus: 'Plus', basic: 'Basic' }

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
    filterBtn: (active) => ({ background: active ? '#009EDB' : 'rgba(255,255,255,0.06)', border: '1px solid ' + (active ? '#009EDB' : 'rgba(255,255,255,0.12)'), color: active ? 'white' : 'rgba(255,255,255,0.5)', padding: '6px 14px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600 }),
    blockBtn: (blocked) => ({ background: blocked ? 'rgba(39,174,96,0.15)' : 'rgba(192,57,43,0.15)', border: '1px solid ' + (blocked ? 'rgba(39,174,96,0.4)' : 'rgba(192,57,43,0.4)'), color: blocked ? '#2ecc71' : '#e74c3c', padding: '5px 14px', borderRadius: 5, fontSize: 12, cursor: 'pointer', fontWeight: 700, fontFamily: "'Source Sans 3', sans-serif", whiteSpace: 'nowrap' }),
    deleteBtn: { background: 'rgba(192,57,43,0.2)', border: '1px solid rgba(192,57,43,0.4)', color: '#e74c3c', padding: '5px 14px', borderRadius: 5, fontSize: 12, cursor: 'pointer', fontWeight: 700, fontFamily: "'Source Sans 3', sans-serif", whiteSpace: 'nowrap' },
    sectionTitle: { fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 14 },
    fieldLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 },
  }

  if (!user || user.role !== 'admin') return null

  return (
    <>
      <Head><title>Admin Panel — MUN Toolkit</title></Head>
      <div style={s.page}>
        {BADGE}

        {/* HEADER */}
        <div style={s.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 28 }}>🇺🇳</span>
            <div>
              <div style={s.title}>MUN Toolkit — Admin Panel</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>User Management · Account Control</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={() => router.push('/')} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', padding: '7px 16px', borderRadius: 6, fontSize: 13, cursor: 'pointer', fontFamily: "'Source Sans 3', sans-serif" }}>🏠 MUN Toolkit</button>
            <button onClick={logout} style={{ background: 'rgba(192,57,43,0.2)', border: '1px solid rgba(192,57,43,0.4)', color: '#ff6b6b', padding: '7px 16px', borderRadius: 6, fontSize: 13, cursor: 'pointer', fontFamily: "'Source Sans 3', sans-serif" }}>Sign Out</button>
          </div>
        </div>

        <div style={s.content}>

          {/* STATS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'Total Users', value: stats.total, color: '#009EDB' },
              { label: 'Admin', value: stats.admin, color: '#c9a84c' },
              { label: 'Plus', value: stats.plus, color: '#009EDB' },
              { label: 'Basic', value: stats.basic, color: '#888' },
              { label: 'Blocked', value: stats.blocked, color: '#e74c3c' },
            ].map(({ label, value, color }) => (
              <div key={label} style={s.statCard}>
                <div style={s.label}>{label}</div>
                <div style={{ ...s.value, color }}>{value}</div>
              </div>
            ))}
          </div>

          {/* STATUS */}
          {actionStatus && (
            <div style={{ background: 'rgba(0,158,219,0.1)', border: '1px solid rgba(0,158,219,0.3)', color: '#7dd4f8', padding: '10px 16px', borderRadius: 6, marginBottom: 16, fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{actionStatus}</span>
              <button onClick={() => setActionStatus('')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>
          )}

          {/* USER TABLE */}
          <div style={s.card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>All Users ({filteredUsers.length})</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <input style={{ ...s.input, width: 180 }} placeholder="Search username or name..." value={search} onChange={e => setSearch(e.target.value)} />
                {['all', 'admin', 'plus', 'basic'].map(f => (
                  <button key={f} style={s.filterBtn(filter === f)} onClick={() => setFilter(f)}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
                ))}
                <button onClick={fetchUsers} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)', padding: '6px 14px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: "'Source Sans 3', sans-serif" }}>↻ Refresh</button>
              </div>
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)' }}>Loading users...</div>
            ) : (
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Username</th>
                    <th style={s.th}>Name</th>
                    <th style={s.th}>Role</th>
                    <th style={s.th}>Status</th>
                    <th style={s.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.username} style={{ opacity: u.blocked ? 0.6 : 1 }}>
                      <td style={s.td}><span style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{u.username}</span></td>
                      <td style={s.td}><span style={{ color: 'rgba(255,255,255,0.6)' }}>{u.name || '—'}</span></td>
                      <td style={s.td}><span style={{ background: ROLE_COLORS[u.role] + '22', border: `1px solid ${ROLE_COLORS[u.role]}44`, color: ROLE_COLORS[u.role], padding: '2px 10px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{ROLE_LABELS[u.role]}</span></td>
                      <td style={s.td}><span style={{ color: u.blocked ? '#e74c3c' : '#2ecc71', fontWeight: 700, fontSize: 12 }}>{u.blocked ? '🔒 Blocked' : '✅ Active'}</span></td>
                      <td style={s.td}>
                        {u.username === PROTECTED_ADMIN ? (
                          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>Protected</span>
                        ) : (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button style={s.blockBtn(u.blocked)} onClick={() => toggleBlock(u.username, u.blocked)}>
                              {u.blocked ? 'Unblock' : 'Block'}
                            </button>
                            <button style={s.deleteBtn} onClick={() => deleteUser(u.username)}>Delete</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* CREATE */}
          <div style={s.card}>
            <div style={s.sectionTitle}>➕ Create New Account</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              {[
                { label: 'Username', key: 'username', type: 'text', width: 140 },
                { label: 'Full Name', key: 'name', type: 'text', width: 140 },
                { label: 'Password', key: 'password', type: 'password', width: 140 },
              ].map(({ label, key, type, width }) => (
                <div key={key}>
                  <div style={s.fieldLabel}>{label}</div>
                  <input style={{ ...s.input, width }} type={type} placeholder={label.toLowerCase()} value={createForm[key]} onChange={e => setCreateForm(p => ({ ...p, [key]: e.target.value }))} />
                </div>
              ))}
              <div>
                <div style={s.fieldLabel}>Role</div>
                <select style={{ ...s.input, width: 110 }} value={createForm.role} onChange={e => setCreateForm(p => ({ ...p, role: e.target.value }))}>
                  <option value="basic">Basic</option>
                  <option value="plus">Plus</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button style={{ background: 'rgba(39,174,96,0.2)', border: '1px solid rgba(39,174,96,0.4)', color: '#2ecc71', padding: '8px 20px', borderRadius: 6, fontSize: 13, cursor: 'pointer', fontWeight: 700, fontFamily: "'Source Sans 3', sans-serif" }} onClick={createUser}>
                Create Account
              </button>
            </div>
          </div>

          {/* EDIT */}
          <div style={s.card}>
            <div style={s.sectionTitle}>✏️ Edit Account — Change Username / Name / Password</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 12, fontStyle: 'italic' }}>Fill in only the fields you want to change. Leave others blank.</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              {[
                { label: 'Current Username', key: 'username', type: 'text', width: 150, placeholder: 'current username' },
                { label: 'New Username', key: 'newUsername', type: 'text', width: 150, placeholder: 'leave blank to keep' },
                { label: 'New Full Name', key: 'newName', type: 'text', width: 150, placeholder: 'leave blank to keep' },
                { label: 'New Password', key: 'newPassword', type: 'password', width: 150, placeholder: 'leave blank to keep' },
              ].map(({ label, key, type, width, placeholder }) => (
                <div key={key}>
                  <div style={s.fieldLabel}>{label}</div>
                  <input style={{ ...s.input, width }} type={type} placeholder={placeholder} value={editForm[key]} onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))} />
                </div>
              ))}
              <button style={{ background: 'rgba(0,158,219,0.2)', border: '1px solid rgba(0,158,219,0.4)', color: '#009EDB', padding: '8px 20px', borderRadius: 6, fontSize: 13, cursor: 'pointer', fontWeight: 700, fontFamily: "'Source Sans 3', sans-serif" }} onClick={editUser}>
                Save Changes
              </button>
            </div>
          </div>

          {/* ACCESS GUIDE */}
          <div style={s.card}>
            <div style={s.sectionTitle}>Access Level Guide</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {[
                { role: 'Admin', color: '#c9a84c', items: ['All country research pages', 'AI briefing & chatbot', 'Update All Sections', 'Admin panel — full user management'] },
                { role: 'Plus', color: '#009EDB', items: ['All country research pages', 'AI briefing & chatbot', 'Live news feed'] },
                { role: 'Basic', color: '#888', items: ['All country research pages — read only', 'No AI features'] },
              ].map(({ role, color, items }) => (
                <div key={role} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}33`, borderRadius: 6, padding: 14 }}>
                  <div style={{ color, fontWeight: 700, fontSize: 13, marginBottom: 10 }}>{role}</div>
                  {items.map(item => <div key={item} style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4, paddingLeft: 8, borderLeft: `2px solid ${color}44` }}>{item}</div>)}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
