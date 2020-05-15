const express = require('express');
const path = require('path');
const app = express();

// Serve static files....
app.use(express.static(__dirname + '/dist'));

// Send all requests to index.html
app.get('/*', function(req, res, next) {
  if(req.headers['x-forwarded-proto'] !=='https'){
    res.redirect('https://' + req.headers.host + req.url);
  } else {
    next();
  }
  
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

// default Heroku PORT
app.listen(process.env.PORT || 3000);