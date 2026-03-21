// pages/api/update.js
// AI briefing using Groq (free)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { password, articles } = req.body

  if (password !== process.env.UPDATE_PASSWORD)
    return res.status(401).json({ error: 'Incorrect password' })

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'GROQ_API_KEY not configured' })

  const newsText = (articles || [])
    .slice(0, 10)
    .map(a => `- ${a.title || ''}`)
    .join('\n')

  const prompt = `You are a MUN research analyst for Iran at ECOSOC. Based on these recent headlines, write a briefing. Respond ONLY with a JSON object, no other text, no markdown, no backticks.

HEADLINES:
${newsText}

JSON format:
{
  "summary": "2 sentence summary of key developments",
  "ecosoc_impact": "1-2 sentences on ECOSOC implications",
  "sanctions_update": "1-2 sentences on sanctions situation",
  "military_update": "1-2 sentences on military situation",
  "talking_points": ["talking point 1", "talking point 2", "talking point 3"],
  "watch_out_for": "1 sentence on what opposing delegates will attack",
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
        max_tokens: 800,
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content: 'You are a JSON-only API. You output raw JSON with no markdown, no backticks, no code fences, no explanation. Only valid JSON.'
          },
          { role: 'user', content: prompt }
        ],
      }),
    })

    const data = await response.json()
    let text = data.choices?.[0]?.message?.content || ''

    // Strip any markdown code fences if Groq adds them anyway
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim()

    // Find the JSON object within the response
    const jsonStart = text.indexOf('{')
    const jsonEnd = text.lastIndexOf('}')
    if (jsonStart !== -1 && jsonEnd !== -1) {
      text = text.substring(jsonStart, jsonEnd + 1)
    }

    let briefing
    try {
      briefing = JSON.parse(text)
    } catch {
      briefing = {
        summary: text.substring(0, 300) || 'Unable to parse AI response.',
        ecosoc_impact: 'See summary above.',
        sanctions_update: 'Check live news feed for latest sanctions developments.',
        military_update: 'Check live news feed for latest military developments.',
        talking_points: [
          'Sovereign equality under the UN Charter',
          'Sanctions constitute collective punishment of civilians',
          'Double standards in international accountability'
        ],
        watch_out_for: 'Human rights record, nuclear enrichment levels, proxy network activities.',
        last_updated: new Date().toISOString()
      }
    }

    // Ensure all fields exist and are safe types
    const safe = {
      summary: String(briefing.summary || ''),
      ecosoc_impact: String(briefing.ecosoc_impact || ''),
      sanctions_update: String(briefing.sanctions_update || ''),
      military_update: String(briefing.military_update || ''),
      talking_points: Array.isArray(briefing.talking_points) ? briefing.talking_points.map(String) : [],
      watch_out_for: String(briefing.watch_out_for || ''),
      last_updated: String(briefing.last_updated || new Date().toISOString())
    }

    return res.status(200).json({ briefing: safe })
  } catch (err) {
    return res.status(500).json({ error: 'AI update failed', detail: err.message })
  }
}
