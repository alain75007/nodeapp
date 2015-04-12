/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Group = require('../api/group/group.model');
var Message = require('../api/message/message.model');

Thing.find({}).remove(function() {
  Thing.create({
    name : 'Development Tools',
    info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name : 'Server and Client integration',
    info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    name : 'Smart Build System',
    info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
    name : 'Modular Structure',
    info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
    name : 'Optimized Build',
    info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  },{
    name : 'Deployment Ready',
    info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating admin user');
    }
  );
  User.create({
    provider: 'local',
    role: 'test2',
    name: 'Test2',
    email: 'test2@test2.com',
    password: 'test2'
  })
  .then(function(user) {
      console.log('finished populating user test2');
  })
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  },  function(err, user) {
    console.log('finished populating user test');
    console.log('UserId ' + user._id);
    Group.find({}).remove(function() {

      console.log('Create group de test 1');
      Group.create({
        _creator: user._id,
        name: "Group de test 1",
        emails: [],
        users: []
      }, function(err, group) {
        Message.find({}).remove(function() {
          console.log('message group is ' + group._id  + ' creator is ' + user._id);
          Message.create({group: group, content: 'Message 1', _creator: user});
          Message.create({group: group, content: 'Message 2', _creator: user});
        });
      });
      Group.create({
        _creator: user._id,
        name: "Group de test 2",
        emails: [],
        users: []
      })
    })
  });
});

