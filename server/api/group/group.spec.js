'use strict';

var should = require('should');
var app = require('../../app');
var User = require('../user/user.model');
var Group = require('./group.model');
var async = require('async');
var _ = require('lodash');

var request = require('supertest');
var userFixture = require('../user/user.fixtures');

var users;
var user;
var token;
var group;


function login(done) {
    users = userFixture.getUsers();
    user = users[0];
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

describe('POST /api/groups', function() {

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
      res.body.users.indexOf(users[0]._id.toString()).should.not.be.equal(-1);
      res.body.users.indexOf(users[1]._id.toString()).should.not.be.equal(-1);
      res.body.users.length.should.be.equal(2, 'wrong users number');
      async.parallel([ // tableau de fonctions à exécuter en parallèle
        function(callback) {
          // Fonction 1
          var user = User.findOne({_id: res.body.users[1]}, function(err, user) {
            if ( err ) return done(err);
            should.not.exist(err, 'user not found in users');
            should.exist(user, 'user not found in database');
            callback(null, user);
          })
        },
        function(callback) {
          // Fonction 2
          var user = User.findOne({_id: res.body.users[0]}, function(err, user) {
            if ( err ) return done(err);
            should.not.exist(err, 'creator not found in users');
            should.exist(user, 'creator not found in database');
            callback(null, user);
          })
        }],
        function(err, result) {
          // Fonction appelée quand founction1 et founction 2 sont toutes les deux terminées 
          var users = result; // contient {user, user}
          done(err);
        }
      );
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
});


describe('DELETE /api/groups/nnn', function() {

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
          // TODO verify group model
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
});

describe('GET /api/groups', function() {

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
