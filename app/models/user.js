var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  email: String,
  username: String,
  fbid: String,
  playStyle: String,
  image: String,
  battleNet: String,
  lol: String,
  primaryUsername: String,
  md5: String,
  feedback: {
    positive: Number,
    negative: Number
  }
});

module.exports = mongoose.model('User', userSchema);
