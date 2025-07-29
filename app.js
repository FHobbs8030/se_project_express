const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const { PORT = 3001 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133', // Use actual test user's _id here
  };
  next();
});

app.use(express.json());
app.use(routes);

app.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 WTWR API is running on http://localhost:${PORT}`);
});
