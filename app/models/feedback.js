var mongoose = require('mongoose');

var feedbacksSchema = mongoose.Schema({
  poster: String,
  body: String,
  poster: String,
  feedbackVal: String
});

module.exports = mongoose.model('Feedback', feedbacksSchema);
