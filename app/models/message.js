var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
  sender: String,
  body: String
});

module.exports = mongoose.model('Message', messageSchema);
