var express = require('express');
var router = express.Router();
var User = require('../app/models/user.js');
var Message = require('../app/models/message.js');

router.post('/', function(req, res) {
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

module.exports = router;
