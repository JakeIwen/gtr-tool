var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Song = require('../models/song');
var bodyParser = require('body-parser');

router.post("/", function(req, res){
  var userEmail = req.decodedToken.email;
  console.log('user email', userEmail);
  // Check the user's level of permision based on their email
  User.findOne({ email: userEmail }, function (err, user) {
    if (err) {
      res.sendStatus(500);
    } else {
      console.log(user);
      if(user == null) {
        // If the user is not in the database, add them
        var NewUser = new User(req.decodedToken);
        console.log('THIS IS THE NEW USER ', NewUser);
        NewUser.save({ email: NewUser.email  }, function (err){
          if (err) {
            console.log('Error COMPLETING new user add task', err);
            res.sendStatus(500);
          } else {
            // return all of the results where a specific user has permission
            console.log('sucessfully created new user');
            res.sendStatus(201);
          }
        });
        //compare clearance levels of old and new user
      } else {
        res.sendStatus(202);
        console.log('logged in as existing user');
      }
    }
  });
});

module.exports = router;
