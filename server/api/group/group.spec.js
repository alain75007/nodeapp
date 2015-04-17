'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
//var user = require('../user/fake_user');
var user1 = {
  name: 'Fake User',
  username: 'test',
  email: 'test@test.com',
  password: 'test'
};

function createUser(done) {
    console.log('hhhh');
    request(app)
    .post('/api/users')
    .send(user1)
    .expect(200)
    .end(function(err, res){
      if ( err ) throw err;
      done();
    });
}


describe('GET /api/groups', function() {

  before(function(done) { 
    createUser(done); 
  });

  it('should respond with JSON array', function(done) {

    request(app)
    .post('/auth/local')
    .send({ email: user1.email, password: user1.password })
    .expect(200)
    .end(function(err, res) {
      if ( err ) throw err;
      request(app)
      .get('/api/groups')
      .set('Authorization', 'Bearer ' + res.body.token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
    });
  });

  it('should respond with 401', function(done) {

      request(app)
      .get('/api/groups')
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});
