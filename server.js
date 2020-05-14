const express = require('express');
const path = require('path');
const app = express();

// Serve static files....
app.use(express.static(__dirname + '/dist'));

// Send all requests to index.html
app.get('/*', function(req, res) {
  if(req.headers['x-forwarded-proto'] !=='https'){
    res.redirect(301, 'https://www.bridgepaysystems.com' + req.url);
console.log(req.headers['x-forwarded-proto']);
console.log('https://www.bridgepaysystems.com' + req.url);
    res.sendFile(path.join(__dirname + '/dist/index.html'));
  } else {
    console.log('https://www.bridgepaysystems.com' + req.url);
    res.sendFile(path.join(__dirname + '/dist/index.html'));
  }
  
  
});

// default Heroku PORT
app.listen(process.env.PORT || 3000);