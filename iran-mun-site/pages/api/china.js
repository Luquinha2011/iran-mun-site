// pages/china.js — China Research Page (all logged-in users)
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
  { id: 'ecosoc', label: '🌐 ECOSOC' },
  { id: 'toolkit', label: '🎤 MUN Toolkit' },
]

const QUICK_STATS = [
  { label: "Population", value: "1.41B", unit: "Most populous nation" },
  { label: "Area", value: "9.596M km²", unit: "4th largest globally" },
  { label: "GDP (nominal)", value: "$17.7T", unit: "2nd largest globally" },
  { label: "GDP per capita", value: "$12,540", unit: "USD (2023)" },
  { label: "Capital", value: "Beijing", unit: "Pop. 21.9 million" },
  { label: "Literacy Rate", value: "97%", unit: "2020 census" },
  { label: "Military Rank", value: "#3", unit: "of 145 nations (2026)" },
  { label: "UN Member Since", value: "1971", unit: "P5 Security Council" },
  { label: "Provinces", value: "23 + 5 AR", unit: "Administrative units" },
]

const TIMELINE = [
  { year: "~2100 BC", text: "Xia Dynasty — considered China's first dynasty, though its historicity is debated." },
  { year: "221 BC", text: "Qin Shi Huang unifies China for the first time. First Emperor creates centralized state, standardizes writing, weights, and measurements." },
  { year: "206 BC–220 AD", text: "Han Dynasty — one of China's golden ages. Confucianism becomes state doctrine. Silk Road opens. China's ethnic majority group is named after this dynasty." },
  { year: "1271–1368", text: "Mongol Yuan Dynasty under Kublai Khan. Marco Polo visits China. China becomes part of the largest contiguous land empire in history." },
  { year: "1368–1644", text: "Ming Dynasty. Great Wall rebuilt. Zheng He's voyages reach Africa. Forbidden City constructed. China is the world's largest economy." },
  { year: "1839–1842", text: "First Opium War. China defeated by Britain. Hong Kong ceded. Century of Humiliation begins — a defining national trauma." },
  { year: "1911", text: "Fall of the Qing Dynasty. Republic of China established under Sun Yat-sen. 2,000 years of imperial rule ends." },
  { year: "1927–1949", text: "Civil War between the Nationalist Party (KMT) and the Communist Party (CCP). Japanese invasion 1937-1945 interrupts but does not end the conflict." },
  { year: "1949", text: "Mao Zedong declares the People's Republic of China. KMT retreats to Taiwan. PRC established with Soviet support." },
  { year: "1958–1962", text: "Great Leap Forward. Mao's forced industrialisation campaign causes the Great Chinese Famine — estimated 15-55 million deaths." },
  { year: "1966–1976", text: "Cultural Revolution. Mao mobilises youth to destroy traditional culture and purge political opponents. Tens of millions persecuted." },
  { year: "1976–1989", text: "Deng Xiaoping's Reform and Opening Up policy. China transitions to a market economy while maintaining CCP political monopoly. Tiananmen Square massacre June 4, 1989." },
  { year: "1997–1999", text: "Hong Kong returned by UK (1997). Macau returned by Portugal (1999). Taiwan remains unresolved." },
  { year: "2001", text: "China joins the World Trade Organization. Begins two decades of extraordinary economic growth — 10% annual GDP growth sustained." },
  { year: "2012", text: "Xi Jinping becomes General Secretary of the CCP and President. Begins consolidation of personal power unprecedented since Mao." },
  { year: "2017–2020", text: "Mass detention of Uyghur Muslims in Xinjiang — estimated 1-1.8 million in camps. International condemnation. China calls them vocational training centres." },
  { year: "2019–2020", text: "Hong Kong pro-democracy protests. National Security Law imposed June 2020 — effectively ends Hong Kong's autonomy under One Country, Two Systems." },
  { year: "2022", text: "Xi Jinping secures unprecedented third term as President. Term limits removed. Concentration of power complete." },
  { year: "2024–2025", text: "Taiwan Strait tensions escalate. China conducts largest-ever military exercises around Taiwan. US-China trade war intensifies with tariffs exceeding 100%." },
  { year: "March 2026", text: "China's economy faces severe headwinds — property sector collapse, youth unemployment at 20%+, deflation. Xi Jinping's Belt and Road Initiative faces widespread debt restructuring." },
]

const VOCAB = [
  { term: "CCP", meaning: "Chinese Communist Party — the sole ruling party of China since 1949. All state power flows through the Party.", why: "Understanding that China is a Party-state, not just a state, is essential for MUN analysis" },
  { term: "Xi Jinping Thought", meaning: "Official ideology enshrined in the Constitution — places Xi's personal doctrine alongside Mao and Deng as foundational ideology", why: "Signals the degree of Xi's personal power consolidation and ideological control" },
  { term: "One China Policy", meaning: "The diplomatic position that there is only one China and Taiwan is part of China. Most nations accept this to maintain relations with Beijing.", why: "Central to all Taiwan-related discussions. China will walk out of any forum that treats Taiwan as a sovereign state" },
  { term: "Belt and Road Initiative (BRI)", meaning: "China's global infrastructure investment strategy — $1 trillion+ in loans and projects across 150+ countries", why: "China's primary tool of economic diplomacy and geopolitical influence, particularly in the Global South" },
  { term: "Five Principles of Peaceful Coexistence", meaning: "China's foundational foreign policy doctrine: mutual respect, non-aggression, non-interference, equality, peaceful coexistence", why: "China invokes these constantly in UN forums to block human rights resolutions — the non-interference principle is its shield" },
  { term: "Century of Humiliation", meaning: "1839-1949 — period of foreign domination, unequal treaties, and territorial loss that defines Chinese nationalist consciousness", why: "Explains China's hypersensitivity to sovereignty issues and its framing of Western criticism as neo-colonial interference" },
  { term: "Zhongnanhai", meaning: "The leadership compound in Beijing — equivalent to China's White House. Seat of the CCP Politburo Standing Committee.", why: "When analysts say 'Zhongnanhai decided', they mean the top 7 leaders of China made a collective decision" },
  { term: "Politburo Standing Committee", meaning: "The 7-member supreme body that collectively governs China. Xi Jinping is General Secretary.", why: "These 7 individuals make all major decisions. Understanding their composition tells you everything about Chinese policy direction" },
  { term: "Wolf Warrior Diplomacy", meaning: "China's assertive, confrontational diplomatic style adopted since ~2017 — named after a nationalist action film series", why: "China's delegates in UN forums have become significantly more aggressive. Expect direct challenges and emotional appeals to sovereignty" },
  { term: "Dual Circulation", meaning: "China's economic strategy to reduce dependence on foreign trade by boosting domestic consumption while maintaining export capacity", why: "Economic self-sufficiency is a strategic priority — context for understanding China's resistance to Western economic pressure" },
]

const POWER_FIGURES = [
  { rank: 1, name: "Xi Jinping", nameChinese: "习近平", position: "General Secretary, CCP; President; Chairman, CMC", institution: "CCP Politburo Standing Committee", powerScore: 100, status: "active", power: "Absolute ruler — controls Party, state, and military simultaneously. Concentration of power unprecedented since Mao. No term limits.", health: "✅ Active — secured unprecedented third term in 2022.", note: "The most powerful Chinese leader since Mao Zedong. All major decisions flow through him personally." },
  { rank: 2, name: "Li Qiang", nameChinese: "李强", position: "Premier — Head of Government", institution: "State Council", powerScore: 72, status: "active", power: "Manages day-to-day economic policy and government administration. Close Xi ally — was Shanghai Party Secretary during COVID lockdowns.", health: "✅ Active.", note: "Number two in the Politburo Standing Committee. His power is entirely dependent on Xi's continued trust." },
  { rank: 3, name: "Wang Huning", nameChinese: "王沪宁", position: "Chairman, CPPCC; Chief Ideologist", institution: "CCP Politburo Standing Committee", powerScore: 68, status: "active", power: "The primary architect of CCP ideology for three decades — shaped Jiang Zemin Thought, Hu Jintao's Harmonious Society, and Xi Jinping Thought.", health: "✅ Active.", note: "The man who writes the ideas that justify CCP rule. Third in Politburo Standing Committee ranking." },
  { rank: 4, name: "Zhao Leji", nameChinese: "赵乐际", position: "Chairman, National People's Congress", institution: "National People's Congress", powerScore: 65, status: "active", power: "Controls China's legislature — the rubber-stamp parliament that formalises CCP decisions into law.", health: "✅ Active.", note: "Former head of the Central Commission for Discipline Inspection — ran Xi's anti-corruption campaign." },
  { rank: 5, name: "Wang Yi", nameChinese: "王毅", position: "Director, CCP Foreign Affairs Commission; Foreign Minister", institution: "Ministry of Foreign Affairs", powerScore: 62, status: "active", power: "China's most senior diplomat. Leads all foreign policy execution. Known for aggressive Wolf Warrior style.", health: "✅ Active — leading China's diplomatic responses to US tariffs and Taiwan tensions.", note: "His public statements are carefully calibrated reflections of Xi's foreign policy intentions." },
  { rank: 6, name: "Zhang Youxia", nameChinese: "张又侠", position: "Vice Chairman, Central Military Commission", institution: "Central Military Commission", powerScore: 60, status: "active", power: "Second-highest military officer in China. Manages day-to-day PLA operations under Xi's command.", health: "✅ Active.", note: "A Xi loyalist with combat experience from the Sino-Vietnamese War. Trusted with military modernisation." },
  { rank: 7, name: "Cai Qi", nameChinese: "蔡奇", position: "Director, CCP General Office; Politburo Standing Committee", institution: "CCP Central Committee", powerScore: 58, status: "active", power: "Controls CCP's nerve centre — the General Office manages Xi's schedule, communications, and access.", health: "✅ Active.", note: "The closest person to Xi in day-to-day operations. Manages the flow of information to the top." },
  { rank: 8, name: "Ding Xuexiang", nameChinese: "丁薛祥", position: "Executive Vice Premier", institution: "State Council", powerScore: 55, status: "active", power: "Manages economic policy coordination across all ministries. Known as Xi's 'chief of staff' before promotion.", health: "✅ Active.", note: "Has worked directly with Xi for decades. One of the most trusted inner-circle figures." },
  { rank: 9, name: "He Weidong", nameChinese: "何卫东", position: "Vice Chairman, Central Military Commission", institution: "Central Military Commission", powerScore: 58, status: "active", power: "Commands China's Eastern Theatre — the military command responsible for Taiwan operations.", health: "✅ Active — oversaw 2024 Taiwan Strait exercises.", note: "His promotion to CMC reflects Xi's prioritisation of Taiwan contingency planning." },
  { rank: 10, name: "Pan Gongsheng", nameChinese: "潘功胜", position: "Governor, People's Bank of China", institution: "People's Bank of China", powerScore: 48, status: "active", power: "Controls China's monetary policy — manages the yuan, foreign exchange reserves ($3.2 trillion), and financial stability.", health: "✅ Active.", note: "As China's economy faces deflation and property crisis, his role has become increasingly critical." },
  { rank: 11, name: "Qin Gang", nameChinese: "秦刚", position: "Former Foreign Minister (dismissed)", institution: "Removed from office", powerScore: 0, status: "restricted", power: "Dismissed July 2023 under unexplained circumstances after just 7 months as Foreign Minister.", health: "🔒 Status unknown — disappeared from public view.", note: "His sudden removal illustrates the fragility of political standing under Xi's system." },
  { rank: 12, name: "Li Shangfu", nameChinese: "李尚福", position: "Former Defence Minister (dismissed)", institution: "Removed from office", powerScore: 0, status: "restricted", power: "Dismissed October 2023 under unexplained circumstances. Under US sanctions since 2018 for buying Russian weapons.", health: "🔒 Status unknown.", note: "Two senior officials vanishing in 2023 signalled significant purging within Xi's inner circle." },
  { rank: 13, name: "Dong Jun", nameChinese: "董军", position: "Defence Minister", institution: "Central Military Commission", powerScore: 52, status: "active", power: "Oversees China's defence ministry and military-to-military diplomatic relationships.", health: "✅ Active.", note: "Navy background — significant given China's focus on South China Sea and Taiwan Strait operations." },
  { rank: 14, name: "Xiao Jie", nameChinese: "肖捷", position: "State Councillor / Secretary-General, State Council", institution: "State Council", powerScore: 42, status: "active", power: "Manages government administration and coordination across all ministries.", health: "✅ Active.", note: "Former Finance Minister. Key figure in managing China's fiscal response to economic slowdown." },
  { rank: 15, name: "Fu Zhenghua", nameChinese: "傅政华", position: "Former Minister of Justice (imprisoned)", institution: "Imprisoned", powerScore: 0, status: "restricted", power: "Sentenced to death with reprieve in 2022 for bribery — a prominent casualty of Xi's anti-corruption campaign.", health: "🔒 Imprisoned.", note: "His fall illustrates that Xi's anti-corruption campaign has reached the highest levels of the security apparatus." },
]

const DEFAULT_DYNAMIC = {
  leadership: { title: "Xi Jinping's Unchallenged Power — 2026", situation: "Xi Jinping has consolidated power to a degree unprecedented since Mao Zedong. Having abolished presidential term limits in 2018 and secured a third term in 2022, Xi now faces a severe economic crisis — property sector collapse, deflation, youth unemployment above 20%, and a trade war with the United States with tariffs exceeding 100%.", mun_note: "China will present itself as a responsible global power being unfairly targeted by Western economic coercion. Delegates should emphasise the Five Principles of Peaceful Coexistence and challenge Western double standards." },
  sanctions: { current_status: "US-China trade war at maximum intensity — 100%+ tariffs", latest_development: "US tariffs on Chinese goods exceed 100% across multiple sectors. China has retaliated with equivalent measures. Multiple technology companies — including NVIDIA, Intel, and ASML — face restrictions on selling advanced chips to China.", economic_impact: "China's GDP growth has slowed to 4.5% — below the government's 5% target. The property sector collapse has wiped out an estimated $18 trillion in household wealth. Youth unemployment officially at 21% but widely believed to be significantly higher.", iran_argument: "China characterises US tariffs and technology restrictions as illegal under WTO rules and economic coercion violating the principles of free trade." },
  military: { current_status: "Elevated — Taiwan Strait and South China Sea tensions high", situation: "China conducted its largest-ever military exercises around Taiwan in 2024. The PLA has deployed carrier battle groups and conducted simulated blockade exercises. The US has increased arms sales to Taiwan and deployed additional forces to the region.", nuclear: "China is expanding its nuclear arsenal at an unprecedented rate — estimated to have 400+ warheads in 2024, projected to reach 1,000 by 2030. For the first time, China can theoretically target all major US cities.", proxies: "China does not operate proxy forces in the conventional sense. Its strategic leverage comes through economic relationships — Belt and Road debt, trade dependency, and diplomatic influence in the Global South." },
  ecosoc_current: { status: "Active participant — uses ECOSOC to promote Global South agenda", latest: "China is the largest contributor to the UN regular budget after the United States and Japan. It uses ECOSOC to advance a development-focused agenda that prioritises economic rights over political and civil rights — a framing that resonates with many developing nations.", iran_position: "China consistently argues that development is a prerequisite for human rights. It blocks resolutions targeting its Xinjiang and Tibet policies by marshalling support from developing nations through Belt and Road relationships." },
  last_updated: "Default content — click Update All Sections to regenerate",
}

// ─── SHARED COMPONENTS (same as Iran page) ───────────────────────────────────

function Box({ type = 'highlight', title, children }) {
  return <div className={`box ${type}`}>{title && <div className="box-title">{title}</div>}<p>{children}</p></div>
}
function InfoRow({ label, value, note }) {
  return <div className="info-row"><span className="info-label">{label}</span><span className={`info-value${note ? ' note' : ''}`}>{value}</span></div>
}
function SectionDivider({ emoji, title }) {
  return <div className="section-divider" style={{ background: '#1a1a3e' }}>{emoji} {title}</div>
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
  if (loading) return <div className="briefing-card"><div className="briefing-header"><h2>🤖 AI Intelligence Briefing</h2></div><div className="briefing-empty"><div className="spinner" style={{ margin: '0 auto 12px', borderColor: '#1a1a3e', borderTopColor: '#c9a84c' }}></div>Generating briefing...</div></div>
  if (!briefing) return <div className="briefing-card" style={{ background: 'linear-gradient(135deg, #1a1a3e, #2a2a5e)' }}><div className="briefing-header"><h2>🤖 AI Intelligence Briefing</h2></div><div className="briefing-empty">Click AI Briefing to get a comprehensive intelligence analysis based on the latest news.</div></div>
  return (
    <div className="briefing-card" style={{ background: 'linear-gradient(135deg, #1a1a3e, #2a2a5e)' }}>
      <div className="briefing-header">
        <h2>🤖 AI Intelligence Briefing</h2>
        {briefing.last_updated && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{new Date(briefing.last_updated).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>}
      </div>
      <div className="briefing-body">
        {briefing.summary && <div className="briefing-section"><div className="briefing-label">📋 Executive Summary</div><div className="briefing-text">{briefing.summary}</div></div>}
        {briefing.situation_overview && <div className="briefing-section"><div className="briefing-label">🌍 Situation Overview</div><div className="briefing-text">{briefing.situation_overview}</div></div>}
        <div className="briefing-grid">
          {briefing.ecosoc_impact && <div className="briefing-box"><div className="briefing-label">🌐 ECOSOC Impact</div><div className="briefing-text">{briefing.ecosoc_impact}</div></div>}
          {briefing.sanctions_update && <div className="briefing-box"><div className="briefing-label">🔒 Trade War Update</div><div className="briefing-text">{briefing.sanctions_update}</div></div>}
          {briefing.military_update && <div className="briefing-box"><div className="briefing-label">💣 Military Update</div><div className="briefing-text">{briefing.military_update}</div></div>}
          {briefing.leadership_crisis && <div className="briefing-box"><div className="briefing-label">👤 Leadership</div><div className="briefing-text">{briefing.leadership_crisis}</div></div>}
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
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const h = () => { const secs = NAV_SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean); let cur = ''; secs.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id }); setActive(cur) }
    window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h)
  }, [])
  return (
    <nav style={{ background: '#1a1a3e', borderBottom: '1px solid rgba(201,168,76,0.2)', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 48 }}>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: '#c9a84c', fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>🇺🇳 MUN Toolkit</button>
        <div style={{ display: 'flex', gap: 2, flexWrap: 'nowrap' }}>
          {NAV_SECTIONS.map(({ id, label }) => (
            <button key={id} onClick={() => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false) }}
              style={{ background: active === id ? 'rgba(201,168,76,0.15)' : 'none', border: 'none', color: active === id ? '#c9a84c' : 'rgba(255,255,255,0.5)', padding: '6px 10px', borderRadius: 3, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: "'Source Sans 3', sans-serif" }}>
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
  const [messages, setMessages] = useState([{ role: 'assistant', content: "Hello! I am your China MUN research assistant. Ask me anything about China's position at ECOSOC, its foreign policy, or MUN procedures." }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  useEffect(() => { if (open && messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' }) }, [messages, open])
  const SUGGESTIONS = ["What are China's strongest arguments in ECOSOC?", "Explain China's position on Taiwan", "What is the Belt and Road Initiative?", "How does China block human rights resolutions?", "What is Wolf Warrior diplomacy?"]
  const sendMessage = async (text) => {
    const userText = text || input.trim(); if (!userText || loading) return
    setInput(''); setLoading(true)
    const newMessages = [...messages, { role: 'user', content: userText }]
    setMessages(newMessages)
    try {
      const res = await fetch('/api/chat-china', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: newMessages }) })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Sorry, please try again.' }])
    } catch { setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]) }
    finally { setLoading(false) }
  }
  const fmt = (text) => text.split('\n').map((line, i) => { const b = line.trim().startsWith('- ') || line.trim().startsWith('• '); const c = line.replace(/^[-•]\s+/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); return <div key={i} style={{ display: 'flex', gap: b ? 8 : 0, marginBottom: line.trim() ? 4 : 2 }}>{b && <span style={{ color: '#c9a84c', flexShrink: 0 }}>→</span>}<span dangerouslySetInnerHTML={{ __html: c }} /></div> })
  return (
    <>
      <button className="chat-fab" style={{ background: '#c0392b' }} onClick={() => setOpen(o => !o)} title="Ask China MUN Assistant">{open ? '✕' : '💬'}{!open && <span className="chat-fab-label">China Assistant</span>}</button>
      {open && (
        <div className="chat-window">
          <div className="chat-header" style={{ background: 'linear-gradient(135deg, #1a1a3e, #c0392b)' }}>
            <div><div className="chat-header-title">🇨🇳 China MUN Assistant</div><div className="chat-header-sub">Powered by Groq AI</div></div>
            <button className="chat-close" onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, i) => <div key={i} className={`chat-msg ${msg.role}`}>{msg.role === 'assistant' && <div className="chat-avatar">🤖</div>}<div className="chat-bubble">{fmt(msg.content)}</div></div>)}
            {loading && <div className="chat-msg assistant"><div className="chat-avatar">🤖</div><div className="chat-bubble chat-typing"><span></span><span></span><span></span></div></div>}
            {messages.length === 1 && <div className="chat-suggestions"><div className="chat-suggestions-label">Suggested questions:</div>{SUGGESTIONS.map((q, i) => <button key={i} className="chat-suggestion" onClick={() => sendMessage(q)}>{q}</button>)}</div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input-row"><input className="chat-input" type="text" placeholder="Ask anything about China..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} disabled={loading} /><button className="chat-send" style={{ background: '#c0392b' }} onClick={() => sendMessage()} disabled={loading || !input.trim()}>➤</button></div>
        </div>
      )}
    </>
  )
}

export default function ChinaPage({ dynamic, generatedAt, user, logout }) {
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
  const fetchNews = async () => { setNewsLoading(true); try { const res = await fetch('/api/news-china'); const data = await res.json(); if (data.news) setNews(data.news) } catch {} finally { setNewsLoading(false) } }
  const generateBriefing = async () => {
    setBriefingLoading(true); setUpdateStatus('Generating AI briefing...')
    const token = localStorage.getItem('mun_token')
    const allArticles = news.flatMap(c => c.articles)
    try {
      const res = await fetch('/api/update-china', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, articles: allArticles.slice(0, 20) }) })
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
      const res = await fetch('/api/revalidate-china', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
      const data = await res.json()
      if (data.revalidated) { setUpdateStatus('Updated! Refreshing in 5 seconds...'); setTimeout(() => window.location.reload(), 5000) }
      else setUpdateStatus(data.error || 'Update failed.')
    } catch { setUpdateStatus('Request failed.') }
    finally { setIsUpdating(false) }
  }
  useEffect(() => { fetchNews() }, [])

  const CHINA_HEADER = { background: 'linear-gradient(135deg, #8B0000 0%, #c0392b 50%, #8B0000 100%)' }

  return (
    <>
      <Head><title>China Research — MUN Toolkit</title><meta name="viewport" content="width=device-width, initial-scale=1" /></Head>
      <div ref={rootRef}>
        {canBriefing && <Chatbot />}

        {/* HEADER */}
        <div className="header" style={CHINA_HEADER}>
          <div className="flag-bar" style={{ borderRadius: 4, overflow: 'hidden', width: 120, height: 8, marginBottom: 20, display: 'flex' }}>
            <div style={{ background: '#DE2910', flex: 1 }} />
            <div style={{ background: '#FFDE00', flex: 0.3 }} />
            <div style={{ background: '#DE2910', flex: 0.7 }} />
          </div>
          <div className="header-top">
            <div>
              <div className="country-name">China 🇨🇳</div>
              <div className="country-sub">People's Republic of China &nbsp;·&nbsp; 中华人民共和国</div>
              <div className="live-badge"><div className="live-dot" />Auto-Updated Daily</div>
            </div>
            <div className="header-meta">
              <strong>MUN Research Page</strong>
              Committee: ECOSOC<br />
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
            <input className="search-input" type="text" placeholder="Search — Xi Jinping, Belt and Road, Taiwan, ECOSOC..." value={query} onChange={e => handleSearchInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); jump(e.shiftKey ? -1 : 1) }; if (e.key === 'Escape') { setQuery(''); clearMarks() } }} />
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
          <Card emoji="👤" title={d.leadership?.title || "Xi Jinping's Unchallenged Power"} fullWidth>
            <p className="prose" style={{ marginBottom: 12 }}>{d.leadership?.situation}</p>
            {d.leadership?.mun_note && <div className="box highlight"><div className="box-title">🎤 MUN Note</div><p>{d.leadership.mun_note}</p></div>}
          </Card>
          <Card emoji="🔒" title="Trade War and Economic Pressure">
            <InfoRow label="Status" value={d.sanctions?.current_status || 'US-China trade war at peak'} />
            <div className="box alert" style={{ marginTop: 12 }}><div className="box-title">Latest Development</div><p>{d.sanctions?.latest_development}</p></div>
            <div className="box highlight"><div className="box-title">Economic Impact</div><p>{d.sanctions?.economic_impact}</p></div>
            <div className="box green"><div className="box-title">China's Argument</div><p>{d.sanctions?.iran_argument}</p></div>
          </Card>
          <Card emoji="💣" title="Military and Taiwan Strait">
            <InfoRow label="Status" value={d.military?.current_status || 'Elevated tensions'} />
            <div className="box alert" style={{ marginTop: 12 }}><div className="box-title">Situation Report</div><p>{d.military?.situation}</p></div>
            <div className="box highlight"><div className="box-title">Nuclear Arsenal</div><p>{d.military?.nuclear}</p></div>
            <div className="box blue"><div className="box-title">Global Influence Tools</div><p>{d.military?.proxies}</p></div>
          </Card>
          <Card emoji="🌐" title="ECOSOC — Current Status">
            <InfoRow label="Status" value={d.ecosoc_current?.status || 'Active participant'} note />
            <div className="box alert" style={{ marginTop: 12 }}><div className="box-title">Latest</div><p>{d.ecosoc_current?.latest}</p></div>
            <div className="box green"><div className="box-title">China's Position</div><p>{d.ecosoc_current?.iran_position}</p></div>
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
          {canBriefing && <button className="update-btn" onClick={generateBriefing} disabled={briefingLoading} style={{ background: '#c0392b' }}>{briefingLoading ? '...' : '🤖 AI Briefing'}</button>}
          {canUpdateAll && (<><input className="update-input" type="password" placeholder="Admin password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: 160 }} /><button className="update-btn" onClick={updateAllSections} disabled={isUpdating} style={{ background: '#8e44ad' }}>{isUpdating ? '⏳ Updating...' : '⚡ Update All Sections'}</button></>)}
          {updateStatus && <span className="update-status">{updateStatus}</span>}
          <span className="fetched-at">Auto-updates daily at 6:00 AM UTC</span>
        </div>
        </div>

        {/* POWER FIGURES */}
        <div id="power-figures">
        <SectionDivider emoji="👑" title="Top 15 Political Figures — Ranked by Power" />
        <div className="main">
          <Card emoji="ℹ️" title="About This Ranking" fullWidth>
            <p className="prose">Figures are ranked by effective political power as of March 2026. Xi Jinping's consolidation of power has made China's leadership structure simpler than it appears — nearly all roads lead back to one person. Two senior figures (Qin Gang and Li Shangfu) were purged in 2023 under unexplained circumstances, illustrating the instability beneath the surface.</p>
          </Card>
          <div className="full-width">
            <div className="power-table-wrapper">
              <table className="power-table">
                <thead><tr><th style={{width:50}}>Rank</th><th style={{width:160}}>Name</th><th style={{width:160}}>Position</th><th>Power and Influence</th><th style={{width:140}}>Health Status</th><th style={{width:80}}>Score</th></tr></thead>
                <tbody>
                  {POWER_FIGURES.map(f => (
                    <tr key={f.rank} className={`power-row status-${f.status}`}>
                      <td className="rank-cell"><span className={`rank-badge ${f.rank <= 3 ? 'top3' : f.rank <= 10 ? 'top10' : ''}`}>{f.rank}</span></td>
                      <td><div className="figure-name">{f.name}</div><div className="figure-farsi">{f.nameChinese}</div><div style={{fontSize:10,color:'var(--light)',marginTop:2}}>{f.institution}</div></td>
                      <td><div className="figure-position">{f.position}</div></td>
                      <td><div style={{fontSize:12,color:'var(--mid)',lineHeight:1.5}}>{f.power}</div>{f.note && <div style={{fontSize:11,color:'var(--light)',fontStyle:'italic',marginTop:4}}>→ {f.note}</div>}</td>
                      <td><div style={{fontSize:12,color:f.status==='restricted'?'#7d3c98':'var(--green)',fontWeight:600}}>{f.health}</div></td>
                      <td className="power-score-cell">{f.powerScore > 0 ? (<><div className="power-score-num">{f.powerScore}</div><div className="power-bar-outer"><div className="power-bar-inner" style={{width:`${f.powerScore}%`,background:f.powerScore>=80?'#c0392b':f.powerScore>=50?'#c9a84c':'#1a5c38'}}></div></div></>) : <div style={{fontSize:11,color:'var(--light)'}}>N/A</div>}</td>
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
            <InfoRow label="Region" value="East Asia" />
            <InfoRow label="Borders" value="Russia, Mongolia, Kazakhstan, Kyrgyzstan, Tajikistan, Afghanistan, Pakistan, India, Nepal, Bhutan, Myanmar, Laos, Vietnam, North Korea" note />
            <InfoRow label="Coastline" value="Yellow Sea, East China Sea, South China Sea — 14,500 km" note />
            <InfoRow label="Highest Point" value="Mount Everest — 8,849m (shared with Nepal)" />
            <InfoRow label="Major Rivers" value="Yangtze, Yellow River (Huang He), Pearl River, Mekong, Brahmaputra" note />
            <InfoRow label="Major Deserts" value="Gobi, Taklamakan" note />
            <InfoRow label="Climate" value="Enormously varied — tropical in south, subarctic in northeast, desert in northwest, temperate in east" note />
            <InfoRow label="Terrain" value="High Tibetan Plateau in west, mountains, deserts; fertile plains and river deltas in east" note />
          </Card>
          <Card emoji="⚡" title="Strategic Geography">
            <Box type="highlight" title="🏝️ South China Sea">China claims approximately 90% of the South China Sea via the Nine-Dash Line — disputed by Vietnam, Philippines, Malaysia, Brunei, and Taiwan. The Permanent Court of Arbitration ruled against China's claims in 2016. China rejects the ruling. The sea carries $3.4 trillion in trade annually.</Box>
            <InfoRow label="Taiwan Strait" value="130km separating mainland China from Taiwan — the world's most dangerous flashpoint" note />
            <InfoRow label="Belt and Road" value="150+ countries, $1 trillion+ in infrastructure loans" note />
            <InfoRow label= "Nuclear Warheads" value="400+ (2024) — expanding rapidly toward 1,000 by 2030" note />
            <InfoRow label="Naval Expansion" value="World's largest navy by number of hulls — surpassed US in 2020" note />
          </Card>
          <Card emoji="🏙️" title="Major Cities" fullWidth>
            <table className="data-table">
              <thead><tr><th>City</th><th>Population</th><th>Significance</th><th>Region</th></tr></thead>
              <tbody>
                <tr><td>🏛️ Beijing</td><td>21.9M</td><td>Capital; political and cultural centre; seat of CCP Politburo</td><td>North China</td></tr>
                <tr><td>🏙️ Shanghai</td><td>24.9M</td><td>Financial capital; largest city; global trade hub</td><td>East China</td></tr>
                <tr><td>🏭 Shenzhen</td><td>17.6M</td><td>Technology and manufacturing hub; first Special Economic Zone</td><td>Guangdong</td></tr>
                <tr><td>🌆 Guangzhou</td><td>16.9M</td><td>Manufacturing and trade capital of southern China</td><td>Guangdong</td></tr>
                <tr><td>🏔️ Chengdu</td><td>16.3M</td><td>Economic centre of western China; major military command</td><td>Sichuan</td></tr>
                <tr><td>🕌 Urumqi</td><td>4.1M</td><td>Capital of Xinjiang — centre of Uyghur detention controversy</td><td>Xinjiang</td></tr>
                <tr><td>🏝️ Hong Kong</td><td>7.3M</td><td>Former British colony; financial centre; autonomy eliminated by 2020 NSL</td><td>Special Administrative Region</td></tr>
                <tr><td>🎰 Macau</td><td>680,000</td><td>Former Portuguese colony; world's largest gambling revenue</td><td>Special Administrative Region</td></tr>
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
            <InfoRow label="Population" value="1.41 billion (2024)" />
            <InfoRow label="Median Age" value="39.5 years — ageing rapidly" />
            <InfoRow label="Urban Population" value="~67%" />
            <InfoRow label="Official Language" value="Mandarin Chinese (Putonghua)" />
            <InfoRow label="Other Languages" value="Cantonese, Shanghainese, Uyghur, Tibetan, Mongolian, Zhuang (55 recognised minorities)" note />
            <InfoRow label="Han Chinese" value="~91.1% of population" />
            <InfoRow label="Ethnic Minorities" value="8.9% — including Uyghur, Tibetan, Mongolian, Zhuang, Hui" note />
            <InfoRow label="One-Child Policy Legacy" value="Ended 2015; now encouraging three children. Demographic crisis — population began shrinking in 2022." note />
            <InfoRow label="Youth Unemployment" value="~21% officially (widely believed to be much higher)" note />
          </Card>
          <Card emoji="🏛️" title="Society and Control">
            <InfoRow label="Internet Users" value="1.05 billion — behind the Great Firewall" />
            <InfoRow label="Social Credit System" value="Ongoing — scores citizens and companies on compliance with CCP norms" note />
            <InfoRow label="Press Freedom" value="175th out of 180 countries — near the bottom globally" note />
            <InfoRow label="Religion" value="Officially atheist state; Buddhism, Taoism, Islam, Christianity permitted but regulated" note />
            <InfoRow label="Confucian Heritage" value="Social harmony, filial piety, hierarchical relationships remain deeply embedded" note />
            <Box type="alert" title="⚠️ Xinjiang — Uyghur Crisis">An estimated 1-1.8 million Uyghur Muslims have been detained in camps China calls vocational training centres. Satellite imagery, leaked documents, and survivor testimony describe systematic cultural erasure, forced labour, and mass surveillance. China characterises this as counter-terrorism and poverty alleviation.</Box>
            <Box type="alert" title="⚠️ Tibet and Hong Kong">Tibet has been under Chinese military control since 1950. The Dalai Lama has been in exile since 1959. Hong Kong's autonomy under One Country, Two Systems was effectively eliminated by the 2020 National Security Law — mass arrests of pro-democracy activists followed.</Box>
          </Card>
        </div>
        </div>

        {/* GOVERNMENT */}
        <div id="government">
        <SectionDivider emoji="🏛️" title="Government and Political Structure" />
        <div className="main">
          <Card emoji="⚖️" title="The Party-State">
            <InfoRow label="System" value="One-party state — Chinese Communist Party (CCP)" />
            <InfoRow label="Constitution" value="People's Republic of China Constitution — amended to remove presidential term limits in 2018" />
            <InfoRow label="General Secretary" value="Xi Jinping — paramount leader; no term limits; third term secured 2022" />
            <InfoRow label="Politburo Standing Committee" value="7 members — the supreme governing body; all men" note />
            <InfoRow label="National People's Congress" value="~3,000 delegates — approves CCP decisions; called a rubber stamp parliament by critics" note />
            <InfoRow label="CPPCC" value="Chinese People's Political Consultative Conference — advisory body; window dressing for non-CCP input" note />
            <InfoRow label="Judiciary" value="Party-controlled; no judicial independence; conviction rate ~99.9%" note />
            <Box type="alert" title="⚠️ There is no separation of powers">In China, the Party controls the state, the military, the judiciary, and the media. Xi simultaneously holds all three top positions: Party General Secretary, President, and Chairman of the Central Military Commission.</Box>
          </Card>
          <Card emoji="💰" title="Economy">
            <InfoRow label="GDP (nominal)" value="$17.7 trillion — 2nd globally" />
            <InfoRow label="GDP per capita" value="$12,540 USD" />
            <InfoRow label="Growth Rate" value="~4.5% (2025) — below 5% government target" note />
            <InfoRow label="Property Crisis" value="Evergrande, Country Garden collapses — $18 trillion household wealth loss estimated" note />
            <InfoRow label="Manufacturing" value="World's factory — produces ~30% of global manufactured goods" />
            <InfoRow label="Trade Surplus" value="$823 billion (2023) — largest in world history" />
            <InfoRow label="Foreign Reserves" value="$3.2 trillion — 2nd largest globally" />
            <InfoRow label="Top Export Partners" value="USA, EU, ASEAN, Japan, South Korea" note />
          </Card>
        </div>
        </div>

        {/* HISTORY */}
        <div id="history">
        <SectionDivider emoji="📅" title="Historical Timeline" />
        <div className="main">
          <Card emoji="🏺" title="From Ancient China to 2026" fullWidth>
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

        {/* ECOSOC */}
        <div id="ecosoc">
        <SectionDivider emoji="🌐" title="China and ECOSOC" />
        <div className="main">
          <Card emoji="🏢" title="China's UN Role" fullWidth>
            <p className="prose" style={{ marginBottom: 16 }}>China is a permanent member of the UN Security Council (P5) with veto power. It is the second largest contributor to the UN regular budget (12%) and the largest contributor of troops among the P5 to UN peacekeeping operations. China uses its UN position to promote a development-first agenda that prioritises economic rights over political and civil rights.</p>
            <div className="three-col">
              <div className="mini-card"><div className="mini-card-title">🛡️ Security Council Veto</div><p>China uses its P5 veto to block resolutions targeting itself (Xinjiang, Tibet, Hong Kong) and its allies (Russia, North Korea, Iran, Venezuela, Syria). It rarely vetoes alone — usually coordinates with Russia.</p></div>
              <div className="mini-card"><div className="mini-card-title">💰 UN Funding</div><p>China contributes 12% of the UN regular budget — second only to the US (22%). It uses this financial leverage to promote its nominees to senior UN positions and influence the organisation's agenda.</p></div>
              <div className="mini-card"><div className="mini-card-title">🌍 Global South Coalition</div><p>China frames itself as the champion of developing nations against Western neo-colonialism. Belt and Road relationships translate into diplomatic support — countries that owe China infrastructure debt tend to abstain rather than vote against China in UN forums.</p></div>
            </div>
          </Card>
          <Card emoji="🚫" title="China's Human Rights Shield">
            <Box type="blue" title="The Non-Interference Doctrine">China's most effective UN strategy is the absolute invocation of national sovereignty and non-interference in internal affairs. Every resolution targeting Xinjiang, Tibet, or Hong Kong is characterised as Western interference in China's domestic affairs — a framing that resonates with many developing nations that have experienced colonialism.</Box>
            <Box type="alert" title="The Xinjiang Challenge">Western nations have introduced resolutions at the Human Rights Council condemning China's treatment of Uyghurs. China has marshalled a counter-coalition of developing nations to block them — in 2022, a motion to even debate Xinjiang was defeated 19-17. China called this a victory for multilateralism.</Box>
            <Box type="highlight" title="The Development Argument">China consistently argues that for developing nations, economic rights — the right to food, shelter, education, and development — are more fundamental than political and civil rights. This argument finds genuine resonance in the Global South and is China's most intellectually coherent UN position.</Box>
          </Card>
          <Card emoji="🔗" title="Foreign Relations" fullWidth>
            <table className="data-table">
              <thead><tr><th>Country / Bloc</th><th>Relationship</th><th>Status — March 2026</th></tr></thead>
              <tbody>
                <tr><td>🇺🇸 United States</td><td>Strategic competition — most consequential bilateral relationship in the world</td><td>Trade war at maximum intensity (100%+ tariffs). Technology decoupling accelerating. Taiwan is the primary flashpoint.</td></tr>
                <tr><td>🇷🇺 Russia</td><td>No limits partnership — Xi and Putin declared friendship without limits February 2022</td><td>China has not provided direct military support to Russia in Ukraine but has been the primary buyer of Russian energy. Relationship complicates China's Global South image.</td></tr>
                <tr><td>🇮🇷 Iran</td><td>Strategic partner — 25-year cooperation agreement (2021)</td><td>Primary buyer of sanctioned Iranian oil. Refuses to recognise UN snapback sanctions. Provides Iran a lifeline.</td></tr>
                <tr><td>🇹🇼 Taiwan</td><td>China considers Taiwan a breakaway province — reunification a core national interest</td><td>Largest-ever military exercises in 2024. US arms sales to Taiwan continue. Taiwan Strait remains world's most dangerous flashpoint.</td></tr>
                <tr><td>🇮🇳 India</td><td>Strategic rival — border disputes, competing Belt and Road vs Quad</td><td>Ongoing border tensions in Ladakh. Both countries have 1.4 billion people and competing visions of Asian leadership.</td></tr>
                <tr><td>🌍 Global South</td><td>Champion of developing nations — Belt and Road, South-South cooperation</td><td>$1 trillion+ in infrastructure loans across 150 countries. Significant debt distress emerging — Zambia, Sri Lanka, Pakistan have sought restructuring.</td></tr>
              </tbody>
            </table>
          </Card>
        </div>
        </div>

        {/* MUN TOOLKIT */}
        <div id="toolkit">
        <SectionDivider emoji="🎤" title="MUN Delegate Toolkit — China" />
        <div className="main">
          <Card emoji="🗣️" title="Core Arguments">
            <Box type="green" title="Argument 1 — Sovereignty and Non-Interference">The principle of non-interference in internal affairs is the bedrock of the international order. The UN Charter's Article 2(7) prohibits intervention in matters within the domestic jurisdiction of any state. Western nations that colonised Asia and Africa for centuries have no standing to lecture China on governance.</Box>
            <Box type="green" title="Argument 2 — Development First">For 1.4 billion people, the most fundamental human right is the right to development — to escape poverty, access education, and live in security. China has lifted 800 million people out of extreme poverty in 40 years — the greatest anti-poverty achievement in human history. This is China's human rights record.</Box>
            <Box type="green" title="Argument 3 — Counter-Terrorism in Xinjiang">China's programmes in Xinjiang are a response to genuine terrorist threats. Xinjiang experienced hundreds of terrorist incidents in the 2010s. The vocational training centres provide education and de-radicalisation — a response proportionate to the security threat. No Western nation has faced similar security challenges without a forceful response.</Box>
            <Box type="green" title="Argument 4 — Taiwan is a Domestic Issue">Taiwan has been an inalienable part of China since ancient times. The One China principle is recognised by the vast majority of UN member states, including the United States. Any discussion of Taiwan's status in this chamber is an interference in China's sovereign internal affairs.</Box>
          </Card>
          <Card emoji="🧭" title="Strategic Notes">
            <Box type="highlight" title="🤝 Build These Coalitions">Russia (P5 veto), Global South nations (Belt and Road recipients), ASEAN (trade dependency), African Union members (Chinese infrastructure investment), Pakistan, Saudi Arabia, UAE. The key is mobilising abstentions — you do not need positive votes, you need to prevent negative majorities.</Box>
            <Box type="alert" title="⚠️ Weak Points">Xinjiang detention camps — satellite imagery is damning. Hong Kong — elimination of democracy on camera. Taiwan military exercises — destabilising. Property sector collapse — economic model failures. Debt trap diplomacy accusations. Demographic crisis from one-child policy legacy. Deng's 2023 disappearance — signals internal instability.</Box>
            <Box type="blue" title="🎯 Tactical Redirection">When pressed on Xinjiang: cite counter-terrorism necessity and challenge the West's record in Iraq and Afghanistan. When pressed on Hong Kong: invoke the legitimate authority of the sovereign state. When pressed on Taiwan: invoke the UN General Assembly Resolution 2758 (1971) which recognised the PRC as the sole legal government of China.</Box>
          </Card>
          <Card emoji="📖" title="Key Vocabulary" fullWidth>
            <table className="data-table">
              <thead><tr><th>Term</th><th>Meaning</th><th>Why It Matters</th></tr></thead>
              <tbody>{VOCAB.map(({ term, meaning, why }) => <tr key={term}><td>{term}</td><td>{meaning}</td><td>{why}</td></tr>)}</tbody>
            </table>
          </Card>
        </div>
        </div>

        <div className="footer" style={{ background: '#1a1a3e' }}>
          🇨🇳 &nbsp; CHINA — LIVE MUN RESEARCH PAGE &nbsp;·&nbsp; ECOSOC COMMITTEE &nbsp;·&nbsp; AUTO-UPDATED DAILY &nbsp;·&nbsp; FOR EDUCATIONAL USE &nbsp; 🇨🇳
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
      const newsUrl = `https://newsapi.org/v2/everything?q=China+Xi+Jinping&language=en&sortBy=publishedAt&pageSize=15&apiKey=${newsApiKey}`
      const newsRes = await fetch(newsUrl)
      const newsData = await newsRes.json()
      const articles = (newsData.articles || []).slice(0, 12)
      const newsText = articles.map(a => `- [${a.source?.name}] ${a.title}`).join('\n')
      const prompt = `You are a MUN research analyst for China at ECOSOC. Based on these news headlines, generate updated content. Return ONLY valid JSON with keys: alert_banner (object with title and content), leadership (object with title, situation, mun_note), sanctions (object with current_status, latest_development, economic_impact, iran_argument), military (object with current_status, situation, nuclear, proxies), ecosoc_current (object with status, latest, iran_position), last_updated. Headlines: ${newsText}. last_updated: "${new Date().toLocaleString('en-GB')} UTC"`
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
