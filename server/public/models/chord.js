var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// step 1: create the Schema
var chordSchema = new Schema({
  names: String,
  longName: String,
  notes: Array
});

chordSchema.pre('save', function(next) {
  next();
});

// step 2 - create the model
var Chord = mongoose.model('Chord', chordSchema);

// step 3 - export our model
module.exports = Chord;
