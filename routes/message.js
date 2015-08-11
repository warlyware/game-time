var express = require('express');
var router = express.Router();
var User = require('../app/models/user.js');
var Message = require('../app/models/message.js');
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

    var message = new Message({
      body: req.body.body,
      sender: req.body.sender
    })

    user.messages.push(message);

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

router.delete('/:userId/:msgId', cors(), function(req, res) {
  var userId = req.params.userId;
  var msgId = req.params.msgId;
  User.findOne({ md5: userId }, function(err, user) {
    console.log('found user', user);
    if (err) {
      res.send(err);
      return;
    }
    if (user === null) {
      res.status(404).json({ error: "User Not Found" });
      return;
    }


    user.messages.remove({_id: msgId});
    user.save();

    res.json(user);
  });
});

module.exports = router;
