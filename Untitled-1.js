// models/Notification.js
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, default: "" },
  message: { type: String, required: true },
  meta: { type: Object, default: {} }, // extra data (link, type, ...)
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  delivered: { type: Boolean, default: false }
});

module.exports = mongoose.model('Notification', NotificationSchema);
