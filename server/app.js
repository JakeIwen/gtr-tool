require('dotenv').config();
var express = require('express');
var app = express();
var path = require('path');
var decoder = require('./modules/decoder');
var bodyParser = require('body-parser');
var scales = require('../public/data/scales');
var chords = require('../public/data/chords');
var mongoConnection = require('./modules/mongo-connection');
var databaseUri = require('./modules/database-config');
var songs = require('./routes/songs');
var users = require('./routes/users');
var pubSongs = require('./routes/public');
var mongoose = require('mongoose');
app.use('/public/', pubSongs);

// serve static files
app.use(express.static('public'));
app.use(bodyParser.json()); // needed for angular requests

// server index file
app.get('/home', function(req, res) {});

app.get('/scales', function(req, res) {
  res.send(scales);
});
app.get('/chords', function(req, res) {
  res.send(chords);
});

/** ---------- MONGOOSE CONNECTION HANDLING ---------- **/
mongoose.connect(databaseUri);
// mongoConnection.connect();


mongoose.connection.on('connected', function() {
  console.log('mongoose connected to ', databaseUri);
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

var portDecision = process.env.PORT || 3000;

app.listen(portDecision, function() {
  console.log("listening on port", portDecision);
});
app.use(decoder.token);
app.use('/users', users);
app.use('/songs/', songs);
