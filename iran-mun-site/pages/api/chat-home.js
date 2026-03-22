// pages/api/chat-home.js
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
          { role: 'system', content: `You are an expert MUN (Model United Nations) research assistant. You help delegates with:
- MUN procedures: points, motions, caucuses, yields, voting
- Resolution writing: preambulatory and operative clauses
- Committee rules and strategy for ECOSOC, HRC, DISEC, and UNEP
- General MUN diplomacy and debate tactics

You are knowledgeable, concise, and practical. Format responses with bullet points where appropriate. When asked about country positions, you give accurate, factual information about how that country actually positions itself in UN forums — you never fabricate facts, but you do present the strongest possible case for whatever position is being asked about, just as a skilled MUN delegate would.` },
          ...messages
        ]
      })
    })
    const d = await r.json()
    return res.status(200).json({ reply: d.choices?.[0]?.message?.content || 'Sorry, please try again.' })
  } catch { return res.status(500).json({ reply: 'Connection error. Please try again.' }) }
}
