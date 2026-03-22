// pages/nigeria.js — Nigeria Research Page (all logged-in users)
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
  { label: "Population", value: "223M", unit: "Most populous in Africa" },
  { label: "Area", value: "923,768 km²", unit: "32nd globally" },
  { label: "GDP (nominal)", value: "$477B", unit: "Largest in Africa" },
  { label: "GDP per capita", value: "$2,184", unit: "USD (2023)" },
  { label: "Capital", value: "Abuja", unit: "Pop. 3.6 million" },
  { label: "Literacy Rate", value: "62%", unit: "2018 estimate" },
  { label: "Military Rank", value: "#35", unit: "of 145 nations" },
  { label: "UN Member Since", value: "1960", unit: "Independence year" },
  { label: "States", value: "36 + FCT", unit: "Administrative units" },
]

const TIMELINE = [
  { year: "~500 BC", text: "Nok civilization flourishes in central Nigeria — one of Africa's earliest known cultures, famous for terracotta sculptures." },
  { year: "1000–1400 AD", text: "Kanem-Bornu Empire dominates the Lake Chad basin. Oyo and Benin Kingdoms rise in the southwest — sophisticated states with complex governance." },
  { year: "1472", text: "Portuguese explorers arrive at the Nigerian coast. Slave trade begins — over the following centuries, millions of Nigerians are enslaved and transported to the Americas." },
  { year: "1804", text: "Usman dan Fodio launches the Fulani Jihad, establishing the Sokoto Caliphate — the largest empire in sub-Saharan Africa at the time." },
  { year: "1861", text: "Britain annexes Lagos. Gradual colonial expansion begins across what will become Nigeria." },
  { year: "1914", text: "Lord Lugard amalgamates the Northern and Southern Protectorates into the Colony and Protectorate of Nigeria — a colonial creation merging over 250 ethnic groups." },
  { year: "1960", text: "Nigeria gains independence from Britain on October 1. Abubakar Tafawa Balewa becomes first Prime Minister." },
  { year: "1966–1970", text: "Two military coups in 1966. Biafra declares independence 1967. Nigerian Civil War kills estimated 1-3 million people, many from famine." },
  { year: "1970–1979", text: "Oil boom transforms the economy. Military rule continues under Gowon, Mohammed, and Obasanjo." },
  { year: "1983–1999", text: "Series of military coups. Sani Abacha's brutal dictatorship 1993-1998. Ken Saro-Wiwa executed 1995. Nigeria isolated internationally." },
  { year: "1999", text: "Return to democracy. Olusegun Obasanjo elected president. Fourth Republic begins." },
  { year: "2009", text: "Boko Haram insurgency begins in the northeast — over 350,000 killed and 2 million displaced by 2026." },
  { year: "2014", text: "Boko Haram kidnaps 276 Chibok schoolgirls — triggering global #BringBackOurGirls campaign." },
  { year: "2015", text: "Muhammadu Buhari wins election — first peaceful transfer of power between parties in Nigerian history." },
  { year: "2023", text: "Bola Tinubu wins disputed presidential election. Removes fuel subsidy — causing severe economic crisis." },
  { year: "2024–2025", text: "Naira collapses — loses over 70% of its value. Inflation exceeds 30%. Mass protests across Nigeria." },
  { year: "March 2026", text: "Nigeria faces simultaneous crises — Boko Haram insurgency, banditry in the northwest, secessionist tensions in the southeast (IPOB), and a severe cost-of-living crisis." },
]

const VOCAB = [
  { term: "Boko Haram / ISWAP", meaning: "Islamic terrorist groups operating in northeast Nigeria and Lake Chad basin — responsible for 350,000+ deaths since 2009", why: "Central to any discussion of Nigeria's security situation and ECOSOC development agenda" },
  { term: "IPOB", meaning: "Indigenous People of Biafra — separatist movement seeking independence for the Igbo southeast", why: "Nigeria consistently frames this as a domestic security matter, rejecting any international interference" },
  { term: "Naira", meaning: "Nigeria's currency — lost over 70% of its value in 2023-2024 following subsidy removal", why: "Key to understanding Nigeria's economic crisis and development challenges" },
  { term: "Oil Dependency", meaning: "Nigeria earns ~90% of foreign exchange from oil exports — making it extremely vulnerable to price fluctuations", why: "Explains Nigeria's fiscal constraints and its advocacy for commodity price stability at ECOSOC" },
  { term: "Niger Delta", meaning: "Oil-producing region plagued by militancy, pollution, and underdevelopment despite vast oil wealth", why: "Key human rights and environmental flashpoint — relevant for ECOSOC, HRC, and UNEP" },
  { term: "Subsidy Removal", meaning: "President Tinubu ended Nigeria's fuel subsidy in 2023 — saving $10B/year but triggering massive inflation", why: "Central to understanding Nigeria's current economic crisis" },
  { term: "ECOWAS", meaning: "Economic Community of West African States — Nigeria is the dominant power and largest contributor", why: "Nigeria uses ECOWAS as its primary tool of regional influence and peacekeeping" },
  { term: "Japa Syndrome", meaning: "Mass emigration of educated Nigerians seeking better opportunities abroad — brain drain crisis", why: "Significant development challenge Nigeria raises in UN forums" },
  { term: "Almajiri", meaning: "System of Quranic schools in northern Nigeria where millions of children live in poverty without formal education", why: "Relevant to education rights discussions at ECOSOC and HRC" },
]

const POWER_FIGURES = [
  { rank: 1, name: "Bola Ahmed Tinubu", position: "President of Nigeria", institution: "Office of the President", power: "Head of state and government. Controls federal executive power, security forces, and economic policy. Former Lagos State Governor — known as the 'Godfather of Lagos politics'.", health: "✅ Active — facing significant economic and security challenges.", powerScore: 100, status: "active", note: "His removal of the fuel subsidy in 2023 triggered Nigeria's worst economic crisis in decades." },
  { rank: 2, name: "Kashim Shettima", position: "Vice President", institution: "Office of the Vice President", power: "Deputy head of government. Former Borno State Governor — extensive experience managing Boko Haram crisis.", health: "✅ Active.", powerScore: 65, status: "active", note: "His northern Muslim background was chosen to balance Tinubu's southern Christian identity." },
  { rank: 3, name: "Godswill Akpabio", position: "Senate President", institution: "National Assembly", power: "Presides over Nigeria's 109-member Senate. Controls legislative agenda.", health: "✅ Active.", powerScore: 60, status: "active", note: "Key ally of President Tinubu in pushing economic reform legislation." },
  { rank: 4, name: "Tajudeen Abbas", position: "Speaker, House of Representatives", institution: "National Assembly", power: "Presides over Nigeria's 360-member House of Representatives.", health: "✅ Active.", powerScore: 55, status: "active", note: "Coordinates with Senate on all federal legislation." },
  { rank: 5, name: "Olukayode Ariwoola", position: "Chief Justice of Nigeria", institution: "Supreme Court of Nigeria", power: "Heads Nigeria's entire judiciary. Final arbiter of constitutional disputes including election cases.", health: "✅ Active.", powerScore: 58, status: "active", note: "Presided over Tinubu's election victory court challenge." },
  { rank: 6, name: "Yemi Cardoso", position: "Governor, Central Bank of Nigeria", institution: "Central Bank of Nigeria", power: "Controls Nigeria's monetary policy, foreign exchange management, and naira stabilisation efforts.", health: "✅ Active.", powerScore: 62, status: "active", note: "Appointed by Tinubu — overseeing controversial naira float policy." },
  { rank: 7, name: "Wale Edun", position: "Minister of Finance", institution: "Federal Ministry of Finance", power: "Manages Nigeria's budget, fiscal policy, and economic reform programme.", health: "✅ Active.", powerScore: 58, status: "active", note: "Key architect of the post-subsidy removal economic strategy." },
  { rank: 8, name: "Christopher Musa", position: "Chief of Defence Staff", institution: "Nigerian Armed Forces", power: "Commands Nigeria's entire military — army, navy, and air force. Leads counterterrorism operations.", health: "✅ Active — directing operations against Boko Haram/ISWAP and bandits.", powerScore: 60, status: "active", note: "Critical figure as Nigeria faces simultaneous security crises in multiple regions." },
  { rank: 9, name: "Nyesom Wike", position: "Minister of the FCT", institution: "Federal Capital Territory Administration", power: "Controls Abuja — Nigeria's capital. One of Tinubu's most powerful political allies.", health: "✅ Active.", powerScore: 55, status: "active", note: "Former Rivers State Governor. Known for political dealmaking." },
  { rank: 10, name: "Peter Obi", position: "Labour Party Presidential Candidate / Opposition Leader", institution: "Labour Party", power: "Leader of Nigeria's most significant opposition movement. Won the 2023 youth vote overwhelmingly.", health: "✅ Active — continues to challenge Tinubu's economic policies.", powerScore: 45, status: "active", note: "His 2023 presidential run galvanised Nigerian youth — Obi-dient movement remains active." },
]

const DEFAULT_DYNAMIC = {
  leadership: { title: "Tinubu's Economic Reform Crisis — 2026", situation: "President Bola Tinubu's removal of the fuel subsidy in 2023 triggered Nigeria's worst economic crisis in decades. The naira has lost over 70% of its value, inflation exceeds 30%, and mass protests have erupted across the country. Tinubu is attempting to implement painful but necessary structural reforms while managing simultaneous security crises.", mun_note: "Nigeria will present itself as a responsible developing nation undertaking difficult but necessary economic reforms, while calling for international support, debt relief, and commodity price stability." },
  security: { current_status: "Active insurgency — multiple simultaneous threats", latest_development: "Boko Haram and ISWAP continue operations in the northeast. Banditry and kidnapping plague the northwest. IPOB separatist tensions simmer in the southeast. Nigeria's military is stretched across multiple fronts.", economic_impact: "Security crises cost Nigeria an estimated $3B annually. Over 2 million internally displaced persons. Foreign investment deterred by instability.", nigeria_argument: "Nigeria characterises its security challenges as a development problem requiring international support — calling for greater UN resources for counterterrorism in the Sahel and Lake Chad region." },
  economy: { current_status: "Severe crisis — inflation, currency collapse, subsidy removal", latest_development: "Naira trading at record lows. Inflation at 30%+. Unemployment officially 5% but underemployment estimated at 40%+. Nigeria remains Africa's largest economy by GDP but faces acute fiscal pressures.", economic_impact: "70% of Nigerians live below $2/day. Youth unemployment drives both emigration (Japa syndrome) and recruitment into extremist groups.", nigeria_argument: "Nigeria calls for restructuring of international debt, reform of IMF conditionalities, and greater technology transfer to enable diversification beyond oil." },
  ecosoc_current: { status: "Active participant — champions African development agenda", latest: "Nigeria is a rotating member of the UN Security Council and active in ECOSOC. It leads African Group positions on development financing, climate adaptation, and debt relief.", nigeria_position: "Nigeria consistently argues that the global financial architecture is stacked against developing nations — calling for reform of the IMF, World Bank, and international debt systems." },
  last_updated: "Default content — click Update All Sections to regenerate",
}

function Box({ type = 'highlight', title, children }) {
  return <div className={`box ${type}`}>{title && <div className="box-title">{title}</div>}<p>{children}</p></div>
}
function InfoRow({ label, value, note }) {
  return <div className="info-row"><span className="info-label">{label}</span><span className={`info-value${note ? ' note' : ''}`}>{value}</span></div>
}
function SectionDivider({ emoji, title }) {
  return <div className="section-divider" style={{ background: '#1a4a1a' }}>{emoji} {title}</div>
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
  if (loading) return <div className="briefing-card"><div className="briefing-header"><h2>🤖 AI Intelligence Briefing</h2></div><div className="briefing-empty"><div className="spinner" style={{ margin: '0 auto 12px', borderColor: '#1a4a1a', borderTopColor: '#008751' }}></div>Generating briefing...</div></div>
  if (!briefing) return <div className="briefing-card" style={{ background: 'linear-gradient(135deg, #1a4a1a, #2a6a2a)' }}><div className="briefing-header"><h2>🤖 AI Intelligence Briefing</h2></div><div className="briefing-empty">Click AI Briefing to get a comprehensive intelligence analysis based on the latest news.</div></div>
  return (
    <div className="briefing-card" style={{ background: 'linear-gradient(135deg, #1a4a1a, #2a6a2a)' }}>
      <div className="briefing-header">
        <h2>🤖 AI Intelligence Briefing</h2>
        {briefing.last_updated && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{new Date(briefing.last_updated).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>}
      </div>
      <div className="briefing-body">
        {briefing.summary && <div className="briefing-section"><div className="briefing-label">📋 Executive Summary</div><div className="briefing-text">{briefing.summary}</div></div>}
        {briefing.situation_overview && <div className="briefing-section"><div className="briefing-label">🌍 Situation Overview</div><div className="briefing-text">{briefing.situation_overview}</div></div>}
        <div className="briefing-grid">
          {briefing.ecosoc_impact && <div className="briefing-box"><div className="briefing-label">🌐 ECOSOC Impact</div><div className="briefing-text">{briefing.ecosoc_impact}</div></div>}
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
    <nav style={{ background: '#1a4a1a', borderBottom: '1px solid rgba(0,135,81,0.3)', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 48 }}>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: '#90ee90', fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>🇺🇳 MUN Toolkit</button>
        <div style={{ display: 'flex', gap: 2, flexWrap: 'nowrap' }}>
          {NAV_SECTIONS.map(({ id, label }) => (
            <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: active === id ? 'rgba(0,135,81,0.2)' : 'none', border: 'none', color: active === id ? '#90ee90' : 'rgba(255,255,255,0.5)', padding: '6px 10px', borderRadius: 3, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: "'Source Sans 3', sans-serif" }}>
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
  const [messages, setMessages] = useState([{ role: 'assistant', content: "Hello! I am your Nigeria MUN research assistant. Ask me anything about Nigeria's position at ECOSOC, HRC, DISEC, or UNEP, its foreign policy, or MUN procedures." }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  useEffect(() => { if (open && messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' }) }, [messages, open])
  const SUGGESTIONS = ["What are Nigeria's strongest arguments in ECOSOC?", "How does Nigeria approach human rights at the HRC?", "What is Nigeria's position on disarmament?", "Explain Nigeria's environmental challenges for UNEP", "Who are Nigeria's key allies in the UN?"]
  const sendMessage = async (text) => {
    const userText = text || input.trim(); if (!userText || loading) return
    setInput(''); setLoading(true)
    const newMessages = [...messages, { role: 'user', content: userText }]
    setMessages(newMessages)
    try {
      const res = await fetch('/api/chat-nigeria', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: newMessages }) })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Sorry, please try again.' }])
    } catch { setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]) }
    finally { setLoading(false) }
  }
  const fmt = (text) => text.split('\n').map((line, i) => { const b = line.trim().startsWith('- ') || line.trim().startsWith('• '); const c = line.replace(/^[-•]\s+/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); return <div key={i} style={{ display: 'flex', gap: b ? 8 : 0, marginBottom: line.trim() ? 4 : 2 }}>{b && <span style={{ color: '#90ee90', flexShrink: 0 }}>→</span>}<span dangerouslySetInnerHTML={{ __html: c }} /></div> })
  return (
    <>
      <button className="chat-fab" style={{ background: '#008751' }} onClick={() => setOpen(o => !o)} title="Ask Nigeria MUN Assistant">{open ? '✕' : '💬'}{!open && <span className="chat-fab-label">Nigeria Assistant</span>}</button>
      {open && (
        <div className="chat-window">
          <div className="chat-header" style={{ background: 'linear-gradient(135deg, #1a4a1a, #008751)' }}>
            <div><div className="chat-header-title">🇳🇬 Nigeria MUN Assistant</div><div className="chat-header-sub">Powered by Groq AI</div></div>
            <button className="chat-close" onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, i) => <div key={i} className={`chat-msg ${msg.role}`}>{msg.role === 'assistant' && <div className="chat-avatar">🤖</div>}<div className="chat-bubble">{fmt(msg.content)}</div></div>)}
            {loading && <div className="chat-msg assistant"><div className="chat-avatar">🤖</div><div className="chat-bubble chat-typing"><span></span><span></span><span></span></div></div>}
            {messages.length === 1 && <div className="chat-suggestions"><div className="chat-suggestions-label">Suggested questions:</div>{SUGGESTIONS.map((q, i) => <button key={i} className="chat-suggestion" onClick={() => sendMessage(q)}>{q}</button>)}</div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input-row"><input className="chat-input" type="text" placeholder="Ask anything about Nigeria..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} disabled={loading} /><button className="chat-send" style={{ background: '#008751' }} onClick={() => sendMessage()} disabled={loading || !input.trim()}>➤</button></div>
        </div>
      )}
    </>
  )
}

export default function NigeriaPage({ dynamic, generatedAt, user, logout }) {
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
  const fetchNews = async () => { setNewsLoading(true); try { const res = await fetch('/api/news-nigeria'); const data = await res.json(); if (data.news) setNews(data.news) } catch {} finally { setNewsLoading(false) } }
  const generateBriefing = async () => {
    setBriefingLoading(true); setUpdateStatus('Generating AI briefing...')
    const token = localStorage.getItem('mun_token')
    const allArticles = news.flatMap(c => c.articles)
    try {
      const res = await fetch('/api/update-nigeria', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, articles: allArticles.slice(0, 20) }) })
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
      const res = await fetch('/api/revalidate-nigeria', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
      const data = await res.json()
      if (data.revalidated) { setUpdateStatus('Updated! Refreshing in 5 seconds...'); setTimeout(() => window.location.reload(), 5000) }
      else setUpdateStatus(data.error || 'Update failed.')
    } catch { setUpdateStatus('Request failed.') }
    finally { setIsUpdating(false) }
  }
  useEffect(() => { fetchNews() }, [])

  const NIGERIA_HEADER = { background: 'linear-gradient(135deg, #1a4a1a 0%, #008751 50%, #1a4a1a 100%)' }

  return (
    <>
      <Head><title>Nigeria Research — MUN Toolkit</title><meta name="viewport" content="width=device-width, initial-scale=1" /></Head>
      <div ref={rootRef}>
        <div style={{ position: 'fixed', top: 10, left: 10, zIndex: 9999, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, fontFamily: "'Source Sans 3', sans-serif", letterSpacing: 0.5, pointerEvents: 'none' }}>✦ Made by Luquinha</div>
        {canBriefing && <Chatbot />}

        {/* HEADER */}
        <div className="header" style={NIGERIA_HEADER}>
          <div style={{ borderRadius: 4, overflow: 'hidden', width: 120, height: 8, marginBottom: 20, display: 'flex' }}>
            <div style={{ background: '#008751', flex: 1 }} />
            <div style={{ background: '#ffffff', flex: 1 }} />
            <div style={{ background: '#008751', flex: 1 }} />
          </div>
          <div className="header-top">
            <div>
              <div className="country-name">Nigeria 🇳🇬</div>
              <div className="country-sub">Federal Republic of Nigeria</div>
              <div className="live-badge"><div className="live-dot" />Auto-Updated Daily</div>
            </div>
            <div className="header-meta">
              <strong>MUN Research Page</strong>
              Committees: ECOSOC · HRC · DISEC · UNEP<br />
              {generatedAt ? `Updated: ${new Date(generatedAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}` : 'Loading...'}<br />
              {user && <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Signed in: {user.name} ({user.role})</span>}
            </div>
          </div>
        </div>

        {/* USER BAR */}
        {user && (
          <div className="user-bar">
            <span className="user-bar-name">👤 {user.name || user.username}<span className={`user-role-badge role-${user.role}`}>{user.role}</span></span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => router.push('/')} style={{ background: 'none', border: '1px solid #333', color: 'rgba(255,255,255,0.4)', padding: '4px 12px', borderRadius: 3, fontSize: 11, cursor: 'pointer', fontFamily: "'Source Sans 3', sans-serif" }}>🇺🇳 MUN Toolkit</button>
              <button onClick={() => router.push('/iran')} style={{ background: 'none', border: '1px solid #1a5c38', color: '#2d7a4f', padding: '4px 12px', borderRadius: 3, fontSize: 11, cursor: 'pointer', fontFamily: "'Source Sans 3', sans-serif" }}>🇮🇷 Iran</button>
              <button onClick={() => router.push('/china')} style={{ background: 'none', border: '1px solid #7a1a1a', color: '#cc0000', padding: '4px 12px', borderRadius: 3, fontSize: 11, cursor: 'pointer', fontFamily: "'Source Sans 3', sans-serif" }}>🇨🇳 China</button>
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
            <input className="search-input" type="text" placeholder="Search — Tinubu, Boko Haram, Niger Delta, ECOWAS..." value={query} onChange={e => handleSearchInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); jump(e.shiftKey ? -1 : 1) }; if (e.key === 'Escape') { setQuery(''); clearMarks() } }} />
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
            <Card emoji="👤" title={d.leadership?.title || "Tinubu's Economic Reform Crisis"} fullWidth>
              <p className="prose" style={{ marginBottom: 12 }}>{d.leadership?.situation}</p>
              {d.leadership?.mun_note && <div className="box highlight"><div className="box-title">🎤 MUN Note</div><p>{d.leadership.mun_note}</p></div>}
            </Card>
            <Card emoji="🔒" title="Security — Current Status">
              <InfoRow label="Status" value={d.security?.current_status || 'Active insurgency'} />
              <div className="box alert" style={{ marginTop: 12 }}><div className="box-title">Latest Development</div><p>{d.security?.latest_development}</p></div>
              <div className="box highlight"><div className="box-title">Economic Impact</div><p>{d.security?.economic_impact}</p></div>
              <div className="box green"><div className="box-title">Nigeria's Argument</div><p>{d.security?.nigeria_argument}</p></div>
            </Card>
            <Card emoji="💰" title="Economy — Current Status">
              <InfoRow label="Status" value={d.economy?.current_status || 'Severe crisis'} />
              <div className="box alert" style={{ marginTop: 12 }}><div className="box-title">Latest Development</div><p>{d.economy?.latest_development}</p></div>
              <div className="box highlight"><div className="box-title">Human Impact</div><p>{d.economy?.economic_impact}</p></div>
              <div className="box green"><div className="box-title">Nigeria's Argument</div><p>{d.economy?.nigeria_argument}</p></div>
            </Card>
            <Card emoji="🌐" title="UN Committees — Current Status">
              <InfoRow label="Status" value={d.ecosoc_current?.status || 'Active participant'} note />
              <div className="box alert" style={{ marginTop: 12 }}><div className="box-title">Latest</div><p>{d.ecosoc_current?.latest}</p></div>
              <div className="box green"><div className="box-title">Nigeria's Position</div><p>{d.ecosoc_current?.nigeria_position}</p></div>
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
            {canBriefing && <button className="update-btn" onClick={generateBriefing} disabled={briefingLoading} style={{ background: '#008751' }}>{briefingLoading ? '...' : '🤖 AI Briefing'}</button>}
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
              <p className="prose">Figures are ranked by effective political power as of March 2026. Nigeria's political power is highly personalised — formal institutions matter less than informal networks, ethnic coalitions, and economic patronage.</p>
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
                        <td><div style={{fontSize:12,color:'var(--green)',fontWeight:600}}>{f.health}</div></td>
                        <td className="power-score-cell"><div className="power-score-num">{f.powerScore}</div><div className="power-bar-outer"><div className="power-bar-inner" style={{width:`${f.powerScore}%`,background:f.powerScore>=80?'#008751':f.powerScore>=50?'#90ee90':'#c9a84c'}}></div></div></td>
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
              <InfoRow label="Region" value="West Africa" />
              <InfoRow label="Borders" value="Benin, Niger, Chad, Cameroon" note />
              <InfoRow label="Coastline" value="Gulf of Guinea — 853 km" note />
              <InfoRow label="Highest Point" value="Chappal Waddi — 2,419m" />
              <InfoRow label="Major Rivers" value="Niger, Benue" note />
              <InfoRow label="Climate" value="Tropical in south; arid in north" note />
              <InfoRow label="Terrain" value="Southern lowlands, central plateau, mountains in southeast, plains in north" note />
            </Card>
            <Card emoji="⚡" title="Strategic Geography">
              <Box type="highlight" title="🛢️ Niger Delta">World's largest mangrove forest and Nigeria's oil heartland. Produces 90% of Nigeria's export revenue. Plagued by oil spills, militant groups, and extreme poverty despite vast wealth.</Box>
              <InfoRow label="Oil Reserves" value="37 billion barrels — 10th largest globally" note />
              <InfoRow label="Gas Reserves" value="5.5 trillion cubic metres — 9th globally" note />
              <InfoRow label="Lake Chad Basin" value="Shrunk 90% since 1960 — climate crisis driving Boko Haram recruitment" note />
              <InfoRow label="ECOWAS Dominance" value="Nigeria contributes ~75% of ECOWAS GDP" note />
            </Card>
            <Card emoji="🏙️" title="Major Cities" fullWidth>
              <table className="data-table">
                <thead><tr><th>City</th><th>Population</th><th>Significance</th><th>Region</th></tr></thead>
                <tbody>
                  <tr><td>🏛️ Abuja</td><td>3.6M</td><td>Capital since 1991; political and administrative centre</td><td>FCT</td></tr>
                  <tr><td>🏙️ Lagos</td><td>15.4M</td><td>Economic capital; largest city in Africa; financial hub</td><td>Southwest</td></tr>
                  <tr><td>🕌 Kano</td><td>4.1M</td><td>Largest northern city; commercial and Islamic cultural centre</td><td>Northwest</td></tr>
                  <tr><td>🏭 Ibadan</td><td>3.6M</td><td>Major university city; southwestern commercial centre</td><td>Southwest</td></tr>
                  <tr><td>⛽ Port Harcourt</td><td>2.3M</td><td>Oil industry capital; Niger Delta hub</td><td>South-South</td></tr>
                  <tr><td>🎓 Enugu</td><td>1.0M</td><td>Southeast capital; Igbo cultural centre</td><td>Southeast</td></tr>
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
              <InfoRow label="Population" value="223 million (2024)" />
              <InfoRow label="Median Age" value="18.1 years — very young population" />
              <InfoRow label="Urban Population" value="~54%" />
              <InfoRow label="Official Language" value="English" />
              <InfoRow label="Major Languages" value="Hausa, Yoruba, Igbo — each spoken by 20M+" note />
              <InfoRow label="Ethnic Groups" value="250+ ethnic groups — Hausa-Fulani 29%, Yoruba 21%, Igbo 18%" note />
              <InfoRow label="Religion" value="~50% Muslim (north), ~48% Christian (south)" note />
              <InfoRow label="Youth Unemployment" value="~40% underemployment among under-35s" note />
              <InfoRow label="Diaspora" value="~1.7M Nigerians abroad — largest African diaspora in the US" note />
            </Card>
            <Card emoji="⚠️" title="Key Social Issues">
              <Box type="alert" title="🎓 Education Crisis">Nigeria has the world's largest number of out-of-school children — estimated 10.5 million. The Almajiri system in the north leaves millions without formal education. Boko Haram (whose name means 'Western education is forbidden') exploits this gap.</Box>
              <Box type="alert" title="👩 Gender Inequality">Nigeria ranks 123rd out of 146 countries on the Gender Gap Index. Child marriage rates remain high in the north. Women face significant barriers in political participation and economic life.</Box>
              <Box type="highlight" title="🌍 Japa Syndrome">Mass emigration of educated Nigerians — doctors, engineers, and academics — is draining Nigeria's human capital. An estimated 300,000 Nigerians emigrated in 2023 alone, mostly to the UK, Canada, and the US.</Box>
            </Card>
          </div>
        </div>

        {/* GOVERNMENT */}
        <div id="government">
          <SectionDivider emoji="🏛️" title="Government and Political Structure" />
          <div className="main">
            <Card emoji="⚖️" title="Constitutional Structure">
              <InfoRow label="System" value="Federal Presidential Republic" />
              <InfoRow label="Constitution" value="1999 Constitution (as amended)" />
              <InfoRow label="President" value="Bola Ahmed Tinubu — elected May 2023" note />
              <InfoRow label="Legislature" value="Bicameral — Senate (109 seats) + House of Representatives (360 seats)" note />
              <InfoRow label="Judiciary" value="Supreme Court — nominally independent" note />
              <InfoRow label="States" value="36 states + Federal Capital Territory" note />
              <InfoRow label="Ruling Party" value="All Progressives Congress (APC)" note />
              <Box type="alert" title="⚠️ Democratic Fragility">Nigeria's democracy remains fragile — elections are routinely marred by violence, vote buying, and rigging allegations. Tinubu's 2023 election victory was challenged in court. The military has staged multiple coups since independence.</Box>
            </Card>
            <Card emoji="💰" title="Economy">
              <InfoRow label="GDP (nominal)" value="$477 billion — largest in Africa" />
              <InfoRow label="GDP per capita" value="$2,184 USD" />
              <InfoRow label="Inflation" value="30%+ (2025)" note />
              <InfoRow label="Oil Dependency" value="~90% of foreign exchange earnings" note />
              <InfoRow label="Unemployment" value="5% official / 40%+ underemployment" note />
              <InfoRow label="Poverty Rate" value="~70% below $2/day" note />
              <InfoRow label="Debt" value="$108 billion external debt — 40% of GDP" note />
              <InfoRow label="Remittances" value="$20 billion/year — larger than oil revenue in some years" note />
            </Card>
          </div>
        </div>

        {/* HISTORY */}
        <div id="history">
          <SectionDivider emoji="📅" title="Historical Timeline" />
          <div className="main">
            <Card emoji="🏺" title="From Ancient Kingdoms to 2026" fullWidth>
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
          <SectionDivider emoji="🌐" title="Nigeria Across All Four Committees" />
          <div className="main">
            <Card emoji="🏢" title="Nigeria's UN Role" fullWidth>
              <p className="prose" style={{ marginBottom: 16 }}>Nigeria is Africa's most populous nation and largest economy, giving it significant moral authority in UN forums. It is a frequent non-permanent member of the Security Council and leads African Group positions across all major committees. Nigeria frames all its positions through the lens of development, sovereignty, and the need to reform a global system it sees as biased against the Global South.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                <div className="mini-card" style={{ border: '1px solid rgba(0,135,81,0.3)' }}>
                  <div className="mini-card-title" style={{ color: '#90ee90' }}>🌐 ECOSOC</div>
                  <p>Nigeria champions development financing reform, debt relief for African nations, and technology transfer. Argues the global financial architecture systematically disadvantages developing nations. Advocates for commodity price stabilisation mechanisms to protect oil-dependent economies.</p>
                </div>
                <div className="mini-card" style={{ border: '1px solid rgba(0,135,81,0.3)' }}>
                  <div className="mini-card-title" style={{ color: '#90ee90' }}>👁️ HRC</div>
                  <p>Nigeria has a complicated relationship with the HRC — it faces criticism for LGBTQ+ criminalisation, Boko Haram-related abuses, and security force violations. It deflects by citing sovereignty and cultural relativism while highlighting its counterterrorism work as a human rights achievement.</p>
                </div>
                <div className="mini-card" style={{ border: '1px solid rgba(0,135,81,0.3)' }}>
                  <div className="mini-card-title" style={{ color: '#90ee90' }}>🔫 DISEC</div>
                  <p>Nigeria strongly advocates for small arms and light weapons (SALW) control — the primary driver of its security crises. Supports the Arms Trade Treaty. Calls for greater international support for African counterterrorism operations in the Sahel. Advocates for demining programmes.</p>
                </div>
                <div className="mini-card" style={{ border: '1px solid rgba(0,135,81,0.3)' }}>
                  <div className="mini-card-title" style={{ color: '#90ee90' }}>🌱 UNEP</div>
                  <p>Nigeria is both a major oil producer and a victim of climate change. The Lake Chad Basin has shrunk 90% — driving conflict and displacement. Niger Delta oil pollution is one of the world's worst environmental crises. Nigeria calls for climate finance, technology transfer, and holding oil companies accountable.</p>
                </div>
              </div>
            </Card>
            <Card emoji="🔗" title="Foreign Relations" fullWidth>
              <table className="data-table">
                <thead><tr><th>Country / Bloc</th><th>Relationship</th><th>Status — March 2026</th></tr></thead>
                <tbody>
                  <tr><td>🇺🇸 United States</td><td>Strategic partner — security cooperation, trade</td><td>Relations strained by US concerns over democracy and human rights. Security cooperation continues against Boko Haram.</td></tr>
                  <tr><td>🇨🇳 China</td><td>Major economic partner — infrastructure investment</td><td>China is Nigeria's largest trading partner. Significant infrastructure loans raising debt sustainability concerns.</td></tr>
                  <tr><td>🌍 African Union</td><td>Leading member — Nigeria sees itself as Africa's natural leader</td><td>Active in AU peacekeeping. Leads African Group at UN. Competitive relationship with South Africa for continental leadership.</td></tr>
                  <tr><td>🇬🇧 United Kingdom</td><td>Former colonial power — significant diaspora and trade ties</td><td>UK hosts largest Nigerian diaspora. Remittances critical to Nigerian economy. Relations complicated by UK migration policy.</td></tr>
                  <tr><td>🌐 ECOWAS</td><td>Dominant power — contributes ~75% of ECOWAS GDP</td><td>Led ECOWAS response to 2023 Niger coup. Uses ECOWAS as primary tool of regional influence.</td></tr>
                  <tr><td>🇿🇦 South Africa</td><td>Regional rival for African leadership</td><td>Competitive but cooperative. Both vie for permanent African seat on UN Security Council.</td></tr>
                </tbody>
              </table>
            </Card>
          </div>
        </div>

        {/* MUN TOOLKIT */}
        <div id="toolkit">
          <SectionDivider emoji="🎤" title="MUN Delegate Toolkit — Nigeria" />
          <div className="main">
            <Card emoji="🗣️" title="Core Arguments">
              <Box type="green" title="Argument 1 — Development Before Everything">Nigeria represents 223 million people — the largest population in Africa. For these people, the right to development, to electricity, to education, and to security are more fundamental than abstract political rights. Judge Nigeria not by Western standards but by the extraordinary complexity of governing the most diverse nation on Earth.</Box>
              <Box type="green" title="Argument 2 — Climate Justice">Nigeria did not cause climate change. Yet the Lake Chad Basin — the lifeline of 30 million people — has shrunk 90% due to climate change caused primarily by industrialised nations. The Niger Delta has been destroyed by the operations of Western oil companies. We demand not charity but justice — and binding commitments on climate finance.</Box>
              <Box type="green" title="Argument 3 — Small Arms Flood">Every weapon used by Boko Haram, every gun used by bandits in the northwest, entered Nigeria through borders that Western nations have failed to secure through the Arms Trade Treaty. Nigeria calls for universal ratification of the ATT and binding controls on arms exports to conflict-affected regions.</Box>
              <Box type="green" title="Argument 4 — Debt Trap">Nigeria pays more in debt service than it spends on healthcare and education combined. The current international financial architecture — designed by and for wealthy nations — is strangling African development. Nigeria calls for comprehensive debt restructuring and reform of IMF conditionalities.</Box>
            </Card>
            <Card emoji="🧭" title="Strategic Notes">
              <Box type="highlight" title="🤝 Build These Coalitions">African Group (54 nations), G-77 + China, ECOWAS members, other oil-producing developing nations (Venezuela, Iran), Islamic Cooperation Organisation members. Nigeria's large population gives it significant moral weight — use it.</Box>
              <Box type="alert" title="⚠️ Weak Points">LGBTQ+ criminalisation (Same Sex Marriage Prohibition Act 2014). Boko Haram atrocities — including school kidnappings. Security force abuses — #EndSARS. Corruption (Transparency International ranks Nigeria 145/180). Niger Delta environmental destruction. Electoral fraud allegations.</Box>
              <Box type="blue" title="🎯 Tactical Redirection">When pressed on LGBTQ+ rights: invoke cultural sovereignty and note that Nigeria's laws reflect the democratic will of its people. When pressed on Boko Haram: pivot to calling for more international support. When pressed on corruption: cite reforms and note that Western financial systems enable Nigerian money laundering.</Box>
            </Card>
            <Card emoji="📖" title="Key Vocabulary" fullWidth>
              <table className="data-table">
                <thead><tr><th>Term</th><th>Meaning</th><th>Why It Matters</th></tr></thead>
                <tbody>{VOCAB.map(({ term, meaning, why }) => <tr key={term}><td>{term}</td><td>{meaning}</td><td>{why}</td></tr>)}</tbody>
              </table>
            </Card>
          </div>
        </div>

        <div className="footer" style={{ background: '#1a4a1a' }}>
          🇳🇬 &nbsp; NIGERIA — LIVE MUN RESEARCH PAGE &nbsp;·&nbsp; ECOSOC · HRC · DISEC · UNEP &nbsp;·&nbsp; AUTO-UPDATED DAILY &nbsp;·&nbsp; FOR EDUCATIONAL USE &nbsp; 🇳🇬
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
      const newsUrl = `https://newsapi.org/v2/everything?q=Nigeria+Tinubu&language=en&sortBy=publishedAt&pageSize=15&apiKey=${newsApiKey}`
      const newsRes = await fetch(newsUrl)
      const newsData = await newsRes.json()
      const articles = (newsData.articles || []).slice(0, 12)
      const newsText = articles.map(a => `- [${a.source?.name}] ${a.title}`).join('\n')
      const prompt = `You are a MUN research analyst for Nigeria. Based on these news headlines, generate updated content. Return ONLY valid JSON with keys: alert_banner (object with title and content, or null), leadership (object with title, situation, mun_note), security (object with current_status, latest_development, economic_impact, nigeria_argument), economy (object with current_status, latest_development, economic_impact, nigeria_argument), ecosoc_current (object with status, latest, nigeria_position), last_updated. Headlines: ${newsText}. last_updated: "${new Date().toLocaleString('en-GB')} UTC"`
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
