'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var User = require('../user/user.model');

var GroupSchema = new Schema({
  _creator:  { type: Schema.Types.ObjectId, ref: 'User', index: true },
  name: { type: String, required: true },
  info: String,
  emails: [],
  active: Boolean,
  users: [{ type: Schema.Types.ObjectId, ref: 'User', index: true }]
});

GroupSchema
  .pre('save', function(next) {
      var self = this;
      User.find().where('email').in(self.emails).exec(function(err, users) {
        self.users = users;
        self.users.push(self._creator);
        next();
      });
  });

  //Schema.path('name').required(true);

/*
// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
  }, 'Email cannot be blank');

*/

module.exports = mongoose.model('Group', GroupSchema);
