var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  email: String,
  username: String,
  fbid: String,
  playStyle: String,
  image: String,
  battleNet: String,
  lol: String,
  primaryUsername: String
});

module.exports = mongoose.model('User', userSchema);
