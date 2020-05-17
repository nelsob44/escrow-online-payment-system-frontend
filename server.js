const express = require('express');
const sslRedirect = require('heroku-ssl-redirect');
const path = require('path');
const app = express();

app.use(sslRedirect());

// Serve static files....
app.use(express.static(__dirname + '/dist'));

// Send all requests to index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

// default Heroku PORT
app.listen(process.env.PORT || 3000);