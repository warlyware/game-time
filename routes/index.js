var express = require('express');
var router = express.Router();
var md5 = require('md5');
var User = require('../app/models/user.js');
var Message = require('../app/models/message.js');
var Match = require('../app/models/match.js');
var mongoose = require('mongoose');
var bnet = require('battlenet-api')();
var lookup = require('lolking-lookup');
var moment = require('moment');

mongoose.connect('mongodb://heroku_6mm8k2vr:j2llrlvlvu6pfr7os0m804pdj8@ds041188.mongolab.com:41188/heroku_6mm8k2vr');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/message', function(req, res) {
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

    var message = new Message({
      body: req.body.body,
      sender: req.body.sender
    })

    user.messages.push(message);

    message.save();
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

router.post('/user', function(req, res) {
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

// Route to update user
router.patch('/user/', function(req, res) {
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

router.get('/user/login/:id', function(req, res) {
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
