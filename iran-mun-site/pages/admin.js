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
  const [actionType, setActionType] = useState('info')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [createForm, setCreateForm] = useState({ username: '', password: '', role: 'basic', name: '' })
  const [editForm, setEditForm] = useState({ username: '', newUsername: '', newName: '', newPassword: '' })
  const [activeTab, setActiveTab] = useState('users')

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
    } catch { showStatus('Failed to load users.', 'error') }
    finally { setLoading(false) }
  }

  const showStatus = (msg, type = 'info') => {
    setActionStatus(msg)
    setActionType(type)
    setTimeout(() => setActionStatus(''), 4000)
  }

  const toggleBlock = async (username, originalUsername, currentlyBlocked) => {
    if (originalUsername === PROTECTED_ADMIN) { showStatus('Cannot modify main admin', 'error'); return }
    showStatus(`${currentlyBlocked ? 'Unblocking' : 'Blocking'} ${username}...`, 'info')
    try {
      const token = localStorage.getItem('mun_token')
      const res = await fetch('/api/admin-block', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, username: originalUsername || username, blocked: !currentlyBlocked }) })
      const data = await res.json()
      if (data.success) { showStatus(`✅ ${username} ${!currentlyBlocked ? 'blocked' : 'unblocked'} successfully`, 'success'); fetchUsers() }
      else showStatus(data.error || 'Action failed.', 'error')
    } catch { showStatus('Request failed.', 'error') }
  }

  const deleteUser = async (username, originalUsername) => {
    if (originalUsername === PROTECTED_ADMIN) { showStatus('Cannot delete main admin', 'error'); return }
    if (!confirm(`Are you sure you want to delete "${username}"? This cannot be undone.`)) return
    showStatus(`Deleting ${username}...`, 'info')
    try {
      const token = localStorage.getItem('mun_token')
      const res = await fetch('/api/admin-delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, username: originalUsername || username }) })
      const data = await res.json()
      if (data.success) { showStatus(`✅ "${username}" deleted successfully`, 'success'); fetchUsers() }
      else showStatus(data.error || 'Failed to delete.', 'error')
    } catch { showStatus('Request failed.', 'error') }
  }

  const createUser = async () => {
    if (!createForm.username || !createForm.password) { showStatus('Username and password are required', 'error'); return }
    showStatus('Creating account...', 'info')
    try {
      const token = localStorage.getItem('mun_token')
      const res = await fetch('/api/admin-create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, ...createForm }) })
      const data = await res.json()
      if (data.success) { showStatus(`✅ Account "${createForm.username}" created successfully`, 'success'); setCreateForm({ username: '', password: '', role: 'basic', name: '' }); fetchUsers() }
      else showStatus(data.error || 'Failed to create.', 'error')
    } catch { showStatus('Request failed.', 'error') }
  }

  const editUser = async () => {
    if (!editForm.username) { showStatus('Enter current username', 'error'); return }
    if (editForm.username === PROTECTED_ADMIN) { showStatus('Cannot edit main admin', 'error'); return }
    if (!editForm.newUsername && !editForm.newName && !editForm.newPassword) { showStatus('Fill in at least one field to change', 'error'); return }
    showStatus('Saving changes...', 'info')
    try {
      const token = localStorage.getItem('mun_token')
      const res = await fetch('/api/admin-edit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, ...editForm }) })
      const data = await res.json()
      if (data.success) { showStatus(`✅ "${editForm.username}" updated successfully`, 'success'); setEditForm({ username: '', newUsername: '', newName: '', newPassword: '' }); fetchUsers() }
      else showStatus(data.error || 'Failed to update.', 'error')
    } catch { showStatus('Request failed.', 'error') }
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

  const ROLE_COLORS = { admin: '#c9a84c', plus: '#009EDB', basic: '#6c757d' }
  const ROLE_LABELS = { admin: 'Admin', plus: 'Plus', basic: 'Basic' }

  const inputStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white',
    padding: '10px 14px',
    borderRadius: 8,
    fontSize: 13,
    outline: 'none',
    fontFamily: "'Source Sans 3', sans-serif",
    transition: 'all 0.2s',
  }

  const statusColors = {
    info: { bg: 'rgba(0,158,219,0.15)', border: 'rgba(0,158,219,0.3)', color: '#7dd4f8' },
    success: { bg: 'rgba(39,174,96,0.15)', border: 'rgba(39,174,96,0.3)', color: '#2ecc71' },
    error: { bg: 'rgba(192,57,43,0.15)', border: 'rgba(192,57,43,0.3)', color: '#ff6b6b' },
  }

  if (!user || user.role !== 'admin') return null

  return (
    <>
      <Head><title>Admin Panel — MUN Toolkit</title></Head>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes spin { to { transform: rotate(360deg) } }
        .admin-input:focus { border-color: rgba(0,158,219,0.5) !important; background: rgba(0,158,219,0.08) !important; }
        .action-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .user-row:hover { background: rgba(255,255,255,0.03) !important; }
        .tab-btn:hover { background: rgba(255,255,255,0.06) !important; }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #060d1a 0%, #0a1628 50%, #0d1f35 100%)', fontFamily: "'Source Sans 3', sans-serif", color: 'white' }}>
        {BADGE}

        {/* HEADER */}
        <div style={{ background: 'linear-gradient(135deg, rgba(0,58,107,0.8), rgba(0,95,142,0.6))', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '20px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #009EDB, #0077b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 4px 16px rgba(0,158,219,0.3)' }}>🇺🇳</div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 900, letterSpacing: -0.3 }}>Admin Panel</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>MUN Toolkit · User Management</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => router.push('/')} className="action-btn" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', padding: '8px 18px', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: "'Source Sans 3', sans-serif", transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6 }}>
              🏠 Home
            </button>
            <button onClick={logout} className="action-btn" style={{ background: 'rgba(192,57,43,0.2)', border: '1px solid rgba(192,57,43,0.35)', color: '#ff8080', padding: '8px 18px', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: "'Source Sans 3', sans-serif", transition: 'all 0.2s' }}>
              Sign Out
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

          {/* STATS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 28 }}>
            {[
              { label: 'Total Users', value: stats.total, color: '#009EDB', icon: '👥' },
              { label: 'Admins', value: stats.admin, color: '#c9a84c', icon: '⚙️' },
              { label: 'Plus', value: stats.plus, color: '#009EDB', icon: '⭐' },
              { label: 'Basic', value: stats.basic, color: '#6c757d', icon: '📖' },
              { label: 'Blocked', value: stats.blocked, color: '#e74c3c', icon: '🔒' },
            ].map(({ label, value, color, icon }) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}22`, borderRadius: 12, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 12, right: 14, fontSize: 20, opacity: 0.15 }}>{icon}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* STATUS BANNER */}
          {actionStatus && (
            <div style={{ animation: 'fadeIn 0.3s ease', background: statusColors[actionType].bg, border: `1px solid ${statusColors[actionType].border}`, color: statusColors[actionType].color, padding: '12px 18px', borderRadius: 10, marginBottom: 20, fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{actionStatus}</span>
              <button onClick={() => setActionStatus('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', opacity: 0.6, fontSize: 16 }}>✕</button>
            </div>
          )}

          {/* TABS */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 4, border: '1px solid rgba(255,255,255,0.06)', width: 'fit-content' }}>
            {[
              { id: 'users', label: '👥 Users', },
              { id: 'create', label: '➕ Create' },
              { id: 'edit', label: '✏️ Edit' },
            ].map(tab => (
              <button key={tab.id} className="tab-btn" onClick={() => setActiveTab(tab.id)} style={{ padding: '8px 20px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: "'Source Sans 3', sans-serif", transition: 'all 0.2s', background: activeTab === tab.id ? 'rgba(0,158,219,0.2)' : 'transparent', color: activeTab === tab.id ? '#009EDB' : 'rgba(255,255,255,0.4)', borderBottom: activeTab === tab.id ? '2px solid #009EDB' : '2px solid transparent' }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
              {/* TABLE HEADER */}
              <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>
                  All Users <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>({filteredUsers.length})</span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 12, opacity: 0.4 }}>🔍</span>
                    <input className="admin-input" style={{ ...inputStyle, width: 200, paddingLeft: 30 }} placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {['all', 'admin', 'plus', 'basic'].map(f => (
                      <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 14px', borderRadius: 7, border: '1px solid ' + (filter === f ? '#009EDB' : 'rgba(255,255,255,0.1)'), background: filter === f ? 'rgba(0,158,219,0.2)' : 'transparent', color: filter === f ? '#009EDB' : 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Source Sans 3', sans-serif", transition: 'all 0.2s' }}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                  <button onClick={fetchUsers} style={{ padding: '7px 14px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.4)', fontSize: 12, cursor: 'pointer', fontFamily: "'Source Sans 3', sans-serif", transition: 'all 0.2s' }}>↻</button>
                </div>
              </div>

              {/* TABLE */}
              {loading ? (
                <div style={{ padding: 60, textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>
                  <div style={{ width: 32, height: 32, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#009EDB', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 12px' }} />
                  Loading users...
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                      {['#', 'Username', 'Name', 'Role', 'Status', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u, idx) => (
                      <tr key={u.username} className="user-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', opacity: u.blocked ? 0.5 : 1, transition: 'background 0.15s' }}>
                        <td style={{ padding: '14px 20px', fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>{idx + 1}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${ROLE_COLORS[u.role]}22`, border: `1px solid ${ROLE_COLORS[u.role]}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: ROLE_COLORS[u.role] }}>
                              {(u.username || '?')[0].toUpperCase()}
                            </div>
                            <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>{u.username}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{u.name || <span style={{ color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>—</span>}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{ background: ROLE_COLORS[u.role] + '20', border: `1px solid ${ROLE_COLORS[u.role]}40`, color: ROLE_COLORS[u.role], padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>
                            {ROLE_LABELS[u.role]}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 7, height: 7, borderRadius: '50%', background: u.blocked ? '#e74c3c' : '#2ecc71', boxShadow: `0 0 6px ${u.blocked ? '#e74c3c' : '#2ecc71'}` }} />
                            <span style={{ fontSize: 12, color: u.blocked ? '#e74c3c' : '#2ecc71', fontWeight: 600 }}>{u.blocked ? 'Blocked' : 'Active'}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          {(u.originalUsername || u.username) === PROTECTED_ADMIN ? (
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)', fontStyle: 'italic' }}>Protected</span>
                          ) : (
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className="action-btn" onClick={() => toggleBlock(u.username, u.originalUsername || u.username, u.blocked)} style={{ background: u.blocked ? 'rgba(39,174,96,0.15)' : 'rgba(192,57,43,0.15)', border: `1px solid ${u.blocked ? 'rgba(39,174,96,0.3)' : 'rgba(192,57,43,0.3)'}`, color: u.blocked ? '#2ecc71' : '#e74c3c', padding: '5px 12px', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontWeight: 700, fontFamily: "'Source Sans 3', sans-serif", transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                                {u.blocked ? '✓ Unblock' : '✗ Block'}
                              </button>
                              {u.isDynamic && (
                                <button className="action-btn" onClick={() => deleteUser(u.username, u.originalUsername || u.username)} style={{ background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.25)', color: '#e74c3c', padding: '5px 12px', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontWeight: 700, fontFamily: "'Source Sans 3', sans-serif", transition: 'all 0.2s' }}>
                                  🗑
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* CREATE TAB */}
          {activeTab === 'create' && (
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 32, maxWidth: 600 }}>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>➕ Create New Account</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Add a new user to the MUN Toolkit platform</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                {[
                  { label: 'Username', key: 'username', type: 'text', placeholder: 'e.g. john123' },
                  { label: 'Full Name', key: 'name', type: 'text', placeholder: 'e.g. John Smith' },
                  { label: 'Password', key: 'password', type: 'password', placeholder: 'Strong password' },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key} style={key === 'password' ? { gridColumn: '1 / -1' } : {}}>
                    <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{label}</label>
                    <input className="admin-input" style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} type={type} placeholder={placeholder} value={createForm[key]} onChange={e => setCreateForm(p => ({ ...p, [key]: e.target.value }))} />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Role</label>
                  <select className="admin-input" style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} value={createForm.role} onChange={e => setCreateForm(p => ({ ...p, role: e.target.value }))}>
                    <option value="basic">Basic</option>
                    <option value="plus">Plus</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <button className="action-btn" onClick={createUser} style={{ background: 'linear-gradient(135deg, rgba(39,174,96,0.3), rgba(39,174,96,0.15))', border: '1px solid rgba(39,174,96,0.4)', color: '#2ecc71', padding: '12px 28px', borderRadius: 9, fontSize: 14, cursor: 'pointer', fontWeight: 700, fontFamily: "'Source Sans 3', sans-serif", transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8 }}>
                ➕ Create Account
              </button>
            </div>
          )}

          {/* EDIT TAB */}
          {activeTab === 'edit' && (
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 32, maxWidth: 600 }}>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>✏️ Edit Account</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Change username, name, or password. Leave blank to keep current value.</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                {[
                  { label: 'Current Username', key: 'username', type: 'text', placeholder: 'Current username', full: true },
                  { label: 'New Username', key: 'newUsername', type: 'text', placeholder: 'Leave blank to keep' },
                  { label: 'New Full Name', key: 'newName', type: 'text', placeholder: 'Leave blank to keep' },
                  { label: 'New Password', key: 'newPassword', type: 'password', placeholder: 'Leave blank to keep' },
                ].map(({ label, key, type, placeholder, full }) => (
                  <div key={key} style={full ? { gridColumn: '1 / -1' } : {}}>
                    <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{label}</label>
                    <input className="admin-input" style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', borderColor: key === 'username' ? 'rgba(0,158,219,0.3)' : 'rgba(255,255,255,0.1)' }} type={type} placeholder={placeholder} value={editForm[key]} onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))} />
                  </div>
                ))}
              </div>
              <button className="action-btn" onClick={editUser} style={{ background: 'linear-gradient(135deg, rgba(0,158,219,0.3), rgba(0,158,219,0.15))', border: '1px solid rgba(0,158,219,0.4)', color: '#009EDB', padding: '12px 28px', borderRadius: 9, fontSize: 14, cursor: 'pointer', fontWeight: 700, fontFamily: "'Source Sans 3', sans-serif", transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8 }}>
                💾 Save Changes
              </button>
            </div>
          )}

          {/* ACCESS GUIDE */}
          <div style={{ marginTop: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>Access Level Guide</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {[
                { role: 'Admin', color: '#c9a84c', icon: '⚙️', items: ['All country research pages', 'AI briefing & chatbot', 'Update All Sections', 'Full user management panel'] },
                { role: 'Plus', color: '#009EDB', icon: '⭐', items: ['All country research pages', 'AI intelligence briefing', 'AI chatbot per country', 'Live news feed'] },
                { role: 'Basic', color: '#6c757d', icon: '📖', items: ['All country research pages', 'Read only — no AI features', 'Live news feed'] },
              ].map(({ role, color, icon, items }) => (
                <div key={role} style={{ background: `${color}08`, border: `1px solid ${color}20`, borderRadius: 10, padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 16 }}>{icon}</span>
                    <span style={{ color, fontWeight: 700, fontSize: 13 }}>{role}</span>
                  </div>
                  {items.map(item => (
                    <div key={item} style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 5, paddingLeft: 8, borderLeft: `2px solid ${color}30`, lineHeight: 1.4 }}>{item}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
