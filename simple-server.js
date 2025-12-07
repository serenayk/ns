const express = require('express');
const app = express();

app.use(express.json());

let notifications = [];

// Test
app.get('/test', (req, res) => {
  res.json({ ok: true });
});

// Create
app.post('/api/notifications', (req, res) => {
  try {
    const { userId, title, message, meta } = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    const notif = { _id: id, userId, title: title || '', message, meta: meta || {}, isRead: false, createdAt: new Date(), delivered: false };
    notifications.push(notif);
    res.status(201).json(notif);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get
app.get('/api/notifications/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { unread } = req.query;
    let items = notifications.filter(n => n.userId === userId);
    if (unread === 'true') items = items.filter(n => !n.isRead);
    res.json(items.sort((a, b) => b.createdAt - a.createdAt).slice(0, 200));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Mark read
app.patch('/api/notifications/:id/read', (req, res) => {
  try {
    const { id } = req.params;
    const notif = notifications.find(n => n._id === id);
    if (!notif) return res.status(404).json({ error: 'not found' });
    notif.isRead = true;
    res.json(notif);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete
app.delete('/api/notifications/:id', (req, res) => {
  try {
    const { id } = req.params;
    const idx = notifications.findIndex(n => n._id === id);
    if (idx === -1) return res.status(404).json({ error: 'not found' });
    notifications.splice(idx, 1);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const port = 4000;
app.listen(port, () => console.log(`Listening on ${port}`));
