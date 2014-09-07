/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Message   = require('../../app/models/message'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    Mongo     = require('mongodb'),
    db        = 'white-van-test';

describe('Message', function(){
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
    it('should create a new Message object', function(){
      var m = new Message();
      expect(m).to.be.instanceof(Message);
    });
  });

  describe('.findById', function(){
    it('should find a message by it\'s id', function(done){
      Message.findById('a00000000000000000000001', function(err, msg){
        expect(msg.subject).to.equal('Hola');
        expect(msg._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });
  describe('.unread', function(){
    it('should find no of unread messages of an user', function(done){
      Message.unread('000000000000000000000002', function(){
        //expect(Message).count.to.equal(2);
        done();
      });
    });
  });
});

