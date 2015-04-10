'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MessageSchema = new Schema({
  group:  { type: Schema.Types.ObjectId, ref: 'Group' },
  _creator:  { type: Schema.Types.ObjectId, ref: 'User' },
  content: String,
  content_type: { type: String, default: 'text' },
  creation_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);
