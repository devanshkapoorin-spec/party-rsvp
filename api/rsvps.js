const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}`;

const headers = {
  'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
  'Content-Type': 'application/json',
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { eventId } = req.query;

  try {
    let url = `${BASE_URL}/RSVPs?sort[0][field]=Submitted At&sort[0][direction]=desc`;
    if (eventId) {
      url += `&filterByFormula={Event}="${eventId}"`;
    }

    const response = await fetch(url, { headers });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    res.status(200).json(data.records.map(r => ({ id: r.id, ...r.fields })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
