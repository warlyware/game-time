var express = require('express');
var router = express.Router();
var User = require('../app/models/user.js');
var md5 = require('md5');
var lookup = require('lolking-lookup');

var userImg;

router.get('/:id', cors(), function(req, res) {
  var requestedUser = req.params.id;
  User.findOne({ md5: requestedUser }, function(err, user) {
    if (err) {
      res.send(err);
    }
    if (user === null) {
      res.status(404).json({ error: "User Not Found" });
      return;
    }
    res.json(user);
  });
});

// Route to update user
router.patch('/', cors(), function(req, res) {
  var requestedUser = req.body.md5;
  var endorsement = req.body.endorsement;
  var image = req.body.image;
  var playStyle = req.body.playStyle;

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

router.get('/login/:id', cors(), function(req, res) {
  var requestedUser = md5(req.params.id);
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

router.post('/', cors(), function(req, res) {

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
      negative: 0,
      total: 0,
      positivePercentage: 0,
      negativePercentage: 0
    }
  });

  if (user.lol) {
    lookup('na', req.body.lol, function(error, loluser) {
      console.log('loluser:', loluser);
      if (error) {
        throw error;
        res.status(400).json('API error');
      }
      imgId = loluser.profile_icon_id;
      user.image = 'http://lkimg.zamimg.com/shared/riot/images/profile_icons/profileIcon' + imgId + '.jpg';
      user.save(function(err, savedUser) {
        if (err) {
          console.log(err);
          res.status(400).json({ error: "Validation Failed" });
        }

        console.log("User Saved:", savedUser);
        res.json(savedUser);
      });
    });
  } else {
    user.image = 'http://zdjecia.pl.sftcdn.net/pl/scrn/115000/115712/starcraft-2-33.png';
    user.save(function(err, savedUser) {
      if (err) {
        console.log(err);
        res.status(400).json({ error: "Validation Failed" });
      }

      res.json(savedUser);
    });
  }
});

router.get('/', cors(), function(req, res) {
  User.find({ }, function(err, users) {
    if (err) {
      res.send(err);
    }
    if (users === null) {
      res.status(404).json({ error: "Users Not Found" });
      return;
    }
    res.json(users);
  });
});

module.exports = router;
