require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}`;
const AT_HEADERS = {
  'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
  'Content-Type': 'application/json',
};

const EVENTS_TABLE = 'tblxtlXhOuC7yvepp';
const RSVPS_TABLE = 'tblkOBkdJFPbHR5Ie';

// GET /api/events — list all events
// POST /api/events — create event
app.route('/api/events')
  .get(async (req, res) => {
    try {
      const r = await fetch(`${BASE_URL}/${EVENTS_TABLE}?sort[0][field]=date&sort[0][direction]=asc`, { headers: AT_HEADERS });
      const data = await r.json();
      if (!r.ok) return res.status(r.status).json(data);
      res.json(data.records.map(rec => ({ id: rec.id, ...rec.fields })));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })
  .post(async (req, res) => {
    const { name, date, location, description, drinkingEvent } = req.body;
    if (!name || !date) return res.status(400).json({ error: 'Name and date required' });
    try {
      const r = await fetch(`${BASE_URL}/${EVENTS_TABLE}`, {
        method: 'POST',
        headers: AT_HEADERS,
        body: JSON.stringify({
          records: [{ fields: {
            'name': name,
            'date': date,
            'location': location || '',
            'description': description || '',
            'drinking event': drinkingEvent || false,
          }}]
        })
      });
      const data = await r.json();
      if (!r.ok) return res.status(r.status).json(data);
      const rec = data.records[0];
      res.status(201).json({ id: rec.id, ...rec.fields });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// POST /api/rsvp — submit RSVP
app.post('/api/rsvp', async (req, res) => {
  const { eventId, guestName, attending, plusOne, drinkPreference } = req.body;
  if (!eventId || !guestName || attending === undefined) {
    return res.status(400).json({ error: 'eventId, guestName, and attending required' });
  }
  try {
    const r = await fetch(`${BASE_URL}/${RSVPS_TABLE}`, {
      method: 'POST',
      headers: AT_HEADERS,
      body: JSON.stringify({
        records: [{ fields: {
          'guest name': guestName,
          'event': [eventId],
          'attending': attending ? 'Yes' : 'No',
          'Plus One': plusOne || false,
          'Drink Preference': drinkPreference || '',
        }}]
      })
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/rsvps?eventId=xxx — get RSVPs for an event
app.get('/api/rsvps', async (req, res) => {
  const { eventId } = req.query;
  try {
    const url = `${BASE_URL}/${RSVPS_TABLE}?sort[0][field]=guest%20name&sort[0][direction]=asc`;
    const r = await fetch(url, { headers: AT_HEADERS });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);
    let records = data.records.map(rec => ({ id: rec.id, ...rec.fields }));
    if (eventId) {
      records = records.filter(rec => Array.isArray(rec.event) && rec.event.includes(eventId));
    }
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Running at http://localhost:${PORT}`));
