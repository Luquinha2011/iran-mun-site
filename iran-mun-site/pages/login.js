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
      if (!res.ok) { setError(data.error || 'Login failed'); setLoading(false); return }
      localStorage.setItem('mun_token', data.token)
      localStorage.setItem('mun_user', JSON.stringify({ username: data.username, name: data.name, role: data.role }))
      router.push('/')
    } catch {
      setError('Connection error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>MUN Toolkit — Sign In</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Source+Sans+3:wght@300;400;600&display=swap" rel="stylesheet" />
      </Head>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #003a6b 0%, #005f8e 40%, #0077b6 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Source Sans 3', sans-serif", padding: 24,
        position: 'relative', overflow: 'hidden',
      }}>

        {/* Background decorative circles */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', bottom: -150, left: -80, width: 500, height: 500, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        <div style={{ position: 'absolute', top: '30%', left: '10%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.02)' }} />

        <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>

          {/* LOGO & TITLE */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ fontSize: 64, marginBottom: 16, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}>🇺🇳</div>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 34, fontWeight: 900,
              color: 'white', letterSpacing: -0.5,
              marginBottom: 8, lineHeight: 1,
            }}>MUN Toolkit</div>
            <div style={{
              fontSize: 12, color: 'rgba(255,255,255,0.5)',
              letterSpacing: 3, textTransform: 'uppercase',
              marginBottom: 6,
            }}>Model United Nations Platform</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
              <span style={{ width: 20, height: 1, background: 'rgba(255,255,255,0.2)', display: 'inline-block' }} />
              Research · Procedures · Strategy
              <span style={{ width: 20, height: 1, background: 'rgba(255,255,255,0.2)', display: 'inline-block' }} />
            </div>
          </div>

          {/* LOGIN CARD */}
          <div style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 12, padding: 32,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 24, textAlign: 'center' }}>
              Sign In to Your Account
            </div>

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 7 }}>Username</label>
                <input
                  type="text" value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)', color: 'white',
                    padding: '11px 16px', borderRadius: 8,
                    fontSize: 14, outline: 'none',
                    fontFamily: "'Source Sans 3', sans-serif",
                    boxSizing: 'border-box', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.4)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 7 }}>Password</label>
                <input
                  type="password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)', color: 'white',
                    padding: '11px 16px', borderRadius: 8,
                    fontSize: 14, outline: 'none',
                    fontFamily: "'Source Sans 3', sans-serif",
                    boxSizing: 'border-box', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.4)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                />
              </div>

              {error && (
                <div style={{
                  background: 'rgba(192,57,43,0.25)', border: '1px solid rgba(192,57,43,0.5)',
                  color: '#ff9999', padding: '10px 14px', borderRadius: 8,
                  fontSize: 13, marginBottom: 16, textAlign: 'center',
                }}>{error}</div>
              )}

              <button
                type="submit" disabled={loading}
                style={{
                  width: '100%', background: loading ? 'rgba(255,255,255,0.1)' : '#009EDB',
                  color: 'white', border: 'none',
                  padding: '13px 20px', borderRadius: 8,
                  fontSize: 14, fontWeight: 700,
                  cursor: loading ? 'default' : 'pointer',
                  fontFamily: "'Source Sans 3', sans-serif",
                  letterSpacing: 0.5, transition: 'background 0.2s',
                }}
              >
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>
          </div>

          {/* ACCESS LEVELS */}
          <div style={{ marginTop: 20, padding: '16px 20px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12, textAlign: 'center' }}>Access Levels</div>
            {[
              { role: 'Admin', color: '#c9a84c', desc: 'Full access — all AI features, update controls, all pages' },
              { role: 'Delegate', color: '#009EDB', desc: 'MUN Toolkit + Iran research page + AI chatbot and briefing' },
              { role: 'Viewer', color: '#555', desc: 'MUN Toolkit home page only — read access' },
            ].map(({ role, color, desc }) => (
              <div key={role} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
                <span style={{ background: color, color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, letterSpacing: 0.5, flexShrink: 0, marginTop: 1 }}>{role}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>{desc}</span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: 0.5 }}>
            🇺🇳 MUN Toolkit · For Educational Use Only
          </div>

        </div>
      </div>
    </>
  )
}
