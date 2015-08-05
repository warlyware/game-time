var express = require('express');
var router = express.Router();
var md5 = require('md5');
var User = require('../app/models/user.js');
var mongoose = require('mongoose');
var bnet = require('battlenet-api')();
var lookup = require('lolking-lookup');

mongoose.connect('mongodb://heroku_6mm8k2vr:j2llrlvlvu6pfr7os0m804pdj8@ds041188.mongolab.com:41188/heroku_6mm8k2vr');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/user', function(req, res) {
  console.log(req.body);
  var user = new User({
    primaryUsername: req.body.primaryUsername,
    email: req.body.email,
    md5: md5(req.body.email),
    playStyle: req.body.playStyle,
    sc2: req.body.sc2,
    sc2id: req.body.sc2id,
    lol: req.body.lol,
    fbid: req.body.fbid,
    image: 'http://placehold.it/250x250',
    feedback: {
      positive: 0,
      negative: 0
    }
  });

  user.save(function(err, savedUser) {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Validation Failed" });
    }
    console.log("User Saved:", savedUser);
    res.json(savedUser);
  });
});

router.patch('/user/', function(req, res) {
  var requestedUser = req.body.md5;
  var endorsement = req.body.endorsement;
  // console.log(endorsement);
  User.findOne({ md5: requestedUser }, function(err, user) {
    if (err) {
      res.send(err);
    }
    if (user === null) {
      res.status(404).json({ error: "User Not Found" });
      return;
    }
    var endorsementVal = user.endorsements[endorsement];
    console.log(endorsementVal);
    user.endorsements[endorsement] = parseInt(endorsementVal) + 1;

    user.save(function(err, savedUser) {
      if (err) {
        console.log(err);
        res.status(400).json({ error: "Validation Failed" });
      }
      console.log("User Saved:", savedUser);
      res.json(savedUser);
    });
  });

});

router.get('/user/login/:id', function(req, res) {
  console.log('login');
  var requestedUser = md5(req.params.id);
  console.log(req.params.id);
  User.findOne({ md5: requestedUser }, function(err, user) {
    if (err) {
      res.send(err);
    }
    if (user === null) {
      res.status(404).json({ error: "User Not Found" });
      return;
    }
    console.log(user);
    res.json(user);
  });
});

router.get('/user/:id', function(req, res) {
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
    console.log(user);
    res.json(user);
  });
});

router.get('/sc2data/:sc2id/:sc2', function(req, res) {
  var sc2name = req.params.sc2;
  var sc2id = req.params.sc2id;
  bnet.sc2.profile.profile({
    origin: 'us',
    id: sc2id,
    region: 1,
    name: sc2name
  }, {
    apikey: '546vvy2c49eswk8tndj4fjsp7yswzxvs'
  }, function(err, resp) {
    console.log(resp);
    res.json(resp);
  });
});

router.get('/loldata/:loluser', function(req, res) {
  lookup('na', req.params.loluser, function(error, data) {
    if (error) {
      throw error;
      res.status(400).json('API error');
    }
    console.log(data);
    res.json(data);
  });
});

module.exports = router;
