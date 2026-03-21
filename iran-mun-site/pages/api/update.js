// pages/api/update.js
// Calls Anthropic API to generate an AI briefing based on latest news

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { password, articles } = req.body;

  // Simple password gate so only your team can trigger updates
  if (password !== process.env.UPDATE_PASSWORD) {
    return res.status(401).json({ error: 'Incorrect password' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });

  const newsText = articles
    .map(a => `- [${a.source}] ${a.title}: ${a.description || ''}`)
    .join('\n');

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
}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    let briefing;
    try {
      briefing = JSON.parse(text);
    } catch {
      // If parsing fails, return raw text
      briefing = { summary: text, last_updated: new Date().toISOString() };
    }

    return res.status(200).json({ briefing });
  } catch (err) {
    return res.status(500).json({ error: 'AI update failed', detail: err.message });
  }
}
