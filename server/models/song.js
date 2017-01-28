var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var songSchema = new Schema({
  title: { type: String, required: true, unique: true },
  song: { type: String, required: true },
  email: { type: String, required: true },
  date_added: { type: Date, required: true },
  key: { type: String, required: false }
});

var Song = mongoose.model('Song', songSchema);

module.exports = Song
