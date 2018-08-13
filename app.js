const express = require('express');
const init = require('@bit/tomlandau.movie-services.express.init');

// Create global app object
var app = express();
app.use(require('./routes'));
init(app);


// finally, let's start our server...
var server = app.listen( process.env.PORT || 3000, function(){
  console.log('Listening on port ' + server.address().port);
});
