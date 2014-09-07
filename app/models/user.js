'use strict';

var bcrypt  = require('bcrypt'),
    Message = require('./message'),
    async   = require('async'),
    _       = require('underscore-contrib'),
    fs      = require('fs'),
    twilio  = require('twilio'),
    Mailgun = require('mailgun-js'),
    path    = require('path'),
    Mongo   = require('mongodb');

function User(o){
}

Object.defineProperty(User, 'collection', {
  get: function(){return global.mongodb.collection('users');}
});

User.query =function(currentUser, criteria, cb){
  var query = {
    'isPublic': true,
    '_id': {'$ne': currentUser._id}
  };

  if (!isNullOrEmpty(criteria.gender)) {
    query.gender = criteria.gender;
  }
  if (!isNullOrEmpty(criteria.isSmoker)) {
    query.isSmoker = criteria.isSmoker === 'true' ? true : false;
  }
  if (!isNullOrEmpty(criteria.isRecord)) {
    query.isRecord = criteria.isRecord === 'true' ? true : false;
  }
  if (!isNullOrEmpty(criteria.weapon)) {
    query.weapon = criteria.weapon;
  }
  if (!isNullOrEmpty(criteria.lookingFor)) {
    query.lookingFor = criteria.lookingFor;
  }
  User.collection.find(query).toArray(cb);
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
  var baseDir = __dirname + '/../static',
      relDir  = '/img/users/' + this._id,
      absDir  = baseDir + relDir,
      exist   = fs.existsSync(absDir),
      self    = this;

  self.photos = self.photos || [];

  if(!exist){
    fs.mkdir(absDir);
  }

  files.photos.forEach(function(photo, index){
    if(!photo.size){return;}

    var ext     = path.extname(photo.path),
        name    = (index + self.photos.length) + ext,
        relPath = relDir + '/' + name,
        absPath = absDir + '/' + name;
    fs.renameSync(photo.path, absPath);

    self.photos.push(relPath);
  });

  this.photos = _.compact(this.photos);

  User.collection.save(this, cb);
};

User.prototype.changePhoto = function(numb, cb){
  var index = (numb * 1) - 1;

  this.profilePic = this.photos[index];
  User.collection.save(this, cb);
};

User.prototype.findStalked = function(cb){
  async.map(this.stalk || [], iteratorId, cb);
};

User.prototype.findHookedUp = function(cb){
  async.map(this.hookUp || [], iteratorId, cb);
};

User.prototype.send = function(obj, cb){
  switch(obj.mType){
    case 'text':
      sendText(obj.message, cb);
      break;
    case 'email':
      sendEmail(this.email, 'Message from Unmarked White Van', obj.message, cb);
      break;
    case 'internal':
      Message.send(this._id, obj.receiverId, obj.subject, obj.message, cb);
  }
};

User.prototype.shank = function(client, cb){
  var subject = 'Call Doctor Love...',
      message = 'Because you\'ve been SHANKED!';

  Message.send(this._id, client._id, subject, message, cb);
};

module.exports = User;

//private helper functions

function isNullOrEmpty(prop){
  return !prop || prop.length < 1;
}

function iteratorId(id, cb){
  User.findById(id, function(err, client){
    id = client;
    cb(null, id);
  });
}

function sendText(to, body, cb){
  if(!to){return cb();}

  var accountSid = process.env.TWSID,
      authToken  = process.env.TWTOK,
      from       = process.env.FROM,
      client     = twilio(accountSid, authToken);

  client.messages.create({to:to, from:from, body:body}, cb);
}

function sendEmail(from, to, subject, message, cb){
  var mailgun = new Mailgun({apiKey:process.env.MGKEY, domain:process.env.MGDOM}),
      data   = {from:from, to:to, subject:subject, text:message};

  mailgun.messages().send(data, cb);
}
