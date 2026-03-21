// pages/api/news.js
// Fetches latest Iran-related news from NewsAPI

export default async function handler(req, res) {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'NEWS_API_KEY not configured' });
  }

  const queries = [
    { label: 'Iran Latest News', q: 'Iran', category: 'general' },
    { label: 'ECOSOC & UN', q: 'Iran ECOSOC OR "United Nations" OR sanctions', category: 'ecosoc' },
    { label: 'Sanctions Updates', q: 'Iran sanctions', category: 'sanctions' },
    { label: 'Military & Conflict', q: 'Iran military OR conflict OR IRGC', category: 'military' },
  ];

  try {
    const results = await Promise.all(
      queries.map(async ({ label, q, category }) => {
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        return {
          label,
          category,
          articles: (data.articles || []).map(a => ({
            title: a.title,
            description: a.description,
            url: a.url,
            source: a.source?.name,
            publishedAt: a.publishedAt,
          }))
        };
      })
    );

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json({ news: results, fetchedAt: new Date().toISOString() });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch news', detail: err.message });
  }
}
