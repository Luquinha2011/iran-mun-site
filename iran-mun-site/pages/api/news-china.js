// pages/api/news-china.js
export default async function handler(req, res) {
  const apiKey = process.env.NEWS_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'NEWS_API_KEY not configured' })
  const queries = [
    { label: 'China Latest News', q: 'China', category: 'general' },
    { label: 'ECOSOC and UN', q: 'China "United Nations" OR ECOSOC OR sanctions', category: 'ecosoc' },
    { label: 'Trade War Updates', q: 'China US trade war tariffs', category: 'trade' },
    { label: 'Military and Taiwan', q: 'China military Taiwan strait', category: 'military' },
  ]
  try {
    const results = await Promise.all(queries.map(async ({ label, q, category }) => {
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`
      const r = await fetch(url); const d = await r.json()
      return { label, category, articles: (d.articles || []).map(a => ({ title: a.title, description: a.description, url: a.url, source: a.source?.name, publishedAt: a.publishedAt })) }
    }))
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    return res.status(200).json({ news: results, fetchedAt: new Date().toISOString() })
  } catch (err) { return res.status(500).json({ error: 'Failed to fetch news' }) }
}
