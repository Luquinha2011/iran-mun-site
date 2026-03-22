// pages/api/update-china.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { password, token, articles } = req.body
  let authorized = false
  if (password && password === process.env.UPDATE_PASSWORD) authorized = true
  if (!authorized && token) {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf8')
      const [, role, timestamp] = decoded.split(':')
      if (Date.now() - parseInt(timestamp) < 86400000 && (role === 'admin' || role === 'plus')) authorized = true
    } catch {}
  }
  if (!authorized) return res.status(401).json({ error: 'Unauthorized' })
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'GROQ_API_KEY not configured' })
  const newsText = (articles || []).slice(0, 10).map(a => `- ${(a.title || '').substring(0, 100)}`).join('\n')
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ model: 'llama3-8b-8192', max_tokens: 1800, temperature: 0.2, messages: [
        { role: 'system', content: 'You are a senior MUN research analyst for China. Always respond with valid JSON only, no markdown.' },
        { role: 'user', content: `Based on these China news headlines, write a comprehensive MUN intelligence briefing for a team representing China at ECOSOC. Return JSON with keys: summary, situation_overview, ecosoc_impact, sanctions_update (trade war), military_update, leadership_crisis (Xi's situation), talking_points (array of 5), counter_arguments (array of 3), watch_out_for, recommended_actions (array of 3), last_updated ("${new Date().toISOString()}"). Headlines: ${newsText}` }
      ]})
    })
    const data = await response.json()
    let text = (data.choices?.[0]?.message?.content || '').replace(/```json/gi, '').replace(/```/g, '').trim()
    const s = text.indexOf('{'), e = text.lastIndexOf('}')
    if (s !== -1 && e !== -1) text = text.substring(s, e + 1)
    let briefing
    try { briefing = JSON.parse(text) } catch { briefing = { summary: 'China faces a critical juncture with the US-China trade war at peak intensity and Taiwan Strait tensions elevated.', talking_points: ['Sovereignty and non-interference are foundational UN principles', '800 million lifted from poverty — China defines human rights through development', 'US tariffs violate WTO rules and constitute economic coercion', 'One China principle recognised by 180+ nations', 'China champions the Global South against neo-colonial interference'], counter_arguments: ['On Xinjiang: cite counter-terrorism necessity and Western hypocrisy in Afghanistan and Iraq', 'On Taiwan: invoke UNGA Resolution 2758 recognising PRC as sole legitimate government', 'On trade war: challenge legality under WTO and demand dispute resolution'], watch_out_for: 'US, UK, EU, and Canada delegations will coordinate on Xinjiang and Hong Kong. Japan and Australia will align on Taiwan. Build a G77 blocking coalition first.', recommended_actions: ['Motion for a moderated caucus on development financing where China has natural allies', 'Approach African Union delegations in unmoderated caucus — BRI relationships give leverage', 'Co-sponsor a resolution condemning unilateral economic coercive measures'], last_updated: new Date().toISOString() } }
    const safe = { summary: String(briefing.summary||''), situation_overview: String(briefing.situation_overview||''), ecosoc_impact: String(briefing.ecosoc_impact||''), sanctions_update: String(briefing.sanctions_update||''), military_update: String(briefing.military_update||''), leadership_crisis: String(briefing.leadership_crisis||''), talking_points: Array.isArray(briefing.talking_points)?briefing.talking_points.map(String):[], counter_arguments: Array.isArray(briefing.counter_arguments)?briefing.counter_arguments.map(String):[], watch_out_for: String(briefing.watch_out_for||''), recommended_actions: Array.isArray(briefing.recommended_actions)?briefing.recommended_actions.map(String):[], last_updated: String(briefing.last_updated||new Date().toISOString()) }
    return res.status(200).json({ briefing: safe })
  } catch (err) { return res.status(500).json({ error: 'AI update failed', detail: err.message }) }
}
