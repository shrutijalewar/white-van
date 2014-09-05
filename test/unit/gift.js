/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Gift      = require('../../app/models/gift'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    db        = 'white-van-test';

describe('Gift', function(){
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
    it('should create a new Gift object', function(){
      var g = new Gift();
      expect(g).to.be.instanceof(Gift);
    });
  });

  describe('.findById', function(){
    it('should find a gift by it\'s id', function(done){
      Gift.findById('b00000000000000000000001', function(err, gift){
        expect(gift.name).to.equal('Latex gloves');
        done();
      });
    });
  });
});

