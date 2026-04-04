// ============================================================
// FoodHive World — pages/api/comments.js
// Airtable-backed comments system
// Table needed in Airtable: "FH_Comments"
// Fields: Name (text), Email (email), Comment (long text),
//         Rating (number 1-5), RecipeSlug (text), Date (date), Status (text)
// ============================================================

const AT_BASE  = 'app2jARrJU6bUgoSM';
const AT_TABLE = 'FH_Comments';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── GET: fetch approved comments for a recipe slug ──
  if (req.method === 'GET') {
    const { slug } = req.query;
    if (!slug) return res.status(400).json({ error: 'slug required' });
    try {
      const formula = encodeURIComponent(`AND({RecipeSlug}="${slug}", {Status}="approved")`);
      const url = `https://api.airtable.com/v0/${AT_BASE}/${AT_TABLE}?filterByFormula=${formula}&sort[0][field]=Date&sort[0][direction]=desc&maxRecords=50`;
      const r = await fetch(url, { headers: { Authorization: `Bearer ${AT_TOKEN}` } });
      const data = await r.json();
      const comments = (data.records || []).map(rec => ({
        id:      rec.id,
        name:    rec.fields.Name || 'Anonymous',
        comment: rec.fields.Comment || '',
        rating:  rec.fields.Rating || 5,
        date:    rec.fields.Date || new Date().toISOString(),
      }));
      return res.status(200).json({ comments });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // ── POST: add new comment ──
  if (req.method === 'POST') {
    const { slug, name, email, comment, rating } = req.body || {};
    if (!slug || !name || !comment) return res.status(400).json({ error: 'slug, name, comment required' });
    if (comment.length > 1000) return res.status(400).json({ error: 'Comment too long (max 1000 chars)' });
    const safeRating = Math.min(5, Math.max(1, parseInt(rating) || 5));
    try {
      const url = `https://api.airtable.com/v0/${AT_BASE}/${AT_TABLE}`;
      const body = {
        records: [{
          fields: {
            Name:       name.slice(0, 100),
            Email:      (email || '').slice(0, 200),
            Comment:    comment.slice(0, 1000),
            Rating:     safeRating,
            RecipeSlug: slug,
            Date:       new Date().toISOString(),
            Status:     'approved', // auto-approve; change to 'pending' for moderation
          }
        }]
      };
      const r = await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${AT_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await r.json();
      if (data.error) return res.status(500).json({ error: data.error.message });
      return res.status(201).json({ success: true, id: data.records?.[0]?.id });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
