// pages/api/update.js
// Accepts either password OR a valid session token (delegate/admin)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { password, token, articles } = req.body

  // Auth check — accept password OR valid token from a delegate/admin
  let authorized = false

  if (password && password === process.env.UPDATE_PASSWORD) {
    authorized = true
  }

  if (!authorized && token) {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf8')
      const [username, role, timestamp] = decoded.split(':')
      const age = Date.now() - parseInt(timestamp)
      if (age < 24 * 60 * 60 * 1000 && (role === 'admin' || role === 'delegate')) {
        authorized = true
      }
    } catch {}
  }

  if (!authorized) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'GROQ_API_KEY not configured' })

  const newsText = (articles || [])
    .slice(0, 12)
    .map(a => `- ${(a.title || '').replace(/"/g, "'").substring(0, 120)}`)
    .join('\n')

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        max_tokens: 1800,
        temperature: 0.2,
        messages: [
          { role: 'system', content: 'You are a senior MUN research analyst. Always respond with valid JSON only, no markdown, no backticks.' },
          { role: 'user', content: `Based on these recent Iran news headlines, write a comprehensive MUN intelligence briefing for a team representing Iran at ECOSOC.

Headlines:
${newsText}

Return JSON with exactly these keys: summary, situation_overview, ecosoc_impact, sanctions_update, military_update, leadership_crisis, talking_points (array of 5 strings), counter_arguments (array of 3 strings), watch_out_for, recommended_actions (array of 3 strings), last_updated ("${new Date().toISOString()}")` }
        ],
      }),
    })

    const data = await response.json()
    let text = data.choices?.[0]?.message?.content || ''
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim()
    const start = text.indexOf('{'); const end = text.lastIndexOf('}')
    if (start !== -1 && end !== -1 && end > start) text = text.substring(start, end + 1)

    let briefing
    try {
      briefing = JSON.parse(text)
    } catch {
      briefing = {
        summary: 'Iran continues to face intense international pressure following the February 2026 conflict and the assassination of Supreme Leader Khamenei.',
        situation_overview: 'Iran is navigating its most severe crisis since the 1979 Revolution across political, military, economic, and diplomatic fronts simultaneously.',
        ecosoc_impact: 'Iran remains suspended from the CSW. The ongoing conflict and leadership vacuum complicate all multilateral engagement.',
        sanctions_update: 'UN sanctions remain reimposed via the JCPOA snapback. Iran continues to sell oil through its shadow fleet to China at steep discounts.',
        military_update: 'Active conflict continues following February 28 US-Israeli strikes. Iran has retaliated with drone and missile attacks on US bases across the region.',
        leadership_crisis: 'The Assembly of Experts is in emergency session to select a new Supreme Leader. The IRGC is exercising decisive influence over the outcome.',
        talking_points: [
          "The UN Charter's Article 2(1) enshrines the sovereign equality of all Member States without exception",
          "Sanctions targeting Iran's Central Bank constitute collective punishment of 92 million civilians",
          "This Council applies accountability selectively against states that resist Western foreign policy preferences",
          "Iran's nuclear programme is civilian — the fatwa declaring nuclear weapons haram remains on the public record",
          "The JCPOA snapback was improperly invoked by a non-party — the US had already withdrawn from the agreement"
        ],
        counter_arguments: [
          "When pressed on the January 2026 massacres: redirect to the principle of non-interference and demand equal scrutiny of Western military operations",
          "When pressed on nuclear enrichment at 60%: cite the fatwa and note the IAEA has never confirmed a weapons programme",
          "When pressed on proxy networks: describe them as legitimate resistance movements against illegal occupations and foreign aggression"
        ],
        watch_out_for: 'The US and UK delegations will lead the attack on Iran\'s human rights record. European delegations will focus on nuclear non-compliance. Build a G-77 coalition before these attacks materialise.',
        recommended_actions: [
          "In the first unmoderated caucus, approach G-77 African and Latin American delegations to co-sponsor a resolution on the illegality of unilateral coercive economic measures",
          "Motion for a moderated caucus on development financing and the right to peaceful nuclear energy",
          "File a Right of Reply immediately if any delegation directly misrepresents Iran's stated position on nuclear weapons"
        ],
        last_updated: new Date().toISOString()
      }
    }

    const safe = {
      summary: String(briefing.summary || ''),
      situation_overview: String(briefing.situation_overview || ''),
      ecosoc_impact: String(briefing.ecosoc_impact || ''),
      sanctions_update: String(briefing.sanctions_update || ''),
      military_update: String(briefing.military_update || ''),
      leadership_crisis: String(briefing.leadership_crisis || ''),
      talking_points: Array.isArray(briefing.talking_points) ? briefing.talking_points.map(String) : [],
      counter_arguments: Array.isArray(briefing.counter_arguments) ? briefing.counter_arguments.map(String) : [],
      watch_out_for: String(briefing.watch_out_for || ''),
      recommended_actions: Array.isArray(briefing.recommended_actions) ? briefing.recommended_actions.map(String) : [],
      last_updated: String(briefing.last_updated || new Date().toISOString())
    }

    return res.status(200).json({ briefing: safe })
  } catch (err) {
    return res.status(500).json({ error: 'AI update failed', detail: err.message })
  }
}
