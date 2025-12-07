require('dotenv').config();
const express = require('express');
const cors = require('cors');
const notifRoutes = require('./routes/notifications');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.use('/api/notifications', notifRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Notification service listening on ${port}`));
