// models/Notification.js
const { v4: uuidv4 } = require('uuid');

class Notification {
  constructor(data) {
    this._id = uuidv4();
    this.userId = data.userId;
    this.title = data.title || "";
    this.message = data.message;
    this.meta = data.meta || {};
    this.isRead = false;
    this.createdAt = new Date();
    this.delivered = false;
  }
}

// In-memory storage
let notifications = [];

module.exports = {
  Notification,
  notifications,
  create: function(data) {
    const notif = new Notification(data);
    notifications.push(notif);
    return notif;
  },
  findById: function(id) {
    return notifications.find(n => n._id === id);
  },
  findByIdAndUpdate: function(id, update) {
    const notif = notifications.find(n => n._id === id);
    if (notif) {
      Object.assign(notif, update);
      return notif;
    }
    return null;
  },
  findByIdAndDelete: function(id) {
    const index = notifications.findIndex(n => n._id === id);
    if (index !== -1) {
      return notifications.splice(index, 1)[0];
    }
    return null;
  },
  find: function(filter) {
    return notifications.filter(n => {
      if (filter.userId && n.userId !== filter.userId) return false;
      if (filter.isRead !== undefined && n.isRead !== filter.isRead) return false;
      return true;
    }).sort((a, b) => b.createdAt - a.createdAt).slice(0, 200);
  }
};
