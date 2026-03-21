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
      // Skip auth check on login page
      if (router.pathname === '/login') {
        setChecking(false)
        return
      }

      const token = localStorage.getItem('mun_token')
      const storedUser = localStorage.getItem('mun_user')

      if (!token || !storedUser) {
        router.push('/login')
        return
      }

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
          localStorage.removeItem('mun_token')
          localStorage.removeItem('mun_user')
          router.push('/login')
        }
      } catch {
        // If verify fails, still try to use stored user
        try {
          setUser(JSON.parse(storedUser))
        } catch {
          router.push('/login')
        }
      } finally {
        setChecking(false)
      }
    }

    checkAuth()
  }, [router.pathname])

  const logout = () => {
    localStorage.removeItem('mun_token')
    localStorage.removeItem('mun_user')
    router.push('/login')
  }

  if (checking && router.pathname !== '/login') {
    return (
      <div style={{
        minHeight: '100vh', background: '#0f1a14',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ color: '#c9a84c', fontFamily: 'sans-serif', fontSize: 14 }}>
          Loading...
        </div>
      </div>
    )
  }

  return <Component {...pageProps} user={user} logout={logout} />
}
