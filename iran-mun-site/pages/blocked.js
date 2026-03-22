// pages/blocked.js
import Head from 'next/head'

export default function Blocked() {
  return (
    <>
      <Head><title>Access Denied — MUN Toolkit</title></Head>
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Source Sans 3', sans-serif" }}>
        <div style={{ textAlign: 'center', maxWidth: 500, padding: 40 }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🔒</div>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: '#e74c3c', marginBottom: 12 }}>404 Access Denied</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, color: 'white', marginBottom: 16 }}>Account Suspended</div>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
            This account has been suspended due to inappropriate behaviour.
          </div>
        </div>
      </div>
    </>
  )
}
