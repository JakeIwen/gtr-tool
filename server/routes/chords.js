var express = require('express');
var router = express.Router();
var Chord = require('../models/chord.js')


router.get('/' , function(req, res) {
  console.log('get chords');
 Chord.find( {},
  function (err, chords) {
    if(err) {
        console.log('Get ERR: ', err);
        res.sendStatus(500);
    } else {
      console.log('chordtypes', chords);
      res.send(chords);//try notes
    }
  });
});

 module.exports = router;
