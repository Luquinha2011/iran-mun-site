// pages/api/update.js
// AI briefing using Groq (free) instead of Anthropic

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { password, articles } = req.body

  if (password !== process.env.UPDATE_PASSWORD)
    return res.status(401).json({ error: 'Incorrect password' })

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'GROQ_API_KEY not configured' })

  const newsText = articles
    .map(a => `- [${a.source}] ${a.title}: ${a.description || ''}`)
    .join('\n')

  const prompt = `You are a senior MUN research analyst. Based on the following recent news headlines about Iran, write a concise intelligence briefing for a MUN team preparing to represent Iran at ECOSOC.

RECENT NEWS:
${newsText}

Write the briefing in this exact JSON format with no markdown or code fences:
{
  "summary": "2-3 sentence executive summary of the most important developments",
  "ecosoc_impact": "How these developments affect Iran's position and strategy in ECOSOC specifically",
  "sanctions_update": "Any sanctions-related developments and their implications",
  "military_update": "Any military or conflict developments relevant to MUN positioning",
  "talking_points": ["point 1", "point 2", "point 3"],
  "watch_out_for": "What opposing delegates will likely attack Iran on based on this news",
  "last_updated": "${new Date().toISOString()}"
}`

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        max_tokens: 1000,
        messages: [
          { role: 'system', content: 'You are a senior MUN research analyst. Always respond with valid JSON only, no markdown, no code fences.' },
          { role: 'user', content: prompt }
        ],
      }),
    })

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content || ''

    let briefing
    try {
      briefing = JSON.parse(text)
    } catch {
      briefing = { summary: text, last_updated: new Date().toISOString() }
    }

    return res.status(200).json({ briefing })
  } catch (err) {
    return res.status(500).json({ error: 'AI update failed', detail: err.message })
  }
}
