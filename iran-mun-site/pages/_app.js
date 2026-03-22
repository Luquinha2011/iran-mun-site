// pages/_app.js
import '../styles/globals.css'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      if (router.pathname === '/login') { setChecking(false); return }

      const token = localStorage.getItem('mun_token')
      const storedUser = localStorage.getItem('mun_user')

      if (!token || !storedUser) { router.push('/login'); return }

      try {
        const res = await fetch('/api/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        })

        if (res.ok) {
          const userData = await res.json()
          setUser(userData)
        } else {
          const data = await res.json()
          localStorage.removeItem('mun_token')
          localStorage.removeItem('mun_user')
          if (data.error === 'Account blocked') {
            router.push('/login?blocked=1')
          } else {
            router.push('/login')
          }
          return
        }
      } catch {
        try { setUser(JSON.parse(storedUser)) } catch { router.push('/login') }
      } finally {
        setChecking(false)
      }
    }
    checkAuth()
  }, [router.pathname])

  // Route protection
  useEffect(() => {
    if (!user) return
    // Admin panel — admin only
    if (router.pathname === '/admin' && user.role !== 'admin') router.push('/')
    // Iran and China — basic, plus, admin only (all roles)
    // No restriction needed since all logged-in users can access
  }, [user, router.pathname])

  const logout = () => {
    localStorage.removeItem('mun_token')
    localStorage.removeItem('mun_user')
    router.push('/login')
  }

  if (checking && router.pathname !== '/login') {
    return (
      <div style={{ minHeight: '100vh', background: '#003a6b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#7dd4f8', fontFamily: 'sans-serif', fontSize: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#009EDB', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          Loading MUN Toolkit...
        </div>
      </div>
    )
  }

  return <Component {...pageProps} user={user} logout={logout} />
}
