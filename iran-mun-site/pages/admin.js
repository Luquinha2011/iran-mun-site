// pages/admin.js — Admin Panel (FINAL)

import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

const PROTECTED_ADMIN = 'luquinha'

export default function AdminPanel({ user, logout }) {
  const router = useRouter()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionStatus, setActionStatus] = useState('')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const [createForm, setCreateForm] = useState({
    username: '',
    password: '',
    role: 'basic',
    name: ''
  })

  const [editForm, setEditForm] = useState({
    username: '',
    newUsername: '',
    newName: '',
    newPassword: ''
  })

  useEffect(() => {
    if (!user) return
    if (user.role !== 'admin') {
      router.push('/')
      return
    }
    fetchUsers()
  }, [user])

  const fetchUsers = async () => {
    setLoading(true)
    const token = localStorage.getItem('mun_token')

    const res = await fetch('/api/admin-users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })

    const data = await res.json()
    if (data.users) setUsers(data.users)

    setLoading(false)
  }

  // 🔒 BLOCK
  const toggleBlock = async (username, blocked) => {
    if (username === PROTECTED_ADMIN) {
      setActionStatus('❌ Cannot modify main admin')
      return
    }

    const token = localStorage.getItem('mun_token')

    await fetch('/api/admin-block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, username, blocked: !blocked })
    })

    fetchUsers()
  }

  // 🔒 DELETE
  const deleteUser = async (username) => {
    if (username === PROTECTED_ADMIN) {
      setActionStatus('❌ Cannot delete main admin')
      return
    }

    if (!confirm(`Delete "${username}"?`)) return

    const token = localStorage.getItem('mun_token')

    await fetch('/api/admin-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, username })
    })

    fetchUsers()
  }

  // 🔒 CREATE
  const createUser = async () => {
    if (!createForm.username || !createForm.password) {
      setActionStatus('⚠️ Fill required fields')
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

  // 🔒 EDIT
  const editUser = async () => {
    if (!editForm.username) return

    if (editForm.username === PROTECTED_ADMIN) {
      setActionStatus('❌ Cannot edit main admin')
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

  const filteredUsers = users.filter(u =>
    (filter === 'all' || u.role === filter) &&
    (u.username.toLowerCase().includes(search.toLowerCase()) ||
     (u.name || '').toLowerCase().includes(search.toLowerCase()))
  )

  if (!user || user.role !== 'admin') return null

  return (
    <>
      <Head><title>Admin Panel</title></Head>

      <div style={{ padding: 30, color: 'white', background: '#0a1628', minHeight: '100vh' }}>

        <h2>Admin Panel</h2>

        <input
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <br/><br/>

        {filteredUsers.map(u => (
          <div key={u.username} style={{ marginBottom: 10 }}>

            <b>{u.username}</b> ({u.role})

            {u.username === PROTECTED_ADMIN ? (
              <span style={{ marginLeft: 10, opacity: 0.5 }}>
                🔒 Protected
              </span>
            ) : (
              <>
                <button onClick={() => toggleBlock(u.username, u.blocked)}>
                  {u.blocked ? 'Unblock' : 'Block'}
                </button>

                <button onClick={() => deleteUser(u.username)}>
                  Delete
                </button>
              </>
            )}

          </div>
        ))}

        <hr/>

        <h3>Create</h3>
        <input placeholder="username" onChange={e=>setCreateForm(p=>({...p,username:e.target.value}))}/>
        <input placeholder="password" onChange={e=>setCreateForm(p=>({...p,password:e.target.value}))}/>
        <button onClick={createUser}>Create</button>

        <hr/>

        <h3>Edit</h3>
        <input placeholder="current username" onChange={e=>setEditForm(p=>({...p,username:e.target.value}))}/>
        <input placeholder="new username" onChange={e=>setEditForm(p=>({...p,newUsername:e.target.value}))}/>
        <button onClick={editUser}>Save</button>

      </div>
    </>
  )
}
