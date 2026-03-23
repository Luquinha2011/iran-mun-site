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
  { name: "Islamic Republic of Iran", flag: "🇮🇷", route: '/iran', committee: 'ECOSOC', tags: ['Live Intel', 'Power Figures', 'ECOSOC Analysis', 'MUN Toolkit', 'AI Chatbot'], tagColor: '#1a5c38', btnColor: '#1a5c38', border: '#e0d8cc', bg: '#faf7f2', keywords: ['iran', 'tehran', 'khamenei', 'irgc', 'nuclear', 'sanctions', 'persian', 'shia'] },
  { name: "People's Republic of China", flag: "🇨🇳", route: '/china', committee: 'ECOSOC', tags: ['Live Intel', 'Power Figures', 'Taiwan Analysis', 'Xinjiang Briefing', 'AI Chatbot'], tagColor: '#cc0000', btnColor: '#cc0000', border: '#e8d8d8', bg: '#fff8f8', keywords: ['china', 'beijing', 'xi jinping', 'taiwan', 'xinjiang', 'belt and road', 'ccp', 'mandarin'] },
  { name: "Federal Republic of Nigeria", flag: "🇳🇬", route: '/nigeria', committee: 'ECOSOC · HRC · DISEC · UNEP', tags: ['Live Intel', 'Power Figures', 'Security Analysis', 'MUN Toolkit', 'AI Chatbot'], tagColor: '#008751', btnColor: '#008751', border: '#d8e8d8', bg: '#f8fff8', keywords: ['nigeria', 'abuja', 'lagos', 'tinubu', 'boko haram', 'niger delta', 'naira', 'ecowas', 'africa'] },
  { name: "French Republic", flag: "🇫🇷", route: '/france', committee: 'ECOSOC · HRC · DISEC · UNEP · P5', tags: ['Live Intel', 'Power Figures', 'Nuclear Strategy', 'MUN Toolkit', 'AI Chatbot'], tagColor: '#00209F', btnColor: '#00209F', border: '#d8d8f0', bg: '#f8f8ff', keywords: ['france', 'paris', 'macron', 'nato', 'nuclear', 'p5', 'veto', 'eu', 'europe', 'francophonie', 'sahel'] },
]

const MADE_BY = (
  <div style={{ position: 'fixed', top: 10, left: 10, zIndex: 9999, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, fontFamily: "'Source Sans 3', sans-serif", letterSpacing: 0.5, pointerEvents: 'none' }}>✦ Made by Luquinha</div>
)

function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ role: 'assistant', content: "Hello! I am Sacul, your MUN research assistant. Ask me anything about procedures, resolution writing, committee rules, or how to argue any country's position." }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  useEffect(() => { if (open && messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' }) }, [messages, open])
  const SUGGESTIONS = ["How do I write a preambulatory clause?", "What is a moderated caucus?", "How do I argue Iran's position at ECOSOC?", "How do I argue China's position on Taiwan?", "What are the strongest arguments for Nigeria at DISEC?", "How do I respond to a Point of Order?"]
  const sendMessage = async (text) => {
    const userText = text || input.trim(); if (!userText || loading) return
    setInput(''); setLoading(true)
    const newMessages = [...messages, { role: 'user', content: userText }]
    setMessages(newMessages)
    try {
      const res = await fetch('/api/chat-home', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: newMessages }) })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Sorry, please try again.' }])
    } catch { setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]) }
    finally { setLoading(false) }
  }
  const fmt = (text) => text.split('\n').map((line, i) => { const b = line.trim().startsWith('- ') || line.trim().startsWith('• '); const c = line.replace(/^[-•]\s+/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); return <div key={i} style={{ display: 'flex', gap: b ? 8 : 0, marginBottom: line.trim() ? 4 : 2 }}>{b && <span style={{ color: '#009EDB', flexShrink: 0 }}>→</span>}<span dangerouslySetInnerHTML={{ __html: c }} /></div> })
  return (
    <>
      <button onClick={() => setOpen(o => !o)} style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000, background: '#009EDB', color: 'white', border: 'none', borderRadius: open ? '50%' : 30, padding: open ? '14px' : '12px 20px', fontSize: open ? 18 : 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,158,219,0.4)', display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Source Sans 3', sans-serif", transition: 'all 0.2s' }}>
        {open ? '✕' : <><span>💬</span><span>Sacul AI</span></>}
      </button>
      {open && (
        <div style={{ position: 'fixed', bottom: 80, right: 24, zIndex: 999, width: 380, height: 520, background: '#0a1628', borderRadius: 12, boxShadow: '0 8px 40px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: "'Source Sans 3', sans-serif" }}>
          <div style={{ background: 'linear-gradient(135deg, #005f8e, #009EDB)', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'white' }}>🇺🇳 MUN Assistant</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>Procedures · Resolutions · Country Positions</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 16 }}>✕</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.role === 'assistant' && <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#009EDB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🤖</div>}
                <div style={{ maxWidth: '80%', padding: '8px 12px', borderRadius: 10, fontSize: 12, lineHeight: 1.5, background: msg.role === 'user' ? '#009EDB' : 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.85)', borderBottomRightRadius: msg.role === 'user' ? 2 : 10, borderBottomLeftRadius: msg.role === 'assistant' ? 2 : 10 }}>
                  {fmt(msg.content)}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#009EDB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🤖</div>
                <div style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', display: 'flex', gap: 4, alignItems: 'center' }}>
                  {[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#009EDB', display: 'inline-block', animation: `bounce 1s ${i * 0.2}s infinite` }} />)}
                </div>
              </div>
            )}
            {messages.length === 1 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Suggested questions</div>
                {SUGGESTIONS.map((q, i) => <button key={i} onClick={() => sendMessage(q)} style={{ display: 'block', width: '100%', textAlign: 'left', background: 'rgba(0,158,219,0.08)', border: '1px solid rgba(0,158,219,0.2)', color: 'rgba(255,255,255,0.7)', padding: '6px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer', marginBottom: 4, fontFamily: "'Source Sans 3', sans-serif" }}>{q}</button>)}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8 }}>
            <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Ask anything about MUN..." disabled={loading} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '8px 12px', borderRadius: 6, fontSize: 12, outline: 'none', fontFamily: "'Source Sans 3', sans-serif" }} />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{ background: '#009EDB', border: 'none', color: 'white', padding: '8px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}>➤</button>
          </div>
        </div>
      )}
      <style>{`@keyframes bounce { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }`}</style>
    </>
  )
}

export default function Home({ user, logout }) {
  const router = useRouter()
  const [activeProc, setActiveProc] = useState(0)
  const [countrySearch, setCountrySearch] = useState('')
  const isPlus = user?.role === 'plus' || user?.role === 'admin'

  const filteredCountries = COUNTRIES.filter(c => {
    if (!countrySearch) return true
    const q = countrySearch.toLowerCase()
    return c.name.toLowerCase().includes(q) || c.committee.toLowerCase().includes(q) || c.keywords.some(k => k.includes(q))
  })

  return (
    <>
      <Head>
        <title>MUN Toolkit — United Nations</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Source+Sans+3:wght@300;400;600&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ fontFamily: "'Source Sans 3', sans-serif", background: '#f4f6f9', minHeight: '100vh', color: '#1a1a1a' }}>
        {MADE_BY}
        {isPlus && <Chatbot />}

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
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>Hello,</div>
                  <div style={{ fontWeight: 700, fontSize: 18, fontFamily: "'Playfair Display', serif" }}>{user.name || user.username} 👋</div>
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
              <button key={i} style={{ background: i === 0 ? 'rgba(255,255,255,0.15)' : 'none', border: 'none', color: i === 0 ? 'white' : 'rgba(255,255,255,0.6)', padding: '8px 14px', borderRadius: 3, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: "'Source Sans 3', sans-serif", letterSpacing: 0.3 }}
                onClick={() => { const ids = ['home', 'procedures', 'resolutions', 'committees', 'countries']; document.getElementById(ids[i])?.scrollIntoView({ behavior: 'smooth' }) }}>{item}</button>
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
                <div style={{ marginTop: 10, display: 'inline-block', background: '#1a5c38', color: 'white', padding: '5px 14px', borderRadius: 3, fontSize: 12, fontWeight: 700 }}>→ Open Iran Page</div>
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

              {/* COUNTRY SEARCH */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ position: 'relative', maxWidth: 400 }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: '#999' }}>🔍</span>
                  <input
                    type="text"
                    placeholder="Search countries — Iran, China, Nigeria, France, ECOSOC..."
                    value={countrySearch}
                    onChange={e => setCountrySearch(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #dde3ea', borderRadius: 6, fontSize: 13, outline: 'none', fontFamily: "'Source Sans 3', sans-serif", color: '#1a1a1a', background: '#f8fafc', boxSizing: 'border-box' }}
                  />
                  {countrySearch && <button onClick={() => setCountrySearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#999' }}>✕</button>}
                </div>
                {countrySearch && <div style={{ fontSize: 12, color: '#999', marginTop: 6 }}>{filteredCountries.length} result{filteredCountries.length !== 1 ? 's' : ''} for "{countrySearch}"</div>}
              </div>

              {/* COUNTRY LIST */}
              {filteredCountries.length === 0 ? (
                <div style={{ padding: '24px 0', textAlign: 'center', color: '#999', fontSize: 13, fontStyle: 'italic' }}>No countries found for "{countrySearch}"</div>
              ) : (
                filteredCountries.map((c, idx) => (
                  <div key={c.route} onClick={() => user?.role !== 'viewer' && router.push(c.route)}
                    style={{ display: 'flex', alignItems: 'center', gap: 20, padding: 20, border: `1px solid ${c.border}`, borderRadius: 4, background: c.bg, cursor: user?.role === 'viewer' ? 'not-allowed' : 'pointer', transition: 'all 0.15s', maxWidth: 500, marginTop: idx > 0 ? 12 : 0, opacity: user?.role === 'viewer' ? 0.6 : 1 }}>
                    <div style={{ fontSize: 48 }}>{c.flag}</div>
                    <div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700 }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: '#888', margin: '4px 0' }}>{c.committee} · March 2026</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                        {c.tags.map(tag => <span key={tag} style={{ background: c.tagColor + '18', color: c.tagColor, padding: '2px 8px', borderRadius: 3, fontSize: 11, fontWeight: 600 }}>{tag}</span>)}
                      </div>
                      <div style={{ marginTop: 12 }}>
                        {user?.role === 'viewer'
                          ? <span style={{ background: '#f0f0f0', color: '#888', padding: '6px 14px', borderRadius: 3, fontSize: 12, fontWeight: 700 }}>🔒 Delegate Access Required</span>
                          : <span style={{ background: c.btnColor, color: 'white', padding: '6px 14px', borderRadius: 3, fontSize: 12, fontWeight: 700 }}>→ Open {c.name.split(' ').pop()} Research Page</span>
                        }
                      </div>
                    </div>
                  </div>
                ))
              )}

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
