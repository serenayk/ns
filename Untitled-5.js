// routes/notifications.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { v4: uuidv4 } = require('uuid');

// Create notification
router.post('/', async (req, res) => {
  try {
    const { userId, title, message, meta } = req.body;
    if (!userId || !message) {
      return res.status(400).json({ error: "userId and message required" });
    }
    if (typeof userId !== 'string' || typeof message !== 'string') {
      return res.status(400).json({ error: "userId and message must be strings" });
    }

    const notif = new Notification({ userId, title, message, meta });
    await notif.save();
    // TODO: push notification to websocket or push service here
    return res.status(201).json(notif);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
});

// Get notifications for a user (with optional query ?unread=true)
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { unread } = req.query;
    const filter = { userId };
    if (unread === 'true') filter.isRead = false;
    const items = await Notification.find(filter).sort({ createdAt: -1 }).limit(200);
    return res.json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
});

// Mark as read
router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    if (!notif) return res.status(404).json({ error: 'not found' });
    return res.json(notif);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findByIdAndDelete(id);
    if (!notif) return res.status(404).json({ error: 'not found' });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
