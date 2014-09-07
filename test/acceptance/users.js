/* global describe, before, beforeEach, it */

'use strict';

process.env.DB   = 'white-van-test';

var expect  = require('chai').expect,
    cp      = require('child_process'),
    app     = require('../../app/index'),
    cookie  = null,
    request = require('supertest');

describe('users', function(){
  before(function(done){
    request(app).get('/').end(done);
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [process.env.DB], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      request(app)
      .post('/login')
      .send('email=bob@aol.com')
      .send('password=1234')
      .end(function(err, res){
        cookie = res.headers['set-cookie'][0];
        done();
      });
    });
  });

  describe('post /register', function(){
    it('should show the register page', function(done){
      request(app)
      .post('/register')
      .send('email=jill@aol.com&password=1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/');
        done();
      });
    });
  });
  describe('get/profile', function(){
    it('should show the profile page', function(done){
      request(app)
      .get('/profile')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Profile');
        expect(res.text).to.include('Inbox');
        expect(res.text).to.include('Send Message');
        expect(res.text).to.include('Gallery');
        done();
      });
    });
  });
  describe('put /profile', function(){
    it('should show the updated profile page', function(done){
      request(app)
      .put('/profile')
      .set('cookie',cookie)
      .send('_method=put&username=bobby&email=bob%40aol.com&phone=123-123-1234&bio=I+am+bobby+and+I+am+sad+and+lonely.&lookingFor=Relationship&weapon=Blade&age=35&gender=male&smoker=nonsmoker&criminal=criminalRecord')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/profile');
        done();
      });
    });
  });
  describe('get /users', function(){
    it('should list all the users on the page', function(done){
      request(app)
      .get('/users')
      .set('cookie',cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Gender');
        expect(res.text).to.include('Smoker');
        expect(res.text).to.include('Record');
        done();
      });
    });
  });
  describe('post /users/:userid/stalk', function(){
    it('should post a stalk to a specific user', function(done){
      request(app)
      .post('/users/:userid/stalk')
      .set('cookie',cookie)
      .send('')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/users/:userid');
        done();
      });
    });
  });
  describe('post /users/:userid/shank', function(){
    it('should post a shank to a specific user', function(done){
      request(app)
      .post('/users/:userid/shank')
      .set('cookie',cookie)
      .send('')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/users/:userid');
        done();
      });
    });
  });
  describe('post /users/:userid/request', function(){
    it('should post a request to a specific user', function(done){
      request(app)
      .post('/users/:userid/request')
      .set('cookie',cookie)
      .send('')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/users/:userid');
        done();
      });
    });
  });
  describe('post /users/:userid/hookup', function(){
    it('should post a hookup request to a specific user', function(done){
      request(app)
      .post('/users/:userid/hookup')
      .set('cookie',cookie)
      .send('')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/users/:userid');
        done();
      });
    });
  });
  describe('post /users/:userid/reject', function(){
    it('should post a reject to a request by a specific user', function(done){
      request(app)
      .post('/users/:userid/reject')
      .set('cookie',cookie)
      .send('')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/users/:userid');
        done();
      });
    });
  });
  describe('get /users/:userId', function(){
    it('should show a specific user on the page', function(done){
      request(app)
      .get('/users/000000000000000000000002')
      .set('cookie',cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Stalk');
        expect(res.text).to.include('Shank');
        expect(res.text).to.include('Bribe');
        expect(res.text).to.include('Seeking');
        done();
      });
    });
  });
  describe('post /users/:userId/bribe', function(){
    it('should show a series of giftable objects on the page', function(done){
      request(app)
      .post('/users/000000000000000000000002/bribe')
      .set('cookie',cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/gifts');
        done();
      });
    });
  });
  describe('delete /logout', function(){
    it('should delete redis and logout user', function(done){
      request(app)
      .delete('/logout')
      .set('cookie',cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/');
        done();
      });
    });
  });
});

