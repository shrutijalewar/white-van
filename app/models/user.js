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
// Authentication Functions
User.localAuthenticate = function(email, password, cb){
  User.collection.findOne({email:email}, function(err, user){
    if(!user){return cb();}
    var isOk = bcrypt.compareSync(password, user.password);
    if(!isOk){return cb();}
    cb(null, user);
  });
};

User.tumblrAuthenticate = function(token, secret, tumblr, cb){
  User.collection.findOne({tumblrId:tumblr.id}, function(err, user){
    if(user){return cb(null, user);}
    user = {tumblrId:tumblr.id, type:'tumblr'};
    User.collection.save(user, cb);
  });
};

User.redditAuthenticate = function(token, secret, reddit, cb){
  User.collection.findOne({redditId:reddit.id}, function(err, user){
    if(user){return cb(null, user);}
    user = {redditId:reddit.id, username:reddit.name, displayName:reddit.name, type:'reddit'};
    User.collection.save(user, cb);
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

User.prototype.send = function(receiver, obj, cb){
  var request        = obj.request || false;

  receiver.phone = receiver.phone || null;

  switch(obj.mType){
    case 'text':
      sendText(receiver.phone, obj.message, cb);
      break;
    case 'email':
      sendEmail(this.email, receiver.email, obj.subject, obj.message, cb);
      break;
    case 'internal':
      Message.send(this._id, receiver._id, obj.subject, obj.message, request, cb);
  }
};

User.prototype.shank = function(client, cb){
  var subject = 'Call Doctor Love...',
      message = 'Because you\'ve been SHANKED!';

  Message.send(this._id, client._id, subject, message, false, function(){
    client.phone = client.phone || null;
    sendText(client.phone, 'SHANKED!! -UWV', cb);
  });
};

User.prototype.stalkStart = function(id, cb){
  this.stalk = this.stalk || [];
  this.stalk.push(id);
  User.collection.save(this, cb);
};

User.prototype.stalkStop = function(id, cb){
  this.stalk = _.without(this.stalk, String(id));
  User.collection.save(this, cb);
};

User.prototype.request = function(receiverId, cb){
  var body     = this.username + ' would like you to ride shotgun in their unmarked white van. Are you in or not?',
      subject  = 'An APB Has Been Issued',
      senderId = this._id;

  Message.send(senderId, receiverId, subject, body, true, cb);
};

User.prototype.hookup = function(obj, cb){
  var messageId = Mongo.ObjectID(obj.messageId),
      self      = this,
      body      = 'And you\'re not going to have to ride it alone. Total messaging is now available with ' + self.username + '.',
      subject   = 'Life Is A Highway...';
  self.hookUp = self.hookUp || [];

  Message.collection.remove({_id:messageId}, function(){
    User.findById(obj.userId, function(err, receiver){
      receiver.hookUp = receiver.hookUp || [];
      receiver.hookUp.push(String(self._id));
      self.hookUp.push(String(receiver._id));
      receiver.hookUp = _.uniq(receiver.hookUp);
      self.hookUp     = _.uniq(self.hookUp);
      User.collection.save(receiver, function(){
        User.collection.save(self, function(){
          Message.send(self._id, receiver._id, subject, body, false, cb);
        });
      });
    });
  });
};

User.prototype.reject = function(obj, cb){
  var messageId = Mongo.ObjectID(obj.messageId),
      self      = this,
      body      = 'And, ' + this.username + ' is making you ride with an empty passenger seat a while longer. Chin up and do something you enjoy tonight! If you get too lonely, you can always turn yourself in.',
      subject   = 'Life Is A Highway...';

  Message.collection.remove({_id:messageId}, function(a, b, c){
    Message.send(self._id, obj.userId, subject, body, false, cb);
  });
};

User.prototype.breakup = function(receiverId, cb){
  var self = this;

  User.findById(receiverId, function(err, client){
    self.hookUp   = _.without(self.hookup, String(client._id));
    client.hookUp = _.without(client.hookup, String(self._id));

    User.collection.save(self, function(){
      User.collection.save(client, function(){
        var subject = 'An APB Has Been Issued',
            body    = 'It seems ' + self.username + ' has gotten over you. Hope this breakup doesn\'t make you more twisted!';

        Message.send(self._id, client._id, subject, body, false, cb);
      });
    });
  });
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

function sendEmail(from, to, subject, html, cb){
  var mailgun = new Mailgun({apiKey:process.env.MAIL_API_KEY, domain:process.env.MAIL_DOMAIN}),
      data   = {from:from, to:to, subject:subject, html:html};
  mailgun.messages().send(data, cb);
}
