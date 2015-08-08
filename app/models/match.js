var mongoose = require('mongoose');

var matchSchema = mongoose.Schema({
  sender: String,
  receiver: String,
  time: Date,
  game: String,
  formattedTime: String,
  accepted: Boolean,
  originMd5: String,
  invitedMd5: String,
  originUser: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  invitedUser: {type: mongoose.Schema.Types.ObjectId, ref:'User'}
});

module.exports = mongoose.model('Match', matchSchema);
