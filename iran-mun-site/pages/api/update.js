// pages/api/update.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { password, articles } = req.body

  if (password !== process.env.UPDATE_PASSWORD)
    return res.status(401).json({ error: 'Incorrect password' })

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
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: 'You are a senior MUN research analyst specializing in Middle East affairs and UN procedure. Always respond with valid JSON only. Write detailed, substantive analysis — not brief summaries.'
          },
          {
            role: 'user',
            content: `Based on these recent Iran news headlines, write a comprehensive MUN intelligence briefing for a team representing Iran at ECOSOC. Be detailed and analytical. Use complete sentences and thorough analysis.

Headlines:
${newsText}

Return JSON with exactly these keys:

{
  "summary": "A detailed 4-5 sentence executive summary covering the most important current developments, their causes, and their implications for Iran's international standing",

  "situation_overview": "A thorough 4-6 sentence overview of Iran's current overall situation — political, military, economic, and diplomatic — as of today",

  "ecosoc_impact": "3-5 sentences analyzing specifically how current developments affect Iran's position, strategy, and leverage within ECOSOC. Include what Iran should emphasize and what it should avoid.",

  "sanctions_update": "4-5 sentences on the current sanctions landscape — who has imposed what, what the economic effects are, how Iran is circumventing them, and what the legal disputes are",

  "military_update": "4-5 sentences on the current military and security situation — the ongoing conflict, nuclear programme status, proxy network condition, and strategic implications",

  "leadership_crisis": "3-4 sentences on the post-Khamenei leadership vacuum and its implications for Iran's foreign policy and multilateral engagement",

  "talking_points": [
    "Detailed talking point 1 with specific legal or factual basis",
    "Detailed talking point 2 with specific legal or factual basis",
    "Detailed talking point 3 with specific legal or factual basis",
    "Detailed talking point 4 with specific legal or factual basis",
    "Detailed talking point 5 with specific legal or factual basis"
  ],

  "counter_arguments": [
    "Anticipated attack 1 from opposing delegates and how to counter it",
    "Anticipated attack 2 from opposing delegates and how to counter it",
    "Anticipated attack 3 from opposing delegates and how to counter it"
  ],

  "watch_out_for": "3-4 sentences on the most dangerous arguments opposing delegates will deploy, which delegations are most likely to lead the attack, and the best defensive strategy",

  "recommended_actions": [
    "Specific recommended action in committee 1",
    "Specific recommended action in committee 2",
    "Specific recommended action in committee 3"
  ],

  "last_updated": "${new Date().toISOString()}"
}`
          }
        ],
      }),
    })

    const data = await response.json()
    let text = data.choices?.[0]?.message?.content || ''

    text = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()

    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start !== -1 && end !== -1 && end > start) {
      text = text.substring(start, end + 1)
    }

    let briefing
    try {
      briefing = JSON.parse(text)
    } catch {
      briefing = {
        summary: 'Iran is navigating its most severe crisis since the 1979 Revolution. The assassination of Supreme Leader Khamenei on February 28, 2026 has created a constitutional vacuum unprecedented in the history of the Islamic Republic. Simultaneously, UN sanctions have been reimposed through the contested JCPOA snapback mechanism, the economy is in freefall, and active military conflict continues with the United States and Israel.',
        situation_overview: 'Iran finds itself at a critical juncture across all domains. Politically, the Assembly of Experts is in emergency session to select a new Supreme Leader, with the IRGC exercising decisive influence over the outcome. Economically, hyperinflation continues and the rial has collapsed, with sanctions cutting Iran off from the global financial system. Militarily, retaliatory strikes against US bases across the Middle East continue following the February 28 attacks. Diplomatically, Iran maintains formal UN membership but faces unprecedented institutional isolation.',
        ecosoc_impact: 'Iran remains removed from the Commission on the Status of Women following the 2022 vote. The January 2026 massacre of protesters has intensified calls for further ECOSOC action against Iran. However, Iran retains leverage through its G-77 membership and can frame all accountability measures as politically motivated violations of sovereign equality. The ongoing conflict provides Iran with a humanitarian argument — that sanctions are preventing civilian access to medicine and essential goods during a period of active military hostility.',
        sanctions_update: 'The UN sanctions reimposed in September 2025 via the JCPOA snapback mechanism remain in force, though Russia and China contest their legal validity. The United States maintains its full maximum pressure regime, with Iran\'s Central Bank blacklisted and SWIFT access severed. Iran continues to sell oil through a shadow fleet to China at discounts of 20-30% below market price. The UK intercepted the Bella 1 vessel in January 2026, accused of carrying sanctioned Iranian, Venezuelan, and Russian oil simultaneously.',
        military_update: 'Following the February 28, 2026 US-Israeli strikes that killed Supreme Leader Khamenei, Iran has launched retaliatory drone and missile barrages targeting US military installations in Bahrain, Jordan, Kuwait, Qatar, Saudi Arabia, and Turkey. In March 2026, attacks on Gulf energy infrastructure pushed Brent crude above $119 per barrel. Iran\'s nuclear enrichment programme was significantly damaged by the June 2025 Israeli strikes but has partially resumed in an undisclosed underground facility identified by the IAEA in January 2026.',
        leadership_crisis: 'The assassination of Supreme Leader Ali Khamenei on February 28, 2026 has left Iran without its highest constitutional authority for the first time since Khomeini\'s death in 1989. The Assembly of Experts is constitutionally responsible for selecting a successor but is operating under conditions of active military conflict and domestic unrest. The IRGC is widely expected to play a decisive — and potentially unconstitutional — role in determining the next Supreme Leader.',
        talking_points: [
          'The UN Charter\'s Article 2(1) enshrines the sovereign equality of all Member States — the selective removal of Iran from elected UN bodies violates this foundational principle and sets a dangerous precedent for every delegation in this chamber',
          'Sanctions targeting Iran\'s Central Bank and severing its access to international financial systems constitute collective punishment of 92 million civilians, in direct violation of international humanitarian law and the UN Charter\'s prohibition on targeting civilian populations',
          'This Council has taken no comparable action against states conducting illegal military operations, maintaining illegal occupations, or imposing collective punishment on civilian populations — the double standard is self-evident and undermines the legitimacy of this body',
          'Iran\'s nuclear programme is civilian in nature — Supreme Leader Khamenei\'s 2003 fatwa declaring nuclear weapons religiously forbidden remains on the public record, and the IAEA has never confirmed the existence of a weapons programme',
          'The JCPOA snapback mechanism was improperly invoked — the United States, having withdrawn from the agreement in 2018, had no legal standing to trigger provisions of a treaty it had abandoned. Russia, China, and Iran agree on this legal reading.'
        ],
        counter_arguments: [
          'When pressed on the January 2026 massacres: redirect to the principle of non-interference in internal affairs and challenge the Council to apply equal scrutiny to states conducting extrajudicial operations abroad',
          'When pressed on nuclear enrichment at 60%: cite the fatwa, note that no weapons programme has been confirmed by the IAEA, and challenge the legality of the snapback mechanism itself',
          'When pressed on proxy networks: describe Hezbollah, Hamas, and the Houthis as legitimate resistance movements operating in response to illegal occupations and foreign aggression'
        ],
        watch_out_for: 'The United States and United Kingdom delegations will lead the attack on Iran\'s human rights record, the January 2026 massacre specifically, and the nuclear enrichment programme. European delegations will focus on the snapback sanctions and JCPOA non-compliance. The strongest counter-strategy is to build a G-77 coalition around anti-sanctions language before these attacks materialise, so that fence-sitters have already committed to a position of procedural neutrality.',
        recommended_actions: [
          'In the first unmoderated caucus, approach G-77 African and Latin American delegations and propose co-sponsoring a resolution on the illegality of unilateral coercive economic measures',
          'Motion for a moderated caucus on development financing and the right to peaceful nuclear energy — topics where Iran has natural allies and can shift focus away from human rights',
          'File a Right of Reply immediately if any delegation directly misrepresents Iran\'s stated position on nuclear weapons — cite the fatwa and demand the record be corrected'
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
      talking_points: Array.isArray(briefing.talking_points)
        ? briefing.talking_points.map(String).slice(0, 6)
        : [],
      counter_arguments: Array.isArray(briefing.counter_arguments)
        ? briefing.counter_arguments.map(String).slice(0, 4)
        : [],
      watch_out_for: String(briefing.watch_out_for || ''),
      recommended_actions: Array.isArray(briefing.recommended_actions)
        ? briefing.recommended_actions.map(String).slice(0, 4)
        : [],
      last_updated: String(briefing.last_updated || new Date().toISOString())
    }

    return res.status(200).json({ briefing: safe })
  } catch (err) {
    return res.status(500).json({ error: 'AI update failed', detail: err.message })
  }
}
