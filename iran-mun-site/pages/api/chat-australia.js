// pages/api/chat-australia.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { messages } = req.body

  const groqKey = process.env.GROQ_API_KEY
  if (!groqKey) {
    return res.status(200).json({ reply: 'AI assistant is not configured. Please add GROQ_API_KEY to your environment variables.' })
  }

  // Groq requires the conversation to start with a user message.
  // The chatbot initialises with an assistant greeting, so we strip it.
  const firstUserIndex = messages.findIndex(m => m.role === 'user')
  if (firstUserIndex === -1) {
    return res.status(200).json({ reply: 'Please send a message first.' })
  }
  const trimmedMessages = messages.slice(firstUserIndex)

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 800,
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content: "You are an expert MUN research assistant specialising in Australia. You help delegates prepare for ECOSOC, HRC, DISEC, and UNEP committees. You know Australia's foreign policy, domestic politics, Indo-Pacific strategy, climate policy, and UN positions in depth. Be concise, accurate, and helpful. Format responses with bullet points where appropriate.",
          },
          ...trimmedMessages,
        ],
      }),
    })

    const d = await r.json()

    // Surface Groq API errors clearly
    if (d.error) {
      console.error('Groq API error:', d.error)
      return res.status(200).json({ reply: `Groq error: ${d.error.message}` })
    }

    const reply = d.choices?.[0]?.message?.content
    if (!reply) {
      console.error('Unexpected Groq response:', JSON.stringify(d))
      return res.status(200).json({ reply: 'No response from AI. Please try again.' })
    }

    return res.status(200).json({ reply })
  } catch (err) {
    console.error('chat-australia handler error:', err)
    return res.status(500).json({ reply: 'Connection error. Please try again.' })
  }
}
