var express = require('express');
var router = express.Router();
var User = require('../app/models/user.js');
var Match = require('../app/models/match.js')
var moment = require('moment');

router.post('/', function(req, res) {
  var originUser = req.body.originMd5;
  var invitedUser = req.body.invitedMd5;

  User.findOne({ md5: originUser }, function(err, oUser) {

    console.log('found user 1');
    if (err) {
      res.send(err);
    }
    if (oUser === null) {
      res.status(404).json({ error: "User Not Found" });
      return;
    }

    User.findOne({ md5: invitedUser}, function(err, iUser) {
      console.log('found user 2');
      if (err) {
        res.send(err);
      }
      if (iUser === null) {
        res.status(404).json({ error: "User Not Found" });
        return;
      }

      var matchMoment = moment(req.body.matchTime).format("dddd, MMMM Do YYYY, h:mm:ss a");
      var milTime = moment(req.body.matchTime).unix();

      var match = new Match({
        game: req.body.game,
        time: req.body.matchTime,
        sender: oUser.primaryUsername,
        receiver: iUser.primaryUsername,
        formattedTime: matchMoment,
        milTime: milTime,
        originMd5: oUser.md5,
        invitedMd5: iUser.md5,
        originUser: oUser._id,
        accepted: false,
        invitedUser: iUser._id
      })

      oUser.matches.push(match);
      iUser.matches.push(match);

      console.log(iUser);
      console.log(oUser);
      match.save();

      oUser.save(function(err, savedUser) {
        if (err) {
          console.log(err);
          res.status(400).json({ error: "Validation Failed" });
          return;
        }
        console.log("Origin User Saved:", savedUser);
      });

      iUser.save(function(err, savedUser) {
        if (err) {
          console.log(err);
          res.status(400).json({ error: "Validation Failed" });
          return;
        }
        console.log("Invited User Saved:", savedUser);
      });

      res.json({ requestor: oUser, invited: iUser, match: match });



    });

  });
});

//Route for accepted match
router.patch('/', function(req, res) {

  var matchId = req.body.matchId;

  Match.findOne({ _id: matchId }, function(err, match) {
    if (err) {
      res.send(err);
    }
    if (match === null) {
      res.status(404).json({ error: "User Not Found" });
      return;
    }

    console.log('```````match```````', match);
    match.accepted = true;
    match.save(function(err, savedMatch) {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Validation Failed" });
    }
    res.json(savedMatch);

    });
  });
});

router.delete('/decline/:user/:matchId', function(req, res) {
  var invitedUser = req.params.user;
  var matchId = req.params.matchId;
  User.findOne({ md5: invitedUser }, function(err, iUser) {
    console.log('found user', iUser);
    if (err) {
      res.send(err);
      return;
    }
    if (iUser === null) {
      res.status(404).json({ error: "User Not Found" });
      return;
    }


    iUser.matches.remove({_id: matchId});
    iUser.save();

    Match.findOne({ _id: matchId }, function(err, match) {
      console.log('found match', match);
      if (err) {
        res.send(err);
        return;
      }
      if (match === null) {
        res.status(404).json({ error: "No matches" });
        return;
      }

      var originUser = match.originUser;

      User.findOne({ _id: originUser }, function(err, oUser) {
        if (err) {
          res.send(err);
          return;
        }
        if (oUser === null) {
          res.status(404).json({ error: "No matches" });
          return;
        }
        oUser.matches.remove({_id: matchId});
        oUser.save();
      });

      match.remove();

    });
    res.json(iUser);
  });
});

// Route for player to cancel own invite
router.delete('/cancel/:user/:matchId', function(req, res) {
  var originUser = req.params.user;
  var matchId = req.params.matchId;
  User.findOne({ md5: originUser }, function(err, oUser) {
    console.log('found user', oUser);
    if (err) {
      res.send(err);
      return;
    }
    if (oUser === null) {
      res.status(404).json({ error: "User Not Found" });
      return;
    }


    oUser.matches.remove({_id: matchId});
    oUser.save();

    Match.findOne({ _id: matchId }, function(err, match) {
      console.log('found match', match);
      if (err) {
        res.send(err);
        return;
      }
      if (match === null) {
        res.status(404).json({ error: "No matches" });
        return;
      }

      var invitedUser = match.invitedUser;

      User.findOne({ _id: invitedUser }, function(err, iUser) {
        if (err) {
          res.send(err);
          return;
        }
        if (iUser === null) {
          res.status(404).json({ error: "No matches" });
          return;
        }
        iUser.matches.remove({_id: matchId});
        iUser.save();
      });

      match.remove();

    });
    res.json(oUser);
  });
});

router.get('/received/:id', function(req, res) {
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
    Match.find({ invitedUser: user._id }, function(err, matches) {
      if (err) {
        res.send(err);
      }
      if (matches === null) {
        res.status(404).json({ error: "No matches" });
        return;
      }

      var acceptedMatches = [];
      var receivedMatches = [];
      console.log('matches:', matches.length);
      for (var i = 0; i < matches.length; i++) {
        console.log('loop:', matches[i]);
        if (matches[i].accepted === true) {
          console.log('accepted match:', matches[i]);
          acceptedMatches.push(matches[i]);
        } else {
          console.log('not accepted match:', matches[i]);
          receivedMatches.push(matches[i]);
        }
      }

      res.json({accepted: acceptedMatches, received: receivedMatches});

    });
    console.log(user);
  });
});

router.get('/sent/:id', function(req, res) {
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

      var acceptedMatches = [];
      var receivedMatches = [];
      console.log('matches:', matches.length);
      for (var i = 0; i < matches.length; i++) {
        console.log('loop:', matches[i]);
        if (matches[i].accepted === true) {
          console.log('accepted match:', matches[i]);
          acceptedMatches.push(matches[i]);
        } else {
          console.log('not accepted match:', matches[i]);
          receivedMatches.push(matches[i]);
        }
      }

      res.json({accepted: acceptedMatches, received: receivedMatches});

    });
    console.log(user);
  });
});

module.exports = router;
