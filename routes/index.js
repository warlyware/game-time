var express = require('express');
var router = express.Router();
var md5 = require('md5');
var Match = require('../app/models/match.js');
var mongoose = require('mongoose');
var moment = require('moment');

mongoose.connect('mongodb://heroku_6mm8k2vr:j2llrlvlvu6pfr7os0m804pdj8@ds041188.mongolab.com:41188/heroku_6mm8k2vr');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/match', function(req, res) {
  var requestedUser = req.body.md5;

  User.findOne({ md5: requestedUser }, function(err, user) {
    console.log('found user');
    if (err) {
      res.send(err);
    }
    if (user === null) {
      res.status(404).json({ error: "User Not Found" });
      return;
    }

    var matchMoment = moment(req.body.Matchtime).format("dddd, MMMM Do, h:mm:ss a");

    var match = new Match({
      game: req.body.game,
      time: req.body.matchTime,
      sender: req.body.sender,
      formattedTime: matchMoment,
      originUser: user._id
    })

    user.matches.push(match);

    console.log(user);
    match.save();
    user.save(function(err, savedUser) {
      if (err) {
        console.log(err);
        res.status(400).json({ error: "Validation Failed" });
        return;
      }
      console.log("User Saved:", savedUser);
      res.json(savedUser);
    });
  });
});

router.get('/match/:id', function(req, res) {
  var requestedUser = req.params.id;
  console.log(req.params.id);
  User.findOne({ md5: requestedUser }, function(err, user) {
    if (err) {
      res.send(err);
    }
    if (user === null) {
      res.status(404).json({ error: "User Not Found" });
      return;
    }
    Match.find({ originUser: user._id }, function(err, matches) {
      if (err) {
        res.send(err);
      }
      if (matches === null) {
        res.status(404).json({ error: "No matches" });
        return;
      }
      res.json(matches);

    });
    console.log(user);
  });
});

module.exports = router;
