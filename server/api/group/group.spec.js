'use strict'; 
var should = require('should');
var app = require('../../app');
var User = require('../user/user.model');
var Group = require('./group.model');
var Subscriber = require('./subscriber/subscriber.model');
var async = require('async');
var mongoose = require('mongoose');
var _ = require('lodash');

var io = require('socket.io-client');
var options ={
  transports: ['websocket'],
  'force new connection': true,
  path: '/socket.io-client'
};

var request = require('supertest');
var userFixture = require('../user/user.fixtures');
var users;
var user;
var token;
var group;

function connectUser(user, callback) {
  user.client = io.connect('http://localhost:9000', options)
    .on('connect', function(a, b) {
      return callback(null, user);
    })
    .on('connect_error', function(err, b) {
      return callback(err);
    })
    .on('connect_timeout', function(err, b) {
      return callback(err);
    });
}

function connectUsers(done) {
    async.parallel([ // tableau de fonctions à exécuter en parallèle
      function(callback) {
        connectUser(users[0],callback);
      },
      function(callback) {
        connectUser(users[1],callback);
      }
    ],
    function(err, result) {
      // Fonction appelée quand founction1 et founction 2 sont toutes les deux terminées 
      //var users = result; // contient {user, user}
      users = result;
      done(err);
    });
}

function login(done, userIndex) {
    users = userFixture.getUsers();
    userIndex = userIndex || 0;
    user = users[userIndex];
    request(app)
    .post('/auth/local')
    .send({ email: user.email, password: user.password })
    .expect(200)
    .end(function(err, res) {
      if ( err ) done(err);
      token = res.body.token;
      done();
    });
}
  before(function(done) { 
    userFixture.createUsers(done);
  });

  before(function(done) { 
    login(done);
  });
  before(function(done) { 
    connectUsers(done);
  });

describe('POST /api/groups (add group)', function() {

  it('should respond with a correct JSON object', function(done) {
    request(app)
    .post('/api/groups')
    .send({ name: 'test', emails: [ 'toto@toto.com', 'test2@test.com'] })
    .set('Authorization', 'Bearer ' + token)
    .expect(201)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);
      group = res.body;
      res.body.should.be.instanceof(Object);
      res.body.name.should.be.equal('test');
      res.body.emails.length.should.be.equal(1, 'wrong emails number');
      res.body.emails[0].should.be.equal('toto@toto.com');
      res.body._creator.should.be.equal(user._id.toString());

      Subscriber.find({group_id: group._id}, function(err, subscribers) {
        if ( err ) return done(err);
        subscribers.length.should.be.equal(3, 'wrong number of subscribers');
        should.exist(_.findWhere(subscribers, {user_id: users[0]}), 'user0 not found');
        should.exist(_.findWhere(subscribers, {user_id: users[1]}), 'user1 not found');
        should.exist(_.findWhere(subscribers, {email: users[0]}), 'user0 not found');
        done();
      });
    });
  });

  it('should remove duplicate subscribers emails', function(done) {
    request(app)
    .post('/api/groups')
    .send({ name: 'test', emails: [ 'toto@toto.com', 'toto@toto.com', 'test2@test.com', 'test2@test.com', 'test1@test.com'] })
    .set('Authorization', 'Bearer ' + token)
    .expect(201)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);
      res.body.emails.length.should.be.equal(1, 'wrong emails number');
      res.body.users.length.should.be.equal(2, 'wrong users number');
      done();
    });
  });

  it('should respond with 401', function(done) {
    request(app)
    .post('/api/groups')
    .send({ name: 'test'})
    .expect(401)
    .end(function(err, res) {
      if (err) return done(err);
      done();
    });
  });

  it('should send new group to subscriber users (socketio)', function(done) {
    var data = {
      _creator: user._id,
      name: 'Test post group socketio',
      emails: ['titi@titi.com', users[1].email, 'toto@toto.com']
    };

    var checkMessage = function(user, callback) {
      var tag = 'group_' + user._id + ':save';
      user.client.on(tag, function(msg){
        data._creator.toString().should.equal(msg._creator);
        data.name.should.equal(msg.name);
        user.client.disconnect();
        return callback(null);
      });
    };

    var checkMessages = function(done) {
      async.parallel([
        function(callback) {
          checkMessage(users[0], callback);
        },
        function(callback) {
          checkMessage(users[1], callback);
        }],
        function(err, result) {
          done(err);
        }
      );
    }
    checkMessages(done);
    Group.create(data, function(err, group) {
      if(err) done(err);
    });
  });
});



describe('DELETE /api/groups/nnn (delete group)', function() {

  it('should delete user from group user list', function(done) {
    request(app)
    .post('/api/groups')
    .send({ name: 'test', emails: [ 'toto@toto.com', 'test2@test.com'] })
    .set('Authorization', 'Bearer ' + token)
    .expect(201)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);
      var group1 = res.body;
      request(app)
      .del('/api/groups/' + group1._id)
      .set('Authorization', 'Bearer ' + token)
      .expect(204)
      .end(function(err, res) {
        if (err) return done(err);
        Group.findOne({_id: group1._id}, function(err, group2) {
          if (err) return done(err, 'Group not found!!!');
          var index = group2.users.indexOf(user._id);
          index.should.be.equal(-1, 'User still in group ');
          done();
        });
      });
    });
  });

  it('should delete group  when no more  user in group user list', function(done) {
    request(app)
    .post('/api/groups')
    .send({ name: 'test22' })
    .set('Authorization', 'Bearer ' + token)
    .expect(201)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);
      var group = res.body;
      request(app)
      .del('/api/groups/' + group._id)
      .set('Authorization', 'Bearer ' + token)
      .expect(204)
      .end(function(err, res) {
      if (err) return done(err);
        Group.findOne({_id: group._id}, function(err, group2) {
          if (err) return done(err, 'Error on find group!!');
          (!!group2).should.be.equal(false);
          done();
        });
      });
    });
  });

  it('should respond with 401 if not logged', function(done) {
    request(app)
    .del('/api/groups/' + group._id)
    .expect(401)
    .end(function(err, res) {
      if (err) return done(err);
      done();
    });
  });

  it('should notify group subscribers if user deleted (socketio)', function(done) {
    var data = {
      _creator: user._id,
      name: 'Test post group socketio',
      emails: ['titi@titi.com', users[1].email, 'toto@toto.com']
    };

    var checkMessage = function(user, action, callback) {
      var tag = 'group_' + user._id + ':' + action;
      user.client.on(tag, function(msg){
        debugger;
        data._creator.toString().should.equal(msg._creator);
        data.name.should.equal(msg.name);
        user.client.disconnect();
        return callback(null);
      });
    };

    var checkMessages = function(done) {
      async.parallel([
        function(callback) {
          checkMessage(users[0], 'remove', callback);
          // TODO check remove
        },
        function(callback) {
          checkMessage(users[1], 'save', callback);
          // TODO check save 
        }],
        function(err, result) {
          done(err);
        }
      );
    }
    Group.create(data, function(err, group) {
      if(err) done(err);
      checkMessages(done);
    });
  });
});

describe('POST /api/groups/nnn/emails', function() {
  it('should respond with 403 if not the creator', function(done) {
    var data = {
      _creator: users[1]._id,
      name: 'Test',
      emails: [users[0].email]
    };
    Group.create(data, function(err, group) {
      if(err) done(err);
      request(app)
      .post('/api/groups/' + group._id + '/emails')
      .send({emails: ['nobody@nobody.com']})
      .set('Authorization', 'Bearer ' + token)
      .expect(403)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      })
    });
  });

  it('should respond with error if no emails', function(done) {
    var data = {
      _creator: user._id,
      name: 'Test',
      emails: ['titi@titi.com']
    };
    Group.create(data, function(err, group) {
      if(err) done(err);
      request(app)
      .post('/api/groups/' + group._id + '/emails')
      //.send({emails: ['nobody@nobody.com']})
      .set('Authorization', 'Bearer ' + token)
      .expect(422)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      })
    });
  });

  it('should add users to empty users array', function(done) {
    var data = {
      _creator: user._id,
      name: 'Test333',
      emails: ['titi@titi.com', users[1].email, 'toto@toto.com']
    };
    Group.create(data, function(err, group) {
      if(err) done(err);
       group.emails.length.should.be.equal(2, 'wrong emails number after creation');
       group.users.length.should.be.equal(2, 'wrong users number after creation');
      request(app)
      .post('/api/groups/' + group._id + '/emails')
      .send({emails: ['nobody@nobody.com', 'titi@titi.com', users[1].email]})
      .set('Authorization', 'Bearer ' + token)
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.emails.length.should.be.equal(3, 'wrong emails number');
        res.body.users.length.should.be.equal(2, 'wrong users number');
        done();
      })
    });
  });

  it('should add users to previous users', function(done) {
    var data = {
      _creator: user._id,
      name: 'Test',
      emails: ['titi@titi.com', users[1].email, 'toto@toto.com']
    };
    Group.create(data, function(err, group) {
      if(err) done(err);
       group.emails.length.should.be.equal(2, 'wrong emails number');
       group.users.length.should.be.equal(2, 'wrong users number');
      request(app)
      .post('/api/groups/' + group._id + '/emails')
      .send({emails: ['nobody@nobody.com', 'titi@titi.com', users[1].email]})
      .set('Authorization', 'Bearer ' + token)
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.emails.length.should.be.equal(3, 'wrong emails number');
        res.body.users.length.should.be.equal(2, 'wrong users number');
        done();
      })
    });
  });
});

describe('GET /api/groups (list group)', function() {
  
  it('should respond with JSON array', function(done) {
    request(app)
    .get('/api/groups')
    .set('Authorization', 'Bearer ' + token)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);
      res.body.should.be.instanceof(Array);
      done();
    });
  });

  it('should respond with 401 if not logged', function(done) {
      request(app)
      .get('/api/groups')
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});

describe('User.create', function() {

  var newEmail = 'cccc@cccc.com';

  before(function(done) {
    User.findOne({email: newEmail}, function(err, user) {
      if (err) return done(err);
      if (!user) return done();
      user.remove(function(err, user) {
        done(err);
      });
    });
  });
  
  it('should update group where user is email subscriber', function(done) {
    var data = {
      _creator: user._id,
      name: 'Test',
      emails: ['titi@titi.com', users[1].email, newEmail]
    };
    Group.create(data, function(err, group) {
      if(err) done(err);
      userFixture.createUser(newEmail, function(err, user) {
        Group.findOne({_id: group._id, users: mongoose.Types.ObjectId(user._id)}).exec(function(err, group) {
          if (err) return done(err);
          (!!group).should.be.equal(true, 'User not add in group ');
          group.emails.indexOf(newEmail).should.be.equal(-1, 'Email not deleted');
          group.emails.indexOf(newEmail).should.be.equal(-1, 'Email not deleted');
          done();
        });
      });
    });
  });
});
