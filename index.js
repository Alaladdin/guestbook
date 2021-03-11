require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const CommentsRoute = require('./app/routes/CommentsRoute');

const PORT = process.env.PORT || 3000;
const app = express();

// setting up
mongoose.set('useCreateIndex', true);

app.use(express.static(path.join(__dirname, 'vendor')));
app.use(bodyParser.json({ limit: '1kb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('', CommentsRoute);

app.disable('x-powered-by');

// index page route
app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/app/views/index.html`));
});

// connect mongodb & port listening
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('connected to mongo database'))
  .catch(console.error);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
