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
  users: [{ type: Schema.Types.ObjectId, ref: 'User', index: true, unique: true }]
});

GroupSchema
  .pre('save', function(next) {
      this.emails = _.uniq(this.emails);
      var self = this;
      User.find().where('email').in(self.emails).where('_id').nin(this.users).exec(function(err, users) {
        self.users = _.union(self.users, users);
        if (self.isNew) {
          var index = self.users.indexOf(self._creator);
          if (index === -1) self.users.push(self._creator);
        }
        /*
        else if (users.length) {
          if (self.users.length) {
            // remove duplicate users :
            var added = self.users.addToSet(_.pluck(users, '_id'));
          }
          else {
            self.users = users;
          }
        }
        */
        User.find().where('_id').in(self.users).select('email').exec(function(err, users) {
            self.emails = _.difference(self.emails, _.pluck(users, 'email'));
            next();
        });

      });
  });

GroupSchema.methods = {
  addEmails: function(emails, callback) {
    if (!emails) return callback(new Error('No emails given')); 
    this.emails = _.union(this.emails, emails);
    this.save(function(err, group) {
      if (err) throw(err);
      return callback(err, group);
    });
  },
  
  removeUser: function(user, callback) {
    var index = this.users.indexOf(user._id);
    if (index > -1) this.users.splice(index, 1);
    if (this.emails.length  || this.users.length) { 
      this.save(function(err, data) {
        if (err) throw(err);
        return callback();
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
