// pages/api/news-france.js
export default async function handler(req, res) {
  const apiKey = process.env.NEWS_API_KEY
  if (!apiKey) return res.status(200).json({ news: [] })
  const categories = [
    { category: 'politics', label: '🏛️ Politics', q: 'France Macron government' },
    { category: 'security', label: '🔒 Security & Defence', q: 'France military NATO Ukraine' },
    { category: 'economy', label: '💰 Economy', q: 'France economy budget' },
    { category: 'un', label: '🌐 UN / International', q: 'France United Nations diplomacy' },
  ]
  try {
    const results = await Promise.all(categories.map(async (cat) => {
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(cat.q)}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`
      const r = await fetch(url)
      const d = await r.json()
      return { category: cat.category, label: cat.label, articles: (d.articles || []).slice(0, 4).map(a => ({ title: a.title, description: a.description, url: a.url, source: a.source?.name, publishedAt: a.publishedAt })) }
    }))
    return res.status(200).json({ news: results })
  } catch { return res.status(200).json({ news: [] }) }
}
