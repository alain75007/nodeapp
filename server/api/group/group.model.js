'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var User = require('../user/user.model');

var _ = require('lodash');

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
      if (!this.isNew) return next();
      this.emails = _.uniq(this.emails);
      var self = this;
      User.find().where('email').in(self.emails).exec(function(err, users) {
        self.users = users;
        var index = self.users.indexOf(self._creator);
        if (index === -1) self.users.push(self._creator);
        var usersEmails = _.pluck(users, 'email');
        self.emails = _.difference(self.emails, usersEmails);
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
GroupSchema.methods = {
  removeUser: function(user, callback) {
    /*
    var index = this.emails.indexOf(user.email);
    if (index > -1) this.emails.splice(index, 1);
    */
    var index = this.users.indexOf(user._id);
    if (index > -1) this.users.splice(index, 1);
    if (this.emails.length  || this.users.length) { 
      this.save(function(err, data) {
        if (err) throw(err);
        return callback(err);
      });
    }
    else {
      this.remove(function(err) {
        if (err) throw(err);
        return callback(err);
      });
    }
  }
};

module.exports = mongoose.model('Group', GroupSchema);
