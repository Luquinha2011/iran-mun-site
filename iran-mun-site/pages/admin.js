// pages/admin.js — Admin Panel (admin role only)
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

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

  const toggleBlock = async (username, blocked) => {
    const token = localStorage.getItem('mun_token')
    await fetch('/api/admin-block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, username, blocked: !blocked })
    })
    fetchUsers()
  }

  const deleteUser = async (username) => {
    if (!confirm(`Delete "${username}"?`)) return
    const token = localStorage.getItem('mun_token')
    await fetch('/api/admin-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, username })
    })
    fetchUsers()
  }

  const createUser = async () => {
    if (!createForm.username || !createForm.password) {
      setActionStatus('Username & password required')
      return
    }
    const token = localStorage.getItem('mun_token')
    await fetch('/api/admin-create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, ...createForm })
    })
    setCreateForm({ username: '', password: '', role: 'basic', name: '' })
    fetchUsers()
  }

  const editUser = async () => {
    if (!editForm.username) {
      setActionStatus('Enter current username')
      return
    }
    const token = localStorage.getItem('mun_token')
    await fetch('/api/admin-edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, ...editForm })
    })
    setEditForm({ username: '', newUsername: '', newName: '', newPassword: '' })
    fetchUsers()
  }

  const filteredUsers = users.filter(u => {
    if (filter !== 'all' && u.role !== filter) return false
    if (search && !u.username.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const s = {
    page: { minHeight: '100vh', background: '#0a1628', color: 'white', fontFamily: 'sans-serif' },
    header: { background: 'linear-gradient(135deg,#003a6b,#005f8e)', padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    content: { maxWidth: 1100, margin: '0 auto', padding: 20 },
    card: { background: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 8, marginBottom: 20 },
    input: { padding: 8, marginRight: 8, borderRadius: 6, border: 'none' },
    btn: { padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', marginRight: 5 },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: 10, borderBottom: '1px solid #333' },
    td: { padding: 10, borderBottom: '1px solid #222' }
  }

  if (!user || user.role !== 'admin') return null

  return (
    <>
      <Head><title>Admin Panel</title></Head>

      <div style={s.page}>
        <div style={s.header}>
          <h2>🇺🇳 MUN Toolkit — Admin</h2>
          <button onClick={logout}>Sign Out</button>
        </div>

        <div style={s.content}>

          <div style={s.card}>
            <h3>Users ({filteredUsers.length})</h3>

            <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={s.input} />

            {['all','admin','plus','basic'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={s.btn}>{f}</button>
            ))}

            {loading ? <p>Loading...</p> : (
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
                        <button onClick={() => toggleBlock(u.username,u.blocked)} style={s.btn}>
                          {u.blocked ? 'Unblock' : 'Block'}
                        </button>
                        <button onClick={() => deleteUser(u.username)} style={s.btn}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div style={s.card}>
            <h3>Create User</h3>
            <input placeholder="Username" value={createForm.username} onChange={e=>setCreateForm(p=>({...p,username:e.target.value}))} style={s.input}/>
            <input placeholder="Password" type="password" value={createForm.password} onChange={e=>setCreateForm(p=>({...p,password:e.target.value}))} style={s.input}/>
            <input placeholder="Name" value={createForm.name} onChange={e=>setCreateForm(p=>({...p,name:e.target.value}))} style={s.input}/>
            <select value={createForm.role} onChange={e=>setCreateForm(p=>({...p,role:e.target.value}))} style={s.input}>
              <option value="basic">Basic</option>
              <option value="plus">Plus</option>
              <option value="admin">Admin</option>
            </select>
            <button onClick={createUser} style={s.btn}>Create</button>
          </div>

          <div style={s.card}>
            <h3>Edit User</h3>
            <input placeholder="Current Username" value={editForm.username} onChange={e=>setEditForm(p=>({...p,username:e.target.value}))} style={s.input}/>
            <input placeholder="New Username" value={editForm.newUsername} onChange={e=>setEditForm(p=>({...p,newUsername:e.target.value}))} style={s.input}/>
            <input placeholder="New Name" value={editForm.newName} onChange={e=>setEditForm(p=>({...p,newName:e.target.value}))} style={s.input}/>
            <input placeholder="New Password" type="password" value={editForm.newPassword} onChange={e=>setEditForm(p=>({...p,newPassword:e.target.value}))} style={s.input}/>
            <button onClick={editUser} style={s.btn}>Save</button>
          </div>

        </div>
      </div>
    </>
  )
}
