// pages/index.js — UN/MUN Home Page
import { useState } from 'react'
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
  {
    name: "HRC",
    full: "Human Rights Council",
    desc: "Promotes and protects human rights around the globe. Addresses situations of human rights violations and makes recommendations. 47 member states elected by the General Assembly.",
    color: "#e67e22"
  },
  {
    name: "ECOSOC",
    full: "Economic and Social Council",
    desc: "Coordinates the economic, social, and related work of the UN and its specialised agencies. 54 rotating member states.",
    color: "#1a6fa0"
  },
  {
    name: "DISEC",
    full: "Disarmament and International Security Committee",
    desc: "First Committee of the General Assembly. Deals with disarmament, global challenges, and threats to international peace and security.",
    color: "#1a5c38"
  },
  {
    name: "UNEP",
    full: "United Nations Environment Programme",
    desc: "The leading global environmental authority. Sets the global environmental agenda and promotes sustainable development within the UN system.",
    color: "#27ae60"
  },
]

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

        {/* UN HEADER */}
        <div style={{
          background: 'linear-gradient(135deg, #009EDB 0%, #0077b6 100%)',
          color: 'white', padding: '48px 40px 40px',
          position: 'relative', overflow: 'hidden'
        }}>
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
                fontSize: 12, fontWeight: 600, fontFamily: "'Source Sans 3', sans-serif",
                letterSpacing: 0.3,
              }}
              onClick={() => {
                const ids = ['home', 'procedures', 'resolutions', 'committees', 'countries']
                document.getElementById(ids[i])?.scrollIntoView({ behavior: 'smooth' })
              }}
              >{item}</button>
            ))}
            {user?.role === 'admin' && (
              <button
                onClick={() => router.push('/admin')}
                style={{
                  marginLeft: 'auto',
                  background: 'rgba(201,168,76,0.2)',
                  border: '1px solid rgba(201,168,76,0.5)',
                  color: '#c9a84c',
                  padding: '6px 14px',
                  borderRadius: 3,
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: "'Source Sans 3', sans-serif",
                  letterSpacing: 0.3,
                }}>
                ⚙️ Admin
              </button>
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
              <div style={{ background: 'white', border: '1px solid #dde3ea', borderRadius: 4, padding: 20, borderTop: '3px solid #c9a84c', cursor: 'pointer' }}
                onClick={() => router.push('/iran')}>
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
            <div style={{ background: '#005f8e', color: '#7dd4f8', padding: '10px 20px', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', fontWeight: 700, borderRadius: '4px 4px 0 0' }}>
              📜 MUN Procedures
            </div>
            <div style={{ background: 'white', border: '1px solid #dde3ea', borderBottom: 'none' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid #dde3ea' }}>
                {MUN_PROCEDURES.map((cat, i) => (
                  <button key={i}
                    onClick={() => setActiveProc(i)}
                    style={{
                      flex: 1, padding: '12px 8px', border: 'none', cursor: 'pointer',
                      background: activeProc === i ? '#f0f8ff' : 'white',
                      borderBottom: activeProc === i ? '2px solid #009EDB' : '2px solid transparent',
                      fontSize: 13, fontWeight: 600, color: activeProc === i ? '#009EDB' : '#666',
                      fontFamily: "'Source Sans 3', sans-serif",
                    }}>
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
            <div style={{ background: '#005f8e', color: '#7dd4f8', padding: '10px 20px', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', fontWeight: 700, borderRadius: '4px 4px 0 0' }}>
              📄 Resolution Writing
            </div>
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
            <div style={{ background: '#005f8e', color: '#7dd4f8', padding: '10px 20px', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', fontWeight: 700, borderRadius: '4px 4px 0 0' }}>
              🌐 UN Committees Overview
            </div>
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
            <div style={{ background: '#005f8e', color: '#7dd4f8', padding: '10px 20px', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', fontWeight: 700, borderRadius: '4px 4px 0 0' }}>
              🗺️ Country Research Pages
            </div>
            <div style={{ background: 'white', border: '1px solid #dde3ea', padding: 24 }}>
              <div
                onClick={() => (user?.role === 'viewer') ? null : router.push('/iran')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 20,
                  padding: 20, border: '1px solid #e0d8cc', borderRadius: 4,
                  background: '#faf7f2', cursor: user?.role === 'viewer' ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s', maxWidth: 500,
                  opacity: user?.role === 'viewer' ? 0.6 : 1,
                }}
              >
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
                    {user?.role === 'viewer' ? (
                      <span style={{ background: '#f0f0f0', color: '#888', padding: '6px 14px', borderRadius: 3, fontSize: 12, fontWeight: 700 }}>🔒 Delegate Access Required</span>
                    ) : (
                      <span style={{ background: '#1a5c38', color: 'white', padding: '6px 14px', borderRadius: 3, fontSize: 12, fontWeight: 700 }}>→ Open Iran Research Page</span>
                    )}
                  </div>
                </div>
              </div>
              <div
                onClick={() => (user?.role === 'viewer') ? null : router.push('/china')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 20,
                  padding: 20, border: '1px solid #e8d8d8', borderRadius: 4,
                  background: '#fff8f8', cursor: user?.role === 'viewer' ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s', maxWidth: 500, marginTop: 12,
                  opacity: user?.role === 'viewer' ? 0.6 : 1,
                }}
              >
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
                    {user?.role === 'viewer' ? (
                      <span style={{ background: '#f0f0f0', color: '#888', padding: '6px 14px', borderRadius: 3, fontSize: 12, fontWeight: 700 }}>🔒 Delegate Access Required</span>
                    ) : (
                      <span style={{ background: '#cc0000', color: 'white', padding: '6px 14px', borderRadius: 3, fontSize: 12, fontWeight: 700 }}>→ Open China Research Page</span>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 14, padding: 14, background: '#f8fafc', border: '1px dashed #dde3ea', borderRadius: 4, fontSize: 12, color: '#999', fontStyle: 'italic' }}>
                More country pages coming soon.
              </div>
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
