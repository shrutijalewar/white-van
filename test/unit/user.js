/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    User      = require('../../app/models/user'),
    dbConnect = require('../../app/lib/mongodb'),
    //Mongo     = require('mongodb'),
    cp        = require('child_process'),
    db        = 'white-van-test';

describe('User', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new User object', function(){
      var u = new User();
      expect(u).to.be.instanceof(User);
    });
  });
  describe('.findById', function(){
    it('should find a user by his/her id', function(done){
      User.findById('000000000000000000000001', function(err, user){
        expect(user.username).to.equal('Bobby');
        expect(user.email).to.equal('bob@aol.com');
        done();
      });
    });
  });
  describe('#findStalked', function(){
    it('should find all that a user is stalking', function(done){
      var o = {name:'patty', stalk:['000000000000000000000002']},
          pat = new User();
      pat.update(o, function(){
        pat.findStalked(function(err, stalk){
          expect(stalk[0].username).to.equal('Sue');
          expect(stalk[0].isSmoker).to.be.false;
          done();
        });
      });
    });
  });
  describe('#findHookedUp', function(){
    it('should find all that a user is hooked up with', function(done){
      var o = {name:'patty', hookUp:['000000000000000000000002']},
          mat = new User();
      mat.update(o, function(){
        mat.findHookedUp(function(err, hookUp){
          console.log('>>>>>>>>>>>>>>', hookUp);
          expect(hookUp[0].username).to.equal('Sue');
          expect(hookUp[0].isSmoker).to.be.false;
          done();
        });
      });
    });
  });
  describe('#update', function(){
    it('should save a user', function(done){
      var u = new User(),
          o = {x:3, isPublic:'No', foo:'bar'};

      u.baz = 'bim';
      u.update(o, function(err, user){
        expect(user.isPublic).to.be.false;
        expect(user.foo).to.equal('bar');
        expect(user.baz).to.equal('bim');
        done();
      });
    });
  });
//Last braces
});

