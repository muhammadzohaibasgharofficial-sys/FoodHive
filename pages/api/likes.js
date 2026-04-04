// ============================================================
// FoodHive World — pages/api/likes.js
// Airtable-backed likes counter
// Table needed: "FH_Likes"
// Fields: RecipeSlug (text, primary), Count (number)
// ============================================================

const AT_BASE  = 'app2jARrJU6bUgoSM';
const AT_TABLE = 'FH_Likes';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { slug } = req.method === 'GET' ? req.query : (req.body || {});
  if (!slug) return res.status(400).json({ error: 'slug required' });

  // Find existing record
  const findRecord = async () => {
    const formula = encodeURIComponent(`{RecipeSlug}="${slug}"`);
    const r = await fetch(`https://api.airtable.com/v0/${AT_BASE}/${AT_TABLE}?filterByFormula=${formula}&maxRecords=1`,
      { headers: { Authorization: `Bearer ${AT_TOKEN}` } });
    const data = await r.json();
    return data.records?.[0] || null;
  };

  // ── GET: return current like count ──
  if (req.method === 'GET') {
    try {
      const rec = await findRecord();
      return res.status(200).json({ count: rec ? (rec.fields.Count || 0) : 0 });
    } catch (e) {
      return res.status(200).json({ count: 0 });
    }
  }

  // ── POST: increment like count ──
  if (req.method === 'POST') {
    try {
      const rec = await findRecord();
      if (rec) {
        const newCount = (rec.fields.Count || 0) + 1;
        await fetch(`https://api.airtable.com/v0/${AT_BASE}/${AT_TABLE}/${rec.id}`,
          { method: 'PATCH', headers: { Authorization: `Bearer ${AT_TOKEN}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ fields: { Count: newCount } }) });
        return res.status(200).json({ count: newCount });
      } else {
        const r = await fetch(`https://api.airtable.com/v0/${AT_BASE}/${AT_TABLE}`,
          { method: 'POST', headers: { Authorization: `Bearer ${AT_TOKEN}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ records: [{ fields: { RecipeSlug: slug, Count: 1 } }] }) });
        const data = await r.json();
        if (data.error) return res.status(500).json({ error: data.error.message });
        return res.status(200).json({ count: 1 });
      }
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
