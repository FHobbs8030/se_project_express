const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const { PORT = 3001 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`🚀 WTWR API is running on http://localhost:${PORT}`);
});
