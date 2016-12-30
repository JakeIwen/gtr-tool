var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var songSchema = new Schema({
  title: { type: String, required: true },
  song: { type: String, required: true },
  key: { type: String, required: false }
});

var Song = mongoose.model('Song', songSchema);

module.exports = Song
