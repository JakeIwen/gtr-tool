var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Song = require('../models/song');
var bodyParser = require('body-parser');

router.get("/titles", function(req, res){
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
        console.log('Invalid user. permission denied.', req.decodedToken.email);
        res.sendStatus(403);
      } else {
        // get all of the song data neded to pupulate DOM table
        Song.find( {}, '-song', {sort: {title: 1}}, function (err, titles){
          if (err) {
            console.log('Error COMPLETING song query task', err);
            res.sendStatus(500);
          } else {
            // return all of the results where a specific user has permission
            console.log('title get success');
            res.send(titles);
          }
        });
      }
    }
  });
});

router.get("/title/:id", function(req, res){
  var userEmail = req.decodedToken.email;
  var songId = req.params.id;
  console.log('songid', req.params.id);
  // Check the user's exitence based on their email
  User.findOne({ email: userEmail }, function (err, user) {
    if (err) {
      console.log('Error COMPLETING user query task', err);
      res.sendStatus(500);
    } else {
      console.log(user);
      if(user == null) {
        // If the user is not in the database, return a forbidden error status
        console.log('No user found with that email. Email: ', req.decodedToken.email);
        res.sendStatus(403);
      } else {
        // find requested song
        Song.findOne( { _id: songId }, function (err, song){
          if (err) {
            console.log('Error COMPLETING song query task', err);
            res.sendStatus(500);
          } else {
            // console.log('song', song);
            console.log('success');
            res.send(song);
          }
        });
      }
    }
  });
});

router.post("/", function(req, res){
  var songData = req.body;
  songData.email = req.decodedToken.email;
  // Check the user's exitence based on their email
  var NewSong = new Song(songData);
  NewSong.save(function(err, data) {
    console.log('saved song');
    if(err) {
      console.log('ERR: ', err);
      res.sendStatus(500);
    } else {
      //res.send(data);
      res.sendStatus(201);
    }
  });
});

router.delete("/title/:id", function(req, res){
  var userEmail = req.decodedToken.email;
  var songId = req.params.id;
  console.log('songid', req.params.id);
  // Check the user's exitence based on their email
  User.findOne({ email: userEmail }, function (err, user) {
    if (err) {
      console.log('Error COMPLETING user query task', err);
      res.sendStatus(500);
    } else {
      console.log(user);
      if(user == null) {
        // If the user is not in the database, return a forbidden error status
        console.log('Invalid user. Permission denied -', req.decodedToken.email);
        res.sendStatus(403);
      } else {
        // find specific song and delete
        Song.find( { _id: songId } ).remove( function (err){
          if (err) {
            console.log('Error COMPLETING song query task', err);
            res.sendStatus(500);
          } else {
            res.sendStatus(202);
          }
        });
      }
    }
  });
});

module.exports = router;
