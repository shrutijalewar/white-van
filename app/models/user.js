'use strict';

var bcrypt  = require('bcrypt'),
    Message = require('./message'),
    async   = require('async'),
    _       = require('underscore-contrib'),
    fs      = require('fs'),
    path    = require('path'),
    Mongo   = require('mongodb');

function User(o){
}

Object.defineProperty(User, 'collection', {
  get: function(){return global.mongodb.collection('users');}
});

User.query =function(cb){
  User.collection.find().toArray(cb);
};

User.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  User.collection.findOne({_id:_id}, function(err, obj){
    var user = Object.create(User.prototype);
    user = _.extend(user, obj);
    cb(err, user);
  });
};

User.register = function(o, cb){
  User.collection.findOne({email:o.email}, function(err, user){
    if(user){return cb();}
    o.password = bcrypt.hashSync(o.password, 10);
    User.collection.save(o, cb);
  });
};

User.localAuthenticate = function(email, password, cb){
  User.collection.findOne({email:email}, function(err, user){
    if(!user){return cb();}
    var isOk = bcrypt.compareSync(password, user.password);
    if(!isOk){return cb();}
    cb(null, user);
  });
};

User.prototype.update = function(obj, cb){
  var properties = Object.keys(obj),
      self       = this;

  self.loc   = this.loc || {};

  properties.forEach(function(property){
    switch(property){
      case 'age':
        self[property] = obj[property] * 1;
        break;
      case 'isSmoker':
        self[property] = (obj[property] === 'true' ? true : false);
        break;
      case 'isRecord':
        self[property] = (obj[property] === 'true' ? true : false);
        break;
      case 'lat':
        self.loc.lat   = obj[property] * 1;
        break;
      case 'lng':
        self.loc.lng   = obj[property] * 1;
        break;
      case 'location':
        self.loc.name  = obj[property];
        break;
      case 'isPublic':
        self[property] = (obj[property] === 'true' ? true : false);
        break;
      default:
        self[property] = obj[property];
    }
  });

  User.collection.save(this, cb);
};

User.prototype.uploadPhotos = function(files, cb){
  var baseDir     = __dirname + '/../static',
      relDir      = '/img/users/' + this._id,
      absDir      = baseDir + relDir,
      exist    = fs.existsSync(absDir);

  this.photos = this.photos || [];

  if(!exist){
    fs.mkdir(absDir);
  }

  this.photos = files.photos.map(function(photo, index){
    if(!photo.size){return;}

    var ext     = path.extname(photo.path),
        name    = index + ext,
        relPath = relDir + '/' + name,
        absPath = absDir + '/' + name;
    fs.renameSync(photo.path, absPath);
    return relPath;
  });

  this.photos = _.compact(this.photos);

  User.collection.save(this, cb);
};

User.prototype.changePhoto = function(numb, cb){
  var index = (numb * 1) - 1;

  this.profilePic = this.photos[index];
  User.collection.save(this, cb);
};

User.prototype.send = function(receiverId, obj, cb){
  Message.send(this._id, receiverId, obj.subject, obj.body, cb);
};

User.prototype.findStalked = function(cb){
  async.map(this.stalk || [], iteratorId, cb);
};

User.prototype.findHookedUp = function(cb){
  async.map(this.hookUp || [], iteratorId, cb);
};

module.exports = User;

//private helper functions

function iteratorId(id, cb){
  User.findById(id, function(err, client){
    id = client;
    cb(null, id);
  });
}
