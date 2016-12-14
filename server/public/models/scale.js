var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// step 1: create the Schema
var scaleSchema = new Schema({
  names: String,
  longName: String,
  notes: Array
});

scaleSchema.pre('save', function(next) {
  next();
});

// step 2 - create the model
var Scale = mongoose.model('Scale', scaleSchema);

// step 3 - export our model
module.exports = Scale;
