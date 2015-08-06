var mongoose = require('mongoose');

var matchSchema = mongoose.Schema({
  sender: String,
  time: Date,
  game: String,
  formattedTime: String,
  accepted: Boolean
});

module.exports = mongoose.model('Match', matchSchema);
