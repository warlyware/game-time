var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  email: String,
  username: String,
  token: String,
  image: String
});

module.exports = mongoose.model('User', userSchema);
