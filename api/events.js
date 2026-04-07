const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}`;

const headers = {
  'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
  'Content-Type': 'application/json',
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const response = await fetch(
        `${BASE_URL}/Events?sort[0][field]=Date&sort[0][direction]=asc`,
        { headers }
      );
      const data = await response.json();
      if (!response.ok) return res.status(response.status).json(data);
      res.status(200).json(data.records.map(r => ({ id: r.id, ...r.fields })));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'POST') {
    const { name, date, location, description, drinkingEvent } = req.body;
    if (!name || !date) return res.status(400).json({ error: 'Name and date required' });

    try {
      const response = await fetch(`${BASE_URL}/Events`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          records: [{
            fields: {
              Name: name,
              Date: date,
              Location: location || '',
              Description: description || '',
              'Drinking Event': drinkingEvent || false,
            }
          }]
        })
      });
      const data = await response.json();
      if (!response.ok) return res.status(response.status).json(data);
      const r = data.records[0];
      res.status(201).json({ id: r.id, ...r.fields });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
