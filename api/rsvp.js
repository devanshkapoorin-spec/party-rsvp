const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}`;
const RSVPS_TABLE = 'tblkOBkdJFPbHR5Ie';

const headers = {
  'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
  'Content-Type': 'application/json',
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { eventId, guestName, attending, plusOne, drinkPreference } = req.body;

  if (!eventId || !guestName || attending === undefined) {
    return res.status(400).json({ error: 'eventId, guestName, and attending are required' });
  }

  try {
    const response = await fetch(`${BASE_URL}/${RSVPS_TABLE}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        records: [{
          fields: {
            'guest name': guestName,
            'event': [eventId],
            'attending': attending ? 'Yes' : 'No',
            'Plus One': plusOne || false,
            'Drink Preference': drinkPreference || '',
          }
        }]
      })
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
