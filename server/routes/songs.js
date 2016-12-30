var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Song = require('../models/song');
var bodyParser = require('body-parser');


router.get("/", function(req, res){
  var userEmail = req.decodedToken.email;
  // Check the user's exitence based on their email
  User.findOne({ email: userEmail }, function (err, user) {
    if (err) {
      console.log('Error COMPLETING user query task', err);
      res.sendStatus(500);
    } else {
      console.log(user);
      if(user == null) {
        // If the user is not in the database, return a forbidden error status
        console.log('No user found with that email. Have you added this person to the database? Email: ', req.decodedToken.email);
        res.sendStatus(403);
      } else {
        // Based on the clearance level of the individual, give them access to different information
        Song.find( {}, function (err, songs){
          if (err) {
            console.log('Error COMPLETING song query task', err);
            res.sendStatus(500);
          } else {
            // return all of the results where a specific user has permission
            console.log('songs', songs);
            res.send(songs);
          }
        });
      }
    }
  });
});




module.exports = router;
