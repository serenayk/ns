// routes/notifications.js
const express = require('express');
const router = express.Router();
const NotifModel = require('../models/Notification');

// Create notification
router.post('/', (req, res) => {
  console.log('POST /api/notifications body:', req.body);
  try {
    const { userId, title, message, meta } = req.body;
    if (!userId || !message) {
      return res.status(400).json({ error: "userId and message required" });
    }
    if (typeof userId !== 'string' || typeof message !== 'string') {
      return res.status(400).json({ error: "userId and message must be strings" });
    }

    const notif = NotifModel.create({ userId, title, message, meta });
    console.log('Created notification:', notif);
    return res.status(201).json(notif);
  } catch (err) {
    console.error('POST error:', err);
    return res.status(500).json({ error: 'server error' });
  }
});

// Get notifications for a user (with optional query ?unread=true)
router.get('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { unread } = req.query;
    const filter = { userId };
    if (unread === 'true') filter.isRead = false;
    const items = NotifModel.find(filter);
    return res.json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
});

// Mark as read
router.patch('/:id/read', (req, res) => {
  try {
    const { id } = req.params;
    const notif = NotifModel.findByIdAndUpdate(id, { isRead: true });
    if (!notif) return res.status(404).json({ error: 'not found' });
    return res.json(notif);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
});

// Delete
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const notif = NotifModel.findByIdAndDelete(id);
    if (!notif) return res.status(404).json({ error: 'not found' });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
