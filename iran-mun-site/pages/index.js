// pages/index.js — UN/MUN Home Page
import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

const MUN_PROCEDURES = [
  {
    category: "Points",
    emoji: "📢",
    items: [
      { name: "Point of Personal Privilege", when: "Cannot hear, room too hot, microphone broken", interrupt: true, desc: "A delegate experiences physical discomfort preventing full participation." },
      { name: "Point of Order", when: "Chair or delegate has made a procedural error", interrupt: true, desc: "Challenges the application of the rules of procedure — not substantive disagreements." },
      { name: "Point of Information (to Chair)", when: "You have a procedural question for the Chair", interrupt: false, desc: "Ask the Chair to clarify a rule or procedure." },
      { name: "Point of Information (to Speaker)", when: "You want to question the current speaker", interrupt: false, desc: "Only after the speech ends, if speaker yields to questions." },
    ]
  },
  {
    category: "Motions",
    emoji: "🗳️",
    items: [
      { name: "Motion to Open Debate", when: "Start of session", interrupt: false, desc: "Formally begins debate on the agenda topic." },
      { name: "Motion to Close Debate", when: "Ready to vote on resolutions", interrupt: false, desc: "Ends speakers list — passes by two-thirds majority." },
      { name: "Motion to Suspend Debate", when: "Moving to caucus or break", interrupt: false, desc: "Temporarily pauses formal debate. Must state time and purpose." },
      { name: "Motion to Table", when: "Delay discussion", interrupt: false, desc: "Sets aside the topic — definition varies by conference." },
      { name: "Motion to Reconsider", when: "Challenge a passed vote", interrupt: false, desc: "Requires a second and majority vote." },
    ]
  },
  {
    category: "Caucuses",
    emoji: "💬",
    items: [
      { name: "Moderated Caucus", when: "Focused debate on a sub-topic", interrupt: false, desc: "Chair calls delegates one by one for short speeches (30-60 sec). Must state total time and speaking time." },
      { name: "Unmoderated Caucus", when: "Negotiation, bloc building, drafting", interrupt: false, desc: "Delegates leave seats and talk freely. Where real diplomacy happens — use it aggressively." },
    ]
  },
  {
    category: "Yields",
    emoji: "🔄",
    items: [
      { name: "Yield to Another Delegate", when: "You have time remaining and want to give it to an ally", interrupt: false, desc: "Tactically gives allies more speaking time." },
      { name: "Yield to Points of Information", when: "You are confident and want to field questions", interrupt: false, desc: "Risky if weak — powerful if confident." },
      { name: "Yield to the Chair", when: "Nothing more to add, avoid questions", interrupt: false, desc: "Safest option — remaining time returns to the Chair." },
    ]
  },
]

const RESOLUTION_STARTERS = {
  preambulatory: ["Recalling", "Reaffirming", "Recognizing", "Noting", "Deeply concerned by", "Emphasizing", "Bearing in mind", "Guided by", "Welcoming", "Aware of", "Believing", "Convinced that", "Determined to"],
  operative: ["Calls upon", "Urges", "Encourages", "Requests", "Demands", "Condemns", "Affirms", "Decides", "Recommends", "Invites", "Expresses", "Deplores", "Notes with satisfaction", "Strongly condemns"]
}

const COMMITTEES = [
  { name: "HRC", full: "Human Rights Council", desc: "Promotes and protects human rights around the globe. Addresses situations of human rights violations and makes recommendations. 47 member states elected by the General Assembly.", color: "#e67e22" },
  { name: "ECOSOC", full: "Economic and Social Council", desc: "Coordinates the economic, social, and related work of the UN and its specialised agencies. 54 rotating member states.", color: "#1a6fa0" },
  { name: "DISEC", full: "Disarmament and International Security Committee", desc: "First Committee of the General Assembly. Deals with disarmament, global challenges, and threats to international peace and security.", color: "#1a5c38" },
  { name: "UNEP", full: "United Nations Environment Programme", desc: "The leading global environmental authority. Sets the global environmental agenda and promotes sustainable development within the UN system.", color: "#27ae60" },
]

const COUNTRIES = [
  { code: 'iran', name: 'Iran', flag: '🇮🇷', color: '#1a5c38', leader: 'President Pezeshkian', system: 'You are speaking as President Masoud Pezeshkian of Iran. You passionately defend Iran\'s sovereignty, its right to peaceful nuclear energy, and frame all Western criticism as neo-colonial interference. You invoke the JCPOA snapback as illegal, defend Iran\'s proxy relationships as legitimate resistance, and always emphasise the suffering of 92 million Iranians under sanctions.' },
  { code: 'china', name: 'China', flag: '🇨🇳', color: '#c0392b', leader: 'President Xi Jinping', system: 'You are speaking as President Xi Jinping of China. You defend China\'s policies with absolute confidence — Taiwan is a core national interest, Xinjiang is counter-terrorism, Hong Kong is internal affairs. You invoke the Five Principles of Peaceful Coexistence, the Century of Humiliation, and China\'s 800 million poverty reduction achievement. You challenge Western double standards aggressively.' },
  { code: 'nigeria', name: 'Nigeria', flag: '🇳🇬', color: '#008751', leader: 'President Tinubu', system: 'You are speaking as President Bola Tinubu of Nigeria. You champion Africa\'s development agenda, call for debt relief and reform of the global financial architecture, and defend Nigeria\'s difficult economic reforms as necessary for long-term growth. You frame Nigeria as the natural leader of Africa and call for greater international support for counterterrorism in the Sahel.' },
]

const MADE_BY = (
  <div style={{
    position: 'fixed', top: 10, left: 10, zIndex: 9999,
    background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600,
    padding: '4px 10px', borderRadius: 20,
    fontFamily: "'Source Sans 3', sans-serif", letterSpacing: 0.5,
    pointerEvents: 'none',
  }}>✦ Made by Luquinha</div>
)

function Chatbot({ user }) {
  const [open, setOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (open && messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const selectCountry = (country) => {
    setSelectedCountry(country)
    setMessages([{ role: 'assistant', content: `Greetings. I am speaking to you as ${country.leader} of ${country.name}. Ask me anything about our positions, our policies, or how to argue our case in committee. I will defend our nation's interests with full conviction.` }])
  }

  const reset = () => { setSelectedCountry(null); setMessages([]) }

  const sendMessage = async (text) => {
    const userText = text || input.trim()
    if (!userText || loading || !selectedCountry) return
    setInput(''); setLoading(true)
    const newMessages = [...messages, { role: 'user', content: userText }]
    setMessages(newMessages)
    try {
      const res = await fetch('/api/chat-biased', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, systemPrompt: selectedCountry.system })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Sorry, please try again.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }])
    }
    finally { setLoading(false) }
  }

  const fmt = (text) => text.split('\n').map((line, i) => {
    const b = line.trim().startsWith('- ') || line.trim().startsWith('• ')
    const c = line.replace(/^[-•]\s+/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    return <div key={i} style={{ display: 'flex', gap: b ? 8 : 0, marginBottom: line.trim() ? 4 : 2 }}>{b && <span style={{ color: selectedCountry?.color || '#009EDB', flexShrink: 0 }}>→</span>}<span dangerouslySetInnerHTML={{ __html: c }} /></div>
  })

  if (!user || (user.role !== 'plus' && user.role !== 'admin')) return null

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000, background: selectedCountry ? selectedCountry.color : '#009EDB', color: 'white', border: 'none', borderRadius: 50, padding: '14px 20px', fontSize: 20, cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: 8 }}
        title="MUN Biased Assistant"
      >
        {open ? '✕' : '💬'}
        {!open && <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Source Sans 3', sans-serif" }}>MUN Assistant</span>}
      </button>

      {open && (
        <div style={{ position: 'fixed', bottom: 90, right: 24, zIndex: 1000, width: 380, maxHeight: '70vh', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, display: 'flex', flexDirection: 'column', boxShadow: '0 8px 40px rgba(0,0,0,0.5)', fontFamily: "'Source Sans 3', sans-serif", overflow: 'hidden' }}>

          {/* HEADER */}
          <div style={{ background: selectedCountry ? `linear-gradient(135deg, ${selectedCountry.color}cc, ${selectedCountry.color})` : 'linear-gradient(135deg, #005f8e, #009EDB)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'white' }}>
                {selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name} MUN Assistant` : '🇺🇳 MUN Biased Assistant'}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
                {selectedCountry ? `Powered by Groq AI · Biased towards ${selectedCountry.name}` : 'Powered by Groq AI · Select a country'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {selectedCountry && <button onClick={reset} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '4px 10px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>↩ Switch</button>}
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}>✕</button>
            </div>
          </div>

          {/* COUNTRY PICKER */}
          {!selectedCountry && (
            <div style={{ padding: 20, flex: 1 }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 16, textAlign: 'center' }}>Choose which country's president you want to speak with:</div>
              {COUNTRIES.map(c => (
                <button key={c.code} onClick={() => selectCountry(c)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${c.color}44`, borderRadius: 8, padding: '14px 16px', marginBottom: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.15s', fontFamily: "'Source Sans 3', sans-serif" }}
                  onMouseEnter={e => e.currentTarget.style.background = `${c.color}22`}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                >
                  <span style={{ fontSize: 32 }}>{c.flag}</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'white' }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: c.color, marginTop: 2 }}>Speaking as {c.leader}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* MESSAGES */}
          {selectedCountry && (
            <>
              <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                    {msg.role === 'assistant' && <div style={{ width: 28, height: 28, borderRadius: '50%', background: selectedCountry.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{selectedCountry.flag}</div>}
                    <div style={{ background: msg.role === 'user' ? '#009EDB' : 'rgba(255,255,255,0.07)', color: 'white', padding: '10px 14px', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', fontSize: 13, lineHeight: 1.5, maxWidth: '80%' }}>
                      {fmt(msg.content)}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: selectedCountry.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{selectedCountry.flag}</div>
                    <div style={{ background: 'rgba(255,255,255,0.07)', padding: '10px 14px', borderRadius: '16px 16px 16px 4px', display: 'flex', gap: 4, alignItems: 'center' }}>
                      {[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.4)', display: 'inline-block', animation: `bounce 1s infinite ${i * 0.2}s` }} />)}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  placeholder={`Ask ${selectedCountry.leader}...`}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  disabled={loading}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', padding: '10px 14px', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: "'Source Sans 3', sans-serif" }}
                />
                <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{ background: selectedCountry.color, border: 'none', color: 'white', padding: '10px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 16 }}>➤</button>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`@keyframes bounce { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }`}</style>
    </>
  )
}

export default function Home({ user, logout }) {
  const router = useRouter()
  const [activeProc, setActiveProc] = useState(0)

  return (
    <>
      <Head>
        <title>MUN Toolkit — United Nations</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Source+Sans+3:wght@300;400;600&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ fontFamily: "'Source Sans 3', sans-serif", background: '#f4f6f9', minHeight: '100vh', color: '#1a1a1a' }}>
        {MADE_BY}
        <Chatbot user={user} />

        {/* UN HEADER */}
        <div style={{ background: 'linear-gradient(135deg, #009EDB 0%, #0077b6 100%)', color: 'white', padding: '48px 40px 40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'absolute', bottom: -80, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
          <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                  <div style={{ fontSize: 48 }}>🇺🇳</div>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 900, lineHeight: 1, letterSpacing: -1 }}>MUN Toolkit</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', letterSpacing: 3, textTransform: 'uppercase', marginTop: 6 }}>Model United Nations · Research · Procedures · Strategy</div>
                  </div>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#90ee90', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                  Live Research Platform
                </div>
              </div>
              {user && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Signed in as</div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{user.name || user.username}</div>
                  <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '2px 10px', borderRadius: 3, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', margin: '4px 0' }}>{user.role}</div>
                  <div><button onClick={logout} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.6)', padding: '4px 12px', borderRadius: 3, fontSize: 11, cursor: 'pointer', marginTop: 4 }}>Sign Out</button></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* NAV BAR */}
        <div style={{ background: '#005f8e', borderBottom: '1px solid #004f7a' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 4, height: 44 }}>
            {['🏠 Home', '📜 Procedures', '🗳️ Resolutions', '🌐 Committees', '🗺️ Countries'].map((item, i) => (
              <button key={i} style={{
                background: i === 0 ? 'rgba(255,255,255,0.15)' : 'none',
                border: 'none', color: i === 0 ? 'white' : 'rgba(255,255,255,0.6)',
                padding: '8px 14px', borderRadius: 3, cursor: 'pointer',
                fontSize: 12, fontWeight: 600, fontFamily: "'Source Sans 3', sans-serif", letterSpacing: 0.3,
              }}
              onClick={() => {
                const ids = ['home', 'procedures', 'resolutions', 'committees', 'countries']
                document.getElementById(ids[i])?.scrollIntoView({ behavior: 'smooth' })
              }}>{item}</button>
            ))}
            {user?.role === 'admin' && (
              <button onClick={() => router.push('/admin')} style={{ marginLeft: 'auto', background: 'rgba(201,168,76,0.2)', border: '1px solid rgba(201,168,76,0.5)', color: '#c9a84c', padding: '6px 14px', borderRadius: 3, cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: "'Source Sans 3', sans-serif", letterSpacing: 0.3 }}>⚙️ Admin</button>
            )}
          </div>
        </div>

        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>

          {/* WELCOME */}
          <div id="home" style={{ marginBottom: 32 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div style={{ background: 'white', border: '1px solid #dde3ea', borderRadius: 4, padding: 20, borderTop: '3px solid #009EDB' }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>📜</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>MUN Procedures</div>
                <div style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>Points, motions, caucuses, yields, voting — everything you need to navigate committee.</div>
              </div>
              <div style={{ background: 'white', border: '1px solid #dde3ea', borderRadius: 4, padding: 20, borderTop: '3px solid #1a5c38' }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>🌐</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Committee Guides</div>
                <div style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>HRC, ECOSOC, DISEC, UNEP — mandates, procedures, and key differences.</div>
              </div>
              <div style={{ background: 'white', border: '1px solid #dde3ea', borderRadius: 4, padding: 20, borderTop: '3px solid #c9a84c', cursor: 'pointer' }} onClick={() => router.push('/iran')}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>🇮🇷</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Iran Research Page</div>
                <div style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>Full country research — live intel, power figures, ECOSOC analysis, MUN toolkit.</div>
                <div style={{ marginTop: 10, display: 'inline-block', background: '#1a5c38', color: 'white', padding: '5px 14px', borderRadius: 3, fontSize: 12, fontWeight: 700 }}>
                  {user?.role === 'viewer' ? '🔒 Delegate Access Required' : '→ Open Iran Page'}
                </div>
              </div>
            </div>
          </div>

          {/* PROCEDURES */}
          <div id="procedures" style={{ marginBottom: 32 }}>
            <div style={{ background: '#005f8e', color: '#7dd4f8', padding: '10px 20px', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', fontWeight: 700, borderRadius: '4px 4px 0 0' }}>📜 MUN Procedures</div>
            <div style={{ background: 'white', border: '1px solid #dde3ea', borderBottom: 'none' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid #dde3ea' }}>
                {MUN_PROCEDURES.map((cat, i) => (
                  <button key={i} onClick={() => setActiveProc(i)} style={{ flex: 1, padding: '12px 8px', border: 'none', cursor: 'pointer', background: activeProc === i ? '#f0f8ff' : 'white', borderBottom: activeProc === i ? '2px solid #009EDB' : '2px solid transparent', fontSize: 13, fontWeight: 600, color: activeProc === i ? '#009EDB' : '#666', fontFamily: "'Source Sans 3', sans-serif" }}>
                    {cat.emoji} {cat.category}
                  </button>
                ))}
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ padding: '8px 14px', textAlign: 'left', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: '#999', borderBottom: '1px solid #eee', width: 180 }}>Name</th>
                    <th style={{ padding: '8px 14px', textAlign: 'left', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: '#999', borderBottom: '1px solid #eee' }}>Description</th>
                    <th style={{ padding: '8px 14px', textAlign: 'left', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: '#999', borderBottom: '1px solid #eee', width: 200 }}>When To Use</th>
                    <th style={{ padding: '8px 14px', textAlign: 'center', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: '#999', borderBottom: '1px solid #eee', width: 100 }}>Interrupt?</th>
                  </tr>
                </thead>
                <tbody>
                  {MUN_PROCEDURES[activeProc].items.map((item, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: '#1a1a1a' }}>{item.name}</td>
                      <td style={{ padding: '10px 14px', color: '#555', lineHeight: 1.5 }}>{item.desc}</td>
                      <td style={{ padding: '10px 14px', color: '#777', fontSize: 11, fontStyle: 'italic' }}>{item.when}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                        <span style={{ padding: '2px 8px', borderRadius: 3, fontSize: 10, fontWeight: 700, background: item.interrupt ? '#fde8e6' : '#f0f0f0', color: item.interrupt ? '#c0392b' : '#777' }}>
                          {item.interrupt ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RESOLUTION WRITING */}
          <div id="resolutions" style={{ marginBottom: 32 }}>
            <div style={{ background: '#005f8e', color: '#7dd4f8', padding: '10px 20px', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', fontWeight: 700, borderRadius: '4px 4px 0 0' }}>📄 Resolution Writing</div>
            <div style={{ background: 'white', border: '1px solid #dde3ea', padding: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, marginBottom: 12, color: '#009EDB' }}>Preambulatory Clauses</div>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 10, fontStyle: 'italic' }}>The "whereas" statements — establish context, recall past resolutions, acknowledge facts. Do NOT create action.</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {RESOLUTION_STARTERS.preambulatory.map(s => (
                      <span key={s} style={{ background: '#e6f4ff', color: '#009EDB', padding: '3px 10px', borderRadius: 3, fontSize: 12, fontWeight: 600 }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, marginBottom: 12, color: '#1a5c38' }}>Operative Clauses</div>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 10, fontStyle: 'italic' }}>The action items — what the committee decides, calls for, or urges. These are the binding parts.</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {RESOLUTION_STARTERS.operative.map(s => (
                      <span key={s} style={{ background: '#e6f2ec', color: '#1a5c38', padding: '3px 10px', borderRadius: 3, fontSize: 12, fontWeight: 600 }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                {[
                  { title: 'Sponsors', desc: 'Wrote the resolution and fully support it. Their names appear at the top.' },
                  { title: 'Signatories', desc: 'Want it debated but may not vote for it. Less commitment than sponsoring.' },
                  { title: 'Amendments', desc: 'Friendly = accepted by sponsors. Unfriendly = goes to a vote. Prepare to defend against unfriendly amendments.' },
                ].map(({ title, desc }) => (
                  <div key={title} style={{ background: '#f8fafc', border: '1px solid #e8ecf0', borderRadius: 4, padding: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{title}</div>
                    <div style={{ fontSize: 12, color: '#666', lineHeight: 1.5 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COMMITTEES */}
          <div id="committees" style={{ marginBottom: 32 }}>
            <div style={{ background: '#005f8e', color: '#7dd4f8', padding: '10px 20px', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', fontWeight: 700, borderRadius: '4px 4px 0 0' }}>🌐 UN Committees Overview</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#dde3ea' }}>
              {COMMITTEES.map(c => (
                <div key={c.name} style={{ background: 'white', padding: 20 }}>
                  <div style={{ borderLeft: `3px solid ${c.color}`, paddingLeft: 12, marginBottom: 10 }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: c.color }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{c.full}</div>
                  </div>
                  <div style={{ fontSize: 12, color: '#555', lineHeight: 1.5 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* COUNTRY PAGES */}
          <div id="countries" style={{ marginBottom: 32 }}>
            <div style={{ background: '#005f8e', color: '#7dd4f8', padding: '10px 20px', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', fontWeight: 700, borderRadius: '4px 4px 0 0' }}>🗺️ Country Research Pages</div>
            <div style={{ background: 'white', border: '1px solid #dde3ea', padding: 24 }}>

              {/* IRAN */}
              <div onClick={() => (user?.role === 'viewer') ? null : router.push('/iran')} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: 20, border: '1px solid #e0d8cc', borderRadius: 4, background: '#faf7f2', cursor: user?.role === 'viewer' ? 'not-allowed' : 'pointer', transition: 'all 0.15s', maxWidth: 500, opacity: user?.role === 'viewer' ? 0.6 : 1 }}>
                <div style={{ fontSize: 48 }}>🇮🇷</div>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700 }}>Islamic Republic of Iran</div>
                  <div style={{ fontSize: 12, color: '#888', margin: '4px 0' }}>ECOSOC Committee · March 2026</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                    {['Live Intel', 'Power Figures', 'ECOSOC Analysis', 'MUN Toolkit', 'AI Chatbot'].map(tag => (
                      <span key={tag} style={{ background: '#e6f2ec', color: '#1a5c38', padding: '2px 8px', borderRadius: 3, fontSize: 11, fontWeight: 600 }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ marginTop: 12 }}>
                    {user?.role === 'viewer' ? <span style={{ background: '#f0f0f0', color: '#888', padding: '6px 14px', borderRadius: 3, fontSize: 12, fontWeight: 700 }}>🔒 Delegate Access Required</span> : <span style={{ background: '#1a5c38', color: 'white', padding: '6px 14px', borderRadius: 3, fontSize: 12, fontWeight: 700 }}>→ Open Iran Research Page</span>}
                  </div>
                </div>
              </div>

              {/* CHINA */}
              <div onClick={() => (user?.role === 'viewer') ? null : router.push('/china')} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: 20, border: '1px solid #e8d8d8', borderRadius: 4, background: '#fff8f8', cursor: user?.role === 'viewer' ? 'not-allowed' : 'pointer', transition: 'all 0.15s', maxWidth: 500, marginTop: 12, opacity: user?.role === 'viewer' ? 0.6 : 1 }}>
                <div style={{ fontSize: 48 }}>🇨🇳</div>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700 }}>People's Republic of China</div>
                  <div style={{ fontSize: 12, color: '#888', margin: '4px 0' }}>ECOSOC Committee · March 2026</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                    {['Live Intel', 'Power Figures', 'Taiwan Analysis', 'Xinjiang Briefing', 'AI Chatbot'].map(tag => (
                      <span key={tag} style={{ background: '#fde8e8', color: '#cc0000', padding: '2px 8px', borderRadius: 3, fontSize: 11, fontWeight: 600 }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ marginTop: 12 }}>
                    {user?.role === 'viewer' ? <span style={{ background: '#f0f0f0', color: '#888', padding: '6px 14px', borderRadius: 3, fontSize: 12, fontWeight: 700 }}>🔒 Delegate Access Required</span> : <span style={{ background: '#cc0000', color: 'white', padding: '6px 14px', borderRadius: 3, fontSize: 12, fontWeight: 700 }}>→ Open China Research Page</span>}
                  </div>
                </div>
              </div>

              {/* NIGERIA */}
              <div onClick={() => (user?.role === 'viewer') ? null : router.push('/nigeria')} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: 20, border: '1px solid #d8e8d8', borderRadius: 4, background: '#f8fff8', cursor: user?.role === 'viewer' ? 'not-allowed' : 'pointer', transition: 'all 0.15s', maxWidth: 500, marginTop: 12, opacity: user?.role === 'viewer' ? 0.6 : 1 }}>
                <div style={{ fontSize: 48 }}>🇳🇬</div>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700 }}>Federal Republic of Nigeria</div>
                  <div style={{ fontSize: 12, color: '#888', margin: '4px 0' }}>ECOSOC · HRC · DISEC · UNEP · March 2026</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                    {['Live Intel', 'Power Figures', 'Security Analysis', 'MUN Toolkit', 'AI Chatbot'].map(tag => (
                      <span key={tag} style={{ background: '#e6f2ec', color: '#008751', padding: '2px 8px', borderRadius: 3, fontSize: 11, fontWeight: 600 }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ marginTop: 12 }}>
                    {user?.role === 'viewer' ? <span style={{ background: '#f0f0f0', color: '#888', padding: '6px 14px', borderRadius: 3, fontSize: 12, fontWeight: 700 }}>🔒 Delegate Access Required</span> : <span style={{ background: '#008751', color: 'white', padding: '6px 14px', borderRadius: 3, fontSize: 12, fontWeight: 700 }}>→ Open Nigeria Research Page</span>}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 14, padding: 14, background: '#f8fafc', border: '1px dashed #dde3ea', borderRadius: 4, fontSize: 12, color: '#999', fontStyle: 'italic' }}>More country pages coming soon.</div>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div style={{ background: '#005f8e', color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: 20, fontSize: 11, letterSpacing: 1 }}>
          🇺🇳 &nbsp; MUN TOOLKIT &nbsp;·&nbsp; MODEL UNITED NATIONS &nbsp;·&nbsp; FOR EDUCATIONAL USE ONLY
        </div>

      </div>
    </>
  )
}
