// pages/france.js — France Research Page (all logged-in users)
import { useState, useEffect, useRef, useCallback } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

const NAV_SECTIONS = [
  { id: 'live-intelligence', label: '🔴 Live Intel' },
  { id: 'power-figures', label: '👑 Power Figures' },
  { id: 'geography', label: '📍 Geography' },
  { id: 'people', label: '👥 People' },
  { id: 'government', label: '🏛️ Government' },
  { id: 'history', label: '📅 History' },
  { id: 'committees', label: '🌐 Committees' },
  { id: 'toolkit', label: '🎤 MUN Toolkit' },
]

const QUICK_STATS = [
  { label: "Population", value: "68.4M", unit: "20th globally" },
  { label: "Area", value: "643,801 km²", unit: "Largest in EU" },
  { label: "GDP (nominal)", value: "$3.05T", unit: "7th globally" },
  { label: "GDP per capita", value: "$44,408", unit: "USD (2023)" },
  { label: "Capital", value: "Paris", unit: "Pop. 2.1 million" },
  { label: "Literacy Rate", value: "99%", unit: "2022 estimate" },
  { label: "Military Rank", value: "#8", unit: "of 145 nations" },
  { label: "UN Member Since", value: "1945", unit: "Founding + P5 member" },
  { label: "Nuclear Warheads", value: "~290", unit: "3rd largest arsenal" },
]

const TIMELINE = [
  { year: "496 AD", text: "Clovis I unites the Frankish tribes and converts to Christianity — foundation of what will become France." },
  { year: "800", text: "Charlemagne crowned Holy Roman Emperor. Frankish Empire dominates Western Europe." },
  { year: "1337–1453", text: "Hundred Years' War against England. Joan of Arc leads French forces to key victories before being burned at the stake in 1431." },
  { year: "1789", text: "French Revolution. Monarchy overthrown. Declaration of the Rights of Man. Reign of Terror follows — thousands guillotined." },
  { year: "1799–1815", text: "Napoleon Bonaparte seizes power. French Empire dominates Europe. Defeated at Waterloo 1815 — Napoleon exiled to Saint Helena." },
  { year: "1870–1871", text: "Franco-Prussian War. France defeated. Paris Commune uprising crushed. Third Republic established." },
  { year: "1914–1918", text: "World War I. France suffers catastrophic losses — 1.4 million soldiers killed. Western Front largely fought on French soil." },
  { year: "1939–1945", text: "World War II. France occupied by Nazi Germany 1940-1944. Vichy regime collaborates. De Gaulle leads Free French from London. Liberation 1944." },
  { year: "1946", text: "Fourth Republic established. France becomes founding member of the UN and permanent Security Council member." },
  { year: "1958", text: "Fifth Republic established under de Gaulle — semi-presidential system that remains today." },
  { year: "1960", text: "France detonates its first nuclear weapon — becomes the 4th nuclear power. Most African colonies gain independence." },
  { year: "1992", text: "Maastricht Treaty signed — France is a founding member of the European Union." },
  { year: "2015", text: "Paris terrorist attacks — 130 killed at Bataclan and across the city. France declares state of emergency." },
  { year: "2017", text: "Emmanuel Macron elected President — youngest ever at 39. En Marche! movement upends traditional party politics." },
  { year: "2019", text: "Yellow Vest (Gilets Jaunes) protests paralyse France for months — fuel tax revolt becomes broader anti-establishment movement." },
  { year: "2022", text: "Macron re-elected — first president re-elected since Chirac in 2002. Loses parliamentary majority." },
  { year: "2024", text: "Paris Olympics. Macron calls snap elections — left-wing coalition wins most seats but no majority. Political deadlock." },
  { year: "March 2026", text: "France navigates political fragmentation at home while leading European responses to Ukraine, supporting NATO expansion, and asserting strategic autonomy from the US." },
]

const VOCAB = [
  { term: "P5", meaning: "The five permanent members of the UN Security Council — US, UK, France, Russia, China — each holding veto power", why: "France is a P5 member — it can veto any Security Council resolution, giving it enormous leverage" },
  { term: "La Francophonie", meaning: "The Organisation internationale de la Francophonie — 88 member states sharing French language and culture", why: "France uses this as a tool of soft power and diplomatic influence, particularly in Africa" },
  { term: "Opération Barkhane", meaning: "France's counterterrorism military operation in the Sahel — ended 2022 after host nations expelled French forces", why: "France's retreat from the Sahel is a major foreign policy setback — relevant to DISEC and ECOSOC discussions" },
  { term: "Strategic Autonomy", meaning: "France's doctrine of maintaining independent military and diplomatic capability — not fully dependent on NATO or the US", why: "Core to understanding French foreign policy — France often breaks with allies to assert independence" },
  { term: "Force de Frappe", meaning: "France's independent nuclear deterrent — submarines, aircraft, and land-based missiles", why: "France is the only EU nuclear power — this gives it unique leverage in DISEC discussions" },
  { term: "Élysée Palace", meaning: "The official residence and workplace of the French President", why: "When analysts say 'the Élysée decided', they mean the President made the call — France's semi-presidential system concentrates enormous power in the presidency" },
  { term: "Laïcité", meaning: "France's strict principle of secularism — separation of religion from public life", why: "Drives French positions on religious freedom, headscarf bans, and human rights at the HRC" },
  { term: "Françafrique", meaning: "France's historically close — and often exploitative — relationship with its former African colonies", why: "Growing resentment of French influence in Africa — military expulsions from Mali, Burkina Faso, Niger — is reshaping French foreign policy" },
  { term: "Cohabitation", meaning: "When the French President and Prime Minister are from opposing political parties", why: "France's current political fragmentation makes this dynamic relevant to understanding French decision-making" },
]

const POWER_FIGURES = [
  { rank: 1, name: "Emmanuel Macron", position: "President of France", institution: "Élysée Palace", power: "Head of state. Controls foreign policy, defence, and nuclear weapons. Commands the armed forces. The most powerful individual in the French system — especially in foreign affairs.", health: "✅ Active — serving second term, politically weakened domestically but still dominant in foreign policy.", powerScore: 100, status: "active", note: "Despite losing his parliamentary majority in 2024, Macron retains near-total control of French foreign policy under the Fifth Republic constitution." },
  { rank: 2, name: "François Bayrou", position: "Prime Minister of France", institution: "Hôtel Matignon", power: "Head of government. Manages domestic policy, the budget, and parliamentary relations. Constitutionally subordinate to the President in foreign affairs.", health: "✅ Active — appointed January 2025.", powerScore: 62, status: "active", note: "Macron's long-standing ally. His appointment reflects Macron's need for centrist coalition partners." },
  { rank: 3, name: "Jean-Noël Barrot", position: "Minister for Europe and Foreign Affairs", institution: "Quai d'Orsay", power: "Leads French diplomacy. Represents France internationally. Implements Macron's foreign policy vision.", health: "✅ Active.", powerScore: 58, status: "active", note: "Young centrist diplomat. Seen as a close Macron loyalist." },
  { rank: 4, name: "Sébastien Lecornu", position: "Minister of Defence", institution: "Ministry of Armed Forces", power: "Oversees France's €50 billion+ defence budget, nuclear arsenal, and all military operations.", health: "✅ Active.", powerScore: 60, status: "active", note: "Has managed France's significant military support to Ukraine and the reorganisation of French forces post-Sahel withdrawal." },
  { rank: 5, name: "Marine Le Pen", position: "Leader, Rassemblement National (RN)", institution: "National Assembly", power: "Leader of France's largest opposition party. Her party controls the largest single bloc in parliament. Can bring down governments.", health: "✅ Active — facing potential ban from politics over EU funds conviction.", powerScore: 70, status: "active", note: "Convicted of misusing EU funds in March 2025. If appeal fails she may be barred from the 2027 presidential election." },
  { rank: 6, name: "Jean-Luc Mélenchon", position: "Leader, La France Insoumise (LFI)", institution: "National Assembly", power: "Leader of the hard-left party — the largest component of the left-wing NFP coalition.", health: "✅ Active.", powerScore: 55, status: "active", note: "Strongly anti-NATO and pro-Palestinian. His foreign policy positions are the polar opposite of Macron's." },
  { rank: 7, name: "Nicolas Sarkozy", position: "Former President / Senior Political Figure", institution: "Republican Party", power: "Convicted of corruption — sentenced to prison in multiple cases. Still influential within the centre-right.", health: "🔒 Under legal restrictions — appealing prison sentence.", powerScore: 25, status: "restricted", note: "His legal troubles have significantly reduced his political influence." },
  { rank: 8, name: "Gérald Darmanin", position: "Former Interior Minister / Senior Figure", institution: "Republican Party aligned", power: "Former Interior Minister — oversaw France's controversial immigration and security policies.", health: "✅ Active — now in opposition.", powerScore: 40, status: "active", note: "Considered a potential presidential candidate in 2027." },
  { rank: 9, name: "Bruno Retailleau", position: "Minister of the Interior", institution: "Ministry of the Interior", power: "Controls France's police, domestic security, and immigration enforcement.", health: "✅ Active.", powerScore: 52, status: "active", note: "Conservative hardliner on immigration — frequently at odds with Macron's centrist instincts." },
  { rank: 10, name: "Nicolas Hieronimus", position: "CEO, L'Oréal / Senior Business Figure", institution: "French Corporate Sector", power: "Heads France's most globally recognised consumer brand. Represents French soft power through luxury and culture.", health: "✅ Active.", powerScore: 35, status: "active", note: "France's economic diplomacy runs through its luxury, aerospace, energy, and defence sectors as much as its government." },
]

const DEFAULT_DYNAMIC = {
  leadership: { title: "Macron's Second Term — Strategic Autonomy Under Pressure", situation: "Emmanuel Macron is navigating his second and final presidential term without a parliamentary majority, facing the strongest far-right challenge in French history from Marine Le Pen's Rassemblement National. Internationally, France is asserting strategic autonomy from the United States, leading European support for Ukraine, and rebuilding its relationships in Africa after a series of humiliating military expulsions from Mali, Burkina Faso, and Niger.", mun_note: "France will present itself as a bridge between the Global North and Global South, a champion of multilateralism, and the indispensable European power at the UN Security Council." },
  security: { current_status: "Active engagements — Ukraine support, Middle East, Indo-Pacific", latest_development: "France is among the largest European supporters of Ukraine, providing Caesar artillery systems, AMX-10RC armoured vehicles, and Mirage jets. French forces have withdrawn from the Sahel but maintain bases in Chad, Djibouti, Gabon, Ivory Coast, and Senegal.", economic_impact: "France's defence budget has increased to €50 billion — the largest peacetime military spending increase in decades. NATO commitments and Ukraine support are straining the budget.", france_argument: "France argues for European strategic autonomy — the capacity to defend European interests without total dependence on the United States. This is not anti-American but pro-European." },
  economy: { current_status: "Moderate growth — fiscal pressure, debt concerns", latest_development: "France's public debt exceeds 110% of GDP. Credit rating agencies have downgraded French debt. The government is attempting to cut €40 billion from the budget amid political deadlock.", economic_impact: "Unemployment at 7.3%. Youth unemployment at 17%. Energy transition costs significant. French luxury sector (LVMH, Hermès, L'Oréal) remains globally dominant.", france_argument: "France calls for reform of EU fiscal rules to allow greater public investment in the green transition and defence — arguing that austerity undermines European competitiveness." },
  ecosoc_current: { status: "Active P5 member — champions multilateralism and development", latest: "France is the 5th largest contributor to the UN regular budget. It champions the Sustainable Development Goals, climate finance, and global health initiatives. Paris Agreement was signed in France — climate diplomacy is a French brand.", france_position: "France consistently argues that multilateralism — the rules-based international order — is the only framework that can address global challenges. It positions itself as a defender of international law against both great power unilateralism and nationalist isolationism." },
  last_updated: "Default content — click Update All Sections to regenerate",
}

function Box({ type = 'highlight', title, children }) {
  return <div className={`box ${type}`}>{title && <div className="box-title">{title}</div>}<p>{children}</p></div>
}
function InfoRow({ label, value, note }) {
  return <div className="info-row"><span className="info-label">{label}</span><span className={`info-value${note ? ' note' : ''}`}>{value}</span></div>
}
function SectionDivider({ emoji, title }) {
  return <div className="section-divider" style={{ background: '#00209F' }}>{emoji} {title}</div>
}
function Card({ emoji, title, fullWidth, children }) {
  return <div className={`card${fullWidth ? ' full-width' : ''}`}><div className="card-header"><span>{emoji}</span><h2>{title}</h2></div><div className="card-body">{children}</div></div>
}

function NewsSection({ news, loading }) {
  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--light)' }}><div className="spinner" style={{ margin: '0 auto 12px' }}></div><div style={{ fontSize: 13 }}>Fetching latest news...</div></div>
  if (!news || news.length === 0) return <div style={{ padding: 20, color: 'var(--light)', fontSize: 13, fontStyle: 'italic' }}>Add your NewsAPI key in Vercel environment variables to enable live news.</div>
  return (
    <div className="news-grid">
      {news.map(cat => (
        <div key={cat.category}>
          <div className="news-category-title">{cat.label}</div>
          {cat.articles.length === 0 ? <div className="news-empty">No articles found.</div> : cat.articles.map((a, i) => (
            <div key={i} className="news-item">
              <a className="news-item-title" href={a.url} target="_blank" rel="noopener noreferrer">{a.title}</a>
              {a.description && <div style={{ fontSize: 12, color: 'var(--mid)', marginTop: 3, lineHeight: 1.4 }}>{a.description.slice(0, 120)}...</div>}
              <div className="news-item-meta">{a.source} · {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function AIBriefing({ briefing, loading }) {
  if (loading) return <div className="briefing-card"><div className="briefing-header"><h2>🤖 AI Intelligence Briefing</h2></div><div className="briefing-empty"><div className="spinner" style={{ margin: '0 auto 12px', borderColor: '#00209F', borderTopColor: '#ED2939' }}></div>Generating briefing...</div></div>
  if (!briefing) return <div className="briefing-card" style={{ background: 'linear-gradient(135deg, #00209F, #003580)' }}><div className="briefing-header"><h2>🤖 AI Intelligence Briefing</h2></div><div className="briefing-empty">Click AI Briefing to get a comprehensive intelligence analysis based on the latest news.</div></div>
  return (
    <div className="briefing-card" style={{ background: 'linear-gradient(135deg, #00209F, #003580)' }}>
      <div className="briefing-header">
        <h2>🤖 AI Intelligence Briefing</h2>
        {briefing.last_updated && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{new Date(briefing.last_updated).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>}
      </div>
      <div className="briefing-body">
        {briefing.summary && <div className="briefing-section"><div className="briefing-label">📋 Executive Summary</div><div className="briefing-text">{briefing.summary}</div></div>}
        {briefing.situation_overview && <div className="briefing-section"><div className="briefing-label">🌍 Situation Overview</div><div className="briefing-text">{briefing.situation_overview}</div></div>}
        <div className="briefing-grid">
          {briefing.ecosoc_impact && <div className="briefing-box"><div className="briefing-label">🌐 Committee Impact</div><div className="briefing-text">{briefing.ecosoc_impact}</div></div>}
          {briefing.security_update && <div className="briefing-box"><div className="briefing-label">🔒 Security Update</div><div className="briefing-text">{briefing.security_update}</div></div>}
          {briefing.economy_update && <div className="briefing-box"><div className="briefing-label">💰 Economy Update</div><div className="briefing-text">{briefing.economy_update}</div></div>}
          {briefing.leadership_update && <div className="briefing-box"><div className="briefing-label">👤 Leadership</div><div className="briefing-text">{briefing.leadership_update}</div></div>}
        </div>
        {briefing.talking_points?.length > 0 && <div className="briefing-section"><div className="briefing-label">🗣️ Talking Points</div><ul className="briefing-points">{briefing.talking_points.map((p, i) => <li key={i}>{p}</li>)}</ul></div>}
        {briefing.counter_arguments?.length > 0 && <div className="briefing-section"><div className="briefing-label">⚔️ Counter-Arguments</div><ul className="briefing-points">{briefing.counter_arguments.map((p, i) => <li key={i}>{p}</li>)}</ul></div>}
        {briefing.watch_out_for && <div className="briefing-section"><div className="briefing-label" style={{ color: '#ff9999' }}>⚠️ Watch Out For</div><div className="briefing-text">{briefing.watch_out_for}</div></div>}
        {briefing.recommended_actions?.length > 0 && <div className="briefing-section"><div className="briefing-label" style={{ color: '#90ee90' }}>✅ Recommended Actions</div><ul className="briefing-points">{briefing.recommended_actions.map((p, i) => <li key={i}>{p}</li>)}</ul></div>}
      </div>
    </div>
  )
}

function useSearch() {
  const [query, setQuery] = useState('')
  const [highlights, setHighlights] = useState([])
  const [current, setCurrent] = useState(-1)
  const rootRef = useRef(null)
  const clearMarks = useCallback(() => { document.querySelectorAll('mark.sh').forEach(m => { m.parentNode?.replaceChild(document.createTextNode(m.textContent), m); m.parentNode?.normalize() }); setHighlights([]); setCurrent(-1) }, [])
  const doSearch = useCallback((q) => {
    clearMarks(); if (!q || q.length < 2) return
    const root = rootRef.current || document.body
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode(node) { const p = node.parentElement; if (!p) return NodeFilter.FILTER_REJECT; if (p.closest('.search-bar') || p.closest('.update-panel')) return NodeFilter.FILTER_REJECT; if (['SCRIPT','STYLE'].includes(p.tagName)) return NodeFilter.FILTER_REJECT; if (node.nodeValue.trim() === '') return NodeFilter.FILTER_REJECT; return NodeFilter.FILTER_ACCEPT } })
    const nodes = []; let n; while ((n = walker.nextNode())) nodes.push(n)
    const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const marks = []
    nodes.forEach(node => { const val = node.nodeValue; if (!regex.test(val)) return; regex.lastIndex = 0; const frag = document.createDocumentFragment(); let last = 0, m; while ((m = regex.exec(val)) !== null) { if (m.index > last) frag.appendChild(document.createTextNode(val.slice(last, m.index))); const mark = document.createElement('mark'); mark.className = 'sh'; mark.textContent = m[0]; frag.appendChild(mark); marks.push(mark); last = regex.lastIndex }; if (last < val.length) frag.appendChild(document.createTextNode(val.slice(last))); node.parentNode.replaceChild(frag, node) })
    setHighlights(marks); if (marks.length > 0) { marks[0].classList.add('active'); marks[0].scrollIntoView({ behavior: 'smooth', block: 'center' }); setCurrent(0) }
  }, [clearMarks])
  const jump = useCallback((dir) => { setHighlights(prev => { if (prev.length === 0) return prev; setCurrent(c => { const next = (c + dir + prev.length) % prev.length; prev[c >= 0 ? c : 0]?.classList.remove('active'); prev[next].classList.add('active'); prev[next].scrollIntoView({ behavior: 'smooth', block: 'center' }); return next }); return prev }) }, [])
  return { query, setQuery, highlights, current, doSearch, clearMarks, jump, rootRef }
}

function NavBar({ router }) {
  const [active, setActive] = useState('')
  useEffect(() => {
    const h = () => { const secs = NAV_SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean); let cur = ''; secs.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id }); setActive(cur) }
    window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h)
  }, [])
  return (
    <nav style={{ background: '#00209F', borderBottom: '1px solid rgba(237,41,57,0.3)', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 48 }}>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: '#ffffff', fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>🇺🇳 MUN Toolkit</button>
        <div style={{ display: 'flex', gap: 2, flexWrap: 'nowrap' }}>
          {NAV_SECTIONS.map(({ id, label }) => (
            <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: active === id ? 'rgba(237,41,57,0.2)' : 'none', border: 'none', color: active === id ? '#ffffff' : 'rgba(255,255,255,0.5)', padding: '6px 10px', borderRadius: 3, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: "'Source Sans 3', sans-serif" }}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ role: 'assistant', content: "Bonjour! I am your France MUN research assistant. Ask me anything about France's position at ECOSOC, HRC, DISEC, or UNEP, its foreign policy, nuclear strategy, or MUN procedures." }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  useEffect(() => { if (open && messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' }) }, [messages, open])
  const SUGGESTIONS = ["What is France's position on nuclear disarmament at DISEC?", "How does France use its P5 veto?", "What is strategic autonomy?", "How does laïcité affect France's HRC positions?", "What is Françafrique and why does it matter?"]
  const sendMessage = async (text) => {
    const userText = text || input.trim(); if (!userText || loading) return
    setInput(''); setLoading(true)
    const newMessages = [...messages, { role: 'user', content: userText }]
    setMessages(newMessages)
    try {
      const res = await fetch('/api/chat-france', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: newMessages }) })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Sorry, please try again.' }])
    } catch { setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]) }
    finally { setLoading(false) }
  }
  const fmt = (text) => text.split('\n').map((line, i) => { const b = line.trim().startsWith('- ') || line.trim().startsWith('• '); const c = line.replace(/^[-•]\s+/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); return <div key={i} style={{ display: 'flex', gap: b ? 8 : 0, marginBottom: line.trim() ? 4 : 2 }}>{b && <span style={{ color: '#ED2939', flexShrink: 0 }}>→</span>}<span dangerouslySetInnerHTML={{ __html: c }} /></div> })
  return (
    <>
      <button className="chat-fab" style={{ background: '#ED2939' }} onClick={() => setOpen(o => !o)} title="Ask France MUN Assistant">{open ? '✕' : '💬'}{!open && <span className="chat-fab-label">France Assistant</span>}</button>
      {open && (
        <div className="chat-window">
          <div className="chat-header" style={{ background: 'linear-gradient(135deg, #00209F, #ED2939)' }}>
            <div><div className="chat-header-title">🇫🇷 France MUN Assistant</div><div className="chat-header-sub">Powered by Groq AI</div></div>
            <button className="chat-close" onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, i) => <div key={i} className={`chat-msg ${msg.role}`}>{msg.role === 'assistant' && <div className="chat-avatar">🤖</div>}<div className="chat-bubble">{fmt(msg.content)}</div></div>)}
            {loading && <div className="chat-msg assistant"><div className="chat-avatar">🤖</div><div className="chat-bubble chat-typing"><span></span><span></span><span></span></div></div>}
            {messages.length === 1 && <div className="chat-suggestions"><div className="chat-suggestions-label">Suggested questions:</div>{SUGGESTIONS.map((q, i) => <button key={i} className="chat-suggestion" onClick={() => sendMessage(q)}>{q}</button>)}</div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input-row"><input className="chat-input" type="text" placeholder="Ask anything about France..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} disabled={loading} /><button className="chat-send" style={{ background: '#ED2939' }} onClick={() => sendMessage()} disabled={loading || !input.trim()}>➤</button></div>
        </div>
      )}
    </>
  )
}

export default function FrancePage({ dynamic, generatedAt, user, logout }) {
  const router = useRouter()
  const d = dynamic || DEFAULT_DYNAMIC
  const isAdmin = user?.role === 'admin'
  const isPlus = user?.role === 'plus' || isAdmin
  const canBriefing = isPlus
  const canUpdateAll = isAdmin
  const [news, setNews] = useState([])
  const [newsLoading, setNewsLoading] = useState(false)
  const [briefing, setBriefing] = useState(null)
  const [briefingLoading, setBriefingLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [updateStatus, setUpdateStatus] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const { query, setQuery, highlights, current, doSearch, clearMarks, jump, rootRef } = useSearch()
  const debounceRef = useRef(null)
  const handleSearchInput = (val) => { setQuery(val); clearTimeout(debounceRef.current); if (val.length < 2) { clearMarks(); return }; debounceRef.current = setTimeout(() => doSearch(val), 250) }
  const fetchNews = async () => { setNewsLoading(true); try { const res = await fetch('/api/news-france'); const data = await res.json(); if (data.news) setNews(data.news) } catch {} finally { setNewsLoading(false) } }
  const generateBriefing = async () => {
    setBriefingLoading(true); setUpdateStatus('Generating AI briefing...')
    const token = localStorage.getItem('mun_token')
    const allArticles = news.flatMap(c => c.articles)
    try {
      const res = await fetch('/api/update-france', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, articles: allArticles.slice(0, 20) }) })
      const data = await res.json()
      if (data.briefing) { setBriefing(data.briefing); setUpdateStatus('Briefing updated.') }
      else setUpdateStatus(data.error || 'Update failed.')
    } catch { setUpdateStatus('Request failed.') }
    finally { setBriefingLoading(false) }
  }
  const updateAllSections = async () => {
    if (!password) { setUpdateStatus('Enter admin password.'); return }
    setIsUpdating(true); setUpdateStatus('Updating all sections...')
    try {
      const res = await fetch('/api/revalidate-france', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
      const data = await res.json()
      if (data.revalidated) { setUpdateStatus('Updated! Refreshing in 5 seconds...'); setTimeout(() => window.location.reload(), 5000) }
      else setUpdateStatus(data.error || 'Update failed.')
    } catch { setUpdateStatus('Request failed.') }
    finally { setIsUpdating(false) }
  }
  useEffect(() => { fetchNews() }, [])

  const FRANCE_HEADER = { background: 'linear-gradient(135deg, #00209F 0%, #ffffff 50%, #ED2939 100%)' }

  return (
    <>
      <Head><title>France Research — MUN Toolkit</title><meta name="viewport" content="width=device-width, initial-scale=1" /></Head>
      <div ref={rootRef}>
        <div style={{ position: 'fixed', top: 10, left: 10, zIndex: 9999, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, fontFamily: "'Source Sans 3', sans-serif", letterSpacing: 0.5, pointerEvents: 'none' }}>✦ Made by Luquinha</div>
        {canBriefing && <Chatbot />}

        {/* HEADER */}
        <div className="header" style={FRANCE_HEADER}>
          <div style={{ borderRadius: 4, overflow: 'hidden', width: 120, height: 8, marginBottom: 20, display: 'flex' }}>
            <div style={{ background: '#00209F', flex: 1 }} />
            <div style={{ background: '#ffffff', flex: 1 }} />
            <div style={{ background: '#ED2939', flex: 1 }} />
          </div>
          <div className="header-top">
            <div>
              <div className="country-name">France 🇫🇷</div>
              <div className="country-sub">République Française · French Republic</div>
              <div className="live-badge"><div className="live-dot" />Auto-Updated Daily</div>
            </div>
            <div className="header-meta">
              <strong>MUN Research Page</strong>
              Committees: ECOSOC · HRC · DISEC · UNEP<br />
              {generatedAt ? `Updated: ${new Date(generatedAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}` : 'Loading...'}<br />
              {user && <span style={{ color: 'rgba(0,0,0,0.5)', fontSize: 11 }}>Signed in: {user.name} ({user.role})</span>}
            </div>
          </div>
        </div>

        {/* USER BAR */}
        {user && (
          <div className="user-bar">
            <span className="user-bar-name">👤 {user.name || user.username}<span className={`user-role-badge role-${user.role}`}>{user.role}</span></span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => router.push('/')} style={{ background: 'none', border: '1px solid #333', color: 'rgba(255,255,255,0.4)', padding: '4px 12px', borderRadius: 3, fontSize: 11, cursor: 'pointer', fontFamily: "'Source Sans 3', sans-serif" }}>🇺🇳 MUN Toolkit</button>
              {isAdmin && <button onClick={() => router.push('/admin')} style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid #c9a84c', color: '#c9a84c', padding: '4px 12px', borderRadius: 3, fontSize: 11, cursor: 'pointer', fontFamily: "'Source Sans 3', sans-serif" }}>⚙️ Admin</button>}
              <button className="user-logout" onClick={logout}>Sign Out</button>
            </div>
          </div>
        )}

        {/* STATS BAR */}
        <div className="stats-bar">
          {QUICK_STATS.map(s => <div key={s.label} className="stat-item"><div className="stat-label">{s.label}</div><div className="stat-value">{s.value}</div><div className="stat-unit">{s.unit}</div></div>)}
        </div>

        <NavBar router={router} />

        {/* SEARCH BAR */}
        <div className="search-bar">
          <div className="search-inner">
            <span className="search-icon">🔍</span>
            <input className="search-input" type="text" placeholder="Search — Macron, NATO, Nuclear, Sahel, Francophonie..." value={query} onChange={e => handleSearchInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); jump(e.shiftKey ? -1 : 1) }; if (e.key === 'Escape') { setQuery(''); clearMarks() } }} />
            {query && <button className="clear-btn" onClick={() => { setQuery(''); clearMarks() }}>✕</button>}
          </div>
          <span className="search-status">{highlights.length > 0 ? `${current + 1} of ${highlights.length}` : query.length >= 2 ? 'No results' : ''}</span>
          <button className="nav-btn" onClick={() => jump(-1)} disabled={highlights.length === 0}>▲</button>
          <button className="nav-btn" onClick={() => jump(1)} disabled={highlights.length === 0}>▼</button>
        </div>

        {/* LIVE INTEL */}
        <div id="live-intelligence">
          <SectionDivider emoji="🔴" title="Live Intelligence — Auto-Updated" />
          <div className="main">
            {d.alert_banner && <div className="full-width"><div className="box alert" style={{ borderRadius: 2 }}><div className="box-title">🚨 {d.alert_banner.title}</div><p>{d.alert_banner.content}</p></div></div>}
            <Card emoji="👤" title={d.leadership?.title || "Macron's Second Term — Strategic Autonomy"} fullWidth>
              <p className="prose" style={{ marginBottom: 12 }}>{d.leadership?.situation}</p>
              {d.leadership?.mun_note && <div className="box highlight"><div className="box-title">🎤 MUN Note</div><p>{d.leadership.mun_note}</p></div>}
            </Card>
            <Card emoji="🔒" title="Security — Current Status">
              <InfoRow label="Status" value={d.security?.current_status || 'Active engagements'} />
              <div className="box alert" style={{ marginTop: 12 }}><div className="box-title">Latest Development</div><p>{d.security?.latest_development}</p></div>
              <div className="box highlight"><div className="box-title">Defence Spending</div><p>{d.security?.economic_impact}</p></div>
              <div className="box green"><div className="box-title">France's Argument</div><p>{d.security?.france_argument}</p></div>
            </Card>
            <Card emoji="💰" title="Economy — Current Status">
              <InfoRow label="Status" value={d.economy?.current_status || 'Moderate growth'} />
              <div className="box alert" style={{ marginTop: 12 }}><div className="box-title">Latest Development</div><p>{d.economy?.latest_development}</p></div>
              <div className="box highlight"><div className="box-title">Key Pressures</div><p>{d.economy?.economic_impact}</p></div>
              <div className="box green"><div className="box-title">France's Argument</div><p>{d.economy?.france_argument}</p></div>
            </Card>
            <Card emoji="🌐" title="UN Committees — Current Status">
              <InfoRow label="Status" value={d.ecosoc_current?.status || 'Active P5 member'} note />
              <div className="box alert" style={{ marginTop: 12 }}><div className="box-title">Latest</div><p>{d.ecosoc_current?.latest}</p></div>
              <div className="box green"><div className="box-title">France's Position</div><p>{d.ecosoc_current?.france_position}</p></div>
              {d.last_updated && <div style={{ fontSize: 11, color: 'var(--light)', marginTop: 12, fontStyle: 'italic' }}>Generated: {d.last_updated}</div>}
            </Card>
            <Card emoji="📰" title="Live News Feed" fullWidth><NewsSection news={news} loading={newsLoading} /></Card>
            {canBriefing
              ? <div className="full-width"><AIBriefing briefing={briefing} loading={briefingLoading} /></div>
              : <div className="full-width"><div className="access-blocked">🔒 AI Intelligence Briefing is available to <strong>Plus</strong> and <strong>Admin</strong> users only.</div></div>
            }
          </div>
          <div className="update-panel">
            <span className="update-label">TEAM CONTROLS</span>
            <button className="update-btn" onClick={fetchNews} disabled={newsLoading}>{newsLoading ? '...' : '🔄 Refresh News'}</button>
            {canBriefing && <button className="update-btn" onClick={generateBriefing} disabled={briefingLoading} style={{ background: '#ED2939' }}>{briefingLoading ? '...' : '🤖 AI Briefing'}</button>}
            {canUpdateAll && (<><input className="update-input" type="password" placeholder="Admin password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: 160 }} /><button className="update-btn" onClick={updateAllSections} disabled={isUpdating} style={{ background: '#8e44ad' }}>{isUpdating ? '⏳ Updating...' : '⚡ Update All Sections'}</button></>)}
            {updateStatus && <span className="update-status">{updateStatus}</span>}
            <span className="fetched-at">Auto-updates daily at 6:00 AM UTC</span>
          </div>
        </div>

        {/* POWER FIGURES */}
        <div id="power-figures">
          <SectionDivider emoji="👑" title="Top 10 Political Figures — Ranked by Power" />
          <div className="main">
            <Card emoji="ℹ️" title="About This Ranking" fullWidth>
              <p className="prose">Figures are ranked by effective political power as of March 2026. France's Fifth Republic concentrates enormous power in the presidency — especially in foreign affairs and defence. Domestically, political fragmentation since 2024 has weakened the government's ability to pass legislation.</p>
            </Card>
            <div className="full-width">
              <div className="power-table-wrapper">
                <table className="power-table">
                  <thead><tr><th style={{width:50}}>Rank</th><th style={{width:160}}>Name</th><th style={{width:200}}>Position</th><th>Power and Influence</th><th style={{width:140}}>Status</th><th style={{width:80}}>Score</th></tr></thead>
                  <tbody>
                    {POWER_FIGURES.map(f => (
                      <tr key={f.rank} className={`power-row status-${f.status}`}>
                        <td className="rank-cell"><span className={`rank-badge ${f.rank <= 3 ? 'top3' : f.rank <= 10 ? 'top10' : ''}`}>{f.rank}</span></td>
                        <td><div className="figure-name">{f.name}</div><div style={{fontSize:10,color:'var(--light)',marginTop:2}}>{f.institution}</div></td>
                        <td><div className="figure-position">{f.position}</div></td>
                        <td><div style={{fontSize:12,color:'var(--mid)',lineHeight:1.5}}>{f.power}</div>{f.note && <div style={{fontSize:11,color:'var(--light)',fontStyle:'italic',marginTop:4}}>→ {f.note}</div>}</td>
                        <td><div style={{fontSize:12,color:f.status==='restricted'?'#7d3c98':'var(--green)',fontWeight:600}}>{f.health}</div></td>
                        <td className="power-score-cell"><div className="power-score-num">{f.powerScore}</div><div className="power-bar-outer"><div className="power-bar-inner" style={{width:`${f.powerScore}%`,background:f.powerScore>=80?'#ED2939':f.powerScore>=50?'#00209F':'#888'}}></div></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* GEOGRAPHY */}
        <div id="geography">
          <SectionDivider emoji="📍" title="Geography and Environment" />
          <div className="main">
            <Card emoji="🗺️" title="Physical Geography">
              <InfoRow label="Region" value="Western Europe" />
              <InfoRow label="Borders" value="Belgium, Luxembourg, Germany, Switzerland, Italy, Monaco, Spain, Andorra" note />
              <InfoRow label="Coastline" value="Atlantic Ocean, English Channel, Mediterranean Sea — 4,853 km" note />
              <InfoRow label="Highest Point" value="Mont Blanc — 4,808m (shared with Italy)" />
              <InfoRow label="Major Rivers" value="Seine, Loire, Rhône, Garonne, Rhine" note />
              <InfoRow label="Climate" value="Temperate in north and centre; Mediterranean in south; alpine in mountains" note />
              <InfoRow label="Overseas Territories" value="French Guiana, Guadeloupe, Martinique, Réunion, Mayotte, New Caledonia, French Polynesia + more" note />
            </Card>
            <Card emoji="⚡" title="Strategic Geography">
              <Box type="highlight" title="🌍 Global Reach — Overseas Territories">France has territories on every inhabited continent and in every ocean — giving it the world's second largest Exclusive Economic Zone (11 million km²). This makes France a genuinely global power with strategic interests from the Caribbean to the Pacific.</Box>
              <InfoRow label="Nuclear Submarine Bases" value="Île Longue (Brest) — home of France's SSBN fleet" note />
              <InfoRow label="NATO HQ" value="Brussels — France rejoined NATO integrated command in 2009" note />
              <InfoRow label="EU Largest Economy" value="2nd largest in EU after Germany" note />
              <InfoRow label="African Presence" value="Military bases in Djibouti, Chad, Ivory Coast, Senegal, Gabon" note />
            </Card>
            <Card emoji="🏙️" title="Major Cities" fullWidth>
              <table className="data-table">
                <thead><tr><th>City</th><th>Population</th><th>Significance</th><th>Region</th></tr></thead>
                <tbody>
                  <tr><td>🏛️ Paris</td><td>2.1M (12M metro)</td><td>Capital; global centre of culture, diplomacy, and finance</td><td>Île-de-France</td></tr>
                  <tr><td>🏭 Lyon</td><td>520,000</td><td>Financial and gastronomic capital of France</td><td>Auvergne-Rhône-Alpes</td></tr>
                  <tr><td>☀️ Marseille</td><td>870,000</td><td>France's largest port; Mediterranean gateway</td><td>Provence</td></tr>
                  <tr><td>✈️ Toulouse</td><td>480,000</td><td>Aerospace capital — home of Airbus</td><td>Occitanie</td></tr>
                  <tr><td>🍷 Bordeaux</td><td>260,000</td><td>Wine capital; Atlantic trade hub</td><td>Nouvelle-Aquitaine</td></tr>
                  <tr><td>🎿 Strasbourg</td><td>290,000</td><td>Seat of European Parliament and Council of Europe</td><td>Grand Est</td></tr>
                </tbody>
              </table>
            </Card>
          </div>
        </div>

        {/* PEOPLE */}
        <div id="people">
          <SectionDivider emoji="👥" title="People, Society and Culture" />
          <div className="main">
            <Card emoji="🧬" title="Demographics">
              <InfoRow label="Population" value="68.4 million (2024)" />
              <InfoRow label="Median Age" value="42.3 years" />
              <InfoRow label="Urban Population" value="~81%" />
              <InfoRow label="Official Language" value="French" />
              <InfoRow label="Immigrant Population" value="~10% — largest groups from North Africa, Sub-Saharan Africa, Portugal" note />
              <InfoRow label="Religion" value="Officially secular; ~50% Catholic, ~10% Muslim, ~40% non-religious" note />
              <InfoRow label="Literacy Rate" value="~99%" />
              <InfoRow label="Life Expectancy" value="82.3 years" note />
            </Card>
            <Card emoji="🏛️" title="Society and Values">
              <Box type="highlight" title="🗽 Liberté, Égalité, Fraternité">France's revolutionary values underpin its domestic and foreign policy. Laïcité — strict secularism — is a constitutional principle that shapes everything from headscarf debates to the separation of church and state in schools and public institutions.</Box>
              <Box type="alert" title="⚠️ Social Tensions">France faces significant social divisions — between urban and rural, between secular and religious communities, and between the established political class and populist movements. The Yellow Vest protests (2018-2019) and repeated urban riots reveal deep inequalities.</Box>
              <Box type="blue" title="🎨 Soft Power">France projects enormous soft power through its language (spoken by 321 million people), culture (cinema, fashion, cuisine, art), and the Francophonie organisation. Paris remains one of the world's most visited cities.</Box>
            </Card>
          </div>
        </div>

        {/* GOVERNMENT */}
        <div id="government">
          <SectionDivider emoji="🏛️" title="Government and Political Structure" />
          <div className="main">
            <Card emoji="⚖️" title="The Fifth Republic">
              <InfoRow label="System" value="Semi-presidential republic" />
              <InfoRow label="Constitution" value="1958 Constitution — designed by de Gaulle" />
              <InfoRow label="President" value="Emmanuel Macron — elected 2017, re-elected 2022; term ends 2027" note />
              <InfoRow label="Prime Minister" value="François Bayrou — appointed January 2025" note />
              <InfoRow label="Parliament" value="National Assembly (577 seats) + Senate (348 seats)" note />
              <InfoRow label="Current Situation" value="Political fragmentation — no single majority; minority government" note />
              <Box type="highlight" title="🏛️ Presidential Dominance in Foreign Affairs">Under the Fifth Republic, the President has near-total control of foreign policy, defence, and nuclear weapons — regardless of the parliamentary situation. This is the reserved domain (domaine réservé). Even during cohabitation, presidents have maintained control of foreign policy.</Box>
            </Card>
            <Card emoji="💰" title="Economy">
              <InfoRow label="GDP (nominal)" value="$3.05 trillion — 7th globally" />
              <InfoRow label="GDP per capita" value="$44,408 USD" />
              <InfoRow label="Public Debt" value="110%+ of GDP" note />
              <InfoRow label="Key Sectors" value="Aerospace (Airbus), luxury (LVMH, Hermès), energy (TotalEnergies), defence (Thales, Dassault), agriculture" note />
              <InfoRow label="Unemployment" value="7.3%" note />
              <InfoRow label="Nuclear Energy" value="70% of electricity from nuclear power — most in the world" note />
              <InfoRow label="Trade Partners" value="Germany, USA, Italy, Spain, Belgium, China" note />
            </Card>
          </div>
        </div>

        {/* HISTORY */}
        <div id="history">
          <SectionDivider emoji="📅" title="Historical Timeline" />
          <div className="main">
            <Card emoji="🏺" title="From the Franks to the Fifth Republic" fullWidth>
              <div style={{ columns: 2, columnGap: 40 }}>
                {TIMELINE.map(({ year, text }) => (
                  <div key={year} className="timeline-item">
                    <div className="timeline-year">{year}</div>
                    <div className="timeline-text">{text}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* COMMITTEES */}
        <div id="committees">
          <SectionDivider emoji="🌐" title="France Across All Four Committees" />
          <div className="main">
            <Card emoji="🏢" title="France's UN Role" fullWidth>
              <p className="prose" style={{ marginBottom: 16 }}>France is a permanent member of the UN Security Council with veto power, the 5th largest contributor to the UN budget, and one of the most active advocates of multilateralism in the international system. France uses its UN position to project global influence, shape international norms, and assert its identity as an independent great power — not merely a US ally.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                <div className="mini-card" style={{ border: '1px solid rgba(0,32,159,0.3)' }}>
                  <div className="mini-card-title" style={{ color: '#6699ff' }}>🌐 ECOSOC</div>
                  <p>France champions the SDGs, climate finance, and development aid. It is one of the world's largest ODA donors. France advocates for debt relief for developing nations while pushing for greater coherence between trade, aid, and development policies. The Paris Agreement is France's flagship multilateral achievement.</p>
                </div>
                <div className="mini-card" style={{ border: '1px solid rgba(0,32,159,0.3)' }}>
                  <div className="mini-card-title" style={{ color: '#6699ff' }}>👁️ HRC</div>
                  <p>France is a strong advocate of human rights universalism — pushing back against cultural relativism arguments. However, it faces criticism for its own record: treatment of migrants, police violence, and laïcité restrictions on religious expression. France argues these are domestic constitutional matters, not human rights violations.</p>
                </div>
                <div className="mini-card" style={{ border: '1px solid rgba(0,32,159,0.3)' }}>
                  <div className="mini-card-title" style={{ color: '#6699ff' }}>🔫 DISEC</div>
                  <p>France supports nuclear non-proliferation but firmly defends its own independent nuclear deterrent as essential to European security. It advocates for the Arms Trade Treaty and conventional weapons control. France opposes the Treaty on the Prohibition of Nuclear Weapons — arguing it undermines credible deterrence.</p>
                </div>
                <div className="mini-card" style={{ border: '1px solid rgba(0,32,159,0.3)' }}>
                  <div className="mini-card-title" style={{ color: '#6699ff' }}>🌱 UNEP</div>
                  <p>France is a global climate leader — host of the Paris Agreement, strong advocate for carbon pricing, and a major funder of green transition in developing nations. France pushes for binding emissions targets and opposes voluntary pledges without enforcement mechanisms.</p>
                </div>
              </div>
            </Card>
            <Card emoji="🔗" title="Foreign Relations" fullWidth>
              <table className="data-table">
                <thead><tr><th>Country / Bloc</th><th>Relationship</th><th>Status — March 2026</th></tr></thead>
                <tbody>
                  <tr><td>🇩🇪 Germany</td><td>Franco-German axis — core of the European Union</td><td>Relationship strained by disagreements over defence spending, nuclear energy, and economic policy but fundamentally intact.</td></tr>
                  <tr><td>🇺🇸 United States</td><td>NATO ally — sometimes tense</td><td>France values the alliance but resists American dominance. AUKUS submarine deal (2021) caused a major rupture — now partially healed.</td></tr>
                  <tr><td>🇷🇺 Russia</td><td>Adversarial since Ukraine invasion</td><td>France is among Ukraine's largest supporters. Macron has suggested sending ground troops — alarming allies. Relations at historic low.</td></tr>
                  <tr><td>🌍 Africa (Sahel)</td><td>Post-colonial partner — now in retreat</td><td>France expelled from Mali, Burkina Faso, and Niger. Still maintains bases in Chad, Djibouti, Senegal. Attempting to reset Africa relations.</td></tr>
                  <tr><td>🇨🇳 China</td><td>Economic partner — strategic competitor</td><td>France tries to balance economic ties with concerns about Chinese influence. Macron's 2023 Beijing visit caused controversy for suggesting Europe should not follow US on Taiwan.</td></tr>
                  <tr><td>🇬🇧 United Kingdom</td><td>Post-Brexit — complicated</td><td>Tensions over fishing rights, migrants in the Channel, and Northern Ireland. Defence cooperation (Lancaster House Treaties) continues.</td></tr>
                </tbody>
              </table>
            </Card>
          </div>
        </div>

        {/* MUN TOOLKIT */}
        <div id="toolkit">
          <SectionDivider emoji="🎤" title="MUN Delegate Toolkit — France" />
          <div className="main">
            <Card emoji="🗣️" title="Core Arguments">
              <Box type="green" title="Argument 1 — Champion of Multilateralism">France does not believe in a world governed by the law of the strongest. We believe in a rules-based international order where every nation — large or small — has a voice. The UN system, imperfect as it is, is the only framework capable of addressing climate change, terrorism, poverty, and nuclear proliferation simultaneously.</Box>
              <Box type="green" title="Argument 2 — Nuclear Deterrence is Legitimate">France's nuclear deterrent is not a threat to peace — it is its guarantor. The NPT recognises France as a legitimate nuclear weapons state. Our deterrent has prevented great power conflict in Europe for 80 years. The Treaty on the Prohibition of Nuclear Weapons is idealistic but dangerous — it would undermine deterrence without addressing the security concerns that make nuclear weapons necessary.</Box>
              <Box type="green" title="Argument 3 — Climate Leadership">France wrote the Paris Agreement. We are committed to carbon neutrality by 2050 and we are delivering — 70% of our electricity already comes from zero-carbon nuclear power. We call on all nations to match their rhetoric with binding commitments and verifiable action plans.</Box>
              <Box type="green" title="Argument 4 — Human Rights Universalism">Human rights are not Western values — they are universal values, enshrined in the Universal Declaration that France helped write in 1948. There is no cultural exception to torture, no civilisational justification for the persecution of minorities. France will always speak for those who cannot speak for themselves.</Box>
            </Card>
            <Card emoji="🧭" title="Strategic Notes">
              <Box type="highlight" title="🤝 Build These Coalitions">EU members (27 nations), NATO allies, Francophonie states (88 nations — particularly useful in African Group), like-minded democracies. On climate: small island states, vulnerable nations. On human rights: EU + traditional allies.</Box>
              <Box type="alert" title="⚠️ Weak Points">Nuclear weapons hypocrisy — France advocates NPT but opposes TPNW. Françafrique — history of exploitative relationships with former colonies. Sahel military failures and expulsions. Domestic human rights record — police violence, migrant treatment, laïcité restrictions. AUKUS submarine deal anger still lingers with Australia.</Box>
              <Box type="blue" title="🎯 Tactical Redirection">When pressed on nuclear weapons: cite NPT legitimacy and deterrence theory. When pressed on Africa: acknowledge past mistakes and pivot to new partnership framework. When pressed on laïcité: invoke constitutional sovereignty and the universal principle of separation of church and state.</Box>
            </Card>
            <Card emoji="📖" title="Key Vocabulary" fullWidth>
              <table className="data-table">
                <thead><tr><th>Term</th><th>Meaning</th><th>Why It Matters</th></tr></thead>
                <tbody>{VOCAB.map(({ term, meaning, why }) => <tr key={term}><td>{term}</td><td>{meaning}</td><td>{why}</td></tr>)}</tbody>
              </table>
            </Card>
          </div>
        </div>

        <div className="footer" style={{ background: '#00209F' }}>
          🇫🇷 &nbsp; FRANCE — LIVE MUN RESEARCH PAGE &nbsp;·&nbsp; ECOSOC · HRC · DISEC · UNEP &nbsp;·&nbsp; AUTO-UPDATED DAILY &nbsp;·&nbsp; FOR EDUCATIONAL USE &nbsp; 🇫🇷
        </div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  let dynamic = null
  let generatedAt = new Date().toISOString()
  try {
    const newsApiKey = process.env.NEWS_API_KEY
    const groqKey = process.env.GROQ_API_KEY
    if (newsApiKey && groqKey) {
      const newsUrl = `https://newsapi.org/v2/everything?q=France+Macron&language=en&sortBy=publishedAt&pageSize=15&apiKey=${newsApiKey}`
      const newsRes = await fetch(newsUrl)
      const newsData = await newsRes.json()
      const articles = (newsData.articles || []).slice(0, 12)
      const newsText = articles.map(a => `- [${a.source?.name}] ${a.title}`).join('\n')
      const prompt = `You are a MUN research analyst for France. Based on these news headlines, generate updated content. Return ONLY valid JSON with keys: alert_banner (object with title and content, or null), leadership (object with title, situation, mun_note), security (object with current_status, latest_development, economic_impact, france_argument), economy (object with current_status, latest_development, economic_impact, france_argument), ecosoc_current (object with status, latest, france_position), last_updated. Headlines: ${newsText}. last_updated: "${new Date().toLocaleString('en-GB')} UTC"`
      const aiRes = await fetch('https://api.groq.com/openai/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqKey}` }, body: JSON.stringify({ model: 'llama3-8b-8192', max_tokens: 1200, temperature: 0.2, messages: [{ role: 'system', content: 'JSON-only API. Output raw JSON, no markdown.' }, { role: 'user', content: prompt }] }) })
      const aiData = await aiRes.json()
      let text = (aiData.choices?.[0]?.message?.content || '').replace(/```json/gi, '').replace(/```/g, '').trim()
      const s = text.indexOf('{'), e = text.lastIndexOf('}')
      if (s !== -1 && e !== -1) text = text.substring(s, e + 1)
      try { dynamic = JSON.parse(text); generatedAt = new Date().toISOString() } catch {}
    }
  } catch {}
  return { props: { dynamic: dynamic || null, generatedAt }, revalidate: 86400 }
}
