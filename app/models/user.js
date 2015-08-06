var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
  sender: String,
  body: String
});

var matchScema = mongoose.Schema({
  sender: String,
  time: Date,
  game: String
});

var userSchema = mongoose.Schema({
  email: String,
  sc2: String,
  sc2id: String,
  username: String,
  fbid: String,
  playStyle: String,
  image: String,
  battleNet: String,
  lol: String,
  primaryUsername: String,
  md5: String,
  matches: [matchScema],
  messages: [messageSchema],
  endorsements: {
    skilled: String,
    friendly: String
  },
  feedback: {
    positive: Number,
    negative: Number
  }
});

module.exports = mongoose.model('User', userSchema);
