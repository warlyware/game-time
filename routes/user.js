var express = require('express');
var router = express.Router();
var User = require('../app/models/user.js');
var md5 = require('md5');

router.get('/:id', function(req, res) {
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

// Route to update user
router.patch('/', function(req, res) {
  var requestedUser = req.body.md5;
  var endorsement = req.body.endorsement;
  var image = req.body.image;
  var playStyle = req.body.playStyle;

  console.log(requestedUser);

  User.findOne({ md5: requestedUser }, function(err, user) {
    if (err) {
      res.send(err);
    }
    if (user === null) {
      res.status(404).json({ error: "User Not Found" });
      return;
    }

    // If updating endorsement
    if (endorsement) {
      var endorsementVal = user.endorsements[endorsement];
      console.log('updating endorsement: ' + endorsementVal);
      user.endorsements[endorsement] = parseInt(endorsementVal) + 1;
    }

    // If updating image url
    if (image) {
      console.log('updating image');
      user.image = image;
    }

    // If updating playStyle
    if (playStyle) {
      user.playStyle = playStyle;
    }

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

router.get('/login/:id', function(req, res) {
  console.log('login');
  var requestedUser = md5(req.params.id);
  console.log('simple login', requestedUser);
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

router.post('/', function(req, res) {
  console.log(req.body);
  var user = new User({
    primaryUsername: req.body.primaryUsername,
    email: req.body.email,
    md5: md5(req.body.uid),
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


module.exports = router;
