// pages/api/chat.js
// Chatbot API route — powered by Groq (free)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { messages } = req.body
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array required' })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'GROQ_API_KEY not configured' })

  const systemPrompt = `You are an expert MUN research assistant specializing in Iran's position at ECOSOC. You have deep knowledge of:

- Iran's political system (Velayat-e Faqih, IRGC, Guardian Council, Assembly of Experts)
- The 2026 crisis: Khamenei's assassination on Feb 28 2026, mass protests, US-Israeli military strikes
- ECOSOC procedures, Iran's removal from the CSW in 2022 (29-8 vote), UN sanctions
- The JCPOA snapback mechanism reimposed September 2025 by UK, France, Germany
- Iran's economic situation: hyperinflation, shadow oil fleet, China partnership
- Iran's nuclear programme: 60% enrichment, June 2025 Israeli strikes, hidden facility discovered Jan 2026
- MUN procedures: points of order, personal privilege, motions, caucuses, resolutions, yields
- Iran's core arguments: sovereign equality, collective punishment, double standards, anti-imperialism
- Key vocabulary: Nowruz, Shahnameh, Ta'arof, Fatwa, Axis of Resistance, Rahbar
- Iran's allies: Russia, China, G-77, Non-Aligned Movement, Cuba, Venezuela

You help MUN delegates prepare speeches, arguments, counter-arguments, and procedural tactics. You are knowledgeable, precise, and always frame answers from Iran's perspective when asked for MUN advice.

Keep responses concise but thorough. Use bullet points when listing multiple items. Be direct and practical.`

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        max_tokens: 600,
        temperature: 0.4,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.slice(-8) // Keep last 8 messages for context
        ],
      }),
    })

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response. Please try again.'

    return res.status(200).json({ reply })
  } catch (err) {
    return res.status(500).json({ error: 'Chat failed', detail: err.message })
  }
}
