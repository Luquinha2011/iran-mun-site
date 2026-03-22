// pages/api/chat-nigeria.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { messages } = req.body
  const groqKey = process.env.GROQ_API_KEY
  if (!groqKey) return res.status(200).json({ reply: 'AI assistant is not configured.' })
  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqKey}` },
      body: JSON.stringify({
        model: 'llama3-8b-8192', max_tokens: 800, temperature: 0.7,
        messages: [
          { role: 'system', content: 'You are an expert MUN research assistant specialising in Nigeria. You help delegates prepare for ECOSOC, HRC, DISEC, and UNEP committees. You know Nigeria\'s foreign policy, domestic politics, security situation, and UN positions in depth. Be concise, accurate, and helpful. Format responses with bullet points where appropriate.' },
          ...messages
        ]
      })
    })
    const d = await r.json()
    return res.status(200).json({ reply: d.choices?.[0]?.message?.content || 'Sorry, please try again.' })
  } catch { return res.status(500).json({ reply: 'Connection error. Please try again.' }) }
}
