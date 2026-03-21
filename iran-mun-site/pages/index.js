// pages/index.js
import { useState, useEffect, useRef, useCallback } from 'react'
import Head from 'next/head'

// ─── STATIC DATA ────────────────────────────────────────────────────────────

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
  { year: "1980–1988", text: "Iran-Iraq War. Estimated 500,000–1M casualties. Shapes Iran's security doctrine and drive for self-sufficient military capacity." },
  { year: "2015", text: "JCPOA nuclear deal signed with P5+1. Iran limits enrichment in exchange for sanctions relief." },
  { year: "2018", text: "US withdraws from JCPOA under Trump. 'Maximum pressure' sanctions reimposed. Iranian rial collapses." },
  { year: "Sept 2022", text: "Mahsa Amini killed in police custody. Nationwide 'Woman, Life, Freedom' protests erupt." },
  { year: "Nov 2022", text: "ECOSOC votes 29–8 to remove Iran from the Commission on the Status of Women. First mid-term removal in the body's history." },
  { year: "June 2025", text: "Israel launches the 'Twelve-Day War'. US strikes Fordow nuclear facility. Ceasefire June 24. Programme set back ~2 years." },
  { year: "Sept 2025", text: "UN sanctions reimposed via JCPOA snapback by UK, France, Germany. Russia and China contest legal validity." },
  { year: "Dec 2025", text: "Largest protests since 1979 erupt across all 31 provinces. ~5 million Iranians on the streets." },
  { year: "Jan 2026", text: "Government massacre of protesters. Deaths estimated 3,117–32,000. IAEA discovers hidden enriched uranium in undamaged underground facility." },
  { year: "Feb 28, 2026", text: "US and Israel launch coordinated strikes. Supreme Leader Khamenei assassinated. Iran retaliates with hundreds of drones and missiles across the region." },
  { year: "March 2026", text: "Iran attacks Gulf energy infrastructure. Brent crude above $119/barrel. Strait of Hormuz threatened. Conflict ongoing." },
]

const VOCAB = [
  { term: "Velayat-e Faqih", meaning: "Guardianship of the Islamic Jurist — constitutional doctrine granting supreme authority to the senior religious jurist", why: "Iran's entire political system rests on this; explains why the elected President has fundamentally limited power" },
  { term: "IRGC", meaning: "Islamic Revolutionary Guard Corps — Iran's most powerful military-political institution, separate from conventional armed forces", why: "Controls nuclear programme, all proxy networks, internal intelligence, and foreign covert ops. The real engine of Iranian foreign policy." },
  { term: "JCPOA", meaning: "Joint Comprehensive Plan of Action — the 2015 nuclear deal between Iran and the P5+1", why: "Legal foundation of all nuclear-related sanctions disputes; its 2018 collapse is Iran's primary grievance in all nuclear discussions" },
  { term: "Snapback Mechanism", meaning: "JCPOA provision allowing signatories to automatically reimpose UN sanctions without a new Security Council vote", why: "Used by E3 in September 2025; Russia and China contest its legality — a live UN legal dispute" },
  { term: "Axis of Resistance", meaning: "Iran's term for its allied armed groups: Hezbollah, Hamas, Houthis, Iraqi Shia militias", why: "Iran projects regional power without direct confrontation; all groups significantly weakened since 2023–2025" },
  { term: "Nowruz", meaning: "Persian New Year — celebrated on the vernal equinox (March 21) for over 3,000 years", why: "Represents Iranian civilizational identity predating Islam; felt across all political divides" },
  { term: "Rahbar", meaning: "'Leader' — the Supreme Leader; highest authority in the Islamic Republic above all elected officials", why: "Khamenei killed February 28, 2026; successor TBD — creating a constitutional crisis of historic proportions" },
  { term: "Ta'arof", meaning: "Iran's elaborate system of ritualized courtesy and social reciprocity", why: "Governs Iranian diplomatic culture — initial refusals are often formal, not final" },
  { term: "Fatwa", meaning: "A religious ruling issued by a qualified Islamic jurist", why: "Khamenei's 2003 fatwa declaring nuclear weapons haram is Iran's primary argument that its nuclear programme is civilian" },
  { term: "Shahnameh", meaning: "'Book of Kings' — world's longest epic poem by a single author (Ferdowsi, ~1010 AD)", why: "Foundational text of Persian national identity; demonstrates the depth of Iranian civilizational self-confidence" },
]

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function Box({ type = 'highlight', title, children }) {
  return (
    <div className={`box ${type}`} style={{ marginBottom: 11 }}>
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
      <div className="card-header">
        <span>{emoji}</span>
        <h2>{title}</h2>
      </div>
      <div className="card-body">{children}</div>
    </div>
  )
}

// ─── NEWS SECTION ────────────────────────────────────────────────────────────

function NewsSection({ news, fetchedAt, loading }) {
  if (loading) return (
    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--light)' }}>
      <div className="spinner" style={{ margin: '0 auto 12px' }}></div>
      <div style={{ fontSize: 13 }}>Fetching latest news...</div>
    </div>
  )

  if (!news || news.length === 0) return (
    <div style={{ padding: '20px', color: 'var(--light)', fontSize: 13, fontStyle: 'italic' }}>
      No news loaded. Add your NewsAPI key and click Refresh News.
    </div>
  )

  return (
    <div className="news-grid">
      {news.map((category) => (
        <div key={category.category} className="news-category">
          <div className="news-category-title">{category.label}</div>
          {category.articles.length === 0 ? (
            <div className="news-empty">No articles found.</div>
          ) : (
            category.articles.map((article, i) => (
              <div key={i} className="news-item">
                <a
                  className="news-item-title"
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
            ))
          )}
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
        Enter your team password below and click "Generate AI Briefing" to get an up-to-date intelligence analysis based on the latest news.
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
        {briefing.summary && (
          <div className="briefing-section">
            <div className="briefing-label">Executive Summary</div>
            <div className="briefing-text">{briefing.summary}</div>
          </div>
        )}
        {briefing.ecosoc_impact && (
          <div className="briefing-section">
            <div className="briefing-label">ECOSOC Impact</div>
            <div className="briefing-text">{briefing.ecosoc_impact}</div>
          </div>
        )}
        {briefing.sanctions_update && (
          <div className="briefing-section">
            <div className="briefing-label">Sanctions Update</div>
            <div className="briefing-text">{briefing.sanctions_update}</div>
          </div>
        )}
        {briefing.military_update && (
          <div className="briefing-section">
            <div className="briefing-label">Military & Conflict</div>
            <div className="briefing-text">{briefing.military_update}</div>
          </div>
        )}
        {briefing.talking_points && briefing.talking_points.length > 0 && (
          <div className="briefing-section">
            <div className="briefing-label">Fresh Talking Points</div>
            <ul className="briefing-points">
              {briefing.talking_points.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
        )}
        {briefing.watch_out_for && (
          <div className="briefing-section">
            <div className="briefing-label" style={{ color: '#ff9999' }}>⚠️ Watch Out For</div>
            <div className="briefing-text">{briefing.watch_out_for}</div>
          </div>
        )}
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
      m.parentNode.replaceChild(document.createTextNode(m.textContent), m)
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

export default function Home() {
  const [news, setNews] = useState([])
  const [fetchedAt, setFetchedAt] = useState(null)
  const [newsLoading, setNewsLoading] = useState(false)
  const [briefing, setBriefing] = useState(null)
  const [briefingLoading, setBriefingLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [updateStatus, setUpdateStatus] = useState('')
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
      if (data.news) {
        setNews(data.news)
        setFetchedAt(data.fetchedAt)
      }
    } catch (e) {
      setUpdateStatus('Failed to fetch news.')
    } finally {
      setNewsLoading(false)
    }
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
      if (data.briefing) {
        setBriefing(data.briefing)
        setUpdateStatus('Briefing updated.')
      } else {
        setUpdateStatus(data.error || 'Update failed.')
      }
    } catch (e) {
      setUpdateStatus('Request failed.')
    } finally {
      setBriefingLoading(false)
    }
  }

  // Auto-fetch news on load
  useEffect(() => { fetchNews() }, [])

  // Auto-refresh every 24 hours
  useEffect(() => {
    const interval = setInterval(fetchNews, 24 * 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Head>
        <title>Iran — MUN Research | ECOSOC</title>
        <meta name="description" content="Comprehensive MUN research page for Iran at ECOSOC" />
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
              <div className="live-badge"><div className="live-dot"/>Live Updates</div>
            </div>
            <div className="header-meta">
              <strong>MUN Research Page</strong>
              Committee: ECOSOC<br/>
              {fetchedAt ? `Last updated: ${new Date(fetchedAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}` : 'Loading news...'}<br/>
              8 Sections — Comprehensive
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
              className="search-input"
              type="text"
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

        {/* ── SECTION 1: LIVE NEWS ── */}
        <SectionDivider emoji="📡" title="Section 1 — Live News Feed" />
        <div className="main">
          <Card emoji="📰" title="Latest Iran News — Auto-Updated" fullWidth>
            <NewsSection news={news} fetchedAt={fetchedAt} loading={newsLoading} />
          </Card>
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
            className="update-input"
            type="password"
            placeholder="Team password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: 160 }}
          />
          <button className="update-btn" onClick={generateBriefing} disabled={briefingLoading || newsLoading}>
            {briefingLoading ? '...' : '🤖 Generate AI Briefing'}
          </button>
          {updateStatus && <span className="update-status">{updateStatus}</span>}
          {fetchedAt && <span className="fetched-at">News fetched: {new Date(fetchedAt).toLocaleTimeString('en-GB')}</span>}
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
                <tr><td>🌹 Shiraz</td><td>1.6M</td><td>Cultural heartland; near Persepolis; home of poets Hafez & Sa'di</td><td>Fars</td></tr>
                <tr><td>⛽ Ahvaz</td><td>1.3M</td><td>Centre of Iran's oil industry</td><td>Khuzestan</td></tr>
                <tr><td>🕍 Qom</td><td>1.2M</td><td>Most important centre of Shia Islamic scholarship</td><td>Qom</td></tr>
                <tr><td>🏺 Yazd</td><td>530,000</td><td>UNESCO World Heritage city; ancient Zoroastrian community</td><td>Yazd</td></tr>
              </tbody>
            </table>
          </Card>
        </div>

        {/* ── SECTION 3: PEOPLE & SOCIETY ── */}
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
                <div style={{ background: '#1a5c38', width: '61%' }}/>
                <div style={{ background: '#2980b9', width: '16%' }}/>
                <div style={{ background: '#8e44ad', width: '10%' }}/>
                <div style={{ background: '#e67e22', width: '6%' }}/>
                <div style={{ background: '#e74c3c', width: '2%' }}/>
                <div style={{ background: '#95a5a6', width: '5%' }}/>
              </div>
              <div className="bar-label-row">
                {[['#1a5c38','Persian 61%'],['#2980b9','Azerbaijani 16%'],['#8e44ad','Kurdish 10%'],['#e67e22','Lur 6%'],['#e74c3c','Arab 2%'],['#95a5a6','Other 5%']].map(([c, l]) => (
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
              Women represent 60% of natural science university students yet face mandatory hijab, restricted travel, and limited legal rights. Mahsa Amini's death in Sept 2022 triggered the largest protests since the 1979 Revolution. The January 2026 massacre killed thousands of protesters.
            </Box>
          </Card>
        </div>

        {/* ── SECTION 4: GOVERNMENT ── */}
        <SectionDivider emoji="🏛️" title="Section 4 — Government & Political Structure" />
        <div className="main">
          <Card emoji="⚖️" title="Constitutional Structure">
            <InfoRow label="System" value="Islamic Republic (Velayat-e Faqih)" />
            <InfoRow label="Constitution" value="Adopted 1979; revised 1989" />
            <InfoRow label="Supreme Leader" value="Highest authority; Khamenei killed Feb 28, 2026 — successor TBD" note />
            <InfoRow label="President" value="Head of government; elected; subordinate to Supreme Leader" note />
            <InfoRow label="Legislature (Majles)" value="290 elected members" />
            <InfoRow label="Guardian Council" value="12 jurists vetting all legislation and candidates — non-elected" note />
            <InfoRow label="Assembly of Experts" value="88 clerics who elect and dismiss the Supreme Leader" note />
            <InfoRow label="Judiciary" value="Head appointed by Supreme Leader; Sharia law applied" note />
          </Card>
          <Card emoji="💣" title="Military & Security">
            <Box type="blue" title="🪖 Artesh — Conventional Military">
              Ranked 16th globally (Global Firepower Index 2026). Significant capabilities degraded by Israeli strikes in June 2025, particularly air defence and missile infrastructure.
            </Box>
            <Box type="alert" title="🛡️ IRGC">
              Controls the nuclear programme, all proxy networks, internal intelligence, and foreign covert operations. Designated a terrorist organisation by the United States. The real engine of Iranian foreign policy.
            </Box>
            <Box type="highlight" title="🕸️ Axis of Resistance">
              Iran leads: Hezbollah (Lebanon), Hamas (Gaza), Houthis (Yemen), PMF militias (Iraq). All significantly degraded since 2023. Syria's Assad fell in late 2024, severing a key logistics corridor.
            </Box>
          </Card>
        </div>

        {/* ── SECTION 5: ECONOMY ── */}
        <SectionDivider emoji="💰" title="Section 5 — Economy & Sanctions" />
        <div className="main">
          <Card emoji="📊" title="Economic Overview">
            <InfoRow label="GDP (nominal)" value="~$454 billion (2023)" />
            <InfoRow label="GDP per capita" value="~$5,400 USD" />
            <InfoRow label="Inflation" value="40–50% range; currency freefall" note />
            <InfoRow label="State Share of GDP" value="~60% state-owned economy" />
            <InfoRow label="Currency" value="Iranian Rial (IRR) — severely devalued" />
            <InfoRow label="Top Trade Partner" value="China" />
            <InfoRow label="Primary Revenue" value="Oil & gas sold via shadow fleet at discount to China" note />
            <InfoRow label="Domestic Industry" value="Manufactures 60–70% of own industrial equipment" note />
          </Card>
          <Card emoji="🔒" title="Sanctions Architecture">
            <Box type="alert" title="🇺🇳 UN Sanctions — Reimposed Sept 2025">
              Triggered by UK, France, Germany via JCPOA snapback. Targets nuclear and missile programmes. Russia and China contest legal validity — creating an unresolved structural dispute at the Security Council.
            </Box>
            <Box type="alert" title="🇺🇸 US Unilateral Sanctions">
              Central Bank blacklisted. SWIFT access severed. IRGC designated terrorist organisation. Any entity doing business with it faces US secondary sanctions.
            </Box>
            <Box type="highlight" title="🛳️ Shadow Fleet">
              Iran sells sanctioned oil to China and Venezuela through vessels operating outside normal tracking. UK intercepted the Bella 1 (renamed Marinera) in January 2026.
            </Box>
          </Card>
        </div>

        {/* ── SECTION 6: HISTORY ── */}
        <SectionDivider emoji="📅" title="Section 6 — Historical Timeline" />
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

        {/* ── SECTION 7: ECOSOC DEEP DIVE ── */}
        <SectionDivider emoji="🌐" title="Section 7 — ECOSOC Deep Dive" />
        <div className="main">
          <Card emoji="🏢" title="What Is ECOSOC?" fullWidth>
            <p className="prose" style={{ marginBottom: 16 }}>
              The United Nations Economic and Social Council — ECOSOC — is one of the six principal organs of the UN, established by the Charter in 1945. It coordinates the work of 15 specialized agencies, 8 functional commissions, and 5 regional commissions. It does not pass binding resolutions like the Security Council, but carries significant normative and political weight. Over 1,600 NGOs hold consultative status — the broadest civil society access point in the UN system.
            </p>
            <div className="three-col">
              <div className="mini-card">
                <div className="mini-card-title">📋 Basic Facts</div>
                <p><strong>Founded:</strong> 1945<br/><strong>Members:</strong> 54 states (rotating 3-year terms)<br/><strong>Sessions:</strong> One 4-week session in July<br/><strong>NGO Access:</strong> 1,600+ organisations with consultative status</p>
              </div>
              <div className="mini-card">
                <div className="mini-card-title">⚙️ How It Works</div>
                <p>Adopts recommendations and coordinates subsidiary bodies. Principal instrument is the High-Level Political Forum (HLPF) — the main UN platform for reviewing Sustainable Development Goal progress. Decisions pass by simple majority.</p>
              </div>
              <div className="mini-card">
                <div className="mini-card-title">🗂️ Key Subsidiary Bodies</div>
                <p>Commission on the Status of Women (CSW) — Iran removed 2022<br/>Commission on Narcotic Drugs (CND)<br/>Statistical Commission<br/>ESCAP (Asia-Pacific) — Iran is a member<br/>High-Level Political Forum (SDGs)</p>
              </div>
            </div>
          </Card>

          <Card emoji="🚫" title="The CSW Removal — Legal Analysis">
            <Box type="blue" title="🇺🇸 The Case For Removal">
              ECOSOC has inherent authority to remove a member from a subsidiary body whose conduct is fundamentally incompatible with that body's mandate. A state that kills women for removing their hijab cannot sit on the commission charged with advancing women's rights. 29 ECOSOC members agreed.
            </Box>
            <Box type="alert" title="🇮🇷 Iran's Legal Counter">
              No explicit provision in ECOSOC's rules for mid-term removal of an elected member. Iran was elected through the proper institutional process. The manoeuvre was an abuse of process engineered by the United States. The UN Charter's sovereign equality principle prohibits precisely this kind of selective institutional action.
            </Box>
            <Box type="highlight" title="📐 The Precedent Problem">
              Iran's most legally significant argument: if ECOSOC can expel a lawfully elected member mid-term based on majority politics, every elected seat in every UN subsidiary body is vulnerable to political ejection. Several states that voted for removal have since expressed unease about this precedent — even among those with no sympathy for the Islamic Republic.
            </Box>
          </Card>

          <Card emoji="💡" title="Iran's ECOSOC Strategy">
            <Box type="green" title="🎯 Platform for Grievances">
              Iran uses ECOSOC to articulate grievances that resonate in the Global South — economic exclusion, financial sanctions, technology transfer restrictions, and the hypocrisy of Western states that preach development while imposing economic siege.
            </Box>
            <Box type="green" title="🤝 Coalition Building">
              Consistently aligns with G-77 and Non-Aligned Movement. On anti-sanctions language, development financing, and technology access, Iran finds allies across Africa, Latin America, and Asia who share structural grievances — even if they distance themselves from Iran's governance record.
            </Box>
            <Box type="alert" title="⚠️ Structural Weakness">
              Iran's domestic record — executions, suppression of women, crackdown on protesters — provides opponents with genuine grounds for action. The January 2026 massacre further eroded whatever sympathy Iran had cultivated. It can delay and delegitimise, but cannot prevent accountability when Western states have the votes and the will to act.
            </Box>
          </Card>

          <Card emoji="🔗" title="Iran's Foreign Relations" fullWidth>
            <table className="data-table">
              <thead><tr><th>Country / Bloc</th><th>Relationship</th><th>Status — March 2026</th></tr></thead>
              <tbody>
                <tr><td>🇺🇸 United States</td><td>Principal adversary since 1979</td><td>Active military conflict following Feb 28 strikes; Pentagon seeking $200B supplemental funding</td></tr>
                <tr><td>🇮🇱 Israel</td><td>Existential enemy; Iran denies Israel's right to exist</td><td>Active military conflict; Khamenei killed in opening hours of Feb 2026 strikes</td></tr>
                <tr><td>🇨🇳 China</td><td>Strategic partner and primary economic lifeline</td><td>25-year cooperation agreement (2021); primary buyer of sanctioned oil; refuses to recognise UN snapback sanctions</td></tr>
                <tr><td>🇷🇺 Russia</td><td>Tactical partner against Western dominance</td><td>Supplies arms; refuses snapback sanctions; relationship complicated by competition in Syria</td></tr>
                <tr><td>🇸🇦 Saudi Arabia</td><td>Regional rival — Sunni-Shia and Arab-Persian tensions</td><td>China-brokered normalisation (2023); Iran's March 2026 Gulf attacks threaten this arrangement</td></tr>
                <tr><td>🇬🇧🇫🇷🇩🇪 E3 Europe</td><td>Formerly JCPOA partners</td><td>Triggered snapback sanctions; UK intercepted shadow fleet vessel Jan 2026; relations at historic low</td></tr>
              </tbody>
            </table>
          </Card>
        </div>

        {/* ── SECTION 8: MUN TOOLKIT ── */}
        <SectionDivider emoji="🎤" title="Section 8 — MUN Delegate Toolkit" />
        <div className="main">
          <Card emoji="🗣️" title="Core Arguments">
            <Box type="green" title="Argument 1 — Sovereignty">
              The UN Charter's principle of sovereign equality is non-negotiable. The CSW removal and the sanctions snapback both represent the weaponisation of institutional procedure by states pursuing geopolitical agendas.
            </Box>
            <Box type="green" title="Argument 2 — Double Standards">
              No comparable accountability has been applied to states conducting illegal military operations or maintaining illegal occupations. Challenge this body to explain the inconsistency.
            </Box>
            <Box type="green" title="Argument 3 — Collective Punishment">
              Sanctions targeting Iran's Central Bank and severing international banking access constitute collective punishment of 92 million civilians — a violation of international humanitarian law.
            </Box>
            <Box type="green" title="Argument 4 — Development Rights">
              Every state holds the inalienable right to peaceful nuclear energy. The IAEA has not confirmed the existence of any weapons programme. Khamenei's 2003 fatwa declared nuclear weapons haram.
            </Box>
          </Card>
          <Card emoji="🧭" title="Strategic Notes">
            <Box type="highlight" title="🤝 Build These Coalitions">
              Russia, China, Cuba, Venezuela, Syria, Bolivia, Belarus — and G-77 members who share grievances about economic coercion. Frame every argument in terms of developing-world solidarity and anti-imperialism.
            </Box>
            <Box type="alert" title="⚠️ Weak Points — Prepare for These">
              January 2026 massacres (7,000–32,000 deaths). Nuclear enrichment at 60% purity. Proxy warfare. Execution rates (global top 3). Mandatory hijab. Internet blackouts during protests. IRGC's international assassination activities.
            </Box>
            <Box type="blue" title="🎯 Tactical Redirection">
              When pressed on human rights, redirect to Western military actions. When pressed on nuclear programme, cite the fatwa. When pressed on proxies, describe them as resistance movements. Frame everything through sovereignty and anti-imperialism.
            </Box>
          </Card>
          <Card emoji="📖" title="Key Vocabulary" fullWidth>
            <table className="data-table">
              <thead><tr><th>Term</th><th>Meaning</th><th>Why It Matters</th></tr></thead>
              <tbody>
                {VOCAB.map(({ term, meaning, why }) => (
                  <tr key={term}>
                    <td>{term}</td>
                    <td>{meaning}</td>
                    <td>{why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 16 }}>
              {[['tag-red','Removed from CSW 2022'],['tag-red','UN Sanctions 2025'],['tag-red','Feb 2026 Conflict'],['tag-red','Khamenei Assassinated'],['tag-gold','Founding UN Member'],['tag-gold','G-77 Member'],['tag-gold','Non-Aligned Movement'],['tag-green','Russia Alliance (P5)'],['tag-green','China Trade Partner'],['tag-blue','Sovereign Equality Argument'],['tag-blue','Collective Punishment Claim'],['tag-grey','Nuclear Programme Contested'],['tag-grey','Constitutional Crisis']].map(([cls, label]) => (
                <span key={label} className={`tag ${cls}`}>{label}</span>
              ))}
            </div>
          </Card>
        </div>

        <div className="footer">
          🇮🇷 &nbsp; IRAN — LIVE MUN RESEARCH PAGE &nbsp;·&nbsp; ECOSOC COMMITTEE &nbsp;·&nbsp; MARCH 2026 &nbsp;·&nbsp; FOR EDUCATIONAL USE ONLY &nbsp; 🇮🇷
        </div>

      </div>
    </>
  )
}
