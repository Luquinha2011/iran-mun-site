// pages/login.js
import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }

      // Store session in localStorage
      localStorage.setItem('mun_token', data.token)
      localStorage.setItem('mun_user', JSON.stringify({
        username: data.username,
        name: data.name,
        role: data.role
      }))

      router.push('/')
    } catch {
      setError('Connection error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Login — Iran MUN Research</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Source+Sans+3:wght@300;400;600&display=swap" rel="stylesheet" />
      </Head>
      <div style={{
        minHeight: '100vh',
        background: '#0f1a14',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Source Sans 3', sans-serif",
        padding: 24,
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* HEADER */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🇮🇷</div>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 28, fontWeight: 900,
              color: 'white', letterSpacing: -0.5,
              marginBottom: 6,
            }}>Iran MUN Research</div>
            <div style={{
              fontSize: 13, color: 'rgba(255,255,255,0.4)',
              letterSpacing: 2, textTransform: 'uppercase'
            }}>ECOSOC Committee · Restricted Access</div>
          </div>

          {/* LOGIN CARD */}
          <div style={{
            background: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: 8,
            padding: 32,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 700,
              letterSpacing: 2, textTransform: 'uppercase',
              color: '#c9a84c', marginBottom: 24,
            }}>Sign In</div>

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 16 }}>
                <label style={{
                  display: 'block', fontSize: 11,
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: 1, textTransform: 'uppercase',
                  marginBottom: 6,
                }}>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  style={{
                    width: '100%', background: '#2a2a2a',
                    border: '1px solid #444', color: 'white',
                    padding: '10px 14px', borderRadius: 6,
                    fontSize: 14, outline: 'none',
                    fontFamily: "'Source Sans 3', sans-serif",
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{
                  display: 'block', fontSize: 11,
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: 1, textTransform: 'uppercase',
                  marginBottom: 6,
                }}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: '100%', background: '#2a2a2a',
                    border: '1px solid #444', color: 'white',
                    padding: '10px 14px', borderRadius: 6,
                    fontSize: 14, outline: 'none',
                    fontFamily: "'Source Sans 3', sans-serif",
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {error && (
                <div style={{
                  background: '#2d1010', border: '1px solid #c0392b',
                  color: '#ff6b6b', padding: '10px 14px',
                  borderRadius: 6, fontSize: 13, marginBottom: 16,
                }}>{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', background: '#1a5c38',
                  color: 'white', border: 'none',
                  padding: '12px 20px', borderRadius: 6,
                  fontSize: 14, fontWeight: 700,
                  cursor: loading ? 'default' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  fontFamily: "'Source Sans 3', sans-serif",
                  letterSpacing: 0.5,
                }}
              >
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>
          </div>

          {/* ROLE INFO */}
          <div style={{
            marginTop: 20, padding: 16,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid #222', borderRadius: 6,
          }}>
            <div style={{ fontSize: 11, color: '#555', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Access Levels</div>
            {[
              { role: 'Admin', color: '#c9a84c', desc: 'Full access — all AI features, update controls' },
              { role: 'Delegate', color: '#2d7a4f', desc: 'Research + AI chatbot' },
              { role: 'Viewer', color: '#4a4a4a', desc: 'Read-only access' },
            ].map(({ role, color, desc }) => (
              <div key={role} style={{ display: 'flex', gap: 10, marginBottom: 6, alignItems: 'flex-start' }}>
                <span style={{
                  background: color, color: 'white',
                  fontSize: 10, fontWeight: 700, padding: '2px 7px',
                  borderRadius: 3, letterSpacing: 0.5,
                  flexShrink: 0, marginTop: 1,
                }}>{role}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{desc}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}
