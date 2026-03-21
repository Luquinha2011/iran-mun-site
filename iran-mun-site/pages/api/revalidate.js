// pages/api/revalidate.js
// Manual "Update All Sections" button — password protected

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { password } = req.body

  if (password !== process.env.UPDATE_PASSWORD) {
    return res.status(401).json({ error: 'Incorrect password' })
  }

  try {
    await res.revalidate('/')
    return res.json({ revalidated: true, message: 'All sections updating — refresh the page in 30 seconds.' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
