'use strict';

var should = require('should');
var app = require('../../app');
var User = require('./user.model');
var request = require('supertest');

var user = {
    provider: 'local',
    name: 'Fake User 1',
    email: 'test1@test1.com',
    password: 'password'
};

describe('User Controller', function() {

    before(function(done) {
        // Clear users before testing
        User.remove().exec().then(function() {
            done();
        });
    });


    it('should create a user', function(done) {
        request(app)
        .post('/api/users')
        .send(user)
        .expect(200)
        .end(function(err, res){
            if ( err ) return done(err);
            done();
        });
    });

    it('should not create a duplicate user', function(done) {
        request(app)
        .post('/api/users')
        .send(user)
        .expect(422)
        .end(function(err, res){
            if ( err ) return done(err);
            (res.body.errors.email.message).should.be.equal('The specified email address is already in use.');
            done();
        });
    });

    it('should authenticate', function(done) {
        request(app)
        .post('/auth/local')
        .send({email: user.email, password: user.password})
        .expect(200)
        .end(function(err, res){
            if ( err ) return done(err);
            done();
        });
    });

    it('should not authenticate if wrong password', function(done) {
        request(app)
        .post('/auth/local')
        .send({email: user.email, password: 'wrong'})
        .expect(401)
        .end(function(err, res){
            if ( err ) return done(err);
            done();
        });
    });

    it('should not authenticate if wrong email', function(done) {
        request(app)
        .post('/auth/local')
        .send({email: 'wrong@wrong.com', password: user.password})
        .expect(401)
        .end(function(err, res){
            if ( err ) return done(err);
            done();
        });
    });

    it('should change password', function(done) {
        User.findOne().exec().then(function(user1) {
            //if ( err ) return done(err);
            request(app)
            .post('/auth/local')
            .send({ email: user.email, password: user.password })
            .expect(200)
            .end(function(err, res) {
                if ( err ) throw err;
                request(app)
                .put('/api/users/' + user1._id + '/password')
                .send({oldPassword: user.password, newPassword: 'toto'})
                .set('Authorization', 'Bearer ' + res.body.token)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
            });
        });
    });

    it('should not change password if oldPassword missing', function(done) {
        User.findOne().exec().then(function(user1) {
            //if ( err ) return done(err);
            request(app)
            .post('/auth/local')
            .send({ email: user.email, password: 'toto' })
            .expect(200)
            .end(function(err, res) {
                if ( err ) throw err;
                request(app)
                .put('/api/users/' + user1._id + '/password')
                .send({newPassword: 'toto'})
                .set('Authorization', 'Bearer ' + res.body.token)
                .expect(403)
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
            });
        });
    });

});
