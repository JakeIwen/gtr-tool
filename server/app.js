var express = require('express');
var app = express();
var path = require('path');

var bodyParser = require('body-parser');
var scales = require('./routes/scales');
var chords = require('./routes/chords');

var mongoose = require('mongoose');


// serve static files
app.use(express.static('public'));
app.use(bodyParser.json()); // needed for angular requests

// server index file
app.get('/home', function(req, res) {});

app.use('/scales', scales);
app.use('/chords', chords);


/** ---------- MONGOOSE CONNECTION HANDLING ---------- **/
var databaseUri = 'mongodb://localhost:27017/gtr-tool';
mongoose.connect(databaseUri);

mongoose.connection.on('connected', function() {
  console.log('mongoose connected to ', databaseUri);
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

app.listen(3000, function() {
  console.log("server running, check localhost:3000");
});
