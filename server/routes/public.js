var express = require('express');
var router = express.Router();
var Song = require('../models/song');
var bodyParser = require('body-parser');

router.get("/", function(req, res){
  console.log('get public');
  Song.find( {private: false}, function (err, publicTitles){
    if (err) {
      console.log('Error COMPLETING song query task', err);
      res.sendStatus(500);
    } else {
      res.send(publicTitles);
    }
  })
});

module.exports = router;
