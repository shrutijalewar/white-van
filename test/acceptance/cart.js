/* global describe, before, beforeEach, it */

'use strict';

process.env.DB   = 'white-van-test';

var expect  = require('chai').expect,
    cp      = require('child_process'),
    app     = require('../../app/index'),
    cookie  = null,
    request = require('supertest');

describe('cart', function(){
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
  describe('get /cart', function(){
    it('should show the objects in the cart', function(done){
      request(app)
      .get('/cart')
      .set('cookie',cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Subtotal');
        done();
      });
    });
  });
  describe('post /cart', function(){
    it('should post objects in the cart', function(done){
      request(app)
      .post('/cart')
      .set('cookie',cookie)
      .send('')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/cart');
        done();
      });
    });
  });
  describe('post /charge', function(){
    it('should post for transaction of the cart', function(done){
      request(app)
      .post('/charge')
      .set('cookie',cookie)
      .send('')
      .end(function(err, res){
        //expect(res.status).to.equal(302);
       // expect(res.text).to.include('Total');
        done();
      });
    });
  });
  describe('delete /carts', function(){
    it('should delete objects in the cart', function(done){
      request(app)
      .delete('/carts')
      .set('cookie',cookie)
      .end(function(err, res){
        //expect(res.status).to.equal(200);
       // expect(res.text).to.include('Total');
        done();
      });
    });
  });
});
