var express = require('express');
var router = express.Router();
var Scale = require('../models/scale.js')

router.get('/:query', function(req, res) {
  query = req.params.query;
  console.log('query', query);
 Scale.find( { "names": query },
  function (err, scales) {
    if(err) {
        console.log('Get ERR: ', err);
        res.sendStatus(500);
    } else {
      console.log('scale', scales);
      res.send(scales);//try notes
    }
  });
});

router.get('/' , function(req, res) {
  console.log('get names');
 Scale.find( {},
  function (err, scales) {
    if(err) {
        console.log('Get ERR: ', err);
        res.sendStatus(500);
    } else {
      console.log('names', scales);
      res.send(scales);//try notes
    }
  });
});

 module.exports = router;
