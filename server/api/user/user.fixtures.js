'use strict';

var app = require('../../app');
var request = require('supertest');

var User = require('./user.model');
var async = require('async');


var users = [];
var currentUser;
var token;

exports.login = function(done, userIndex) {
    //users = userFixture.getUsers();
    userIndex = userIndex || 0;
    currentUser = users[userIndex];
    request(app)
    .post('/auth/local')
    .send({ email: currentUser.email, password: currentUser.password })
    .expect(200)
    .end(function(err, res) {
        if ( err ) done(err);
        token = res.body.token;
        done();
    });
}

exports.createUser = function(email, callback) {
    var user = {
        provider: 'local',
        name: 'Fake User ' + email,
        email: email,
        password: 'password'
    };
    User.create(user, function(err, user) {
      if ( err ) return callback(err);
      callback(null, user);
    });
};



exports.createUsers = function(done) {
    var user1 = {
        provider: 'local',
        name: 'Fake User 1',
        email: 'test1@test.com',
        password: 'password'
    };
    var user2 = {
        provider: 'local',
        name: 'Fake User 2',
        email: 'test2@test.com',
        password: 'password'
    };
    User.remove().exec().then(function() {
        async.parallel([
            function(callback) {
                User.create(user1, function(err, user) {
                    if ( err ) return done(err);
                    callback(null, user);
                });
            },
            function(callback) {
                User.create(user2, function(err, user) {
                    if ( err ) return done(err);
                    callback(null, user);
                });
            }],
            function(err, result) {
                users = result;
                done(err);
            }
        );
    })
};
exports.getUsers = function() {
  return users;
};



var io = require('socket.io-client');

function connectUser(user, callback) {
    var options ={
        transports: ['websocket'],
        'force new connection': true,
        path: '/socket.io-client'
    };

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
exports.connectUser = connectUser; 

exports.connectUsers = function(done) {
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
};
