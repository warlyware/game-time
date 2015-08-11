var express = require('express');
var router = express.Router();
var User = require('../app/models/user.js');
var Feedback = require('../app/models/feedback.js');
var cors = require('cors');

router.post('/', cors(), function(req, res) {
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

    var feedback = new Feedback({
      body: req.body.body,
      poster: req.body.poster,
      feedbackVal: req.body.feedbackVal
    })

    user.feedback.total = user.feedback.total || 0;
    user.feedback.total += 1;



    if (req.body.feedbackVal === 'positive') {
      user.feedback.positive += 1;
    } else if (req.body.feedbackVal === 'negative') {
      user.feedback.negative += 1;
    }

    var positive = user.feedback.positive;
    var negative = user.feedback.negative;
    var total = user.feedback.total;
    user.feedback.positivePercentage = Math.round((positive/total) * 100);
    user.feedback.negativePercentage = Math.round((negative/total) * 100);

    user.feedbacks.push(feedback);

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

module.exports = router;
