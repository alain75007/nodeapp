'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var User = require('../user/user.model');

var GroupSchema = new Schema({
  _creator:  { type: Schema.Types.ObjectId, ref: 'User' },
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Group', GroupSchema);
