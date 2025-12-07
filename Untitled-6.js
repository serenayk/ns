// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const notifRoutes = require('./routes/notifications');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Quick in-memory fallback if no MONGODB_URI provided
const MONGODB_URI = process.env.MONGODB_URI || null;

async function start() {
  if (MONGODB_URI) {
    try {
      await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Connected to MongoDB');
    } catch (e) {
      console.error('MongoDB connect error', e);
      process.exit(1);
    }
  } else {
    console.log('No MONGODB_URI provided — ensure you use a persistent DB for production. Using Mongoose still OK for in-memory demo.');
  }

  app.use('/api/notifications', notifRoutes);

  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`Notification service listening on ${port}`));
}

start();
