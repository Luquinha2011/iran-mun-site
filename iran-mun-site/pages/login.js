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

  const blocked = router.query?.blocked === '1'

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

  const ROLE_INFO = [
    { role: 'Admin', color: '#c9a84c', icon: '⚙️', desc: 'Full access — AI features, update controls, admin panel' },
    { role: 'Plus', color: '#009EDB', icon: '⭐', desc: 'All country pages · AI briefing · Chatbot' },
    { role: 'Basic', color: '#555', desc: '📖', icon: '📖', desc2: 'All country pages — read only, no AI features' },
  ]

  return (
    <>
      <Head>
        <title>MUN Toolkit — Sign In</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Source+Sans+3:wght@300;400;600&display=swap" rel="stylesheet" />
      </Head>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #001f3f 0%, #003a6b 40%, #005f8e 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Source Sans 3', sans-serif", padding: 24,
        position: 'relative', overflow: 'hidden',
      }}>

        {/* Decorative background */}
        <div style={{ position: 'absolute', top: -120, right: -120, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,158,219,0.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -150, left: -100, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: '20%', right: '15%', width: 2, height: 200, background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.06), transparent)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '8%', width: 150, height: 2, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.04), transparent)' }} />

        <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>

          {/* LOGO */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 40, margin: '0 auto 20px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}>🇺🇳</div>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 38, fontWeight: 900,
              color: 'white', letterSpacing: -1,
              marginBottom: 6, lineHeight: 1,
            }}>MUN Toolkit</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 16 }}>
              Model United Nations
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              {['Research', 'Procedures', 'Strategy'].map((t, i) => (
                <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.5 }}>{t}</span>
                  {i < 2 && <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />}
                </span>
              ))}
            </div>
          </div>

          {/* BLOCKED BANNER */}
          {blocked && (
            <div style={{
              background: 'rgba(192,57,43,0.2)', border: '1px solid rgba(192,57,43,0.4)',
              color: '#ff9999', padding: '12px 16px', borderRadius: 10,
              fontSize: 13, marginBottom: 16, textAlign: 'center',
              backdropFilter: 'blur(8px)',
            }}>
              🔒 Your account has been blocked. Contact your administrator.
            </div>
          )}

          {/* LOGIN CARD */}
          <div style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16, padding: '36px 32px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
          }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                Sign In to Your Account
              </div>
              <div style={{ width: 40, height: 2, background: 'linear-gradient(to right, #009EDB, #c9a84c)', borderRadius: 2, margin: '10px auto 0' }} />
            </div>

            <form onSubmit={handleLogin}>

              {/* USERNAME */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
                  Username
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, opacity: 0.4 }}>👤</span>
                  <input
                    type="text" value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.12)', color: 'white',
                      padding: '12px 16px 12px 42px', borderRadius: 10,
                      fontSize: 14, outline: 'none',
                      fontFamily: "'Source Sans 3', sans-serif",
                      boxSizing: 'border-box', transition: 'all 0.2s',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#009EDB'; e.target.style.background = 'rgba(0,158,219,0.08)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(255,255,255,0.07)' }}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ display: 'block', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, opacity: 0.4 }}>🔑</span>
                  <input
                    type="password" value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.12)', color: 'white',
                      padding: '12px 16px 12px 42px', borderRadius: 10,
                      fontSize: 14, outline: 'none',
                      fontFamily: "'Source Sans 3', sans-serif",
                      boxSizing: 'border-box', transition: 'all 0.2s',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#009EDB'; e.target.style.background = 'rgba(0,158,219,0.08)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(255,255,255,0.07)' }}
                  />
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div style={{
                  background: 'rgba(192,57,43,0.2)', border: '1px solid rgba(192,57,43,0.4)',
                  color: '#ff9999', padding: '11px 14px', borderRadius: 8,
                  fontSize: 13, marginBottom: 18, textAlign: 'center',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit" disabled={loading}
                style={{
                  width: '100%',
                  background: loading ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #009EDB, #0077b6)',
                  color: 'white', border: 'none',
                  padding: '14px 20px', borderRadius: 10,
                  fontSize: 14, fontWeight: 700,
                  cursor: loading ? 'default' : 'pointer',
                  fontFamily: "'Source Sans 3', sans-serif",
                  letterSpacing: 0.5, transition: 'all 0.2s',
                  boxShadow: loading ? 'none' : '0 4px 20px rgba(0,158,219,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
                onMouseEnter={e => { if (!loading) e.target.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.target.style.transform = 'translateY(0)' }}
              >
                {loading ? (
                  <>
                    <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    Signing in...
                  </>
                ) : (
                  <>Sign In <span style={{ fontSize: 16 }}>→</span></>
                )}
              </button>
            </form>
          </div>

          {/* ACCESS LEVELS */}
          <div style={{ marginTop: 16, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
            {[
              { role: 'Admin', color: '#c9a84c', icon: '⚙️', desc: 'Full access — AI features, update controls, admin panel' },
              { role: 'Plus', color: '#009EDB', icon: '⭐', desc: 'All country pages · AI briefing · Chatbot' },
              { role: 'Basic', color: '#666', icon: '📖', desc: 'All country pages — read only, no AI features' },
            ].map(({ role, color, icon, desc }, i) => (
              <div key={role} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 16px',
                background: i % 2 === 0 ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.15)',
                borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span style={{
                  background: color + '22', border: `1px solid ${color}44`,
                  color: color, fontSize: 10, fontWeight: 700,
                  padding: '2px 8px', borderRadius: 4, letterSpacing: 0.5,
                  flexShrink: 0, textTransform: 'uppercase',
                }}>{role}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', lineHeight: 1.4 }}>{desc}</span>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: 'rgba(255,255,255,0.15)', letterSpacing: 0.5 }}>
            ✦ Made by Luquinha &nbsp;·&nbsp; 🇺🇳 MUN Toolkit &nbsp;·&nbsp; Educational Use Only
          </div>

        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        input::placeholder { color: rgba(255,255,255,0.25) }
      `}</style>
    </>
  )
}
