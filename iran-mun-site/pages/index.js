// pages/index.js
import { useState, useEffect, useRef, useCallback } from 'react'
import Head from 'next/head'

// ─── NAVIGATION SECTIONS ─────────────────────────────────────────────────────

const NAV_SECTIONS = [
  { id: 'procedures', label: '📜 Procedures' },
  { id: 'live-intelligence', label: '🔴 Live Intel' },
  { id: 'geography', label: '📍 Geography' },
  { id: 'people', label: '👥 People' },
  { id: 'government', label: '🏛️ Government' },
  { id: 'power-figures', label: '👑 Power Figures' },
  { id: 'history', label: '📅 History' },
  { id: 'ecosoc', label: '🌐 ECOSOC' },
  { id: 'toolkit', label: '🎤 MUN Toolkit' },
]

// ─── TOP 30 POLITICAL FIGURES ────────────────────────────────────────────────

const POWER_FIGURES = [
  {
    rank: 1,
    name: "Ali Khamenei",
    nameFarsi: "علی خامنه‌ای",
    position: "Supreme Leader (Rahbar)",
    institution: "Office of the Supreme Leader",
    religion: "Twelver Shia — Marja (Senior Jurist)",
    power: "Absolute — commands all armed forces, judiciary, foreign policy, media. Highest constitutional authority.",
    health: "Deceased — assassinated February 28, 2026 during US-Israeli military strikes on Tehran.",
    powerScore: 100,
    status: "deceased",
    note: "His death has created the most severe constitutional crisis in the history of the Islamic Republic."
  },
  {
    rank: 2,
    name: "Mohammad Hossein Bagheri",
    nameFarsi: "محمدحسین باقری",
    position: "Chief of Staff, Armed Forces",
    institution: "General Staff of the Armed Forces",
    religion: "Twelver Shia",
    power: "Commands Iran's entire conventional military apparatus. De facto highest military authority post-Khamenei.",
    health: "Active — status unknown following Feb 2026 strikes.",
    powerScore: 88,
    status: "active",
    note: "Commands the Artesh (conventional forces). His coordination with the IRGC is the critical power axis."
  },
  {
    rank: 3,
    name: "Hossein Salami",
    nameFarsi: "حسین سلامی",
    position: "Commander-in-Chief, IRGC",
    institution: "Islamic Revolutionary Guard Corps",
    religion: "Twelver Shia",
    power: "Commands Iran's most powerful military-political institution — nuclear programme, missile arsenal, proxy networks, intelligence.",
    health: "Active — believed to be directing retaliatory operations as of March 2026.",
    powerScore: 85,
    status: "active",
    note: "The IRGC is the real engine of Iranian foreign policy. Salami is arguably the most powerful figure currently operating."
  },
  {
    rank: 4,
    name: "Ahmad Vahidi",
    nameFarsi: "احمد وحیدی",
    position: "Minister of Interior",
    institution: "Ministry of Interior",
    religion: "Twelver Shia",
    power: "Controls internal security, elections, provincial governors, and law enforcement coordination.",
    health: "Active.",
    powerScore: 72,
    status: "active",
    note: "Former IRGC Quds Force commander. Under US sanctions for his role in the 1994 Buenos Aires bombing."
  },
  {
    rank: 5,
    name: "Ali Larijani",
    nameFarsi: "علی لاریجانی",
    position: "Senior Advisor to the Supreme Leader",
    institution: "Office of the Supreme Leader",
    religion: "Twelver Shia — clerical family lineage",
    power: "One of Iran's most experienced political operators. Former Speaker of Majles (parliament) for 12 years. Key intermediary between factions.",
    health: "Active — widely mentioned as potential Supreme Leader candidate.",
    powerScore: 70,
    status: "active",
    note: "His candidacy for Supreme Leader was barred by the Guardian Council in 2021 — he may now be positioned for succession."
  },
  {
    rank: 6,
    name: "Gholam-Hossein Mohseni-Ejei",
    nameFarsi: "غلامحسین محسنی اژه‌ای",
    position: "Head of the Judiciary",
    institution: "Islamic Republic Judiciary",
    religion: "Twelver Shia — cleric (Hojatoleslam)",
    power: "Controls Iran's entire judicial system, including Revolutionary Courts that prosecute dissidents. Appointed by the Supreme Leader.",
    health: "Active.",
    powerScore: 68,
    status: "active",
    note: "Known for harsh sentences against protesters. Presided over mass trials following the 2022 and 2025-26 protests."
  },
  {
    rank: 7,
    name: "Masoud Pezeshkian",
    nameFarsi: "مسعود پزشکیان",
    position: "President of Iran",
    institution: "Office of the Presidency",
    religion: "Twelver Shia",
    power: "Head of government — manages economic policy, cabinet, and diplomatic representation. Constitutionally subordinate to the Supreme Leader.",
    health: "Active — elected July 2024 as a reformist candidate.",
    powerScore: 65,
    status: "active",
    note: "His reformist agenda is heavily constrained by the Guardian Council and IRGC. The leadership vacuum has further reduced his effective authority."
  },
  {
    rank: 8,
    name: "Mohammad Mokhber",
    nameFarsi: "محمد مخبر",
    position: "First Vice President",
    institution: "Office of the Presidency",
    religion: "Twelver Shia",
    power: "Constitutionally next in line to assume presidential duties. Close associate of Khamenei.",
    health: "Active.",
    powerScore: 60,
    status: "active",
    note: "Former head of Setad — Khamenei's vast economic empire. His constitutional role during the succession crisis is contested."
  },
  {
    rank: 9,
    name: "Abbas Araghchi",
    nameFarsi: "عباس عراقچی",
    position: "Minister of Foreign Affairs",
    institution: "Ministry of Foreign Affairs",
    religion: "Twelver Shia",
    power: "Leads Iran's diplomatic engagement internationally, including nuclear negotiations and UN representation.",
    health: "Active — leading Iran's diplomatic responses to the February 2026 conflict.",
    powerScore: 58,
    status: "active",
    note: "Veteran nuclear negotiator who was a key architect of the 2015 JCPOA. Now navigating the post-conflict international landscape."
  },
  {
    rank: 10,
    name: "Mohammad Bagher Ghalibaf",
    nameFarsi: "محمدباقر قالیباف",
    position: "Speaker of the Islamic Consultative Assembly (Majles)",
    institution: "Islamic Consultative Assembly",
    religion: "Twelver Shia",
    power: "Leads Iran's 290-member parliament. Former IRGC commander and Tehran mayor. Major political operator.",
    health: "Active.",
    powerScore: 55,
    status: "active",
    note: "Has run for president multiple times. Considered a hardliner with strong IRGC backing and significant political ambitions."
  },
  {
    rank: 11,
    name: "Esmail Qaani",
    nameFarsi: "اسماعیل قاانی",
    position: "Commander, IRGC Quds Force",
    institution: "IRGC Quds Force",
    religion: "Twelver Shia",
    power: "Commands Iran's external operations force — manages all proxy relationships, foreign militias, and covert operations abroad.",
    health: "Active — managing the degraded but operational Axis of Resistance.",
    powerScore: 75,
    status: "active",
    note: "Succeeded Qasem Soleimani after his assassination in January 2020. Less charismatic but equally operationally significant."
  },
  {
    rank: 12,
    name: "Ahmad Khatami",
    nameFarsi: "احمد خاتمی",
    position: "Member, Assembly of Experts",
    institution: "Assembly of Experts",
    religion: "Twelver Shia — senior cleric (Ayatollah)",
    power: "Senior hardline cleric on the body constitutionally responsible for selecting the next Supreme Leader.",
    health: "Active — in emergency session for succession process.",
    powerScore: 62,
    status: "active",
    note: "Known for extremely hawkish sermons. Has called for execution of protesters and dissidents."
  },
  {
    rank: 13,
    name: "Mohammad-Ali Jafari",
    nameFarsi: "محمدعلی جعفری",
    position: "Former IRGC Commander-in-Chief / Senior Military Advisor",
    institution: "IRGC",
    religion: "Twelver Shia",
    power: "Retains significant influence within IRGC senior command networks.",
    health: "Active.",
    powerScore: 50,
    status: "active",
    note: "Commanded the IRGC 2007-2019. Still considered influential in IRGC strategic planning circles."
  },
  {
    rank: 14,
    name: "Sadegh Amoli Larijani",
    nameFarsi: "صادق آملی لاریجانی",
    position: "Chairman, Expediency Council",
    institution: "Expediency Discernment Council",
    religion: "Twelver Shia — Ayatollah",
    power: "Chairs the body that arbitrates between parliament and the Guardian Council and advises the Supreme Leader.",
    health: "Active.",
    powerScore: 55,
    status: "active",
    note: "Brother of Ali Larijani. Former head of the Judiciary. Major conservative power broker."
  },
  {
    rank: 15,
    name: "Ahmad Alamolhoda",
    nameFarsi: "احمد علم‌الهدی",
    position: "Friday Prayer Leader, Mashhad / Member, Assembly of Experts",
    institution: "Assembly of Experts",
    religion: "Twelver Shia — Ayatollah",
    power: "Controls Iran's most important religious city. Father-in-law of Ebrahim Raisi (deceased). Major clerical voice.",
    health: "Active — vocal supporter of hardline succession.",
    powerScore: 48,
    status: "active",
    note: "Mashhad's Friday prayers draw millions. His political sermons carry enormous weight among the conservative clerical base."
  },
  {
    rank: 16,
    name: "Ali Shamkhani",
    nameFarsi: "علی شمخانی",
    position: "Senior Political-Military Advisor",
    institution: "Office of the Supreme Leader",
    religion: "Twelver Shia",
    power: "Former Secretary of Supreme National Security Council. One of Iran's most experienced strategic thinkers.",
    health: "Active.",
    powerScore: 52,
    status: "active",
    note: "Brokered the Saudi-Iran normalisation deal in Beijing in 2023. Retains significant back-channel diplomatic influence."
  },
  {
    rank: 17,
    name: "Mohsen Rezaee",
    nameFarsi: "محسن رضایی",
    position: "Secretary, Expediency Council",
    institution: "Expediency Discernment Council",
    religion: "Twelver Shia",
    power: "Former IRGC commander. Significant influence in conservative political and economic circles.",
    health: "Active.",
    powerScore: 45,
    status: "active",
    note: "Wanted by Interpol for the 1994 Buenos Aires bombing. Has run for president four times. Known for economic nationalist positions."
  },
  {
    rank: 18,
    name: "Farhad Dejpasand",
    nameFarsi: "فرهاد دژپسند",
    position: "Former Minister of Economic Affairs / Senior Economic Advisor",
    institution: "Ministry of Economic Affairs",
    religion: "Twelver Shia",
    power: "Key figure in managing Iran's sanctions-hit economy and foreign currency crisis.",
    health: "Active.",
    powerScore: 38,
    status: "active",
    note: "Iran's economic technocrats wield significant quiet power in managing the country's survival under maximum pressure."
  },
  {
    rank: 19,
    name: "Nasser Kanani",
    nameFarsi: "ناصر کنعانی",
    position: "Spokesman, Ministry of Foreign Affairs",
    institution: "Ministry of Foreign Affairs",
    religion: "Twelver Shia",
    power: "Public face of Iran's diplomatic positions. Delivers official responses to international developments.",
    health: "Active.",
    powerScore: 30,
    status: "active",
    note: "His statements are carefully crafted official positions — useful for MUN delegates to reference as Iran's public posture."
  },
  {
    rank: 20,
    name: "Hossein Amir-Abdollahian",
    nameFarsi: "حسین امیرعبداللهیان",
    position: "Former Minister of Foreign Affairs",
    institution: "Ministry of Foreign Affairs",
    religion: "Twelver Shia",
    power: "Deceased — killed in helicopter crash May 2024 alongside President Raisi.",
    health: "Deceased — May 19, 2024.",
    powerScore: 0,
    status: "deceased",
    note: "His death alongside Raisi significantly disrupted Iran's foreign policy continuity before the current crisis."
  },
  {
    rank: 21,
    name: "Ebrahim Raisi",
    nameFarsi: "ابراهیم رئیسی",
    position: "Former President of Iran",
    institution: "Office of the Presidency",
    religion: "Twelver Shia — cleric (Hojatoleslam)",
    power: "Deceased — killed in helicopter crash May 2024.",
    health: "Deceased — May 19, 2024.",
    powerScore: 0,
    status: "deceased",
    note: "Was considered the frontrunner for Supreme Leader succession. His death created a significant power vacuum that directly contributed to the current crisis."
  },
  {
    rank: 22,
    name: "Gholamhossein Ismaili",
    nameFarsi: "غلامحسین اسماعیلی",
    position: "Head of the President's Office",
    institution: "Office of the Presidency",
    religion: "Twelver Shia",
    power: "Controls access to the President. Key administrative gatekeeper.",
    health: "Active.",
    powerScore: 35,
    status: "active",
    note: "Former head of Iran's Prison Organisation. Close to hardline factions."
  },
  {
    rank: 23,
    name: "Hassan Rouhani",
    nameFarsi: "حسن روحانی",
    position: "Former President / Member, Expediency Council",
    institution: "Expediency Discernment Council",
    religion: "Twelver Shia — cleric (Hojatoleslam)",
    power: "Retains moderate influence. Architect of the 2015 JCPOA. Under significant political pressure from hardliners.",
    health: "Active — politically marginalised.",
    powerScore: 28,
    status: "active",
    note: "His political movement has been effectively dismantled. Represents the reformist wing that has been systematically blocked by the Guardian Council."
  },
  {
    rank: 24,
    name: "Yahya Rahim Safavi",
    nameFarsi: "یحیی رحیم صفوی",
    position: "Senior Military Advisor to the Supreme Leader",
    institution: "Office of the Supreme Leader",
    religion: "Twelver Shia",
    power: "Former IRGC commander. Senior military advisor with direct access to the Supreme Leader's office.",
    health: "Active.",
    powerScore: 42,
    status: "active",
    note: "One of the architects of Iran's regional military strategy. Significant informal influence over IRGC doctrine."
  },
  {
    rank: 25,
    name: "Mahmoud Alavi",
    nameFarsi: "محمود علوی",
    position: "Former Minister of Intelligence",
    institution: "Ministry of Intelligence",
    religion: "Twelver Shia — cleric",
    power: "Former head of Iran's civilian intelligence service. Retains networks within the intelligence community.",
    health: "Active.",
    powerScore: 36,
    status: "active",
    note: "Iran's intelligence apparatus — separate from IRGC intelligence — is a significant parallel power structure."
  },
  {
    rank: 26,
    name: "Ali Akbar Velayati",
    nameFarsi: "علی اکبر ولایتی",
    position: "Senior International Affairs Advisor to the Supreme Leader",
    institution: "Office of the Supreme Leader",
    religion: "Twelver Shia",
    power: "Advises the Supreme Leader on all international matters. Former foreign minister for 16 years (1981-1997).",
    health: "Active — elderly but politically relevant.",
    powerScore: 40,
    status: "active",
    note: "His longevity in the system gives him unparalleled institutional knowledge. Considered a moderate conservative."
  },
  {
    rank: 27,
    name: "Mir-Hossein Mousavi",
    nameFarsi: "میرحسین موسوی",
    position: "Former Prime Minister / Reform Leader",
    institution: "Under house arrest",
    religion: "Twelver Shia",
    power: "Effectively zero formal power — under house arrest since 2011 following the Green Movement.",
    health: "Under house arrest — health status unknown.",
    powerScore: 5,
    status: "restricted",
    note: "Symbolic figure of the reform movement. His continued detention represents the regime's refusal to acknowledge political opposition."
  },
  {
    rank: 28,
    name: "Mohammad Javad Zarif",
    nameFarsi: "محمدجواد ظریف",
    position: "Former Foreign Minister / Senior Diplomatic Advisor",
    institution: "Ministry of Foreign Affairs (advisory)",
    religion: "Twelver Shia",
    power: "Limited formal power — but widely respected internationally. Architect of Iran's Western diplomatic engagement.",
    health: "Active — politically constrained.",
    powerScore: 25,
    status: "active",
    note: "Negotiated the 2015 JCPOA. Now serving in an advisory capacity under President Pezeshkian. Distrusted by hardliners."
  },
  {
    rank: 29,
    name: "Abdolnaser Hemmati",
    nameFarsi: "عبدالناصر همتی",
    position: "Former Governor, Central Bank of Iran",
    institution: "Central Bank of Iran",
    religion: "Twelver Shia",
    power: "Former head of Iran's blacklisted Central Bank. Key figure in managing the currency crisis.",
    health: "Active.",
    powerScore: 22,
    status: "active",
    note: "The Central Bank's isolation from SWIFT and international banking is the single most damaging economic sanction Iran faces."
  },
  {
    rank: 30,
    name: "Saeed Jalili",
    nameFarsi: "سعید جلیلی",
    position: "Secretary, Supreme National Security Council (former) / Senior Negotiator",
    institution: "Supreme National Security Council",
    religion: "Twelver Shia",
    power: "Iran's most hardline nuclear negotiator. Known for maximalist positions that collapsed multiple rounds of talks.",
    health: "Active — significant political influence among ultra-conservatives.",
    powerScore: 32,
    status: "active",
    note: "Lost the 2024 presidential election to Pezeshkian. His faction remains powerful within the IRGC and conservative clerical establishment."
  },
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
        {briefing.summary && (
          <div className="briefing-section">
            <div className="briefing-label">📋 Executive Summary</div>
            <div className="briefing-text">{briefing.summary}</div>
          </div>
        )}
        {briefing.situation_overview && (
          <div className="briefing-section">
            <div className="briefing-label">🌍 Situation Overview</div>
            <div className="briefing-text">{briefing.situation_overview}</div>
          </div>
        )}
        <div className="briefing-grid">
          {briefing.ecosoc_impact && (
            <div className="briefing-box">
              <div className="briefing-label">🌐 ECOSOC Impact</div>
              <div className="briefing-text">{briefing.ecosoc_impact}</div>
            </div>
          )}
          {briefing.sanctions_update && (
            <div className="briefing-box">
              <div className="briefing-label">🔒 Sanctions Update</div>
              <div className="briefing-text">{briefing.sanctions_update}</div>
            </div>
          )}
          {briefing.military_update && (
            <div className="briefing-box">
              <div className="briefing-label">💣 Military Update</div>
              <div className="briefing-text">{briefing.military_update}</div>
            </div>
          )}
          {briefing.leadership_crisis && (
            <div className="briefing-box">
              <div className="briefing-label">👤 Leadership Crisis</div>
              <div className="briefing-text">{briefing.leadership_crisis}</div>
            </div>
          )}
        </div>
        {briefing.talking_points?.length > 0 && (
          <div className="briefing-section">
            <div className="briefing-label">🗣️ Talking Points</div>
            <ul className="briefing-points">{briefing.talking_points.map((p, i) => <li key={i}>{p}</li>)}</ul>
          </div>
        )}
        {briefing.counter_arguments?.length > 0 && (
          <div className="briefing-section">
            <div className="briefing-label">⚔️ Counter-Arguments</div>
            <ul className="briefing-points">{briefing.counter_arguments.map((p, i) => <li key={i}>{p}</li>)}</ul>
          </div>
        )}
        {briefing.watch_out_for && (
          <div className="briefing-section">
            <div className="briefing-label" style={{ color: '#ff9999' }}>⚠️ Watch Out For</div>
            <div className="briefing-text">{briefing.watch_out_for}</div>
          </div>
        )}
        {briefing.recommended_actions?.length > 0 && (
          <div className="briefing-section">
            <div className="briefing-label" style={{ color: '#90ee90' }}>✅ Recommended Actions</div>
            <ul className="briefing-points">{briefing.recommended_actions.map((p, i) => <li key={i}>{p}</li>)}</ul>
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

// ─── CHATBOT ─────────────────────────────────────────────────────────────────

const SUGGESTED_QUESTIONS = [
  "What are Iran's strongest arguments in ECOSOC?",
  "How do I respond to attacks on Iran's human rights record?",
  "Explain the JCPOA snapback mechanism",
  "What happened to Khamenei?",
  "How do I write a resolution as Iran?",
  "What is a Point of Order?",
  "Who are Iran's allies in the UN?",
  "What is the Axis of Resistance?",
]

function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your Iran MUN research assistant. I know everything about Iran's position at ECOSOC, MUN procedures, and current events. What do you need help with?"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open])

  const sendMessage = async (text) => {
    const userText = text || input.trim()
    if (!userText || loading) return

    setShowSuggestions(false)
    setInput('')
    setLoading(true)

    const newMessages = [...messages, { role: 'user', content: userText }]
    setMessages(newMessages)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply || data.error || 'Something went wrong.'
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Connection error. Please try again.'
      }])
    } finally {
      setLoading(false)
    }
  }

  const formatMessage = (text) => {
    // Convert **bold** to bold spans and bullet points
    const lines = text.split('\n')
    return lines.map((line, i) => {
      const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('• ')
      const cleaned = line
        .replace(/^[-•]\s+/, '')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>’)
      return (
        <div key={i} style={{
          display: 'flex',
          gap: isBullet ? 8 : 0,
          marginBottom: line.trim() ? 4 : 2,
          paddingLeft: isBullet ? 4 : 0
        }}>
          {isBullet && <span style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 1 }}>→</span>}
          <span dangerouslySetInnerHTML={{ __html: cleaned }} />
        </div>
      )
    })
  }

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        className="chat-fab"
        onClick={() => setOpen(o => !o)}
        title="Ask Iran MUN Assistant"
      >
        {open ? '✕' : '💬'}
        {!open && <span className="chat-fab-label">MUN Assistant</span>}
      </button>

      {/* CHAT WINDOW */}
      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div>
              <div className="chat-header-title">🇮🇷 Iran MUN Assistant</div>
              <div className="chat-header-sub">Powered by Groq AI — Ask me anything</div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role}`}>
                {msg.role === 'assistant' && (
                  <div className="chat-avatar">🤖</div>
                )}
                <div className="chat-bubble">
                  {formatMessage(msg.content)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-msg assistant">
                <div className="chat-avatar">🤖</div>
                <div className="chat-bubble chat-typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            {showSuggestions && (
              <div className="chat-suggestions">
                <div className="chat-suggestions-label">Suggested questions:</div>
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button key={i} className="chat-suggestion" onClick={() => sendMessage(q)}>
                    {q}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-row">
            <input
              className="chat-input"
              type="text"
              placeholder="Ask about Iran, ECOSOC, MUN procedures..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              disabled={loading}
            />
            <button
              className="chat-send"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// ─── NAV BAR ─────────────────────────────────────────────────────────────────

function NavBar() {
  const [active, setActive] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean)
      let current = ''
      sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 120) current = section.id
      })
      setActive(current)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMenuOpen(false)
  }

  return (
    <nav className="nav-bar">
      <div className="nav-inner">
        <div className="nav-brand">🇮🇷 Iran MUN</div>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {NAV_SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              className={`nav-link ${active === id ? 'active' : ''}`}
              onClick={() => scrollTo(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  )
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export default function Home({ dynamic, generatedAt, user, logout }) {
  const d = dynamic || DEFAULT_DYNAMIC

  // Role checks
  const isAdmin = user?.role === 'admin'
  const isDelegate = user?.role === 'delegate' || isAdmin
  const canChat = isDelegate
  const canBriefing = isAdmin
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

        {/* CHATBOT — delegate and admin only */}
        {canChat && <Chatbot />}

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

        {/* NAV BAR */}
        <NavBar />

        {/* USER BAR */}
        {user && (
          <div className="user-bar">
            <span className="user-bar-name">
              👤 {user.name || user.username}
              <span className={`user-role-badge role-${user.role}`}>{user.role}</span>
            </span>
            <button className="user-logout" onClick={logout}>Sign Out</button>
          </div>
        )}

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


        {/* ── SECTION 1: MUN PROCEDURES (moved to top) ── */}
        <div id="procedures">
        <SectionDivider emoji="📜" title="Section 1 — MUN Procedures and Terminology" />
        <div className="main">

          <Card emoji="🎙️" title="Points" fullWidth>
            <table className="data-table">
              <thead><tr><th>Point</th><th>What It Means</th><th>When To Use It</th><th>Can Be Interrupted?</th></tr></thead>
              <tbody>
                <tr>
                  <td>📢 Point of Personal Privilege</td>
                  <td>A delegate is experiencing a personal discomfort that prevents them from fully participating — cannot hear, room too hot, microphone not working, etc.</td>
                  <td>When you genuinely cannot hear the speaker or there is a physical issue. Not to be abused — it interrupts the speaker and the Chair will notice if used frivolously.</td>
                  <td>Yes — can interrupt a speaker</td>
                </tr>
                <tr>
                  <td>⚖️ Point of Order</td>
                  <td>A delegate believes the Chair or another delegate has made a procedural error — the rules of procedure are not being followed correctly.</td>
                  <td>When the Chair misapplies a rule, miscounts a vote, or the committee strays from proper procedure. Not for substantive disagreements — only procedural ones.</td>
                  <td>Yes — can interrupt a speaker</td>
                </tr>
                <tr>
                  <td>ℹ️ Point of Information (to the Chair)</td>
                  <td>A delegate has a question about procedure directed at the Chair.</td>
                  <td>When you are unclear about how a rule works or what the current procedure is. The Chair answers.</td>
                  <td>No — cannot interrupt a speaker</td>
                </tr>
                <tr>
                  <td>❓ Point of Information (to the Speaker)</td>
                  <td>A delegate wishes to ask a question of the delegate currently speaking, subject to that delegate’s consent.</td>
                  <td>After a speech, if the speaker yields to points of information. You ask a direct question — usually to challenge or clarify their argument.</td>
                  <td>No — only after the speech</td>
                </tr>
                <tr>
                  <td>🔍 Point of Inquiry</td>
                  <td>Used in some MUN conferences as an alternative name for a question directed at the Chair about procedure.</td>
                  <td>Same as Point of Information to the Chair — varies by conference rules. Always check your specific conference’s rules of procedure.</td>
                  <td>No</td>
                </tr>
              </tbody>
            </table>
          </Card>

          <Card emoji="🗳️" title="Motions">
            <table className="data-table">
              <thead><tr><th>Motion</th><th>What It Does</th></tr></thead>
              <tbody>
                <tr><td>📋 Motion to Open Debate</td><td>Formally begins debate on the agenda topic. Usually the first motion of any committee session.</td></tr>
                <tr><td>🔇 Motion to Table / Postpone</td><td>Suspends or delays debate on the current topic. In some conferences "table" means to set aside indefinitely; in others it means to bring something forward. Always check your conference’s definition.</td></tr>
                <tr><td>🔁 Motion to Reconsider</td><td>Requests that a previously passed resolution or motion be voted on again. Requires a second and a majority vote.</td></tr>
                <tr><td>🚪 Motion to Close Debate</td><td>Ends the speakers list and moves the committee to vote on resolutions. Requires a second and passes by a two-thirds majority in most conferences.</td></tr>
                <tr><td>⏸️ Motion to Suspend Debate</td><td>Temporarily pauses formal debate — typically to move into an unmoderated caucus or take a break. Requires time and purpose to be stated.</td></tr>
                <tr><td>⏭️ Motion to Adjourn</td><td>Ends the committee session entirely for the day. Requires a majority vote.</td></tr>
                <tr><td>🔓 Motion to Reopen Debate</td><td>Brings a topic back onto the floor after debate was closed. Requires a second and a majority.</td></tr>
              </tbody>
            </table>
          </Card>

          <Card emoji="💬" title="Caucuses">
            <div className="box highlight" style={{"marginBottom": "12px"}}>
              <div className="box-title">🎤 Moderated Caucus</div>
              <p>Formal but faster-paced discussion. The Chair calls on delegates one at a time for short speeches (typically 30–60 seconds each). Used to debate specific sub-topics within the main agenda. A delegate motions for a moderated caucus by stating the total time and speaking time per delegate.</p>
            </div>
            <div className="box green" style={{"marginBottom": "12px"}}>
              <div className="box-title">🤝 Unmoderated Caucus</div>
              <p>Informal networking time. Delegates leave their seats and talk freely to negotiate, build blocs, and draft resolutions. The Chair does not moderate. Motion must include a total time. This is where most of the real diplomacy happens — use it aggressively.</p>
            </div>
            <div className="box blue">
              <div className="box-title">📝 Consultation of the Whole</div>
              <p>A structured form of informal debate used in some UN-style conferences. Less common but similar to an unmoderated caucus with slightly more structure. Check your specific conference rules.</p>
            </div>
          </Card>

          <Card emoji="📝" title="Speeches and Yields">
            <div className="box blue" style={{"marginBottom": "12px"}}>
              <div className="box-title">⏱️ Speakers List</div>
              <p>The formal queue of delegates who wish to speak. Add yourself by raising your placard when the Chair asks. Each speaker gets a set time (typically 60–90 seconds). You can yield your remaining time at the end of your speech.</p>
            </div>
            <div className="box highlight" style={{"marginBottom": "12px"}}>
              <div className="box-title">🔄 Yield to Another Delegate</div>
              <p>At the end of your speech, if you have time remaining, you can yield it to a specific delegate — they then use your remaining time. Used tactically to give allies more speaking time.</p>
            </div>
            <div className="box green" style={{"marginBottom": "12px"}}>
              <div className="box-title">❓ Yield to Points of Information</div>
              <p>You open yourself to questions from other delegates after your speech. Risky if your position is weak — but powerful if you are confident. Other delegates raise their placards and the Chair selects who may question you.</p>
            </div>
            <div className="box green">
              <div className="box-title">🪑 Yield to the Chair</div>
              <p>You give your remaining time back to the Chair — no questions, no other delegate speaks. The safest option if you have nothing else to add or do not want to be questioned.</p>
            </div>
          </Card>

          <Card emoji="📄" title="Resolution Writing" fullWidth>
            <table className="data-table">
              <thead><tr><th>Element</th><th>What It Is</th><th>Examples</th></tr></thead>
              <tbody>
                <tr>
                  <td>🏷️ Signatories / Sponsors</td>
                  <td>Sponsors wrote the resolution and fully support it. Signatories only want it debated — they may not vote for it.</td>
                  <td>Iran would be a sponsor of resolutions condemning sanctions. It might be a signatory on resolutions about development financing.</td>
                </tr>
                <tr>
                  <td>📌 Preambulatory Clauses</td>
                  <td>The "whereas" statements at the top — they establish context, recall past resolutions, and acknowledge facts. They do not create action.</td>
                  <td>Recalling, Reaffirming, Recognizing, Noting, Deeply concerned, Emphasizing, Bearing in mind, Guided by</td>
                </tr>
                <tr>
                  <td>⚡ Operative Clauses</td>
                  <td>The action items — what the committee actually decides, calls for, or urges.</td>
                  <td>Calls upon, Urges, Encourages, Requests, Demands, Condemns, Affirms, Decides, Recommends, Invites</td>
                </tr>
                <tr>
                  <td>✏️ Amendments</td>
                  <td>Changes to a draft resolution before it is voted on. Friendly amendments are accepted by sponsors. Unfriendly amendments go to a vote.</td>
                  <td>Opposing delegates will attempt to amend Iran’s draft resolutions to add human rights language — be prepared to argue against unfriendly amendments.</td>
                </tr>
              </tbody>
            </table>
          </Card>

          <Card emoji="🗺️" title="Voting Procedure">
            <div className="box green" style={{"marginBottom": "12px"}}>
              <div className="box-title">✅ Yes / For</div>
              <p>You support the resolution or motion as written.</p>
            </div>
            <div className="box alert" style={{"marginBottom": "12px"}}>
              <div className="box-title">❌ No / Against</div>
              <p>You oppose the resolution or motion.</p>
            </div>
            <div className="box highlight" style={{"marginBottom": "12px"}}>
              <div className="box-title">➖ Abstain</div>
              <p>You neither support nor oppose. Abstentions count toward quorum but not toward the majority needed to pass. Iran often abstains on resolutions it disagrees with procedurally but does not want to formally oppose.</p>
            </div>
            <div className="box blue">
              <div className="box-title">🔒 Right of Reply</div>
              <p>If a delegate makes a personal attack or directly misrepresents your country’s position, you may request a Right of Reply from the Chair. You get a brief response — typically 30 seconds. Use it sparingly. As Iran, expect to need this frequently.</p>
            </div>
          </Card>

          <Card emoji="🇮🇷" title="Iran-Specific MUN Tactics" fullWidth>
            <div className="three-col">
              <div className="mini-card">
                <div className="mini-card-title">🎤 Opening Speech</div>
                <p>Lead with Iran’s civilizational identity and sovereign dignity — not defensiveness. Open with a reference to the Cyrus Cylinder as the world’s first human rights declaration. Frame Iran as a nation that invented human rights being lectured by states that violate them daily.</p>
              </div>
              <div className="mini-card">
                <div className="mini-card-title">🤝 Bloc Building</div>
                <p>In unmoderated caucuses, approach G-77 delegates first — particularly African and Latin American delegations. Lead with shared grievances about Western economic coercion and double standards. Build the anti-sanctions coalition first, then bring Iran’s arguments into it.</p>
              </div>
              <div className="mini-card">
                <div className="mini-card-title">📝 Draft Resolutions</div>
                <p>Draft resolutions focused on development financing, the right to peaceful nuclear energy, and the illegality of unilateral coercive measures. These attract G-77 co-sponsors. Avoid drafts that require defending Iran’s domestic record.</p>
              </div>
              <div className="mini-card">
                <div className="mini-card-title">⚔️ Handling Attacks</div>
                <p>When Western delegates attack Iran’s human rights record, do not deny — redirect. "The delegation of Iran welcomes a consistent application of human rights standards to all Member States." Then request equal scrutiny of the attacking delegation’s own record.</p>
              </div>
              <div className="mini-card">
                <div className="mini-card-title">🔄 Right of Reply</div>
                <p>Use the Right of Reply strategically — not every time, only when it genuinely advances your narrative. Overusing it makes you look defensive. Silence can be more powerful when you have already made your position clear.</p>
              </div>
              <div className="mini-card">
                <div className="mini-card-title">🏆 Winning as Iran</div>
                <p>Victory for Iran in ECOSOC is demonstrating that the multilateral system applies its rules selectively. If you can get developing nations to abstain rather than vote against Iran, and force Western delegates onto the defensive on double standards — that is a win.</p>
              </div>
            </div>
          </Card>

        </div>
        </div>

        {/* ── SECTION 2: LIVE INTELLIGENCE ── */}
        <div id="live-intelligence">
        <SectionDivider emoji="🔴" title="Section 2 — Live Intelligence (Auto-Updated)" />
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
              <div className="box-title">Iran’s Legal Argument</div>
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
              <div className="box-title">Iran’s Position</div>
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

          {/* AI BRIEFING — admin only */}
          {canBriefing ? (
            <div className="full-width">
              <AIBriefing briefing={briefing} loading={briefingLoading} />
            </div>
          ) : (
            <div className="full-width">
              <div className="access-blocked">
                🔒 AI Intelligence Briefing is available to <strong>Admin</strong> users only.
              </div>
            </div>
          )}

        </div>

        {/* UPDATE PANEL — role based */}
        <div className="update-panel">
          <span className="update-label">TEAM CONTROLS</span>
          <button className="update-btn" onClick={fetchNews} disabled={newsLoading}>
            {newsLoading ? '...' : '🔄 Refresh News'}
          </button>
          {canBriefing && (
            <>
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
            </>
          )}
          {updateStatus && <span className="update-status">{updateStatus}</span>}
          <span className="fetched-at">Auto-updates daily at 6:00 AM UTC</span>
        </div>

        </div>

        {/* ── SECTION 2: GEOGRAPHY ── */}
        <div id="geography">
        <SectionDivider emoji="📍" title="Section 2 — Geography and Environment" />
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
              Approximately 20% of the world’s oil and 30% of global LNG passes through this chokepoint. Iran’s ability to threaten closure is its most powerful geopolitical lever. In March 2026, attacks on Gulf energy infrastructure pushed Brent crude above $119/barrel.
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
                <tr><td>🕌 Mashhad</td><td>3.4M</td><td>Iran’s largest religious city; shrine of Imam Reza</td><td>Razavi Khorasan</td></tr>
                <tr><td>🌉 Isfahan</td><td>2.3M</td><td>Historic Safavid capital; UNESCO-listed Naqsh-e Jahan Square</td><td>Isfahan</td></tr>
                <tr><td>🏔️ Tabriz</td><td>1.7M</td><td>Largest Azerbaijani-speaking city; major trade hub</td><td>East Azerbaijan</td></tr>
                <tr><td>🌹 Shiraz</td><td>1.6M</td><td>Cultural heartland; near Persepolis; home of poets Hafez and Sa’di</td><td>Fars</td></tr>
                <tr><td>⛽ Ahvaz</td><td>1.3M</td><td>Centre of Iran’s oil industry</td><td>Khuzestan</td></tr>
                <tr><td>🕍 Qom</td><td>1.2M</td><td>Most important centre of Shia Islamic scholarship</td><td>Qom</td></tr>
                <tr><td>🏺 Yazd</td><td>530,000</td><td>UNESCO World Heritage city; ancient Zoroastrian community</td><td>Yazd</td></tr>
              </tbody>
            </table>
          </Card>
        </div>

        </div>

        {/* ── SECTION 3: PEOPLE ── */}
        <div id="people">
        <SectionDivider emoji="👥" title="Section 3 — People, Society and Culture" />
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
          <Card emoji="🕌" title="Religion and Society">
            <InfoRow label="State Religion" value="Twelver Shia Islam" />
            <InfoRow label="Shia Muslims" value="~90–95% of population" />
            <InfoRow label="Sunni Muslims" value="~5–8% (Kurdish, Balochi communities)" note />
            <InfoRow label="Other Faiths" value="Zoroastrian, Jewish, Christian, Baha'i (persecuted)" note />
            <InfoRow label="Literacy Rate" value="~86%" />
            <InfoRow label="Life Expectancy" value="~77 years" />
            <InfoRow label="Executions" value="Consistently top 3 globally" note />
            <InfoRow label="Press Freedom" value="Near bottom globally; state controls most media" note />
            <Box type="alert" title="⚠️ Women — 2026">
              Women represent 60% of natural science university students yet face mandatory hijab and restricted legal rights. Mahsa Amini’s death in Sept 2022 triggered the largest protests since 1979. The January 2026 massacre killed thousands of protesters.
            </Box>
          </Card>
        </div>

        </div>

        {/* ── SECTION 4: GOVERNMENT ── */}
        <div id="government">
        <SectionDivider emoji="🏛️" title="Section 4 — Government and Political Structure" />
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
          <Card emoji="💣" title="Military and Security">
            <Box type="blue" title="🪖 Artesh — Conventional Military">
              Ranked 16th globally (Global Firepower Index 2026). Significant capabilities degraded by Israeli strikes in June 2025.
            </Box>
            <Box type="alert" title="🛡️ IRGC">
              Controls the nuclear programme, all proxy networks, internal intelligence, and foreign covert operations. Designated a terrorist organisation by the United States.
            </Box>
            <Box type="highlight" title="🕸️ Axis of Resistance">
              Hezbollah (Lebanon), Hamas (Gaza), Houthis (Yemen), PMF militias (Iraq). All significantly degraded since 2023. Syria’s Assad fell in late 2024.
            </Box>
          </Card>
        </div>

        </div>

        </div>

        {/* ── SECTION: POWER FIGURES ── */}
        <div id="power-figures">
        <SectionDivider emoji="👑" title="Top 30 Political Figures — Ranked by Power" />
        <div className="main">
          <Card emoji="ℹ️" title="About This Ranking" fullWidth>
            <p className="prose">Figures are ranked by their effective political power as of March 2026 — accounting for institutional position, IRGC alignment, clerical authority, factional support, and actual decision-making influence. Formal titles do not always reflect real power in the Islamic Republic. The assassination of Supreme Leader Khamenei on February 28, 2026 has fundamentally reshuffled this ranking — the succession crisis means power is currently concentrated in the IRGC and the Assembly of Experts.</p>
          </Card>

          <div className="full-width">
            <div className="power-table-wrapper">
              <table className="power-table">
                <thead>
                  <tr>
                    <th style={{width: 50}}>Rank</th>
                    <th style={{width: 180}}>Name</th>
                    <th style={{width: 160}}>Position</th>
                    <th style={{width: 120}}>Institution</th>
                    <th style={{width: 100}}>Religion</th>
                    <th>Power and Influence</th>
                    <th style={{width: 130}}>Health Status</th>
                    <th style={{width: 80}}>Power</th>
                  </tr>
                </thead>
                <tbody>
                  {POWER_FIGURES.map((f) => (
                    <tr key={f.rank} className={`power-row status-${f.status}`}>
                      <td className="rank-cell">
                        <span className={`rank-badge ${f.rank <= 3 ? 'top3' : f.rank <= 10 ? 'top10' : ''}`}>
                          {f.rank}
                        </span>
                      </td>
                      <td>
                        <div className="figure-name">{f.name}</div>
                        <div className="figure-farsi">{f.nameFarsi}</div>
                      </td>
                      <td>
                        <div className="figure-position">{f.position}</div>
                      </td>
                      <td>
                        <div style={{fontSize: 11, color: 'var(--mid)'}}>{f.institution}</div>
                      </td>
                      <td>
                        <div style={{fontSize: 11, color: 'var(--mid)'}}>{f.religion}</div>
                      </td>
                      <td>
                        <div style={{fontSize: 12, color: 'var(--mid)', lineHeight: 1.5}}>{f.power}</div>
                        {f.note && <div style={{fontSize: 11, color: 'var(--light)', fontStyle: 'italic', marginTop: 4}}>→ {f.note}</div>}
                      </td>
                      <td>
                        <span className={`health-badge health-${f.status}`}>
                          {f.status === 'deceased' ? '💀 Deceased' : f.status === 'restricted' ? '🔒 Restricted' : '✅ Active'}
                        </span>
                        <div style={{fontSize: 11, color: 'var(--light)', marginTop: 4, lineHeight: 1.4}}>{f.health}</div>
                      </td>
                      <td className="power-score-cell">
                        {f.powerScore > 0 ? (
                          <>
                            <div className="power-score-num">{f.powerScore}</div>
                            <div className="power-bar-outer">
                              <div className="power-bar-inner" style={{width: `${f.powerScore}%`, background: f.powerScore >= 80 ? 'var(--red)' : f.powerScore >= 50 ? 'var(--gold)' : 'var(--green)'}}></div>
                            </div>
                          </>
                        ) : (
                          <div style={{fontSize: 11, color: 'var(--light)'}}>N/A</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        </div>

        {/* ── SECTION: HISTORY ── */}
        <div id="history">
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

        </div>

        {/* ── SECTION 6: ECOSOC ── */}
        <div id="ecosoc">
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
              ECOSOC has inherent authority to remove a member from a subsidiary body whose conduct is fundamentally incompatible with that body’s mandate. A state that kills women for removing their hijab cannot sit on the commission charged with advancing women’s rights.
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
              Consistently aligns with G-77 and Non-Aligned Movement. Finds allies across Africa, Latin America, and Asia who share structural grievances — even if they distance themselves from Iran’s governance record.
            </Box>
            <Box type="alert" title="⚠️ Structural Weakness">
              Iran’s domestic record provides opponents with genuine grounds for action. The January 2026 massacre further eroded whatever sympathy Iran had cultivated. It can delay and delegitimise but cannot prevent accountability when Western states have the votes and will to act.
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
                <tr><td>🇸🇦 Saudi Arabia</td><td>Regional rival</td><td>China-brokered normalisation (2023); Iran’s March 2026 Gulf attacks threaten this</td></tr>
                <tr><td>🇬🇧🇫🇷🇩🇪 E3 Europe</td><td>Formerly JCPOA partners</td><td>Triggered snapback sanctions; relations at historic low</td></tr>
              </tbody>
            </table>
          </Card>
        </div>

        </div>

        {/* ── SECTION 7: MUN TOOLKIT ── */}
        <div id="toolkit">
        <SectionDivider emoji="🎤" title="Section 7 — MUN Delegate Toolkit" />
        <div className="main">
          <Card emoji="🗣️" title="Core Arguments">
            <Box type="green" title="Argument 1 — Sovereignty">The UN Charter’s principle of sovereign equality is non-negotiable. The CSW removal and the sanctions snapback both represent the weaponisation of institutional procedure by states pursuing geopolitical agendas.</Box>
            <Box type="green" title="Argument 2 — Double Standards">No comparable accountability has been applied to states conducting illegal military operations. Challenge this body to explain the inconsistency.</Box>
            <Box type="green" title="Argument 3 — Collective Punishment">Sanctions targeting Iran’s Central Bank and severing international banking access constitute collective punishment of 92 million civilians.</Box>
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

        </div>

        {/* ── SECTION 3: AI BRIEFING ── */}
        <div id="ai-briefing">
        <SectionDivider emoji="🤖" title="Section 3 — AI Intelligence Briefing (Live)" />
        <div className="main">
          <div className="full-width">
            <AIBriefing briefing={briefing} loading={briefingLoading} />
          </div>
          <div className="full-width" style={{ background: 'var(--dark)', padding: '16px 20px', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: '#666', letterSpacing: '0.5px' }}>GENERATE BRIEFING</span>
            <input
              className="update-input"
              type="password"
              placeholder="Team password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generateBriefing()}
              style={{ width: 160 }}
            />
            <button className="update-btn" onClick={generateBriefing} disabled={briefingLoading}>
              {briefingLoading ? '⏳ Generating...' : '🤖 Generate AI Briefing'}
            </button>
            {updateStatus && <span style={{ fontSize: 12, color: 'var(--light)' }}>{updateStatus}</span>}
          </div>
        </div>
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
