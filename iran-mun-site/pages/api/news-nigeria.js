// pages/api/news-nigeria.js
export default async function handler(req, res) {
  const apiKey = process.env.NEWS_API_KEY
  if (!apiKey) return res.status(200).json({ news: [] })
  const categories = [
    { category: 'politics', label: '🏛️ Politics', q: 'Nigeria Tinubu government' },
    { category: 'security', label: '🔒 Security', q: 'Nigeria Boko Haram security' },
    { category: 'economy', label: '💰 Economy', q: 'Nigeria economy naira' },
    { category: 'un', label: '🌐 UN / International', q: 'Nigeria United Nations' },
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
