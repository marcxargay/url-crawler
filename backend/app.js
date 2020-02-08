const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')

const searchController = require('./search-controller.js');

const port = 3000;

const app = express();

app.use(bodyParser.json({ extended: true }));

app.options('/search', cors())
app.post('/search', cors(), searchController.search);



mongoose.connect(
  'mongodb://127.0.0.1:27017', { useNewUrlParser: true },
)
  .then(result => {
    console.log('Server running..')
    app.listen(port);
  })
  .catch(err => {
    console.log(err);
  }
  );
