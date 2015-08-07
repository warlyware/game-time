var mongoose = require('mongoose');

var matchSchema = mongoose.Schema({
  sender: String,
  time: Date,
  game: String,
  formattedTime: String,
  accepted: Boolean,
  originUser: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  invitedUser: {type: mongoose.Schema.Types.ObjectId, ref:'User'}
});

module.exports = mongoose.model('Match', matchSchema);
