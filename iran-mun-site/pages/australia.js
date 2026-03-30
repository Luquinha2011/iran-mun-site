// pages/australia.js — Australia Research Page (all logged-in users)
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
  { label: "Population", value: "26.8M", unit: "As of 2024" },
  { label: "Area", value: "7,692,024 km²", unit: "6th largest country" },
  { label: "GDP (nominal)", value: "$1.73T", unit: "13th globally" },
  { label: "GDP per capita", value: "$64,812", unit: "USD (2024)" },
  { label: "Capital", value: "Canberra", unit: "Pop. 470,000" },
  { label: "Literacy Rate", value: "99%", unit: "2024 estimate" },
  { label: "Military Rank", value: "#19", unit: "of 145 nations" },
  { label: "UN Member Since", value: "1945", unit: "Founding member" },
  { label: "States & Territories", value: "6 + 2", unit: "Administrative units" },
]

const TIMELINE = [
  { year: "~65,000 BC", text: "Aboriginal Australians arrive on the continent — one of the oldest continuous human cultures on Earth, with over 500 distinct language groups." },
  { year: "1606", text: "Dutch explorer Willem Janszoon makes the first recorded European contact with Australia. Dutch, French, and English explorers chart the coastline over the next 175 years." },
  { year: "1770", text: "Captain James Cook charts the eastern coast and claims it for Britain, naming it New South Wales." },
  { year: "1788", text: "First Fleet arrives at Sydney Cove — Britain establishes a penal colony. Aboriginal population, estimated at 750,000, decimated by disease, displacement, and violence over the following century." },
  { year: "1851", text: "Gold rushes transform the colonies — population surges from 430,000 to 1.7 million in a decade. Eureka Stockade (1854) becomes an early symbol of democratic resistance." },
  { year: "1901", text: "Federation — six colonies unite to form the Commonwealth of Australia on 1 January. Australia becomes one of the first countries to grant women the right to vote (1902). White Australia Policy enacted." },
  { year: "1914–1918", text: "Australia enters WWI. The ANZAC campaign at Gallipoli (1915) becomes foundational to national identity despite catastrophic losses. 60,000 Australians killed." },
  { year: "1939–1945", text: "WWII — Australia fights in Europe, North Africa, and the Pacific. Fall of Singapore (1942) shatters British imperial protection. Australia turns to the US — the alliance that defines its foreign policy ever since." },
  { year: "1945", text: "Australia is a founding member of the United Nations. Herbert Vere Evatt plays a key role in drafting the UN Charter, championing small and medium power rights." },
  { year: "1966–1972", text: "White Australia Policy dismantled. Significant Asian immigration begins. Harold Holt disappears at sea (1967). Gough Whitlam's Labor government elected 1972 — transformative social reforms." },
  { year: "1975", text: "Whitlam government dismissed by Governor-General John Kerr — the most controversial moment in Australian constitutional history. Malcolm Fraser becomes PM." },
  { year: "1992", text: "Mabo v Queensland — High Court overturns terra nullius doctrine, recognising Aboriginal land rights. Native Title Act 1993 follows." },
  { year: "2007", text: "Kevin Rudd elected PM. Australia formally ratifies the Kyoto Protocol. Rudd delivers National Apology to the Stolen Generations." },
  { year: "2013–2022", text: "Decade of political instability — six prime ministers in nine years. Climate policy wars dominate. Scott Morrison's Coalition government accused of climate inaction." },
  { year: "2022", text: "Anthony Albanese wins election, ending nine years of Coalition rule. Australia sets more ambitious climate targets — 43% emissions reduction by 2030." },
  { year: "2023", text: "Voice to Parliament referendum fails — 60% vote No. Significant blow to Aboriginal reconciliation agenda." },
  { year: "2024–2025", text: "Australia deepens AUKUS submarine partnership with US and UK. Tensions with China ease as trade relations partially normalise. Cost-of-living crisis dominates domestic politics." },
  { year: "March 2026", text: "Australia navigates the US-China rivalry in the Indo-Pacific while managing domestic housing affordability, energy transition, and renewed focus on First Nations rights." },
]

const VOCAB = [
  { term: "AUKUS", meaning: "Security pact between Australia, UK, and US announced in 2021 — most significant military commitment, involving acquisition of nuclear-powered submarines", why: "Central to understanding Australia's defence posture and its pivot toward the US in the Indo-Pacific" },
  { term: "QUAD", meaning: "Quadrilateral Security Dialogue — Australia, US, Japan, India — an informal strategic forum in the Indo-Pacific", why: "Key tool of Australian foreign policy to balance China's regional influence" },
  { term: "Five Eyes", meaning: "Intelligence-sharing alliance between Australia, US, UK, Canada, and New Zealand", why: "Australia's most intimate security relationship — shapes its intelligence positions at the UN" },
  { term: "Terra Nullius", meaning: "The now-overturned legal fiction that Australia was empty land before European settlement — used to deny Aboriginal land rights", why: "Background to understanding Australia's obligations to First Nations peoples and domestic human rights challenges" },
  { term: "Net Zero 2050", meaning: "Australia's commitment to reach net zero greenhouse gas emissions by 2050 with 43% reduction by 2030", why: "Key environmental policy driving Australia's positions at UNEP and climate negotiations" },
  { term: "Pacific Step-Up", meaning: "Australia's strategic policy to deepen engagement with Pacific Island nations — partly to counter Chinese influence", why: "Explains Australia's position on Pacific climate finance — existential issue for island nations" },
  { term: "Offshore Processing", meaning: "Australia's controversial policy of detaining asylum seekers in Papua New Guinea and Nauru rather than on Australian territory", why: "Significant human rights flashpoint at the HRC — Australia argues it deters dangerous boat journeys" },
  { term: "Stolen Generations", meaning: "Aboriginal and Torres Strait Islander children forcibly removed from their families under government policy from 1910s to 1970s", why: "Core to understanding Australia's First Nations human rights obligations and domestic politics" },
  { term: "Critical Minerals", meaning: "Australia holds world's largest reserves of lithium, cobalt, and rare earths — essential for clean energy transition", why: "Increasingly central to Australia's economic diplomacy and strategic value in the Indo-Pacific" },
]

const POWER_FIGURES = [
  { rank: 1, name: "Anthony Albanese", position: "Prime Minister of Australia", institution: "Office of the Prime Minister", power: "Head of government. Controls federal executive power, foreign policy, and economic agenda. Labor Party leader since 2019.", health: "✅ Active — managing cost-of-living crisis and AUKUS implementation.", powerScore: 100, status: "active", note: "Won the May 2022 election on climate action, integrity, and social policy. Faces pressure over housing affordability and energy transition." },
  { rank: 2, name: "Jim Chalmers", position: "Treasurer", institution: "Department of the Treasury", power: "Controls federal budget, economic policy, and fiscal strategy. Most influential economic voice in cabinet.", health: "✅ Active.", powerScore: 72, status: "active", note: "Key architect of Australia's cost-of-living relief measures and budget surplus strategy." },
  { rank: 3, name: "Penny Wong", position: "Minister for Foreign Affairs", institution: "Department of Foreign Affairs and Trade", power: "Drives Australia's foreign policy — AUKUS, QUAD, China engagement, and Pacific Step-Up. Former Senate leader.", health: "✅ Active — highly influential internationally.", powerScore: 78, status: "active", note: "Widely considered the most capable minister in the Albanese government. Architect of the China diplomatic reset." },
  { rank: 4, name: "Richard Marles", position: "Deputy Prime Minister & Minister for Defence", institution: "Department of Defence", power: "Oversees AUKUS submarine programme and Australian Defence Force operations. Deputy Labor leader.", health: "✅ Active.", powerScore: 68, status: "active", note: "Central figure in the most significant defence investment in Australian history — the nuclear-powered submarine programme." },
  { rank: 5, name: "Peter Dutton", position: "Leader of the Opposition", institution: "Liberal Party of Australia", power: "Leader of the Liberal-National Coalition. Former Home Affairs Minister known for tough border protection policies.", health: "✅ Active — positioning for next federal election.", powerScore: 58, status: "active", note: "Leads the 'No' campaign rhetoric on many Albanese government initiatives. Hawks hawkish position on China." },
  { rank: 6, name: "Stephen Kennedy", position: "Secretary of the Treasury", institution: "Department of the Treasury", power: "Top public servant on economic matters. Significant influence on fiscal and monetary policy settings.", health: "✅ Active.", powerScore: 55, status: "active", note: "Key advisor to Treasurer Chalmers on managing inflation and cost-of-living pressures." },
  { rank: 7, name: "Michele Bullock", position: "Governor, Reserve Bank of Australia", institution: "Reserve Bank of Australia", power: "Controls Australia's monetary policy and interest rates. First woman to lead the RBA.", health: "✅ Active — navigating post-pandemic interest rate cycle.", powerScore: 65, status: "active", note: "Appointed 2023. Her rate decisions have enormous impact on Australia's housing affordability crisis." },
  { rank: 8, name: "Angela Ganter", position: "Chief of the Defence Force", institution: "Australian Defence Force", power: "Commands Australia's entire military — army, navy, and air force. Oversees AUKUS and joint exercises with US.", health: "✅ Active.", powerScore: 58, status: "active", note: "Leads the largest peacetime defence build-up in Australia's modern history." },
  { rank: 9, name: "Mark Dreyfus", position: "Attorney-General", institution: "Attorney-General's Department", power: "Controls federal justice, integrity, and legal policy. Key figure in the National Anti-Corruption Commission.", health: "✅ Active.", powerScore: 52, status: "active", note: "Established the National Anti-Corruption Commission — a key Labor election promise." },
  { rank: 10, name: "Chris Bowen", position: "Minister for Climate Change and Energy", institution: "Department of Climate Change", power: "Drives Australia's energy transition and climate commitments — 43% emissions reduction by 2030.", health: "✅ Active — faces significant opposition to renewable energy rollout.", powerScore: 60, status: "active", note: "Architect of Australia's most ambitious climate policy agenda. Faces grid reliability challenges as coal plants close." },
]

const DEFAULT_DYNAMIC = {
  leadership: { title: "Albanese Government — Navigating the Indo-Pacific Transition", situation: "Prime Minister Anthony Albanese's Labor government is managing Australia's most consequential strategic pivot in decades — the AUKUS nuclear-powered submarine programme, a delicate China diplomatic reset, and a domestic cost-of-living crisis. Australia is positioning itself as a critical minerals superpower and a responsible middle power in an increasingly contested Indo-Pacific.", mun_note: "Australia will present itself as a constructive multilateralist committed to rules-based international order, climate action, and Indo-Pacific stability — while carefully managing its alliance with the US and growing strategic competition with China." },
  security: { current_status: "Heightened strategic competition — Indo-Pacific tensions", latest_development: "AUKUS submarine programme progressing with US and UK. Australia increasing defence spending to 2.4% of GDP. Ongoing cyber threats attributed to state actors. Enhanced military cooperation with Japan, South Korea, and India through QUAD.", economic_impact: "Defence investment exceeds $50B annually. Critical minerals sector attracting massive foreign investment. Economic coercion from China (2020-2023) cost Australian exporters an estimated $20B.", australia_argument: "Australia advocates for a free, open, and resilient Indo-Pacific underpinned by international law, freedom of navigation, and peaceful resolution of disputes. It frames AUKUS as defensive and consistent with non-proliferation obligations." },
  economy: { current_status: "Stable but under cost-of-living pressure", latest_development: "Inflation easing but housing affordability at historic crisis levels. Labour market remains strong. Critical minerals boom creating new export opportunities. Budget returning to surplus.", economic_impact: "Housing prices in major cities among the highest in the world. Mortgage stress affecting 30%+ of households. Energy transition creating both economic opportunity and short-term price pressures.", australia_argument: "Australia calls for reform of international trade rules, greater investment in critical minerals supply chains, and climate finance mechanisms that reward early movers in the energy transition." },
  ecosoc_current: { status: "Active participant — middle power multilateralist", latest: "Australia is an active ECOSOC participant, championing gender equality, Pacific development, and digital inclusion. It leads the Pacific Islands Forum agenda on climate finance and sustainable development.", australia_position: "Australia consistently advocates for effective multilateralism, rules-based international order, and development assistance focused on good governance and gender equality. It uses its Pacific relationships to amplify developing country voices." },
  last_updated: "Default content — click Update All Sections to regenerate",
}

// ─── Shared UI components ────────────────────────────────────────────────────

function Box({ type = 'highlight', title, children }) {
  return <div className={`box ${type}`}>{title && <div className="box-title">{title}</div>}<p>{children}</p></div>
}
function InfoRow({ label, value, note }) {
  return <div className="info-row"><span className="info-label">{label}</span><span className={`info-value${note ? ' note' : ''}`}>{value}</span></div>
}
function SectionDivider({ emoji, title }) {
  return <div className="section-divider" style={{ background: '#00008B' }}>{emoji} {title}</div>
}
function Card({ emoji, title, fullWidth, children }) {
  return <div className={`card${fullWidth ? ' full-width' : ''}`}><div className="card-header"><span>{emoji}</span><h2>{title}</h2></div><div className="card-body">{children}</div></div>
}

// ─── News ────────────────────────────────────────────────────────────────────

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

// ─── AI Briefing ─────────────────────────────────────────────────────────────

function AIBriefing({ briefing, loading }) {
  if (loading) return <div className="briefing-card"><div className="briefing-header"><h2>🤖 AI Intelligence Briefing</h2></div><div className="briefing-empty"><div className="spinner" style={{ margin: '0 auto 12px', borderColor: '#00008B', borderTopColor: '#FFCC00' }}></div>Generating briefing...</div></div>
  if (!briefing) return <div className="briefing-card" style={{ background: 'linear-gradient(135deg, #00008B, #0000CD)' }}><div className="briefing-header"><h2>🤖 AI Intelligence Briefing</h2></div><div className="briefing-empty">Click AI Briefing to get a comprehensive intelligence analysis based on the latest news.</div></div>
  return (
    <div className="briefing-card" style={{ background: 'linear-gradient(135deg, #00008B, #0000CD)' }}>
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
        {briefing.recommended_actions?.length > 0 && <div className="briefing-section"><div className="briefing-label" style={{ color: '#FFD700' }}>✅ Recommended Actions</div><ul className="briefing-points">{briefing.recommended_actions.map((p, i) => <li key={i}>{p}</li>)}</ul></div>}
      </div>
    </div>
  )
}

// ─── Search hook ─────────────────────────────────────────────────────────────

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

// ─── NavBar ───────────────────────────────────────────────────────────────────

function NavBar({ router }) {
  const [active, setActive] = useState('')
  useEffect(() => {
    const h = () => { const secs = NAV_SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean); let cur = ''; secs.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id }); setActive(cur) }
    window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h)
  }, [])
  return (
    <nav style={{ background: '#00008B', borderBottom: '1px solid rgba(255,204,0,0.3)', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 48 }}>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: '#FFD700', fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>🇺🇳 MUN Toolkit</button>
        <div style={{ display: 'flex', gap: 2, flexWrap: 'nowrap' }}>
          {NAV_SECTIONS.map(({ id, label }) => (
            <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: active === id ? 'rgba(255,204,0,0.2)' : 'none', border: 'none', color: active === id ? '#FFD700' : 'rgba(255,255,255,0.5)', padding: '6px 10px', borderRadius: 3, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: "'Source Sans 3', sans-serif" }}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

// ─── Chatbot ──────────────────────────────────────────────────────────────────

function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ role: 'assistant', content: "Hello! I am SACUL AI, your Australia MUN research assistant. Ask me anything about Australia's position at ECOSOC, HRC, DISEC, or UNEP, its Indo-Pacific strategy, or MUN procedures." }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  useEffect(() => { if (open && messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' }) }, [messages, open])
  const SUGGESTIONS = [
    "What are Australia's strongest arguments in ECOSOC?",
    "How does Australia approach human rights at the HRC?",
    "What is Australia's position on AUKUS at DISEC?",
    "Explain Australia's climate commitments for UNEP",
    "Who are Australia's key allies in the UN?",
  ]
  const sendMessage = async (text) => {
    const userText = text || input.trim(); if (!userText || loading) return
    setInput(''); setLoading(true)
    const newMessages = [...messages, { role: 'user', content: userText }]
    setMessages(newMessages)
    try {
      const res = await fetch('/api/chat-australia', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: newMessages }) })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Sorry, please try again.' }])
    } catch { setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]) }
    finally { setLoading(false) }
  }
  const fmt = (text) => text.split('\n').map((line, i) => { const b = line.trim().startsWith('- ') || line.trim().startsWith('• '); const c = line.replace(/^[-•]\s+/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); return <div key={i} style={{ display: 'flex', gap: b ? 8 : 0, marginBottom: line.trim() ? 4 : 2 }}>{b && <span style={{ color: '#FFD700', flexShrink: 0 }}>→</span>}<span dangerouslySetInnerHTML={{ __html: c }} /></div> })
  return (
    <>
      <button className="chat-fab" style={{ background: '#00008B' }} onClick={() => setOpen(o => !o)} title="Ask SACUL AI">{open ? '✕' : '💬'}{!open && <span className="chat-fab-label">Australia Assistant</span>}</button>
      {open && (
        <div className="chat-window">
          <div className="chat-header" style={{ background: 'linear-gradient(135deg, #00008B, #0000CD)' }}>
            <div><div className="chat-header-title">🇦🇺 Australia MUN Assistant</div><div className="chat-header-sub">SACUL AI · Powered by Groq</div></div>
            <button className="chat-close" onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, i) => <div key={i} className={`chat-msg ${msg.role}`}><div className="chat-bubble">{msg.role === 'assistant' && <div className="chat-avatar">🤖</div>}{fmt(msg.content)}</div></div>)}
            {loading && <div className="chat-msg assistant"><div className="chat-avatar">🤖</div><div className="chat-bubble chat-typing"><span></span><span></span><span></span></div></div>}
            {messages.length === 1 && <div className="chat-suggestions"><div className="chat-suggestions-label">Suggested questions:</div>{SUGGESTIONS.map((q, i) => <button key={i} className="chat-suggestion" onClick={() => sendMessage(q)}>{q}</button>)}</div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input-row"><input className="chat-input" type="text" placeholder="Ask anything about Australia..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} disabled={loading} /><button className="chat-send" style={{ background: '#00008B' }} onClick={() => sendMessage()} disabled={loading || !input.trim()}>➤</button></div>
        </div>
      )}
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AustraliaPage({ dynamic, generatedAt, user, logout }) {
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
  const fetchNews = async () => { setNewsLoading(true); try { const res = await fetch('/api/news-australia'); const data = await res.json(); if (data.news) setNews(data.news) } catch {} finally { setNewsLoading(false) } }
  const generateBriefing = async () => {
    setBriefingLoading(true); setUpdateStatus('Generating AI briefing...')
    const token = localStorage.getItem('mun_token')
    const allArticles = news.flatMap(c => c.articles)
    try {
      const res = await fetch('/api/update-australia', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, articles: allArticles.slice(0, 20) }) })
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
      const res = await fetch('/api/revalidate-australia', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
      const data = await res.json()
      if (data.revalidated) { setUpdateStatus('Updated! Refreshing in 5 seconds...'); setTimeout(() => window.location.reload(), 5000) }
      else setUpdateStatus(data.error || 'Update failed.')
    } catch { setUpdateStatus('Request failed.') }
    finally { setIsUpdating(false) }
  }
  useEffect(() => { fetchNews() }, [])

  // Australian colour scheme: deep navy (#00008B), gold (#FFD700 / #FFCC00), red (#CC0000), white
  const AUSTRALIA_HEADER = { background: 'linear-gradient(135deg, #00003a 0%, #00008B 50%, #00003a 100%)' }

  return (
    <>
      <Head><title>Australia Research — MUN Toolkit</title><meta name="viewport" content="width=device-width, initial-scale=1" /></Head>
      <div ref={rootRef}>
        {/* Made by badge */}
        <div style={{ position: 'fixed', top: 10, left: 10, zIndex: 9999, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, fontFamily: "'Source Sans 3', sans-serif", letterSpacing: 0.5, pointerEvents: 'none' }}>✦ Made by Luquinha</div>
        {canBriefing && <Chatbot />}

        {/* HEADER */}
        <div className="header" style={AUSTRALIA_HEADER}>
          {/* Australian flag colour bar */}
          <div style={{ borderRadius: 4, overflow: 'hidden', width: 120, height: 8, marginBottom: 20, display: 'flex' }}>
            <div style={{ background: '#00008B', flex: 2 }} />
            <div style={{ background: '#CC0000', flex: 1 }} />
            <div style={{ background: '#ffffff', flex: 1 }} />
            <div style={{ background: '#FFCC00', flex: 1 }} />
          </div>
          <div className="header-top">
            <div>
              <div className="country-name">Australia 🇦🇺</div>
              <div className="country-sub">Commonwealth of Australia</div>
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
              {isAdmin && <button onClick={() => router.push('/admin')} style={{ background: 'rgba(255,204,0,0.15)', border: '1px solid #FFCC00', color: '#FFCC00', padding: '4px 12px', borderRadius: 3, fontSize: 11, cursor: 'pointer', fontFamily: "'Source Sans 3', sans-serif" }}>⚙️ Admin</button>}
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
            <input className="search-input" type="text" placeholder="Search — Albanese, AUKUS, QUAD, Pacific, Aboriginal..." value={query} onChange={e => handleSearchInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); jump(e.shiftKey ? -1 : 1) }; if (e.key === 'Escape') { setQuery(''); clearMarks() } }} />
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
            <Card emoji="👤" title={d.leadership?.title || "Albanese Government — Navigating the Indo-Pacific Transition"} fullWidth>
              <p className="prose" style={{ marginBottom: 12 }}>{d.leadership?.situation}</p>
              {d.leadership?.mun_note && <div className="box highlight"><div className="box-title">🎤 MUN Note</div><p>{d.leadership.mun_note}</p></div>}
            </Card>
            <Card emoji="🔒" title="Security — Current Status">
              <InfoRow label="Status" value={d.security?.current_status || 'Heightened Indo-Pacific competition'} />
              <div className="box alert" style={{ marginTop: 12 }}><div className="box-title">Latest Development</div><p>{d.security?.latest_development}</p></div>
              <div className="box highlight"><div className="box-title">Economic Impact</div><p>{d.security?.economic_impact}</p></div>
              <div className="box green"><div className="box-title">Australia's Argument</div><p>{d.security?.australia_argument}</p></div>
            </Card>
            <Card emoji="💰" title="Economy — Current Status">
              <InfoRow label="Status" value={d.economy?.current_status || 'Stable with cost-of-living pressure'} />
              <div className="box alert" style={{ marginTop: 12 }}><div className="box-title">Latest Development</div><p>{d.economy?.latest_development}</p></div>
              <div className="box highlight"><div className="box-title">Human Impact</div><p>{d.economy?.economic_impact}</p></div>
              <div className="box green"><div className="box-title">Australia's Argument</div><p>{d.economy?.australia_argument}</p></div>
            </Card>
            <Card emoji="🌐" title="UN Committees — Current Status">
              <InfoRow label="Status" value={d.ecosoc_current?.status || 'Active multilateralist'} note />
              <div className="box alert" style={{ marginTop: 12 }}><div className="box-title">Latest</div><p>{d.ecosoc_current?.latest}</p></div>
              <div className="box green"><div className="box-title">Australia's Position</div><p>{d.ecosoc_current?.australia_position}</p></div>
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
            {canBriefing && <button className="update-btn" onClick={generateBriefing} disabled={briefingLoading} style={{ background: '#00008B' }}>{briefingLoading ? '...' : '🤖 AI Briefing'}</button>}
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
              <p className="prose">Figures are ranked by effective political power as of March 2026. Australia's Westminster system concentrates power in the Prime Minister and Cabinet, with the Treasury and Foreign Affairs portfolios carrying exceptional weight given Australia's economic and strategic situation.</p>
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
                        <td><div style={{fontSize:12,color:'#FFD700',fontWeight:600}}>{f.health}</div></td>
                        <td className="power-score-cell"><div className="power-score-num">{f.powerScore}</div><div className="power-bar-outer"><div className="power-bar-inner" style={{width:`${f.powerScore}%`,background:f.powerScore>=80?'#00008B':f.powerScore>=50?'#FFD700':'#CC0000'}}></div></div></td>
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
              <InfoRow label="Region" value="Oceania / Indo-Pacific" />
              <InfoRow label="Borders" value="No land borders — island continent" note />
              <InfoRow label="Coastline" value="25,760 km — 7th longest globally" note />
              <InfoRow label="Highest Point" value="Mount Kosciuszko — 2,228m" />
              <InfoRow label="Major Rivers" value="Murray-Darling system" note />
              <InfoRow label="Climate" value="Arid/semi-arid interior; tropical north; temperate south" note />
              <InfoRow label="Terrain" value="Vast flat desert interior (the Outback), coastal ranges, fertile southeast" note />
            </Card>
            <Card emoji="⚡" title="Strategic Geography">
              <InfoRow label="Critical Minerals" value="Largest lithium reserves globally — 57% of world supply" note />
              <InfoRow label="Coal Exports" value="World's 2nd largest coal exporter — major climate policy tension" note />
              <InfoRow label="EEZ" value="9.8 million km² — 3rd largest Exclusive Economic Zone globally" note />
              <InfoRow label="Indo-Pacific Position" value="Sits at intersection of Indian and Pacific Oceans — key strategic location" note />
              <InfoRow label="Great Barrier Reef" value="World's largest coral reef system — under severe climate threat" note />
              <Box type="alert" title="🌡️ Climate Frontline">Australia is one of the world's most climate-vulnerable developed nations — experiencing intensifying bushfires, droughts, and coral bleaching. The 2019-2020 Black Summer bushfires burned 18.6 million hectares and killed an estimated 3 billion animals.</Box>
            </Card>
            <Card emoji="🏙️" title="Major Cities" fullWidth>
              <table className="data-table">
                <thead><tr><th>City</th><th>Population</th><th>Significance</th><th>State/Territory</th></tr></thead>
                <tbody>
                  <tr><td>🏛️ Canberra</td><td>470,000</td><td>National capital; political and administrative centre</td><td>ACT</td></tr>
                  <tr><td>🏙️ Sydney</td><td>5.3M</td><td>Largest city; financial and cultural capital</td><td>NSW</td></tr>
                  <tr><td>🌆 Melbourne</td><td>5.1M</td><td>Cultural capital; major financial and business hub</td><td>Victoria</td></tr>
                  <tr><td>☀️ Brisbane</td><td>2.6M</td><td>Fast-growing; host of 2032 Olympic Games</td><td>Queensland</td></tr>
                  <tr><td>⛏️ Perth</td><td>2.1M</td><td>Gateway to mining regions; Indian Ocean facing</td><td>WA</td></tr>
                  <tr><td>🍷 Adelaide</td><td>1.4M</td><td>Defence industry hub; wine and food capital</td><td>SA</td></tr>
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
              <InfoRow label="Population" value="26.8 million (2024)" />
              <InfoRow label="Median Age" value="38.4 years" />
              <InfoRow label="Urban Population" value="~86% — one of world's most urbanised" />
              <InfoRow label="Official Language" value="English (de facto)" />
              <InfoRow label="Indigenous Population" value="3.8% — Aboriginal and Torres Strait Islander peoples" note />
              <InfoRow label="Born Overseas" value="~30% — highly multicultural nation" note />
              <InfoRow label="Religion" value="~44% Christian; ~39% no religion (growing); Muslim 3.2%" note />
              <InfoRow label="Life Expectancy" value="83.3 years — among world's highest" note />
              <InfoRow label="University Educated" value="~35% of adults hold bachelor's degree or higher" note />
            </Card>
            <Card emoji="⚠️" title="Key Social Issues">
              <Box type="alert" title="🏠 Housing Affordability Crisis">Sydney and Melbourne rank among the world's least affordable cities. The ratio of median house price to median income exceeds 12:1 in Sydney. A generation of younger Australians is being locked out of home ownership — the defining political issue of 2025-2026.</Box>
              <Box type="alert" title="🪃 First Nations Justice">Aboriginal and Torres Strait Islander peoples experience life expectancy 8 years below the national average, incarceration rates 15 times higher, and significantly worse health and education outcomes. The 2023 Voice to Parliament referendum failure has complicated the reconciliation agenda.</Box>
              <Box type="highlight" title="🌏 Multicultural Identity">Australia's identity is increasingly shaped by its Asian neighbourhood. Over 20% of Australians have Asian heritage. This demographic shift is influencing foreign policy, trade relationships, and Australia's emerging role as an Indo-Pacific nation rather than a European outpost.</Box>
            </Card>
          </div>
        </div>

        {/* GOVERNMENT */}
        <div id="government">
          <SectionDivider emoji="🏛️" title="Government and Political Structure" />
          <div className="main">
            <Card emoji="⚖️" title="Constitutional Structure">
              <InfoRow label="System" value="Federal Parliamentary Constitutional Monarchy" />
              <InfoRow label="Constitution" value="Commonwealth of Australia Constitution Act 1901" />
              <InfoRow label="Head of State" value="King Charles III — represented by Governor-General" note />
              <InfoRow label="Prime Minister" value="Anthony Albanese — elected May 2022" note />
              <InfoRow label="Legislature" value="Bicameral — Senate (76 seats) + House of Representatives (151 seats)" note />
              <InfoRow label="Judiciary" value="High Court of Australia — final court of appeal" note />
              <InfoRow label="States" value="6 states + 2 self-governing territories" note />
              <InfoRow label="Ruling Party" value="Australian Labor Party (ALP)" note />
              <Box type="highlight" title="🗳️ Compulsory Voting">Australia is one of very few democracies where voting is compulsory — with fines for non-voters. This produces high turnout (95%+) and governments that must appeal to the median voter, not just partisan bases.</Box>
            </Card>
            <Card emoji="💰" title="Economy">
              <InfoRow label="GDP (nominal)" value="$1.73 trillion — 13th globally" />
              <InfoRow label="GDP per capita" value="$64,812 USD — among world's highest" />
              <InfoRow label="Inflation" value="~3% (2025 — easing)" note />
              <InfoRow label="Key Exports" value="Iron ore, coal, LNG, gold, agricultural products" note />
              <InfoRow label="Unemployment" value="~4.1% — near historic lows" note />
              <InfoRow label="Key Trading Partners" value="China (32% of exports), Japan, South Korea, India" note />
              <InfoRow label="Critical Minerals" value="Major emerging export sector — lithium, cobalt, rare earths" note />
              <InfoRow label="Defence Spending" value="~2.4% of GDP — rising sharply for AUKUS" note />
            </Card>
          </div>
        </div>

        {/* HISTORY */}
        <div id="history">
          <SectionDivider emoji="📅" title="Historical Timeline" />
          <div className="main">
            <Card emoji="🏺" title="From Ancient Australia to 2026" fullWidth>
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
          <SectionDivider emoji="🌐" title="Australia Across All Four Committees" />
          <div className="main">
            <Card emoji="🏢" title="Australia's UN Role" fullWidth>
              <p className="prose" style={{ marginBottom: 16 }}>Australia is a founding UN member with a proud tradition of constructive multilateralism. It helped shape the UN Charter and has contributed to peacekeeping operations worldwide. Australia sits in an unusual position — a wealthy Western nation geographically located in the Indo-Pacific, deeply dependent on China economically while allied militarily with the US. This tension defines its UN positions on trade, security, and human rights.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                <div className="mini-card" style={{ border: '1px solid rgba(255,204,0,0.3)' }}>
                  <div className="mini-card-title" style={{ color: '#FFD700' }}>🌐 ECOSOC</div>
                  <p>Australia champions gender equality, effective development assistance, and digital inclusion. It leads Pacific development finance conversations. Australia promotes good governance and anti-corruption as conditions for development aid — sometimes creating tension with developing nations.</p>
                </div>
                <div className="mini-card" style={{ border: '1px solid rgba(255,204,0,0.3)' }}>
                  <div className="mini-card-title" style={{ color: '#FFD700' }}>👁️ HRC</div>
                  <p>Australia faces criticism for its offshore asylum seeker processing policy (Nauru/PNG) and poor outcomes for Aboriginal and Torres Strait Islander peoples. It counters by citing its robust democratic institutions, resettlement programmes, and international aid. It strongly advocates for freedom of expression and press freedom globally.</p>
                </div>
                <div className="mini-card" style={{ border: '1px solid rgba(255,204,0,0.3)' }}>
                  <div className="mini-card-title" style={{ color: '#FFD700' }}>🔫 DISEC</div>
                  <p>Australia strongly supports arms control and non-proliferation. AUKUS nuclear-powered submarine programme faces scrutiny — Australia insists it complies fully with NPT obligations. Australia advocates for cyber norms of behaviour and regulation of autonomous weapons systems. Supports the Arms Trade Treaty.</p>
                </div>
                <div className="mini-card" style={{ border: '1px solid rgba(255,204,0,0.3)' }}>
                  <div className="mini-card-title" style={{ color: '#FFD700' }}>🌱 UNEP</div>
                  <p>Australia walks a tightrope — one of the world's largest coal and LNG exporters, yet also a major victim of climate change and a champion of Pacific island nations facing existential sea-level rise. Since 2022, Australia has significantly upgraded its climate commitments and calls for ambitious global climate finance mechanisms.</p>
                </div>
              </div>
            </Card>
            <Card emoji="🔗" title="Foreign Relations" fullWidth>
              <table className="data-table">
                <thead><tr><th>Country / Bloc</th><th>Relationship</th><th>Status — March 2026</th></tr></thead>
                <tbody>
                  <tr><td>🇺🇸 United States</td><td>Closest strategic ally — AUKUS, Five Eyes, ANZUS Treaty</td><td>Alliance at historic depth. AUKUS submarine programme progressing. Deep intelligence and military integration.</td></tr>
                  <tr><td>🇨🇳 China</td><td>Largest trading partner — complex strategic rivalry</td><td>Partial diplomatic reset since 2022. Trade sanctions mostly lifted. Strategic competition in Indo-Pacific remains intense.</td></tr>
                  <tr><td>🇬🇧 United Kingdom</td><td>AUKUS partner — shared Crown, Five Eyes, cultural ties</td><td>AUKUS deepening defence ties. Significant bilateral trade post-Brexit FTA. Strong intelligence sharing.</td></tr>
                  <tr><td>🇯🇵 Japan</td><td>Key QUAD partner — growing security cooperation</td><td>Most important Asian security partner. Joint exercises and defence technology cooperation expanding rapidly.</td></tr>
                  <tr><td>🌏 ASEAN</td><td>Major regional grouping — Australia a dialogue partner</td><td>Australia seeking deeper ASEAN integration. Significant aid and investment. Careful balance on South China Sea.</td></tr>
                  <tr><td>🏝️ Pacific Islands</td><td>Regional leader — Pacific Step-Up policy</td><td>Climate finance and development aid central. Competition with China for influence. Tuvalu/Kiribati agreements on migration.</td></tr>
                </tbody>
              </table>
            </Card>
          </div>
        </div>

        {/* MUN TOOLKIT */}
        <div id="toolkit">
          <SectionDivider emoji="🎤" title="MUN Delegate Toolkit — Australia" />
          <div className="main">
            <Card emoji="🗣️" title="Core Arguments">
              <Box type="green" title="Argument 1 — Rules-Based International Order">Australia's security, prosperity, and sovereignty depend on a rules-based international order. No nation benefits more from international law, freedom of navigation, and peaceful dispute resolution than a mid-sized trading nation like Australia. We reject the use of economic coercion and military intimidation to settle disputes — and we will invest in the alliances and institutions needed to uphold these principles.</Box>
              <Box type="green" title="Argument 2 — Climate Leadership with Pacific Solidarity">Australia is both a significant emitter and a frontline victim of climate change. We have made the difficult transition from climate laggard to climate leader — committing to 43% emissions reduction by 2030. But we also stand with our Pacific neighbours who face existential threats from sea-level rise. Australia calls for the Green Climate Fund to be fully capitalised and for loss and damage mechanisms to be adequately resourced.</Box>
              <Box type="green" title="Argument 3 — Critical Minerals for the Clean Energy Transition">Australia holds the world's largest reserves of many critical minerals essential for clean energy — lithium, cobalt, nickel, and rare earths. We are prepared to be a reliable, rules-based supplier to the world. In return, we ask for fair trade rules, technology transfer partnerships, and recognition that resource development, when conducted responsibly, is essential to the global energy transition.</Box>
              <Box type="green" title="Argument 4 — Effective Multilateralism Over Paralysis">The UN Security Council's dysfunction — particularly the use of vetoes to block accountability — undermines the entire UN system. Australia champions UN reform, transparent decision-making, and effective multilateral institutions that can respond to emerging challenges. We advocate for the voice of small and medium nations to be heard equally alongside the great powers.</Box>
            </Card>
            <Card emoji="🧭" title="Strategic Notes">
              <Box type="highlight" title="🤝 Build These Coalitions">Western bloc (US, UK, Canada, New Zealand — Five Eyes), QUAD partners (Japan, India), Pacific Island Forum, like-minded mid-powers (Canada, Netherlands, South Korea, Germany), climate-ambitious nations. Australia's credibility on climate has significantly improved since 2022.</Box>
              <Box type="alert" title="⚠️ Weak Points">Offshore asylum seeker processing on Nauru and PNG — significant HRC vulnerability. Australia's status as world's largest coal exporter — tension with climate commitments. Poor Aboriginal and Torres Strait Islander outcomes — life expectancy gap, incarceration rates. AUKUS nuclear-submarine programme faces non-proliferation questions at DISEC.</Box>
              <Box type="blue" title="🎯 Tactical Redirection">When pressed on asylum seekers: cite the humanitarian rationale of preventing dangerous boat journeys and deaths at sea; highlight resettlement numbers. When pressed on coal exports: note Australia's domestic renewable transition and that coal phase-out must be managed in a just and orderly way. When pressed on AUKUS: emphasise full NPT compliance and the defensive nature of the submarines. When pressed on Aboriginal outcomes: acknowledge the challenge, cite investment levels, and note the long-term nature of reconciliation.</Box>
            </Card>
            <Card emoji="📖" title="Key Vocabulary" fullWidth>
              <table className="data-table">
                <thead><tr><th>Term</th><th>Meaning</th><th>Why It Matters</th></tr></thead>
                <tbody>{VOCAB.map(({ term, meaning, why }) => <tr key={term}><td>{term}</td><td>{meaning}</td><td>{why}</td></tr>)}</tbody>
              </table>
            </Card>
          </div>
        </div>

        <div className="footer" style={{ background: '#00003a', borderTop: '2px solid #FFCC00' }}>
          🇦🇺 &nbsp; AUSTRALIA — LIVE MUN RESEARCH PAGE &nbsp;·&nbsp; ECOSOC · HRC · DISEC · UNEP &nbsp;·&nbsp; AUTO-UPDATED DAILY &nbsp;·&nbsp; FOR EDUCATIONAL USE &nbsp; 🇦🇺
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
      const newsUrl = `https://newsapi.org/v2/everything?q=Australia+Albanese&language=en&sortBy=publishedAt&pageSize=15&apiKey=${newsApiKey}`
      const newsRes = await fetch(newsUrl)
      const newsData = await newsRes.json()
      const articles = (newsData.articles || []).slice(0, 12)
      const newsText = articles.map(a => `- [${a.source?.name}] ${a.title}`).join('\n')
      const prompt = `You are a MUN research analyst for Australia. Based on these news headlines, generate updated content. Return ONLY valid JSON with keys: alert_banner (object with title and content, or null), leadership (object with title, situation, mun_note), security (object with current_status, latest_development, economic_impact, australia_argument), economy (object with current_status, latest_development, economic_impact, australia_argument), ecosoc_current (object with status, latest, australia_position), last_updated. Headlines: ${newsText}. last_updated: "${new Date().toLocaleString('en-GB')} UTC"`
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
