// pages/index.js
import { useState, useEffect, useRef, useCallback } from 'react'
import Head from 'next/head'

// ─── STATIC DATA (never changes) ────────────────────────────────────────────

const QUICK_STATS = [
  { label: "Population", value: "92.4M", unit: "17th globally" },
  { label: "Area", value: "1.648M km²", unit: "17th in Asia" },
  { label: "GDP (nominal)", value: "~$454B", unit: "2023 estimate" },
  { label: "GDP per capita", value: "~$5,400", unit: "USD approx." },
  { label: "Capital", value: "Tehran", unit: "Pop. 9.6 million" },
  { label: "Literacy Rate", value: "86%", unit: "2016 census" },
  { label: "Military Rank", value: "#16", unit: "of 145 nations" },
  { label: "UN Member Since", value: "1945", unit: "Founding member" },
  { label: "Provinces", value: "31", unit: "Administrative units" },
]

const TIMELINE = [
  { year: "~550 BC", text: "Cyrus the Great founds the Achaemenid Empire — first world superpower. Issues the Cyrus Cylinder, widely considered the world's first charter of human rights." },
  { year: "637–651 AD", text: "Arab Muslim conquest of Persia. Persian culture ultimately reshapes Islamic civilization — not the reverse." },
  { year: "1502–1736", text: "Safavid Dynasty establishes Shia Islam as state religion. Isfahan becomes one of the world's most sophisticated cities." },
  { year: "1951–1953", text: "PM Mossadegh nationalises Anglo-Iranian Oil Company. CIA/MI6-backed coup (Operation Ajax) removes him — a defining historical grievance." },
  { year: "1979", text: "Islamic Revolution. Shah deposed. Islamic Republic established. US Embassy seized — 444-day hostage crisis." },
  { year: "1980–1988", text: "Iran-Iraq War. Estimated 500,000–1M casualties. Shapes Iran's security doctrine." },
  { year: "2015", text: "JCPOA nuclear deal signed with P5+1. Iran limits enrichment in exchange for sanctions relief." },
  { year: "2018", text: "US withdraws from JCPOA under Trump. 'Maximum pressure' sanctions reimposed. Iranian rial collapses." },
  { year: "Sept 2022", text: "Mahsa Amini killed in police custody. Nationwide 'Woman, Life, Freedom' protests erupt." },
  { year: "Nov 2022", text: "ECOSOC votes 29–8 to remove Iran from the Commission on the Status of Women. First mid-term removal in the body's history." },
  { year: "June 2025", text: "Israel launches the 'Twelve-Day War'. US strikes Fordow nuclear facility. Ceasefire June 24." },
  { year: "Sept 2025", text: "UN sanctions reimposed via JCPOA snapback by UK, France, Germany. Russia and China contest legal validity." },
  { year: "Dec 2025", text: "Largest protests since 1979 erupt across all 31 provinces. ~5 million Iranians on the streets." },
  { year: "Jan 2026", text: "Government massacre of protesters. Deaths estimated 3,117–32,000. IAEA discovers hidden enriched uranium." },
  { year: "Feb 28, 2026", text: "US and Israel launch coordinated strikes. Supreme Leader Khamenei assassinated. Iran retaliates with hundreds of drones and missiles." },
  { year: "March 2026", text: "Iran attacks Gulf energy infrastructure. Brent crude above $119/barrel. Strait of Hormuz threatened. Conflict ongoing." },
]

const VOCAB = [
  { term: "Velayat-e Faqih", meaning: "Guardianship of the Islamic Jurist — constitutional doctrine granting supreme authority to the senior religious jurist", why: "Iran's entire political system rests on this; explains why the elected President has fundamentally limited power" },
  { term: "IRGC", meaning: "Islamic Revolutionary Guard Corps — Iran's most powerful military-political institution", why: "Controls nuclear programme, all proxy networks, internal intelligence. The real engine of Iranian foreign policy." },
  { term: "JCPOA", meaning: "Joint Comprehensive Plan of Action — the 2015 nuclear deal between Iran and the P5+1", why: "Legal foundation of all nuclear-related sanctions disputes" },
  { term: "Snapback Mechanism", meaning: "JCPOA provision allowing signatories to automatically reimpose UN sanctions", why: "Used by E3 in September 2025; Russia and China contest its legality" },
  { term: "Axis of Resistance", meaning: "Iran's term for its allied armed groups: Hezbollah, Hamas, Houthis, Iraqi Shia militias", why: "All significantly weakened since 2023–2025" },
  { term: "Nowruz", meaning: "Persian New Year — celebrated on the vernal equinox (March 21) for over 3,000 years", why: "Represents Iranian civilizational identity predating Islam" },
  { term: "Rahbar", meaning: "'Leader' — the Supreme Leader; highest authority above all elected officials", why: "Khamenei killed February 28, 2026 — constitutional crisis ongoing" },
  { term: "Ta'arof", meaning: "Iran's elaborate system of ritualized courtesy and social reciprocity", why: "Governs Iranian diplomatic culture" },
  { term: "Fatwa", meaning: "A religious ruling issued by a qualified Islamic jurist", why: "Khamenei's 2003 fatwa declaring nuclear weapons haram is Iran's civilian nuclear argument" },
]

// ─── DEFAULT DYNAMIC CONTENT (used before first AI update) ──────────────────

const DEFAULT_DYNAMIC = {
  leadership: {
    title: "Leadership Crisis — Post February 28, 2026",
    situation: "Supreme Leader Ali Khamenei was assassinated on February 28, 2026, during coordinated US-Israeli military strikes on Iran. The Islamic Republic faces its most severe constitutional crisis since its founding in 1979. No successor has been publicly named. The Assembly of Experts — 88 clerics constitutionally responsible for selecting a new Supreme Leader — is in emergency session under conditions of active military conflict and mass civil unrest.",
    key_figures: [
      { name: "Ali Khamenei", role: "Supreme Leader (deceased Feb 28, 2026)", note: "Ruled Iran since 1989. His assassination leaves a power vacuum with no clear successor." },
      { name: "Assembly of Experts", role: "Constitutional body responsible for selecting new Supreme Leader", note: "88 clerics currently in emergency session. Deliberations complicated by ongoing conflict and internal factional divisions." },
      { name: "IRGC Leadership", role: "De facto power brokers during succession crisis", note: "The Revolutionary Guard is widely expected to play a decisive role in determining — or imposing — the next Supreme Leader." },
      { name: "Mohammad Mokhber", role: "Acting President (status uncertain)", note: "Constitutional chain of command is contested given the simultaneous absence of both the Supreme Leader and a functioning civilian government." },
    ],
    mun_note: "The leadership vacuum fundamentally changes Iran's negotiating position in ECOSOC. Delegates should acknowledge the uncertainty while maintaining that Iran's institutional positions — on sovereignty, sanctions, and the CSW removal — remain unchanged regardless of who leads the country."
  },
  sanctions: {
    current_status: "Maximal — UN, US, and EU sanctions simultaneously in force",
    latest_development: "UN sanctions reimposed September 2025 via JCPOA snapback. US maintains full maximum pressure regime. Iran's Central Bank blacklisted. SWIFT access severed. Shadow fleet operations continue — UK intercepted Bella 1 (renamed Marinera) in January 2026 carrying sanctioned Iranian, Venezuelan, and Russian oil.",
    economic_impact: "Iranian rial in freefall — currency collapse triggered the December 2025 protests. GDP growth severely constrained. Inflation running at 40–50%. Budget deficit widening. China remains primary buyer of sanctioned oil at steep discounts.",
    iran_argument: "Iran characterises all sanctions as illegal collective punishment of 92 million civilians, violating international humanitarian law. On the snapback specifically, Iran argues the mechanism was improperly invoked since the US had already left the JCPOA."
  },
  military: {
    current_status: "Active conflict — February/March 2026",
    situation: "Following the February 28, 2026 US-Israeli strikes that killed Supreme Leader Khamenei, Iran launched retaliatory strikes targeting US military bases in Bahrain, Jordan, Kuwait, Qatar, Saudi Arabia, and Turkey, as well as targets in Israel. In March 2026, Iran conducted attacks on Gulf energy infrastructure pushing Brent crude above $119/barrel. The Strait of Hormuz remains under threat.",
    nuclear: "Nuclear sites at Natanz and Fordow were significantly damaged in June 2025 Israeli strikes. The programme was set back approximately two years. In January 2026, the IAEA discovered a previously unknown underground enrichment facility — Iran had restarted enrichment.",
    proxies: "Iran's Axis of Resistance proxy network has been significantly degraded since 2023. Hezbollah severely weakened. Hamas leadership eliminated. Houthis continue Red Sea operations. Syria's Assad fell in late 2024, severing a key logistics corridor."
  },
  ecosoc_current: {
    status: "Formally suspended from CSW — active conflict complicates all multilateral engagement",
    latest: "Iran remains removed from the Commission on the Status of Women following the 2022 vote. The January 2026 massacre of protesters has intensified international pressure for further ECOSOC action. Iran's financial exclusion from World Bank and IMF — coordinated through ECOSOC's institutional family — is total. The ongoing military conflict has prompted an emergency ECOSOC debate on humanitarian implications and energy security.",
    iran_position: "Iran maintains that all institutional actions against it are politically motivated and legally invalid. It continues to participate in ECOSOC general sessions, ESCAP, and the CND as a sovereign Member State asserting its full rights under the UN Charter."
  },
  last_updated: "Static default — click Update All Sections to fetch AI-generated content",
  last_updated_time: null
}

// ─── HELPER COMPONENTS ──────────────────────────────────────────────────────

function Box({ type = 'highlight', title, children }) {
  return (
    <div className={`box ${type}`}>
      {title && <div className="box-title">{title}</div>}
      <p>{children}</p>
    </div>
  )
}

function InfoRow({ label, value, note }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className={`info-value${note ? ' note' : ''}`}>{value}</span>
    </div>
  )
}

function SectionDivider({ emoji, title }) {
  return <div className="section-divider">{emoji} {title}</div>
}

function Card({ emoji, title, fullWidth, children }) {
  return (
    <div className={`card${fullWidth ? ' full-width' : ''}`}>
      <div className="card-header"><span>{emoji}</span><h2>{title}</h2></div>
      <div className="card-body">{children}</div>
    </div>
  )
}

// ─── NEWS SECTION ────────────────────────────────────────────────────────────

function NewsSection({ news, loading }) {
  if (loading) return (
    <div style={{ padding: 40, textAlign: 'center', color: 'var(--light)' }}>
      <div className="spinner" style={{ margin: '0 auto 12px' }}></div>
      <div style={{ fontSize: 13 }}>Fetching latest news...</div>
    </div>
  )
  if (!news || news.length === 0) return (
    <div style={{ padding: 20, color: 'var(--light)', fontSize: 13, fontStyle: 'italic' }}>
      Add your NewsAPI key in Vercel environment variables to enable live news.
    </div>
  )
  return (
    <div className="news-grid">
      {news.map(category => (
        <div key={category.category}>
          <div className="news-category-title">{category.label}</div>
          {category.articles.length === 0 ? (
            <div className="news-empty">No articles found.</div>
          ) : category.articles.map((article, i) => (
            <div key={i} className="news-item">
              <a className="news-item-title" href={article.url} target="_blank" rel="noopener noreferrer">
                {article.title}
              </a>
              {article.description && (
                <div style={{ fontSize: 12, color: 'var(--mid)', marginTop: 3, lineHeight: 1.4 }}>
                  {article.description.slice(0, 120)}{article.description.length > 120 ? '...' : ''}
                </div>
              )}
              <div className="news-item-meta">
                {article.source} · {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// ─── AI BRIEFING ─────────────────────────────────────────────────────────────

function AIBriefing({ briefing, loading }) {
  if (loading) return (
    <div className="briefing-card">
      <div className="briefing-header"><h2>🤖 AI Intelligence Briefing</h2></div>
      <div className="briefing-empty">
        <div className="spinner" style={{ margin: '0 auto 12px', borderColor: '#2a5a3a', borderTopColor: 'var(--gold)' }}></div>
        Generating briefing...
      </div>
    </div>
  )
  if (!briefing) return (
    <div className="briefing-card">
      <div className="briefing-header"><h2>🤖 AI Intelligence Briefing</h2></div>
      <div className="briefing-empty">
        Enter your team password below and click "Generate AI Briefing" to get an up-to-date intelligence analysis.
      </div>
    </div>
  )
  return (
    <div className="briefing-card">
      <div className="briefing-header">
        <h2>🤖 AI Intelligence Briefing</h2>
        {briefing.last_updated && (
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
            {new Date(briefing.last_updated).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
      <div className="briefing-body">
        {briefing.summary && <div className="briefing-section"><div className="briefing-label">Executive Summary</div><div className="briefing-text">{briefing.summary}</div></div>}
        {briefing.ecosoc_impact && <div className="briefing-section"><div className="briefing-label">ECOSOC Impact</div><div className="briefing-text">{briefing.ecosoc_impact}</div></div>}
        {briefing.sanctions_update && <div className="briefing-section"><div className="briefing-label">Sanctions Update</div><div className="briefing-text">{briefing.sanctions_update}</div></div>}
        {briefing.military_update && <div className="briefing-section"><div className="briefing-label">Military & Conflict</div><div className="briefing-text">{briefing.military_update}</div></div>}
        {briefing.talking_points?.length > 0 && (
          <div className="briefing-section">
            <div className="briefing-label">Fresh Talking Points</div>
            <ul className="briefing-points">{briefing.talking_points.map((p, i) => <li key={i}>{p}</li>)}</ul>
          </div>
        )}
        {briefing.watch_out_for && <div className="briefing-section"><div className="briefing-label" style={{ color: '#ff9999' }}>⚠️ Watch Out For</div><div className="briefing-text">{briefing.watch_out_for}</div></div>}
      </div>
    </div>
  )
}

// ─── SEARCH HOOK ─────────────────────────────────────────────────────────────

function useSearch() {
  const [query, setQuery] = useState('')
  const [highlights, setHighlights] = useState([])
  const [current, setCurrent] = useState(-1)
  const rootRef = useRef(null)

  const clearMarks = useCallback(() => {
    document.querySelectorAll('mark.sh').forEach(m => {
      m.parentNode?.replaceChild(document.createTextNode(m.textContent), m)
      m.parentNode?.normalize()
    })
    setHighlights([])
    setCurrent(-1)
  }, [])

  const doSearch = useCallback((q) => {
    clearMarks()
    if (!q || q.length < 2) return
    const root = rootRef.current || document.body
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const p = node.parentElement
        if (!p) return NodeFilter.FILTER_REJECT
        if (p.closest('.search-bar') || p.closest('.update-panel')) return NodeFilter.FILTER_REJECT
        if (['SCRIPT','STYLE'].includes(p.tagName)) return NodeFilter.FILTER_REJECT
        if (node.nodeValue.trim() === '') return NodeFilter.FILTER_REJECT
        return NodeFilter.FILTER_ACCEPT
      }
    })
    const nodes = []
    let n
    while ((n = walker.nextNode())) nodes.push(n)
    const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const marks = []
    nodes.forEach(node => {
      const val = node.nodeValue
      if (!regex.test(val)) return
      regex.lastIndex = 0
      const frag = document.createDocumentFragment()
      let last = 0, m
      while ((m = regex.exec(val)) !== null) {
        if (m.index > last) frag.appendChild(document.createTextNode(val.slice(last, m.index)))
        const mark = document.createElement('mark')
        mark.className = 'sh'
        mark.textContent = m[0]
        frag.appendChild(mark)
        marks.push(mark)
        last = regex.lastIndex
      }
      if (last < val.length) frag.appendChild(document.createTextNode(val.slice(last)))
      node.parentNode.replaceChild(frag, node)
    })
    setHighlights(marks)
    if (marks.length > 0) {
      marks[0].classList.add('active')
      marks[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
      setCurrent(0)
    }
  }, [clearMarks])

  const jump = useCallback((dir) => {
    setHighlights(prev => {
      if (prev.length === 0) return prev
      setCurrent(c => {
        const next = (c + dir + prev.length) % prev.length
        prev[c >= 0 ? c : 0]?.classList.remove('active')
        prev[next].classList.add('active')
        prev[next].scrollIntoView({ behavior: 'smooth', block: 'center' })
        return next
      })
      return prev
    })
  }, [])

  return { query, setQuery, highlights, current, doSearch, clearMarks, jump, rootRef }
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export default function Home({ dynamic, generatedAt }) {
  const d = dynamic || DEFAULT_DYNAMIC

  const [news, setNews] = useState([])
  const [newsLoading, setNewsLoading] = useState(false)
  const [briefing, setBriefing] = useState(null)
  const [briefingLoading, setBriefingLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [updateStatus, setUpdateStatus] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const { query, setQuery, highlights, current, doSearch, clearMarks, jump, rootRef } = useSearch()
  const debounceRef = useRef(null)

  const handleSearchInput = (val) => {
    setQuery(val)
    clearTimeout(debounceRef.current)
    if (val.length < 2) { clearMarks(); return }
    debounceRef.current = setTimeout(() => doSearch(val), 250)
  }

  const fetchNews = async () => {
    setNewsLoading(true)
    try {
      const res = await fetch('/api/news')
      const data = await res.json()
      if (data.news) setNews(data.news)
    } catch (e) {}
    finally { setNewsLoading(false) }
  }

  const generateBriefing = async () => {
    if (!password) { setUpdateStatus('Enter your team password first.'); return }
    setBriefingLoading(true)
    setUpdateStatus('Generating AI briefing...')
    const allArticles = news.flatMap(c => c.articles)
    try {
      const res = await fetch('/api/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, articles: allArticles.slice(0, 20) })
      })
      const data = await res.json()
      if (data.briefing) { setBriefing(data.briefing); setUpdateStatus('Briefing updated.') }
      else setUpdateStatus(data.error || 'Update failed.')
    } catch { setUpdateStatus('Request failed.') }
    finally { setBriefingLoading(false) }
  }

  const updateAllSections = async () => {
    if (!password) { setUpdateStatus('Enter your team password first.'); return }
    setIsUpdating(true)
    setUpdateStatus('Updating all sections — this takes about 30 seconds...')
    try {
      const res = await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      const data = await res.json()
      if (data.revalidated) {
        setUpdateStatus('All sections updated! Refreshing page in 5 seconds...')
        setTimeout(() => window.location.reload(), 5000)
      } else {
        setUpdateStatus(data.error || 'Update failed.')
      }
    } catch { setUpdateStatus('Request failed.') }
    finally { setIsUpdating(false) }
  }

  useEffect(() => { fetchNews() }, [])
  useEffect(() => {
    const interval = setInterval(fetchNews, 24 * 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Head>
        <title>Iran — MUN Research | ECOSOC</title>
        <meta name="description" content="Live MUN research for Iran at ECOSOC — auto-updated daily" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div ref={rootRef}>

        {/* HEADER */}
        <div className="header">
          <div className="flag-bar"><div className="g"/><div className="w"/><div className="r"/></div>
          <div className="header-top">
            <div>
              <div className="country-name">Iran 🇮🇷</div>
              <div className="country-sub">Islamic Republic of Iran &nbsp;·&nbsp; جمهوری اسلامی ایران</div>
              <div className="live-badge"><div className="live-dot"/>Auto-Updated Daily</div>
            </div>
            <div className="header-meta">
              <strong>MUN Research Page</strong>
              Committee: ECOSOC<br/>
              {generatedAt ? `Content generated: ${new Date(generatedAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}` : 'Loading...'}<br/>
              8 Sections — Live
            </div>
          </div>
        </div>

        {/* STATS BAR */}
        <div className="stats-bar">
          {QUICK_STATS.map(s => (
            <div key={s.label} className="stat-item">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-unit">{s.unit}</div>
            </div>
          ))}
        </div>

        {/* SEARCH BAR */}
        <div className="search-bar">
          <div className="search-inner">
            <span className="search-icon">🔍</span>
            <input
              className="search-input" type="text"
              placeholder="Search anything — Sanctions, IRGC, Nowruz, ECOSOC..."
              value={query}
              onChange={e => handleSearchInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') { e.preventDefault(); jump(e.shiftKey ? -1 : 1) }
                if (e.key === 'Escape') { setQuery(''); clearMarks() }
              }}
            />
            {query && <button className="clear-btn" onClick={() => { setQuery(''); clearMarks() }}>✕</button>}
          </div>
          <span className="search-status">
            {highlights.length > 0 ? `${current + 1} of ${highlights.length}` : query.length >= 2 ? 'No results' : ''}
          </span>
          <button className="nav-btn" onClick={() => jump(-1)} disabled={highlights.length === 0}>▲</button>
          <button className="nav-btn" onClick={() => jump(1)} disabled={highlights.length === 0}>▼</button>
        </div>

        {/* ── SECTION 1: LIVE INTELLIGENCE ── */}
        <SectionDivider emoji="🔴" title="Section 1 — Live Intelligence (Auto-Updated)" />
        <div className="main">

          {/* ALERT BANNER if AI generated one */}
          {d.alert_banner && (
            <div className="full-width">
              <div className="box alert" style={{ borderRadius: 2, marginBottom: 0 }}>
                <div className="box-title">🚨 {d.alert_banner.title}</div>
                <p>{d.alert_banner.content}</p>
              </div>
            </div>
          )}

          {/* LEADERSHIP */}
          <Card emoji="👤" title={d.leadership?.title || "Leadership Crisis"} fullWidth>
            <p className="prose" style={{ marginBottom: 16 }}>{d.leadership?.situation}</p>
            {d.leadership?.key_figures && (
              <table className="data-table">
                <thead><tr><th>Figure</th><th>Role</th><th>Current Status</th></tr></thead>
                <tbody>
                  {d.leadership.key_figures.map((f, i) => (
                    <tr key={i}>
                      <td>{f.name}</td>
                      <td>{f.role}</td>
                      <td>{f.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {d.leadership?.mun_note && (
              <div className="box highlight" style={{ marginTop: 14 }}>
                <div className="box-title">🎤 MUN Note</div>
                <p>{d.leadership.mun_note}</p>
              </div>
            )}
          </Card>

          {/* SANCTIONS */}
          <Card emoji="🔒" title="Sanctions — Current Status">
            <InfoRow label="Overall Status" value={d.sanctions?.current_status || 'Maximal'} />
            <div className="box alert" style={{ marginTop: 12 }}>
              <div className="box-title">Latest Development</div>
              <p>{d.sanctions?.latest_development}</p>
            </div>
            <div className="box highlight" style={{ marginTop: 0 }}>
              <div className="box-title">Economic Impact</div>
              <p>{d.sanctions?.economic_impact}</p>
            </div>
            <div className="box green" style={{ marginTop: 0 }}>
              <div className="box-title">Iran's Legal Argument</div>
              <p>{d.sanctions?.iran_argument}</p>
            </div>
          </Card>

          {/* MILITARY */}
          <Card emoji="💣" title="Military — Current Situation">
            <InfoRow label="Status" value={d.military?.current_status || 'Active conflict'} />
            <div className="box alert" style={{ marginTop: 12 }}>
              <div className="box-title">Situation Report</div>
              <p>{d.military?.situation}</p>
            </div>
            <div className="box highlight" style={{ marginTop: 0 }}>
              <div className="box-title">Nuclear Programme</div>
              <p>{d.military?.nuclear}</p>
            </div>
            <div className="box blue" style={{ marginTop: 0 }}>
              <div className="box-title">Proxy Networks</div>
              <p>{d.military?.proxies}</p>
            </div>
          </Card>

          {/* ECOSOC CURRENT */}
          <Card emoji="🌐" title="ECOSOC — Current Status">
            <InfoRow label="Status" value={d.ecosoc_current?.status || 'Suspended from CSW'} note />
            <div className="box alert" style={{ marginTop: 12 }}>
              <div className="box-title">Latest</div>
              <p>{d.ecosoc_current?.latest}</p>
            </div>
            <div className="box green" style={{ marginTop: 0 }}>
              <div className="box-title">Iran's Position</div>
              <p>{d.ecosoc_current?.iran_position}</p>
            </div>
            {d.last_updated && (
              <div style={{ fontSize: 11, color: 'var(--light)', marginTop: 12, fontStyle: 'italic' }}>
                Content last generated: {d.last_updated}
              </div>
            )}
          </Card>

          {/* LIVE NEWS */}
          <Card emoji="📰" title="Live News Feed" fullWidth>
            <NewsSection news={news} loading={newsLoading} />
          </Card>

          {/* AI BRIEFING */}
          <div className="full-width">
            <AIBriefing briefing={briefing} loading={briefingLoading} />
          </div>

        </div>

        {/* UPDATE PANEL */}
        <div className="update-panel">
          <span className="update-label">TEAM CONTROLS</span>
          <button className="update-btn" onClick={fetchNews} disabled={newsLoading}>
            {newsLoading ? '...' : '🔄 Refresh News'}
          </button>
          <input
            className="update-input" type="password"
            placeholder="Team password" value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: 160 }}
          />
          <button className="update-btn" onClick={generateBriefing} disabled={briefingLoading}>
            {briefingLoading ? '...' : '🤖 AI Briefing'}
          </button>
          <button
            className="update-btn"
            onClick={updateAllSections}
            disabled={isUpdating}
            style={{ background: '#8e44ad' }}
          >
            {isUpdating ? '⏳ Updating...' : '⚡ Update All Sections'}
          </button>
          {updateStatus && <span className="update-status">{updateStatus}</span>}
          <span className="fetched-at">Auto-updates daily at 6:00 AM UTC</span>
        </div>

        {/* ── SECTION 2: GEOGRAPHY ── */}
        <SectionDivider emoji="📍" title="Section 2 — Geography & Environment" />
        <div className="main">
          <Card emoji="🗺️" title="Physical Geography">
            <InfoRow label="Region" value="West Asia (Middle East)" />
            <InfoRow label="Borders" value="Iraq, Turkey, Armenia, Azerbaijan, Turkmenistan, Afghanistan, Pakistan" note />
            <InfoRow label="Coastline" value="Persian Gulf · Gulf of Oman · Caspian Sea" note />
            <InfoRow label="Highest Point" value="Mt. Damavand — 5,610m 🌋" />
            <InfoRow label="Mountain Ranges" value="Alborz (north), Zagros (west)" note />
            <InfoRow label="Major Deserts" value="Dasht-e Kavir, Dasht-e Lut" note />
            <InfoRow label="Major Rivers" value="Karun, Zayandeh Rud, Arvand Rud" note />
            <InfoRow label="Climate" value="Mostly arid/semi-arid; subtropical along Caspian; alpine in mountains" note />
          </Card>
          <Card emoji="⚡" title="Strategic Geography">
            <Box type="highlight" title="🚢 Strait of Hormuz">
              Approximately 20% of the world's oil and 30% of global LNG passes through this chokepoint. Iran's ability to threaten closure is its most powerful geopolitical lever. In March 2026, attacks on Gulf energy infrastructure pushed Brent crude above $119/barrel.
            </Box>
            <InfoRow label="Oil Reserves" value="4th largest globally (~157 billion barrels)" note />
            <InfoRow label="Gas Reserves" value="2nd largest globally" note />
            <InfoRow label="Energy Paradox" value="Vast reserves; severe domestic power outages in 2024–2025" note />
            <InfoRow label="Nuclear Sites" value="Natanz, Fordow, Isfahan, Bushehr — multiple damaged June 2025" note />
          </Card>
          <Card emoji="🏙️" title="Major Cities" fullWidth>
            <table className="data-table">
              <thead><tr><th>City</th><th>Population</th><th>Significance</th><th>Province</th></tr></thead>
              <tbody>
                <tr><td>🏛️ Tehran</td><td>9.6M (metro ~17M)</td><td>Capital; financial and political hub</td><td>Tehran</td></tr>
                <tr><td>🕌 Mashhad</td><td>3.4M</td><td>Iran's largest religious city; shrine of Imam Reza</td><td>Razavi Khorasan</td></tr>
                <tr><td>🌉 Isfahan</td><td>2.3M</td><td>Historic Safavid capital; UNESCO-listed Naqsh-e Jahan Square</td><td>Isfahan</td></tr>
                <tr><td>🏔️ Tabriz</td><td>1.7M</td><td>Largest Azerbaijani-speaking city; major trade hub</td><td>East Azerbaijan</td></tr>
                <tr><td>🌹 Shiraz</td><td>1.6M</td><td>Cultural heartland; near Persepolis; home of poets Hafez and Sa'di</td><td>Fars</td></tr>
                <tr><td>⛽ Ahvaz</td><td>1.3M</td><td>Centre of Iran's oil industry</td><td>Khuzestan</td></tr>
                <tr><td>🕍 Qom</td><td>1.2M</td><td>Most important centre of Shia Islamic scholarship</td><td>Qom</td></tr>
                <tr><td>🏺 Yazd</td><td>530,000</td><td>UNESCO World Heritage city; ancient Zoroastrian community</td><td>Yazd</td></tr>
              </tbody>
            </table>
          </Card>
        </div>

        {/* ── SECTION 3: PEOPLE ── */}
        <SectionDivider emoji="👥" title="Section 3 — People, Society & Culture" />
        <div className="main">
          <Card emoji="🧬" title="Demographics">
            <InfoRow label="Population" value="~92.4 million (2025)" />
            <InfoRow label="Median Age" value="32 years" />
            <InfoRow label="Urban Population" value="~77%" />
            <InfoRow label="Official Language" value="Persian (Farsi)" />
            <InfoRow label="Other Languages" value="Azerbaijani, Kurdish, Luri, Balochi, Arabic, Syriac" note />
            <InfoRow label="Refugees Hosted" value="~4M Afghans — one of world's largest hosting nations" note />
            <InfoRow label="Diaspora" value="5–8M Iranians abroad (USA, Germany, UK, Canada, UAE)" note />
            <InfoRow label="Youth Unemployment" value="~25–30% among under-35s (2025)" note />
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--light)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Ethnic Composition</div>
              <div className="ethnic-bar">
                <div style={{ background: '#1a5c38', width: '61%' }}/><div style={{ background: '#2980b9', width: '16%' }}/>
                <div style={{ background: '#8e44ad', width: '10%' }}/><div style={{ background: '#e67e22', width: '6%' }}/>
                <div style={{ background: '#e74c3c', width: '2%' }}/><div style={{ background: '#95a5a6', width: '5%' }}/>
              </div>
              <div className="bar-label-row">
                {[['#1a5c38','Persian 61%'],['#2980b9','Azerbaijani 16%'],['#8e44ad','Kurdish 10%'],['#e67e22','Lur 6%'],['#e74c3c','Arab 2%'],['#95a5a6','Other 5%']].map(([c,l]) => (
                  <span key={l} className="bar-label"><span className="bar-dot" style={{ background: c }}/>{l}</span>
                ))}
              </div>
            </div>
          </Card>
          <Card emoji="🕌" title="Religion & Society">
            <InfoRow label="State Religion" value="Twelver Shia Islam" />
            <InfoRow label="Shia Muslims" value="~90–95% of population" />
            <InfoRow label="Sunni Muslims" value="~5–8% (Kurdish, Balochi communities)" note />
            <InfoRow label="Other Faiths" value="Zoroastrian, Jewish, Christian, Baha'i (persecuted)" note />
            <InfoRow label="Literacy Rate" value="~86%" />
            <InfoRow label="Life Expectancy" value="~77 years" />
            <InfoRow label="Executions" value="Consistently top 3 globally" note />
            <InfoRow label="Press Freedom" value="Near bottom globally; state controls most media" note />
            <Box type="alert" title="⚠️ Women — 2026">
              Women represent 60% of natural science university students yet face mandatory hijab and restricted legal rights. Mahsa Amini's death in Sept 2022 triggered the largest protests since 1979. The January 2026 massacre killed thousands of protesters.
            </Box>
          </Card>
        </div>

        {/* ── SECTION 4: GOVERNMENT ── */}
        <SectionDivider emoji="🏛️" title="Section 4 — Government & Political Structure" />
        <div className="main">
          <Card emoji="⚖️" title="Constitutional Structure">
            <InfoRow label="System" value="Islamic Republic (Velayat-e Faqih)" />
            <InfoRow label="Constitution" value="Adopted 1979; revised 1989" />
            <InfoRow label="Supreme Leader" value="Khamenei killed Feb 28, 2026 — successor TBD" note />
            <InfoRow label="President" value="Head of government; elected; subordinate to Supreme Leader" note />
            <InfoRow label="Legislature (Majles)" value="290 elected members" />
            <InfoRow label="Guardian Council" value="12 jurists vetting all legislation and candidates" note />
            <InfoRow label="Assembly of Experts" value="88 clerics who elect and dismiss the Supreme Leader" note />
            <InfoRow label="Judiciary" value="Head appointed by Supreme Leader; Sharia law applied" note />
          </Card>
          <Card emoji="💣" title="Military & Security">
            <Box type="blue" title="🪖 Artesh — Conventional Military">
              Ranked 16th globally (Global Firepower Index 2026). Significant capabilities degraded by Israeli strikes in June 2025.
            </Box>
            <Box type="alert" title="🛡️ IRGC">
              Controls the nuclear programme, all proxy networks, internal intelligence, and foreign covert operations. Designated a terrorist organisation by the United States.
            </Box>
            <Box type="highlight" title="🕸️ Axis of Resistance">
              Hezbollah (Lebanon), Hamas (Gaza), Houthis (Yemen), PMF militias (Iraq). All significantly degraded since 2023. Syria's Assad fell in late 2024.
            </Box>
          </Card>
        </div>

        {/* ── SECTION 5: HISTORY ── */}
        <SectionDivider emoji="📅" title="Section 5 — Historical Timeline" />
        <div className="main">
          <Card emoji="🏺" title="From Ancient Persia to the 2026 Conflict" fullWidth>
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

        {/* ── SECTION 6: ECOSOC ── */}
        <SectionDivider emoji="🌐" title="Section 6 — ECOSOC Deep Dive" />
        <div className="main">
          <Card emoji="🏢" title="What Is ECOSOC?" fullWidth>
            <p className="prose" style={{ marginBottom: 16 }}>
              The United Nations Economic and Social Council — ECOSOC — is one of the six principal organs of the UN, established by the Charter in 1945. It coordinates the work of 15 specialized agencies, 8 functional commissions, and 5 regional commissions. Over 1,600 NGOs hold consultative status — the broadest civil society access point in the UN system.
            </p>
            <div className="three-col">
              <div className="mini-card"><div className="mini-card-title">📋 Basic Facts</div><p><strong>Founded:</strong> 1945<br/><strong>Members:</strong> 54 states (rotating 3-year terms)<br/><strong>Sessions:</strong> One 4-week session in July<br/><strong>NGO Access:</strong> 1,600+ organisations with consultative status</p></div>
              <div className="mini-card"><div className="mini-card-title">⚙️ How It Works</div><p>Adopts recommendations, coordinates subsidiary bodies, convenes high-level political dialogues. Principal instrument is the High-Level Political Forum (HLPF) for reviewing Sustainable Development Goal progress. Decisions pass by simple majority.</p></div>
              <div className="mini-card"><div className="mini-card-title">🗂️ Key Subsidiary Bodies</div><p>Commission on the Status of Women (CSW) — Iran removed 2022<br/>Commission on Narcotic Drugs (CND)<br/>Statistical Commission<br/>ESCAP (Asia-Pacific) — Iran is a member<br/>High-Level Political Forum (SDGs)</p></div>
            </div>
          </Card>
          <Card emoji="🚫" title="The CSW Removal — Legal Analysis">
            <Box type="blue" title="🇺🇸 The Case For Removal">
              ECOSOC has inherent authority to remove a member from a subsidiary body whose conduct is fundamentally incompatible with that body's mandate. A state that kills women for removing their hijab cannot sit on the commission charged with advancing women's rights.
            </Box>
            <Box type="alert" title="🇮🇷 Iran's Legal Counter">
              No explicit provision in ECOSOC's rules for mid-term removal. Iran was lawfully elected. The manoeuvre was an abuse of process. The UN Charter's sovereign equality principle prohibits precisely this kind of selective institutional action.
            </Box>
            <Box type="highlight" title="📐 The Precedent Problem">
              If ECOSOC can expel a lawfully elected member mid-term based on majority politics, every elected seat in every UN subsidiary body is vulnerable to political ejection. Several states that voted for removal have since expressed unease about this precedent.
            </Box>
          </Card>
          <Card emoji="💡" title="Iran's ECOSOC Strategy">
            <Box type="green" title="🎯 Platform for Grievances">
              Iran uses ECOSOC to articulate grievances resonating in the Global South — economic exclusion, financial sanctions, and the hypocrisy of Western states that preach development while imposing economic siege.
            </Box>
            <Box type="green" title="🤝 Coalition Building">
              Consistently aligns with G-77 and Non-Aligned Movement. Finds allies across Africa, Latin America, and Asia who share structural grievances — even if they distance themselves from Iran's governance record.
            </Box>
            <Box type="alert" title="⚠️ Structural Weakness">
              Iran's domestic record provides opponents with genuine grounds for action. The January 2026 massacre further eroded whatever sympathy Iran had cultivated. It can delay and delegitimise but cannot prevent accountability when Western states have the votes and will to act.
            </Box>
          </Card>
          <Card emoji="🔗" title="Foreign Relations" fullWidth>
            <table className="data-table">
              <thead><tr><th>Country / Bloc</th><th>Relationship</th><th>Status — March 2026</th></tr></thead>
              <tbody>
                <tr><td>🇺🇸 United States</td><td>Principal adversary since 1979</td><td>Active military conflict; ongoing operations following Feb 28 strikes</td></tr>
                <tr><td>🇮🇱 Israel</td><td>Existential enemy</td><td>Active military conflict; Khamenei killed in opening hours of Feb 2026 strikes</td></tr>
                <tr><td>🇨🇳 China</td><td>Strategic partner and economic lifeline</td><td>25-year cooperation agreement (2021); primary buyer of sanctioned oil; refuses UN snapback sanctions</td></tr>
                <tr><td>🇷🇺 Russia</td><td>Tactical partner</td><td>Supplies arms; refuses snapback sanctions</td></tr>
                <tr><td>🇸🇦 Saudi Arabia</td><td>Regional rival</td><td>China-brokered normalisation (2023); Iran's March 2026 Gulf attacks threaten this</td></tr>
                <tr><td>🇬🇧🇫🇷🇩🇪 E3 Europe</td><td>Formerly JCPOA partners</td><td>Triggered snapback sanctions; relations at historic low</td></tr>
              </tbody>
            </table>
          </Card>
        </div>

        {/* ── SECTION 7: MUN TOOLKIT ── */}
        <SectionDivider emoji="🎤" title="Section 7 — MUN Delegate Toolkit" />
        <div className="main">
          <Card emoji="🗣️" title="Core Arguments">
            <Box type="green" title="Argument 1 — Sovereignty">The UN Charter's principle of sovereign equality is non-negotiable. The CSW removal and the sanctions snapback both represent the weaponisation of institutional procedure by states pursuing geopolitical agendas.</Box>
            <Box type="green" title="Argument 2 — Double Standards">No comparable accountability has been applied to states conducting illegal military operations. Challenge this body to explain the inconsistency.</Box>
            <Box type="green" title="Argument 3 — Collective Punishment">Sanctions targeting Iran's Central Bank and severing international banking access constitute collective punishment of 92 million civilians.</Box>
            <Box type="green" title="Argument 4 — Development Rights">Every state holds the inalienable right to peaceful nuclear energy. The IAEA has not confirmed the existence of any weapons programme.</Box>
          </Card>
          <Card emoji="🧭" title="Strategic Notes">
            <Box type="highlight" title="🤝 Build These Coalitions">Russia, China, Cuba, Venezuela, Syria, Bolivia, Belarus — and G-77 members who share grievances about economic coercion. Frame everything in terms of developing-world solidarity and anti-imperialism.</Box>
            <Box type="alert" title="⚠️ Weak Points">January 2026 massacres (7,000–32,000 deaths). Nuclear enrichment at 60% purity. Proxy warfare. Execution rates (global top 3). Mandatory hijab. Internet blackouts during protests.</Box>
            <Box type="blue" title="🎯 Tactical Redirection">When pressed on human rights, redirect to Western military actions. When pressed on nuclear programme, cite the fatwa. When pressed on proxies, describe them as resistance movements. Frame everything through sovereignty and anti-imperialism.</Box>
          </Card>
          <Card emoji="📖" title="Key Vocabulary" fullWidth>
            <table className="data-table">
              <thead><tr><th>Term</th><th>Meaning</th><th>Why It Matters</th></tr></thead>
              <tbody>
                {VOCAB.map(({ term, meaning, why }) => (
                  <tr key={term}><td>{term}</td><td>{meaning}</td><td>{why}</td></tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 16 }}>
              {[['tag-red','Removed from CSW 2022'],['tag-red','UN Sanctions 2025'],['tag-red','Feb 2026 Conflict'],['tag-red','Khamenei Assassinated'],['tag-gold','Founding UN Member'],['tag-gold','G-77 Member'],['tag-gold','Non-Aligned Movement'],['tag-green','Russia Alliance (P5)'],['tag-green','China Trade Partner'],['tag-blue','Sovereign Equality Argument'],['tag-blue','Collective Punishment Claim'],['tag-grey','Nuclear Programme Contested'],['tag-grey','Constitutional Crisis']].map(([cls,label]) => (
                <span key={label} className={`tag ${cls}`}>{label}</span>
              ))}
            </div>
          </Card>
        </div>

        <div className="footer">
          🇮🇷 &nbsp; IRAN — LIVE MUN RESEARCH PAGE &nbsp;·&nbsp; ECOSOC COMMITTEE &nbsp;·&nbsp; AUTO-UPDATED DAILY &nbsp;·&nbsp; FOR EDUCATIONAL USE &nbsp; 🇮🇷
        </div>

      </div>
    </>
  )
}

// ─── SERVER-SIDE: FETCH NEWS + GENERATE AI CONTENT ──────────────────────────
// This runs on the server every 24 hours automatically (ISR)
// Also triggered manually by the "Update All Sections" button

export async function getStaticProps() {
  let dynamic = DEFAULT_DYNAMIC
  let generatedAt = new Date().toISOString()

  try {
    const newsApiKey = process.env.NEWS_API_KEY
    const anthropicKey = process.env.GROQ_API_KEY

    if (newsApiKey && anthropicKey) {
      // 1. Fetch latest news
      const newsUrl = `https://newsapi.org/v2/everything?q=Iran&language=en&sortBy=publishedAt&pageSize=20&apiKey=${newsApiKey}`
      const newsRes = await fetch(newsUrl)
      const newsData = await newsRes.json()
      const articles = (newsData.articles || []).slice(0, 15)

      const newsText = articles
        .map(a => `- [${a.source?.name}] ${a.title}: ${a.description || ''}`)
        .join('\n')

      // 2. Generate AI content for all dynamic sections
      const prompt = `You are a senior MUN research analyst. Based on the following recent news about Iran, generate updated content for a MUN research website representing Iran at ECOSOC.

RECENT NEWS (${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}):
${newsText}

Return ONLY valid JSON with no markdown, no code fences, no extra text:
{
  "alert_banner": {
    "title": "most urgent development in 6 words",
    "content": "2 sentence summary of the single most important current development"
  },
  "leadership": {
    "title": "Leadership Situation — [current date month year]",
    "situation": "3-4 sentences on the current leadership situation post-Khamenei assassination, including any successor developments",
    "key_figures": [
      {"name": "figure name", "role": "their role", "note": "current status or relevance"},
      {"name": "figure name", "role": "their role", "note": "current status or relevance"},
      {"name": "figure name", "role": "their role", "note": "current status or relevance"}
    ],
    "mun_note": "tactical advice for MUN delegates on how to handle leadership questions in committee"
  },
  "sanctions": {
    "current_status": "one line summary of sanctions status",
    "latest_development": "most recent sanctions development in 2-3 sentences",
    "economic_impact": "current economic impact in 2-3 sentences",
    "iran_argument": "Iran's current legal and political argument against sanctions"
  },
  "military": {
    "current_status": "one line military status",
    "situation": "2-3 sentences on current military situation",
    "nuclear": "current nuclear programme status",
    "proxies": "current status of proxy networks"
  },
  "ecosoc_current": {
    "status": "one line ECOSOC status",
    "latest": "most recent ECOSOC/UN developments relevant to Iran in 2-3 sentences",
    "iran_position": "Iran's current stated position in multilateral forums"
  },
  "last_updated": "${new Date().toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} UTC"
}`

      const aiRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anthropicKey}`,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          max_tokens: 2000,
          messages: [
            { role: 'system', content: 'You are a senior MUN research analyst. Always respond with valid JSON only, no markdown, no code fences.' },
            { role: 'user', content: prompt }
          ],
        }),
      })

      const aiData = await aiRes.json()
      const text = aiData.choices?.[0]?.message?.content || ''

      try {
        dynamic = JSON.parse(text)
        generatedAt = new Date().toISOString()
      } catch {
        // If JSON parse fails, keep defaults
        console.log('AI content parse failed, using defaults')
      }
    }
  } catch (err) {
    console.log('Content generation error:', err.message)
  }

  return {
    props: { dynamic, generatedAt },
    revalidate: 86400, // Regenerate every 24 hours automatically
  }
}
