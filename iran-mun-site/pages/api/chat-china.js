// pages/api/chat-china.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { messages } = req.body
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'Messages array required' })
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return res.status(500).json({ reply: 'GROQ_API_KEY not configured in Vercel.' })
  const system = `You are an expert MUN research assistant for China at ECOSOC. You know: CCP structure, Xi Jinping's consolidation of power, Belt and Road Initiative, Taiwan crisis, Xinjiang/Uyghur situation, South China Sea disputes, US-China trade war, China's UN strategy (P5 veto, non-interference doctrine), Wolf Warrior diplomacy, Five Principles of Peaceful Coexistence, China's development-first human rights argument, MUN procedures. Help delegates prepare speeches, arguments, and tactics. Frame answers from China's perspective when asked for MUN advice. Be concise and use bullet points for lists.`
  const models = ['llama3-8b-8192', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768']
  for (const model of models) {
    try {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` }, body: JSON.stringify({ model, max_tokens: 500, temperature: 0.4, messages: [{ role: 'system', content: system }, ...messages.slice(-6)] }) })
      const d = await r.json()
      if (!r.ok) continue
      const reply = d.choices?.[0]?.message?.content
      if (reply) return res.status(200).json({ reply })
    } catch { continue }
  }
  return res.status(200).json({ reply: "Rate limited. Core China MUN arguments:\n- Sovereignty and non-interference\n- Development as primary human right\n- 800M lifted from poverty\n- One China principle (UNGA Res 2758)\n- Counter-terrorism in Xinjiang" })
}
