const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes'); // 👈 this should point to your routes folder

const { PORT = 3001 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.use(express.json());

// Temporary auth middleware
app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133' // replace with your test user ID
  };
  next();
});

app.use(routes); // 👈 this should be here

app.listen(PORT, () => {
  console.log(`🚀 WTWR API is running on http://localhost:${PORT}`);
});
