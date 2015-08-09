var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
  sender: String,
  body: String
});

var feedbacksSchema = mongoose.Schema({
  poster: String,
  body: String,
  poster: String,
  feedbackVal: String,
  type: String
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
  primaryUsername: {type: String, required: true},
  md5: String,
  matches: [{type: mongoose.Schema.Types.ObjectId, ref:'Match'}],
  messages: [messageSchema],
  endorsements: {
    skilled: String,
    friendly: String
  },
  feedbacks: [feedbacksSchema],
  feedback: {
    positive: Number,
    negative: Number,
    positivePercentage: Number,
    negativePercentage: Number,
    total: Number
  }
});

module.exports = mongoose.model('User', userSchema);
