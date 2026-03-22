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
        const res = await fetch('/api/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) })
        if (res.ok) { setUser(await res.json()) }
        else { localStorage.removeItem('mun_token'); localStorage.removeItem('mun_user'); router.push('/login') }
      } catch {
        try { setUser(JSON.parse(storedUser)) } catch { router.push('/login') }
      } finally { setChecking(false) }
    }
    checkAuth()
  }, [router.pathname])

  // Block viewers from the Iran page
  useEffect(() => {
    if (user?.role === 'viewer' && router.pathname === '/iran') {
      router.push('/')
    }
  }, [user, router.pathname])

  const logout = () => {
    localStorage.removeItem('mun_token')
    localStorage.removeItem('mun_user')
    router.push('/login')
  }

  if (checking && router.pathname !== '/login') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#009EDB', fontFamily: 'sans-serif', fontSize: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 20, height: 20, border: '2px solid #004f7a', borderTopColor: '#009EDB', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          Loading MUN Research Hub...
        </div>
      </div>
    )
  }

  return <Component {...pageProps} user={user} logout={logout} />
}
