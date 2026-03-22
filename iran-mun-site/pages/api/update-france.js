// pages/api/update-france.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { token, articles } = req.body
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8')
    const [, role] = decoded.split(':')
    if (role !== 'admin' && role !== 'plus') return res.status(403).json({ error: 'Plus or Admin only' })
  } catch { return res.status(401).json({ error: 'Invalid token' }) }
  const groqKey = process.env.GROQ_API_KEY
  if (!groqKey) return res.status(200).json({ error: 'AI not configured' })
  const newsText = (articles || []).map(a => `- ${a.title}`).join('\n')
  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqKey}` },
      body: JSON.stringify({
        model: 'llama3-8b-8192', max_tokens: 1500, temperature: 0.3,
        messages: [
          { role: 'system', content: 'You are a MUN intelligence analyst for France. Return only valid JSON.' },
          { role: 'user', content: `Based on these headlines, generate a France MUN intelligence briefing. Return JSON with: summary, situation_overview, ecosoc_impact, security_update, economy_update, leadership_update, talking_points (array), counter_arguments (array), watch_out_for, recommended_actions (array), last_updated. Headlines:\n${newsText}\n\nlast_updated: "${new Date().toLocaleString('en-GB')} UTC"` }
        ]
      })
    })
    const d = await r.json()
    let text = (d.choices?.[0]?.message?.content || '').replace(/```json/gi, '').replace(/```/g, '').trim()
    const s = text.indexOf('{'), e = text.lastIndexOf('}')
    if (s !== -1 && e !== -1) text = text.substring(s, e + 1)
    const briefing = JSON.parse(text)
    return res.status(200).json({ briefing })
  } catch { return res.status(500).json({ error: 'AI generation failed' }) }
}
