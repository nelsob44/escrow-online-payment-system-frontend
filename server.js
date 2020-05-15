const express = require('express');
const path = require('path');
const app = express();

// Serve static files....
app.use(express.static(__dirname + '/dist'));

// Send all requests to index.html
app.get('/*', function(req, res) {
  
    res.redirect(301, 'https://www.bridgepaysystems.com' + req.url).then(() => {
      res.sendFile(path.join(__dirname + '/dist/index.html'));
    });
  
});

// default Heroku PORT
app.listen(process.env.PORT || 3000);