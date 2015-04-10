'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var User = require('../user/user.model');

var GroupSchema = new Schema({
  _creator:  { type: Schema.Types.ObjectId, ref: 'User' },
  name: String,
  info: String,
  emails: [],
  active: Boolean,
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

GroupSchema
  .pre('save', function(next) {
      //if (!this.emails.length) return next();
      var self = this;
      User.find().where('email').in(self.emails).exec(function(err, users) {
        //console.log('Users length = ' + users.length);
        //console.log('Users = ' + users);
        self.users = users;
        self.users.push(self._creator);
        next();
      });
  });

module.exports = mongoose.model('Group', GroupSchema);
