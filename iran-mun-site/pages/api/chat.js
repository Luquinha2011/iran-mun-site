// pages/api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { messages } = req.body
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array required' })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'GROQ_API_KEY not configured' })

  const systemPrompt = `You are an expert MUN research assistant specializing in Iran's position at ECOSOC. You have deep knowledge of:

- Iran's political system: Velayat-e Faqih, IRGC, Guardian Council, Assembly of Experts
- The 2026 crisis: Khamenei assassinated Feb 28 2026, mass protests Dec 2025-Jan 2026, US-Israeli military strikes
- ECOSOC: Iran removed from CSW in 2022 (vote 29-8), UN sanctions reimposed Sept 2025 via JCPOA snapback
- JCPOA: 2015 nuclear deal, US withdrew 2018, snapback triggered by UK/France/Germany Sept 2025
- Iran's economy: hyperinflation, shadow oil fleet to China, Central Bank blacklisted, SWIFT access severed
- Nuclear programme: 60% enrichment, June 2025 Israeli strikes, hidden facility found Jan 2026
- MUN procedures: points of order, personal privilege, motions, caucuses, resolutions, amendments, yields
- Iran's core arguments: sovereign equality, collective punishment, double standards, anti-imperialism
- Key vocabulary: Nowruz, Shahnameh, Ta'arof, Fatwa, Axis of Resistance, Rahbar, Velayat-e Faqih
- Iran's allies: Russia (P5 veto), China (P5 veto), G-77, Non-Aligned Movement, Cuba, Venezuela, Syria

You help MUN delegates prepare speeches, arguments, and procedural tactics. Be concise but thorough. Use bullet points for lists. Be direct and practical. When asked for MUN advice, always frame from Iran's perspective.`

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 500,
        temperature: 0.4,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.slice(-6)
        ],
      }),
    })

    if (!response.ok) {
      const errData = await response.json()
      console.error('Groq error:', JSON.stringify(errData))
      
      // If rate limited, return a helpful message
      if (response.status === 429) {
        return res.status(200).json({ 
          reply: "I'm temporarily rate limited — the free Groq plan has usage limits. Please wait 30 seconds and try again. In the meantime, check the research sections above for the information you need." 
        })
      }
      
      return res.status(200).json({ 
        reply: `API error: ${errData?.error?.message || 'Unknown error'}. Please try again.` 
      })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || 'Sorry, no response generated. Please try again.'

    return res.status(200).json({ reply })
  } catch (err) {
    console.error('Chat error:', err.message)
    return res.status(200).json({ 
      reply: 'Connection error. Please check your internet connection and try again.' 
    })
  }
}
