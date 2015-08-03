var express = require('express');
var router = express.Router();
var User = require('../app/models/user.js')
var mongoose = require('mongoose');

mongoose.connect('mongodb://heroku_6mm8k2vr:j2llrlvlvu6pfr7os0m804pdj8@ds041188.mongolab.com:41188/heroku_6mm8k2vr');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/user', function(req, res) {
  console.log(req.body);
  var user = new User({
    username: req.body.username,
    email: req.body.email,
    image: req.body.image
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

router.get('/user/:username', function(req, res) {
  var requestedUser = req.params.username;
  console.log(req.params.username);
  User.findOne({ username: requestedUser }, function(err, user) {
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

module.exports = router;
