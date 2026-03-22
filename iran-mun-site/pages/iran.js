// pages/iran.js — Iran Research Page (Delegate + Admin only)
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
  { year: "~550 BC", text: "Cyrus the Great founds the Achaemenid Empire. Issues the Cyrus Cylinder, widely considered the world's first charter of human rights." },
  { year: "637–651 AD", text: "Arab Muslim conquest of Persia. Persian culture ultimately reshapes Islamic civilization." },
  { year: "1502–1736", text: "Safavid Dynasty establishes Shia Islam as state religion. Isfahan becomes one of the world's most sophisticated cities." },
  { year: "1951–1953", text: "PM Mossadegh nationalises Anglo-Iranian Oil Company. CIA/MI6-backed coup (Operation Ajax) removes him." },
  { year: "1979", text: "Islamic Revolution. Shah deposed. Islamic Republic established. US Embassy seized — 444-day hostage crisis." },
  { year: "1980–1988", text: "Iran-Iraq War. Estimated 500,000–1M casualties. Shapes Iran's security doctrine." },
  { year: "2015", text: "JCPOA nuclear deal signed with P5+1." },
  { year: "2018", text: "US withdraws from JCPOA. Maximum pressure sanctions reimposed. Iranian rial collapses." },
  { year: "Sept 2022", text: "Mahsa Amini killed in police custody. Nationwide Woman, Life, Freedom protests erupt." },
  { year: "Nov 2022", text: "ECOSOC votes 29-8 to remove Iran from the Commission on the Status of Women." },
  { year: "June 2025", text: "Israel launches Twelve-Day War. US strikes Fordow nuclear facility. Ceasefire June 24." },
  { year: "Sept 2025", text: "UN sanctions reimposed via JCPOA snapback. Russia and China contest legal validity." },
  { year: "Dec 2025", text: "Largest protests since 1979. ~5 million Iranians on the streets across all 31 provinces." },
  { year: "Jan 2026", text: "Government massacre of protesters. Deaths estimated 3,117-32,000. IAEA discovers hidden enriched uranium." },
  { year: "Feb 28, 2026", text: "US and Israel launch coordinated strikes. Supreme Leader Khamenei assassinated. Iran retaliates with hundreds of drones and missiles." },
  { year: "March 2026", text: "Iran attacks Gulf energy infrastructure. Brent crude above $119/barrel. Strait of Hormuz threatened. Conflict ongoing." },
]

const VOCAB = [
  { term: "Velayat-e Faqih", meaning: "Guardianship of the Islamic Jurist — grants supreme authority to the senior religious jurist", why: "Iran's entire political system rests on this" },
  { term: "IRGC", meaning: "Islamic Revolutionary Guard Corps — Iran's most powerful military-political institution", why: "Controls nuclear programme, all proxy networks, internal intelligence" },
  { term: "JCPOA", meaning: "Joint Comprehensive Plan of Action — the 2015 nuclear deal between Iran and the P5+1", why: "Legal foundation of all nuclear-related sanctions disputes" },
  { term: "Snapback Mechanism", meaning: "JCPOA provision allowing signatories to automatically reimpose UN sanctions", why: "Used by E3 in September 2025 — Russia and China contest its legality" },
  { term: "Axis of Resistance", meaning: "Iran's term for its allied armed groups: Hezbollah, Hamas, Houthis, Iraqi Shia militias", why: "All significantly weakened since 2023-2025" },
  { term: "Nowruz", meaning: "Persian New Year — celebrated on the vernal equinox (March 21) for over 3,000 years", why: "Represents Iranian civilizational identity predating Islam" },
  { term: "Rahbar", meaning: "Leader — the Supreme Leader; highest authority above all elected officials", why: "Khamenei killed February 28, 2026 — constitutional crisis ongoing" },
  { term: "Ta'arof", meaning: "Iran's elaborate system of ritualized courtesy and social reciprocity", why: "Governs Iranian diplomatic culture" },
  { term: "Fatwa", meaning: "A religious ruling issued by a qualified Islamic jurist", why: "Khamenei's 2003 fatwa declaring nuclear weapons haram is Iran's civilian nuclear argument" },
]

const POWER_FIGURES = [
  { rank: 1, name: "Ali Khamenei", nameFarsi: "علی خامنه‌ای", position: "Supreme Leader (Rahbar)", institution: "Office of the Supreme Leader", religion: "Twelver Shia — Marja", power: "Absolute — commanded all armed forces, judiciary, foreign policy, media.", health: "💀 Deceased — assassinated February 28, 2026 during US-Israeli strikes.", powerScore: 100, status: "deceased", note: "His death created the most severe constitutional crisis in the history of the Islamic Republic." },
  { rank: 2, name: "Hossein Salami", nameFarsi: "حسین سلامی", position: "Commander-in-Chief, IRGC", institution: "Islamic Revolutionary Guard Corps", religion: "Twelver Shia", power: "Commands Iran's most powerful military-political institution — nuclear programme, missile arsenal, proxy networks, intelligence.", health: "✅ Active — directing retaliatory operations March 2026.", powerScore: 85, status: "active", note: "Arguably the most powerful figure currently operating in Iran." },
  { rank: 3, name: "Esmail Qaani", nameFarsi: "اسماعیل قاانی", position: "Commander, IRGC Quds Force", institution: "IRGC Quds Force", religion: "Twelver Shia", power: "Commands Iran's external operations force — manages all proxy relationships, foreign militias, and covert operations abroad.", health: "✅ Active — managing degraded but operational Axis of Resistance.", powerScore: 75, status: "active", note: "Succeeded Qasem Soleimani after his assassination in January 2020." },
  { rank: 4, name: "Mohammad Hossein Bagheri", nameFarsi: "محمدحسین باقری", position: "Chief of Staff, Armed Forces", institution: "General Staff of the Armed Forces", religion: "Twelver Shia", power: "Commands Iran's entire conventional military apparatus. De facto highest military authority post-Khamenei.", health: "✅ Active — status uncertain following Feb 2026 strikes.", powerScore: 80, status: "active", note: "Coordination between Artesh and IRGC is the critical power axis." },
  { rank: 5, name: "Ali Larijani", nameFarsi: "علی لاریجانی", position: "Senior Advisor to the Supreme Leader", institution: "Office of the Supreme Leader", religion: "Twelver Shia — clerical lineage", power: "One of Iran's most experienced political operators. Former Speaker of Majles for 12 years.", health: "✅ Active — mentioned as potential Supreme Leader candidate.", powerScore: 70, status: "active", note: "His candidacy for Supreme Leader was barred by the Guardian Council in 2021." },
  { rank: 6, name: "Masoud Pezeshkian", nameFarsi: "مسعود پزشکیان", position: "President of Iran", institution: "Office of the Presidency", religion: "Twelver Shia", power: "Head of government — manages economic policy, cabinet, and diplomatic representation. Constitutionally subordinate to the Supreme Leader.", health: "✅ Active — elected July 2024 as a reformist candidate.", powerScore: 65, status: "active", note: "His reformist agenda is heavily constrained by the Guardian Council and IRGC." },
  { rank: 7, name: "Gholam-Hossein Mohseni-Ejei", nameFarsi: "غلامحسین محسنی اژه‌ای", position: "Head of the Judiciary", institution: "Islamic Republic Judiciary", religion: "Twelver Shia — cleric", power: "Controls Iran's entire judicial system, including Revolutionary Courts. Appointed by the Supreme Leader.", health: "✅ Active.", powerScore: 68, status: "active", note: "Known for harsh sentences against protesters." },
  { rank: 8, name: "Ahmad Khatami", nameFarsi: "احمد خاتمی", position: "Member, Assembly of Experts", institution: "Assembly of Experts", religion: "Twelver Shia — Ayatollah", power: "Senior hardline cleric on the body constitutionally responsible for selecting the next Supreme Leader.", health: "✅ Active — in emergency session for succession process.", powerScore: 62, status: "active", note: "Known for extremely hawkish sermons. Called for execution of protesters." },
  { rank: 9, name: "Mohammad Bagher Ghalibaf", nameFarsi: "محمدباقر قالیباف", position: "Speaker of the Majles", institution: "Islamic Consultative Assembly", religion: "Twelver Shia", power: "Leads Iran's 290-member parliament. Former IRGC commander and Tehran mayor.", health: "✅ Active.", powerScore: 55, status: "active", note: "Considered a hardliner with strong IRGC backing and significant political ambitions." },
  { rank: 10, name: "Abbas Araghchi", nameFarsi: "عباس عراقچی", position: "Minister of Foreign Affairs", institution: "Ministry of Foreign Affairs", religion: "Twelver Shia", power: "Leads Iran's diplomatic engagement internationally, including nuclear negotiations and UN representation.", health: "✅ Active — leading diplomatic responses to the February 2026 conflict.", powerScore: 58, status: "active", note: "Veteran nuclear negotiator — key architect of the 2015 JCPOA." },
  { rank: 11, name: "Sadegh Amoli Larijani", nameFarsi: "صادق آملی لاریجانی", position: "Chairman, Expediency Council", institution: "Expediency Discernment Council", religion: "Twelver Shia — Ayatollah", power: "Chairs the body that arbitrates between parliament and the Guardian Council.", health: "✅ Active.", powerScore: 55, status: "active", note: "Brother of Ali Larijani. Former head of the Judiciary." },
  { rank: 12, name: "Ali Shamkhani", nameFarsi: "علی شمخانی", position: "Senior Political-Military Advisor", institution: "Office of the Supreme Leader", religion: "Twelver Shia", power: "Former Secretary of Supreme National Security Council. Experienced strategic thinker.", health: "✅ Active.", powerScore: 52, status: "active", note: "Brokered the Saudi-Iran normalisation deal in Beijing in 2023." },
  { rank: 13, name: "Ahmad Vahidi", nameFarsi: "احمد وحیدی", position: "Minister of Interior", institution: "Ministry of Interior", religion: "Twelver Shia", power: "Controls internal security, elections, provincial governors, and law enforcement.", health: "✅ Active.", powerScore: 50, status: "active", note: "Former IRGC Quds Force commander. Under US sanctions." },
  { rank: 14, name: "Yahya Rahim Safavi", nameFarsi: "یحیی رحیم صفوی", position: "Senior Military Advisor to Supreme Leader", institution: "Office of the Supreme Leader", religion: "Twelver Shia", power: "Former IRGC commander. Senior military advisor with direct access to the Supreme Leader's office.", health: "✅ Active.", powerScore: 42, status: "active", note: "One of the architects of Iran's regional military strategy." },
  { rank: 15, name: "Mohammad-Ali Jafari", nameFarsi: "محمدعلی جعفری", position: "Former IRGC Commander / Senior Advisor", institution: "IRGC", religion: "Twelver Shia", power: "Retains significant influence within IRGC senior command networks.", health: "✅ Active.", powerScore: 40, status: "active", note: "Commanded the IRGC 2007-2019." },
  { rank: 16, name: "Ali Akbar Velayati", nameFarsi: "علی اکبر ولایتی", position: "Senior International Affairs Advisor", institution: "Office of the Supreme Leader", religion: "Twelver Shia", power: "Advises the Supreme Leader on all international matters. Former foreign minister for 16 years.", health: "✅ Active — elderly but politically relevant.", powerScore: 40, status: "active", note: "Longevity in the system gives him unparalleled institutional knowledge." },
  { rank: 17, name: "Ahmad Alamolhoda", nameFarsi: "احمد علم‌الهدی", position: "Friday Prayer Leader, Mashhad", institution: "Assembly of Experts", religion: "Twelver Shia — Ayatollah", power: "Controls Iran's most important religious city. Major clerical voice in succession debates.", health: "✅ Active.", powerScore: 48, status: "active", note: "Mashhad's Friday prayers draw millions. Father-in-law of deceased President Raisi." },
  { rank: 18, name: "Mohsen Rezaee", nameFarsi: "محسن رضایی", position: "Secretary, Expediency Council", institution: "Expediency Discernment Council", religion: "Twelver Shia", power: "Former IRGC commander. Significant influence in conservative political and economic circles.", health: "✅ Active.", powerScore: 45, status: "active", note: "Wanted by Interpol for the 1994 Buenos Aires bombing." },
  { rank: 19, name: "Saeed Jalili", nameFarsi: "سعید جلیلی", position: "Former SNSC Secretary / Senior Negotiator", institution: "Supreme National Security Council", religion: "Twelver Shia", power: "Iran's most hardline nuclear negotiator. Known for maximalist positions.", health: "✅ Active — significant influence among ultra-conservatives.", powerScore: 32, status: "active", note: "Lost the 2024 presidential election to Pezeshkian." },
  { rank: 20, name: "Gholamhossein Ismaili", nameFarsi: "غلامحسین اسماعیلی", position: "Head of the President's Office", institution: "Office of the Presidency", religion: "Twelver Shia", power: "Controls access to the President. Key administrative gatekeeper.", health: "✅ Active.", powerScore: 35, status: "active", note: "Former head of Iran's Prison Organisation." },
  { rank: 21, name: "Mohammad Mokhber", nameFarsi: "محمد مخبر", position: "First Vice President", institution: "Office of the Presidency", religion: "Twelver Shia", power: "Constitutionally next in line to assume presidential duties.", health: "✅ Active.", powerScore: 38, status: "active", note: "Former head of Setad — Khamenei's vast economic empire." },
  { rank: 22, name: "Nasser Kanani", nameFarsi: "ناصر کنعانی", position: "Spokesman, Ministry of Foreign Affairs", institution: "Ministry of Foreign Affairs", religion: "Twelver Shia", power: "Public face of Iran's diplomatic positions. Official responses to international developments.", health: "✅ Active.", powerScore: 30, status: "active", note: "His statements are the official public posture — useful for MUN delegates to reference." },
  { rank: 23, name: "Hassan Rouhani", nameFarsi: "حسن روحانی", position: "Former President / Member, Expediency Council", institution: "Expediency Discernment Council", religion: "Twelver Shia — cleric", power: "Retains moderate influence. Architect of the 2015 JCPOA. Under significant political pressure.", health: "✅ Active — politically marginalised.", powerScore: 28, status: "active", note: "His political movement has been effectively dismantled by the Guardian Council." },
  { rank: 24, name: "Mohammad Javad Zarif", nameFarsi: "محمدجواد ظریف", position: "Former Foreign Minister / Senior Advisor", institution: "Ministry of Foreign Affairs (advisory)", religion: "Twelver Shia", power: "Limited formal power but widely respected internationally. Architect of JCPOA.", health: "✅ Active — politically constrained.", powerScore: 25, status: "active", note: "Negotiated the 2015 JCPOA. Now serving in an advisory capacity." },
  { rank: 25, name: "Mahmoud Alavi", nameFarsi: "محمود علوی", position: "Former Minister of Intelligence", institution: "Ministry of Intelligence", religion: "Twelver Shia — cleric", power: "Former head of Iran's civilian intelligence service. Retains networks within the intelligence community.", health: "✅ Active.", powerScore: 36, status: "active", note: "Iran's intelligence apparatus — separate from IRGC intelligence — is a significant parallel power structure." },
  { rank: 26, name: "Abdolnaser Hemmati", nameFarsi: "عبدالناصر همتی", position: "Former Governor, Central Bank of Iran", institution: "Central Bank of Iran", religion: "Twelver Shia", power: "Former head of Iran's blacklisted Central Bank. Key figure in managing the currency crisis.", health: "✅ Active.", powerScore: 22, status: "active", note: "The Central Bank's SWIFT isolation is the single most damaging economic sanction Iran faces." },
  { rank: 27, name: "Mir-Hossein Mousavi", nameFarsi: "میرحسین موسوی", position: "Former Prime Minister / Reform Leader", institution: "Under house arrest", religion: "Twelver Shia", power: "Effectively zero formal power — under house arrest since 2011 following the Green Movement.", health: "🔒 Under house arrest — health status unknown.", powerScore: 5, status: "restricted", note: "Symbolic figure of the reform movement." },
  { rank: 28, name: "Farhad Dejpasand", nameFarsi: "فرهاد دژپسند", position: "Senior Economic Advisor", institution: "Ministry of Economic Affairs", religion: "Twelver Shia", power: "Key figure in managing Iran's sanctions-hit economy and foreign currency crisis.", health: "✅ Active.", powerScore: 38, status: "active", note: "Iran's economic technocrats wield significant quiet power." },
  { rank: 29, name: "Hossein Amir-Abdollahian", nameFarsi: "حسین امیرعبداللهیان", position: "Former Minister of Foreign Affairs", institution: "Ministry of Foreign Affairs", religion: "Twelver Shia", power: "Deceased — killed in helicopter crash May 2024 alongside President Raisi.", health: "💀 Deceased — May 19, 2024.", powerScore: 0, status: "deceased", note: "His death alongside Raisi significantly disrupted Iran's foreign policy continuity." },
  { rank: 30, name: "Ebrahim Raisi", nameFarsi: "ابراهیم رئیسی", position: "Former President of Iran", institution: "Office of the Presidency", religion: "Twelver Shia — cleric", power: "Deceased — killed in helicopter crash May 2024.", health: "💀 Deceased — May 19, 2024.", powerScore: 0, status: "deceased", note: "Was considered the frontrunner for Supreme Leader succession. His death directly contributed to the current crisis." },
]

const DEFAULT_DYNAMIC = {
  leadership: { title: "Leadership Crisis — Post February 28, 2026", situation: "Supreme Leader Ali Khamenei was assassinated on February 28, 2026. The Assembly of Experts is in emergency session under conditions of active military conflict and domestic unrest.", key_figures: [], mun_note: "Acknowledge the uncertainty while maintaining that Iran's institutional positions on sovereignty, sanctions, and the CSW removal remain unchanged." },
  sanctions: { current_status: "Maximal — UN, US, and EU sanctions simultaneously in force", latest_development: "UN sanctions reimposed September 2025 via JCPOA snapback. Iran continues selling oil through shadow fleet to China.", economic_impact: "Iranian rial in freefall. Inflation 40-50%. Budget deficit widening.", iran_argument: "Iran characterises all sanctions as illegal collective punishment of 92 million civilians." },
  military: { current_status: "Active conflict — February/March 2026", situation: "Following Feb 28 strikes that killed Khamenei, Iran launched retaliatory strikes targeting US military bases across the region.", nuclear: "Nuclear sites significantly damaged in June 2025. Hidden enrichment facility discovered January 2026.", proxies: "Axis of Resistance degraded. Hezbollah weakened. Syria's Assad fell late 2024." },
  ecosoc_current: { status: "Formally suspended from CSW — active conflict ongoing", latest: "Iran remains removed from the Commission on the Status of Women. January 2026 massacre intensified international pressure.", iran_position: "Iran maintains all institutional actions are politically motivated and legally invalid." },
  last_updated: "Default content — click Update All Sections to regenerate",
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

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

function NewsSection({ news, loading }) {
  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--light)' }}><div className="spinner" style={{ margin: '0 auto 12px' }}></div><div style={{ fontSize: 13 }}>Fetching latest news...</div></div>
  if (!news || news.length === 0) return <div style={{ padding: 20, color: 'var(--light)', fontSize: 13, fontStyle: 'italic' }}>Add your NewsAPI key in Vercel environment variables to enable live news.</div>
  return (
    <div className="news-grid">
      {news.map(category => (
        <div key={category.category}>
          <div className="news-category-title">{category.label}</div>
          {category.articles.length === 0 ? <div className="news-empty">No articles found.</div> : category.articles.map((article, i) => (
            <div key={i} className="news-item">
              <a className="news-item-title" href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a>
              {article.description && <div style={{ fontSize: 12, color: 'var(--mid)', marginTop: 3, lineHeight: 1.4 }}>{article.description.slice(0, 120)}...</div>}
              <div className="news-item-meta">{article.source} · {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function AIBriefing({ briefing, loading }) {
  if (loading) return <div className="briefing-card"><div className="briefing-header"><h2>🤖 AI Intelligence Briefing</h2></div><div className="briefing-empty"><div className="spinner" style={{ margin: '0 auto 12px', borderColor: '#2a5a3a', borderTopColor: 'var(--gold)' }}></div>Generating briefing...</div></div>
  if (!briefing) return <div className="briefing-card"><div className="briefing-header"><h2>🤖 AI Intelligence Briefing</h2></div><div className="briefing-empty">Enter your team password and click AI Briefing to get a comprehensive intelligence analysis.</div></div>
  return (
    <div className="briefing-card">
      <div className="briefing-header">
        <h2>🤖 AI Intelligence Briefing</h2>
        {briefing.last_updated && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{new Date(briefing.last_updated).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>}
      </div>
      <div className="briefing-body">
        {briefing.summary && <div className="briefing-section"><div className="briefing-label">📋 Executive Summary</div><div className="briefing-text">{briefing.summary}</div></div>}
        {briefing.situation_overview && <div className="briefing-section"><div className="briefing-label">🌍 Situation Overview</div><div className="briefing-text">{briefing.situation_overview}</div></div>}
        <div className="briefing-grid">
          {briefing.ecosoc_impact && <div className="briefing-box"><div className="briefing-label">🌐 ECOSOC Impact</div><div className="briefing-text">{briefing.ecosoc_impact}</div></div>}
          {briefing.sanctions_update && <div className="briefing-box"><div className="briefing-label">🔒 Sanctions Update</div><div className="briefing-text">{briefing.sanctions_update}</div></div>}
          {briefing.military_update && <div className="briefing-box"><div className="briefing-label">💣 Military Update</div><div className="briefing-text">{briefing.military_update}</div></div>}
          {briefing.leadership_crisis && <div className="briefing-box"><div className="briefing-label">👤 Leadership Crisis</div><div className="briefing-text">{briefing.leadership_crisis}</div></div>}
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
  const clearMarks = useCallback(() => {
    document.querySelectorAll('mark.sh').forEach(m => { m.parentNode?.replaceChild(document.createTextNode(m.textContent), m); m.parentNode?.normalize() })
    setHighlights([]); setCurrent(-1)
  }, [])
  const doSearch = useCallback((q) => {
    clearMarks(); if (!q || q.length < 2) return
    const root = rootRef.current || document.body
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode(node) { const p = node.parentElement; if (!p) return NodeFilter.FILTER_REJECT; if (p.closest('.search-bar') || p.closest('.update-panel')) return NodeFilter.FILTER_REJECT; if (['SCRIPT','STYLE'].includes(p.tagName)) return NodeFilter.FILTER_REJECT; if (node.nodeValue.trim() === '') return NodeFilter.FILTER_REJECT; return NodeFilter.FILTER_ACCEPT } })
    const nodes = []; let n; while ((n = walker.nextNode())) nodes.push(n)
    const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const marks = []
    nodes.forEach(node => { const val = node.nodeValue; if (!regex.test(val)) return; regex.lastIndex = 0; const frag = document.createDocumentFragment(); let last = 0, m; while ((m = regex.exec(val)) !== null) { if (m.index > last) frag.appendChild(document.createTextNode(val.slice(last, m.index))); const mark = document.createElement('mark'); mark.className = 'sh'; mark.textContent = m[0]; frag.appendChild(mark); marks.push(mark); last = regex.lastIndex }; if (last < val.length) frag.appendChild(document.createTextNode(val.slice(last))); node.parentNode.replaceChild(frag, node) })
    setHighlights(marks)
    if (marks.length > 0) { marks[0].classList.add('active'); marks[0].scrollIntoView({ behavior: 'smooth', block: 'center' }); setCurrent(0) }
  }, [clearMarks])
  const jump = useCallback((dir) => { setHighlights(prev => { if (prev.length === 0) return prev; setCurrent(c => { const next = (c + dir + prev.length) % prev.length; prev[c >= 0 ? c : 0]?.classList.remove('active'); prev[next].classList.add('active'); prev[next].scrollIntoView({ behavior: 'smooth', block: 'center' }); return next }); return prev }) }, [])
  return { query, setQuery, highlights, current, doSearch, clearMarks, jump, rootRef }
}

function NavBar({ router }) {
  const [active, setActive] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const handleScroll = () => { const sections = NAV_SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean); let current = ''; sections.forEach(section => { if (window.scrollY >= section.offsetTop - 120) current = section.id }); setActive(current) }
    window.addEventListener('scroll', handleScroll); return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  const scrollTo = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); setMenuOpen(false) }
  return (
    <nav className="nav-bar">
      <div className="nav-inner">
        <button className="nav-brand" onClick={() => router.push('/')} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--gold)', fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700 }}>🇺🇳 MUN Toolkit</button>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {NAV_SECTIONS.map(({ id, label }) => (
            <button key={id} className={`nav-link ${active === id ? 'active' : ''}`} onClick={() => scrollTo(id)}>{label}</button>
          ))}
        </div>
        <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)}>{menuOpen ? '✕' : '☰'}</button>
      </div>
    </nav>
  )
}

function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ role: 'assistant', content: "Hello! I am your Iran MUN research assistant. Ask me anything about Iran's position at ECOSOC, MUN procedures, or current events." }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef(null)
  useEffect(() => { if (open && messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' }) }, [messages, open])
  const SUGGESTIONS = ["What are Iran's strongest arguments in ECOSOC?", "How do I respond to attacks on Iran's human rights record?", "Explain the JCPOA snapback mechanism", "What happened to Khamenei?", "Who are Iran's allies in the UN?", "What is the Axis of Resistance?"]
  const sendMessage = async (text) => {
    const userText = text || input.trim(); if (!userText || loading) return
    setShowSuggestions(false); setInput(''); setLoading(true)
    const newMessages = [...messages, { role: 'user', content: userText }]
    setMessages(newMessages)
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: newMessages }) })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Sorry, please try again.' }])
    } catch { setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]) }
    finally { setLoading(false) }
  }
  const formatMessage = (text) => text.split('\n').map((line, i) => { const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('• '); const cleaned = line.replace(/^[-•]\s+/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); return <div key={i} style={{ display: 'flex', gap: isBullet ? 8 : 0, marginBottom: line.trim() ? 4 : 2, paddingLeft: isBullet ? 4 : 0 }}>{isBullet && <span style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 1 }}>→</span>}<span dangerouslySetInnerHTML={{ __html: cleaned }} /></div> })
  return (
    <>
      <button className="chat-fab" onClick={() => setOpen(o => !o)} title="Ask Iran MUN Assistant">{open ? '✕' : '💬'}{!open && <span className="chat-fab-label">MUN Assistant</span>}</button>
      {open && (
        <div className="chat-window">
          <div className="chat-header"><div><div className="chat-header-title">🇮🇷 Iran MUN Assistant</div><div className="chat-header-sub">Powered by Groq AI</div></div><button className="chat-close" onClick={() => setOpen(false)}>✕</button></div>
          <div className="chat-messages">
            {messages.map((msg, i) => <div key={i} className={`chat-msg ${msg.role}`}>{msg.role === 'assistant' && <div className="chat-avatar">🤖</div>}<div className="chat-bubble">{formatMessage(msg.content)}</div></div>)}
            {loading && <div className="chat-msg assistant"><div className="chat-avatar">🤖</div><div className="chat-bubble chat-typing"><span></span><span></span><span></span></div></div>}
            {showSuggestions && <div className="chat-suggestions"><div className="chat-suggestions-label">Suggested questions:</div>{SUGGESTIONS.map((q, i) => <button key={i} className="chat-suggestion" onClick={() => sendMessage(q)}>{q}</button>)}</div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input-row"><input className="chat-input" type="text" placeholder="Ask anything..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} disabled={loading} /><button className="chat-send" onClick={() => sendMessage()} disabled={loading || !input.trim()}>➤</button></div>
        </div>
      )}
    </>
  )
}

export default function IranPage({ dynamic, generatedAt, user, logout }) {
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
  const fetchNews = async () => { setNewsLoading(true); try { const res = await fetch('/api/news'); const data = await res.json(); if (data.news) setNews(data.news) } catch {} finally { setNewsLoading(false) } }
  const generateBriefing = async () => {
    setBriefingLoading(true)
    setUpdateStatus('Generating AI briefing...')
    const allArticles = news.flatMap(c => c.articles)
    const token = localStorage.getItem('mun_token')
    try {
      const res = await fetch('/api/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: process.env.NEXT_PUBLIC_UPDATE_PASSWORD, token, articles: allArticles.slice(0, 20) })
      })
      const data = await res.json()
      if (data.briefing) { setBriefing(data.briefing); setUpdateStatus('Briefing updated.') }
      else setUpdateStatus(data.error || 'Update failed.')
    } catch { setUpdateStatus('Request failed.') }
    finally { setBriefingLoading(false) }
  }
  const updateAllSections = async () => { if (!password) { setUpdateStatus('Enter password first.'); return }; setIsUpdating(true); setUpdateStatus('Updating all sections...'); try { const res = await fetch('/api/revalidate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) }); const data = await res.json(); if (data.revalidated) { setUpdateStatus('Updated! Refreshing in 5 seconds...'); setTimeout(() => window.location.reload(), 5000) } else setUpdateStatus(data.error || 'Update failed.') } catch { setUpdateStatus('Request failed.') } finally { setIsUpdating(false) } }
  useEffect(() => { fetchNews() }, [])

  return (
    <>
      <Head>
        <title>Iran — MUN Toolkit</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div ref={rootRef}>
        <Chatbot />

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
              {generatedAt ? `Updated: ${new Date(generatedAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}` : 'Loading...'}<br/>
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
            <input className="search-input" type="text" placeholder="Search anything — Sanctions, IRGC, Nowruz, ECOSOC..." value={query} onChange={e => handleSearchInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); jump(e.shiftKey ? -1 : 1) }; if (e.key === 'Escape') { setQuery(''); clearMarks() } }} />
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
          <Card emoji="👤" title={d.leadership?.title || "Leadership Crisis"} fullWidth>
            <p className="prose" style={{ marginBottom: 12 }}>{d.leadership?.situation}</p>
            {d.leadership?.mun_note && <div className="box highlight"><div className="box-title">🎤 MUN Note</div><p>{d.leadership.mun_note}</p></div>}
          </Card>
          <Card emoji="🔒" title="Sanctions — Current Status">
            <InfoRow label="Status" value={d.sanctions?.current_status || 'Maximal'} />
            <div className="box alert" style={{ marginTop: 12 }}><div className="box-title">Latest</div><p>{d.sanctions?.latest_development}</p></div>
            <div className="box highlight"><div className="box-title">Economic Impact</div><p>{d.sanctions?.economic_impact}</p></div>
            <div className="box green"><div className="box-title">Iran's Argument</div><p>{d.sanctions?.iran_argument}</p></div>
          </Card>
          <Card emoji="💣" title="Military — Current Situation">
            <InfoRow label="Status" value={d.military?.current_status || 'Active conflict'} />
            <div className="box alert" style={{ marginTop: 12 }}><div className="box-title">Situation Report</div><p>{d.military?.situation}</p></div>
            <div className="box highlight"><div className="box-title">Nuclear Programme</div><p>{d.military?.nuclear}</p></div>
            <div className="box blue"><div className="box-title">Proxy Networks</div><p>{d.military?.proxies}</p></div>
          </Card>
          <Card emoji="🌐" title="ECOSOC — Current Status">
            <InfoRow label="Status" value={d.ecosoc_current?.status || 'Suspended from CSW'} note />
            <div className="box alert" style={{ marginTop: 12 }}><div className="box-title">Latest</div><p>{d.ecosoc_current?.latest}</p></div>
            <div className="box green"><div className="box-title">Iran's Position</div><p>{d.ecosoc_current?.iran_position}</p></div>
            {d.last_updated && <div style={{ fontSize: 11, color: 'var(--light)', marginTop: 12, fontStyle: 'italic' }}>Generated: {d.last_updated}</div>}
          </Card>
          <Card emoji="📰" title="Live News Feed" fullWidth><NewsSection news={news} loading={newsLoading} /></Card>
          {canBriefing ? <div className="full-width"><AIBriefing briefing={briefing} loading={briefingLoading} /></div> : <div className="full-width"><div className="access-blocked">🔒 AI Intelligence Briefing is available to <strong>Plus</strong> and <strong>Admin</strong> users only.</div></div>}
        </div>

        {/* UPDATE PANEL */}
        <div className="update-panel">
          <span className="update-label">TEAM CONTROLS</span>
          <button className="update-btn" onClick={fetchNews} disabled={newsLoading}>{newsLoading ? '...' : '🔄 Refresh News'}</button>
          {canBriefing && (
            <button className="update-btn" onClick={generateBriefing} disabled={briefingLoading}>{briefingLoading ? '...' : '🤖 AI Briefing'}</button>
          )}
          {canUpdateAll && (<>
            <input className="update-input" type="password" placeholder="Admin password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: 160 }} />
            <button className="update-btn" onClick={updateAllSections} disabled={isUpdating} style={{ background: '#8e44ad' }}>{isUpdating ? '⏳ Updating...' : '⚡ Update All Sections'}</button>
          </>)}
          {updateStatus && <span className="update-status">{updateStatus}</span>}
          <span className="fetched-at">Auto-updates daily at 6:00 AM UTC</span>
        </div>
        </div>

        {/* POWER FIGURES */}
        <div id="power-figures">
        <SectionDivider emoji="👑" title="Top 30 Political Figures — Ranked by Power" />
        <div className="main">
          <Card emoji="ℹ️" title="About This Ranking" fullWidth>
            <p className="prose">Figures are ranked by effective political power as of March 2026. The assassination of Supreme Leader Khamenei on February 28, 2026 has fundamentally reshuffled this ranking — power is currently concentrated in the IRGC and the Assembly of Experts.</p>
          </Card>
          <div className="full-width">
            <div className="power-table-wrapper">
              <table className="power-table">
                <thead><tr><th style={{width:50}}>Rank</th><th style={{width:160}}>Name</th><th style={{width:160}}>Position</th><th style={{width:80}}>Religion</th><th>Power and Influence</th><th style={{width:140}}>Health Status</th><th style={{width:80}}>Score</th></tr></thead>
                <tbody>
                  {POWER_FIGURES.map(f => (
                    <tr key={f.rank} className={`power-row status-${f.status}`}>
                      <td className="rank-cell"><span className={`rank-badge ${f.rank <= 3 ? 'top3' : f.rank <= 10 ? 'top10' : ''}`}>{f.rank}</span></td>
                      <td><div className="figure-name">{f.name}</div><div className="figure-farsi">{f.nameFarsi}</div><div style={{fontSize:10,color:'var(--light)',marginTop:2}}>{f.institution}</div></td>
                      <td><div className="figure-position">{f.position}</div></td>
                      <td><div style={{fontSize:11,color:'var(--mid)'}}>{f.religion}</div></td>
                      <td><div style={{fontSize:12,color:'var(--mid)',lineHeight:1.5}}>{f.power}</div>{f.note && <div style={{fontSize:11,color:'var(--light)',fontStyle:'italic',marginTop:4}}>→ {f.note}</div>}</td>
                      <td><div style={{fontSize:12,color:f.status==='deceased'?'var(--red)':f.status==='restricted'?'#7d3c98':'var(--green)',fontWeight:600}}>{f.health}</div></td>
                      <td className="power-score-cell">{f.powerScore > 0 ? (<><div className="power-score-num">{f.powerScore}</div><div className="power-bar-outer"><div className="power-bar-inner" style={{width:`${f.powerScore}%`,background:f.powerScore>=80?'var(--red)':f.powerScore>=50?'var(--gold)':'var(--green)'}}></div></div></>) : <div style={{fontSize:11,color:'var(--light)'}}>N/A</div>}</td>
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
            <Box type="highlight" title="🚢 Strait of Hormuz">20% of the world's oil and 30% of global LNG passes through this chokepoint. Iran's ability to threaten closure is its most powerful geopolitical lever. In March 2026, attacks pushed Brent crude above $119/barrel.</Box>
            <InfoRow label="Oil Reserves" value="4th largest globally (~157 billion barrels)" note />
            <InfoRow label="Gas Reserves" value="2nd largest globally" note />
            <InfoRow label="Nuclear Sites" value="Natanz, Fordow, Isfahan, Bushehr — multiple damaged June 2025" note />
          </Card>
        </div>
        </div>

        {/* PEOPLE */}
        <div id="people">
        <SectionDivider emoji="👥" title="People, Society and Culture" />
        <div className="main">
          <Card emoji="🧬" title="Demographics">
            <InfoRow label="Population" value="~92.4 million (2025)" />
            <InfoRow label="Median Age" value="32 years" />
            <InfoRow label="Official Language" value="Persian (Farsi)" />
            <InfoRow label="Other Languages" value="Azerbaijani, Kurdish, Luri, Balochi, Arabic" note />
            <InfoRow label="Refugees Hosted" value="~4M Afghans — one of world's largest hosting nations" note />
            <InfoRow label="Diaspora" value="5-8M Iranians abroad (USA, Germany, UK, Canada, UAE)" note />
            <InfoRow label="Youth Unemployment" value="~25-30% among under-35s (2025)" note />
          </Card>
          <Card emoji="🕌" title="Religion and Society">
            <InfoRow label="State Religion" value="Twelver Shia Islam" />
            <InfoRow label="Shia Muslims" value="~90-95% of population" />
            <InfoRow label="Sunni Muslims" value="~5-8% (Kurdish, Balochi communities)" note />
            <InfoRow label="Other Faiths" value="Zoroastrian, Jewish, Christian, Baha'i (persecuted)" note />
            <InfoRow label="Literacy Rate" value="~86%" />
            <InfoRow label="Executions" value="Consistently top 3 globally" note />
            <Box type="alert" title="⚠️ Women — 2026">Women represent 60% of natural science university students yet face mandatory hijab and restricted legal rights. Mahsa Amini's death in Sept 2022 triggered the largest protests since 1979. The January 2026 massacre killed thousands of protesters.</Box>
          </Card>
        </div>
        </div>

        {/* GOVERNMENT */}
        <div id="government">
        <SectionDivider emoji="🏛️" title="Government and Political Structure" />
        <div className="main">
          <Card emoji="⚖️" title="Constitutional Structure">
            <InfoRow label="System" value="Islamic Republic (Velayat-e Faqih)" />
            <InfoRow label="Constitution" value="Adopted 1979; revised 1989" />
            <InfoRow label="Supreme Leader" value="Khamenei killed Feb 28, 2026 — successor TBD" note />
            <InfoRow label="President" value="Masoud Pezeshkian — elected July 2024; subordinate to Supreme Leader" note />
            <InfoRow label="Legislature (Majles)" value="290 elected members" />
            <InfoRow label="Guardian Council" value="12 jurists vetting all legislation and candidates" note />
            <InfoRow label="Assembly of Experts" value="88 clerics who elect and dismiss the Supreme Leader" note />
            <InfoRow label="Judiciary" value="Head appointed by Supreme Leader; Sharia law applied" note />
          </Card>
          <Card emoji="💣" title="Military and Security">
            <Box type="blue" title="🪖 Artesh — Conventional Military">Ranked 16th globally. Capabilities degraded by Israeli strikes in June 2025.</Box>
            <Box type="alert" title="🛡️ IRGC">Controls the nuclear programme, all proxy networks, internal intelligence. Designated a terrorist organisation by the United States.</Box>
            <Box type="highlight" title="🕸️ Axis of Resistance">Hezbollah (Lebanon), Hamas (Gaza), Houthis (Yemen), PMF militias (Iraq). All significantly degraded since 2023. Syria's Assad fell late 2024.</Box>
          </Card>
        </div>
        </div>

        {/* HISTORY */}
        <div id="history">
        <SectionDivider emoji="📅" title="Historical Timeline" />
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
        </div>

        {/* ECOSOC */}
        <div id="ecosoc">
        <SectionDivider emoji="🌐" title="ECOSOC Deep Dive" />
        <div className="main">
          <Card emoji="🏢" title="What Is ECOSOC?" fullWidth>
            <p className="prose" style={{ marginBottom: 16 }}>ECOSOC is one of the six principal organs of the UN, established by the Charter in 1945. It coordinates 15 specialized agencies, 8 functional commissions, and 5 regional commissions. Over 1,600 NGOs hold consultative status — the broadest civil society access point in the UN system.</p>
            <div className="three-col">
              <div className="mini-card"><div className="mini-card-title">📋 Basic Facts</div><p>Founded: 1945 · Members: 54 states (rotating 3-year terms) · Sessions: One 4-week session in July · NGO Access: 1,600+ organisations</p></div>
              <div className="mini-card"><div className="mini-card-title">⚙️ How It Works</div><p>Adopts recommendations, coordinates subsidiary bodies. Principal instrument is the HLPF for reviewing SDG progress. Decisions pass by simple majority.</p></div>
              <div className="mini-card"><div className="mini-card-title">🗂️ Key Bodies</div><p>Commission on the Status of Women (CSW) — Iran removed 2022 · Commission on Narcotic Drugs (CND) · ESCAP (Asia-Pacific) — Iran is a member · HLPF (SDGs)</p></div>
            </div>
          </Card>
          <Card emoji="🚫" title="The CSW Removal">
            <Box type="blue" title="The Case For Removal">ECOSOC voted 29-8 (16 abstentions) November 2022. A state that kills women for removing their hijab cannot sit on the commission charged with advancing women's rights.</Box>
            <Box type="alert" title="Iran's Legal Counter">No explicit provision in ECOSOC's rules for mid-term removal. Iran was lawfully elected. The manoeuvre was an abuse of process. The UN Charter's sovereign equality principle prohibits this selective institutional action.</Box>
            <Box type="highlight" title="The Precedent Problem">If ECOSOC can expel a lawfully elected member mid-term based on majority politics, every elected seat in every UN subsidiary body is vulnerable to political ejection.</Box>
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
        </div>

        {/* MUN TOOLKIT */}
        <div id="toolkit">
        <SectionDivider emoji="🎤" title="MUN Delegate Toolkit" />
        <div className="main">
          <Card emoji="🗣️" title="Core Arguments">
            <Box type="green" title="Argument 1 — Sovereignty">The UN Charter's principle of sovereign equality is non-negotiable. The CSW removal and the sanctions snapback both represent the weaponisation of institutional procedure by states pursuing geopolitical agendas.</Box>
            <Box type="green" title="Argument 2 — Double Standards">No comparable accountability has been applied to states conducting illegal military operations. Challenge this body to explain the inconsistency.</Box>
            <Box type="green" title="Argument 3 — Collective Punishment">Sanctions targeting Iran's Central Bank and severing international banking access constitute collective punishment of 92 million civilians.</Box>
            <Box type="green" title="Argument 4 — Development Rights">Every state holds the inalienable right to peaceful nuclear energy. The IAEA has not confirmed the existence of any weapons programme.</Box>
          </Card>
          <Card emoji="🧭" title="Strategic Notes">
            <Box type="highlight" title="🤝 Build These Coalitions">Russia, China, Cuba, Venezuela, Syria, Bolivia, Belarus — and G-77 members who share grievances about economic coercion. Frame everything in terms of developing-world solidarity.</Box>
            <Box type="alert" title="⚠️ Weak Points">January 2026 massacres (7,000-32,000 deaths). Nuclear enrichment at 60%. Proxy warfare. Execution rates (global top 3). Mandatory hijab. Internet blackouts during protests.</Box>
            <Box type="blue" title="🎯 Tactical Redirection">When pressed on human rights, redirect to Western military actions. When pressed on nuclear programme, cite the fatwa. Frame everything through sovereignty and anti-imperialism.</Box>
          </Card>
          <Card emoji="📖" title="Key Vocabulary" fullWidth>
            <table className="data-table">
              <thead><tr><th>Term</th><th>Meaning</th><th>Why It Matters</th></tr></thead>
              <tbody>{VOCAB.map(({ term, meaning, why }) => <tr key={term}><td>{term}</td><td>{meaning}</td><td>{why}</td></tr>)}</tbody>
            </table>
          </Card>
        </div>
        </div>

        <div className="footer">🇮🇷 &nbsp; IRAN — LIVE MUN RESEARCH PAGE &nbsp;·&nbsp; ECOSOC COMMITTEE &nbsp;·&nbsp; AUTO-UPDATED DAILY &nbsp;·&nbsp; FOR EDUCATIONAL USE &nbsp; 🇮🇷</div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  let dynamic = null
  let generatedAt = new Date().toISOString()
  try {
    const newsApiKey = process.env.NEWS_API_KEY
    const anthropicKey = process.env.GROQ_API_KEY
    if (newsApiKey && anthropicKey) {
      const newsUrl = `https://newsapi.org/v2/everything?q=Iran&language=en&sortBy=publishedAt&pageSize=15&apiKey=${newsApiKey}`
      const newsRes = await fetch(newsUrl)
      const newsData = await newsRes.json()
      const articles = (newsData.articles || []).slice(0, 12)
      const newsText = articles.map(a => `- [${a.source?.name}] ${a.title}: ${a.description || ''}`).join('\n')
      const prompt = `You are a MUN research analyst for Iran at ECOSOC. Based on these news headlines, generate updated content. Return ONLY valid JSON with these keys: alert_banner (object with title and content), leadership (object with title, situation, mun_note), sanctions (object with current_status, latest_development, economic_impact, iran_argument), military (object with current_status, situation, nuclear, proxies), ecosoc_current (object with status, latest, iran_position), last_updated (string). Headlines: ${newsText}. last_updated value: "${new Date().toLocaleString('en-GB')} UTC"`
      const aiRes = await fetch('https://api.groq.com/openai/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${anthropicKey}` }, body: JSON.stringify({ model: 'llama3-8b-8192', max_tokens: 1500, temperature: 0.2, messages: [{ role: 'system', content: 'You are a JSON-only API. Output raw JSON only, no markdown, no backticks.' }, { role: 'user', content: prompt }] }) })
      const aiData = await aiRes.json()
      let text = aiData.choices?.[0]?.message?.content || ''
      text = text.replace(/```json/gi, '').replace(/```/g, '').trim()
      const start = text.indexOf('{'); const end = text.lastIndexOf('}')
      if (start !== -1 && end !== -1) text = text.substring(start, end + 1)
      try { dynamic = JSON.parse(text); generatedAt = new Date().toISOString() } catch {}
    }
  } catch {}
  return { props: { dynamic: dynamic || null, generatedAt }, revalidate: 86400 }
}
