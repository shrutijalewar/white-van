'use strict';

var bcrypt  = require('bcrypt'),
    Message = require('./message'),
    async   = require('async'),
      _     = require('underscore-contrib'),
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
      default:
        self[property] = obj[property];
    }
  });

  User.collection.save(this, cb);
};

User.prototype.send = function(receiverId, obj, cb){
  Message.send(this._id, receiverId, obj.subject, obj.body, cb);
};

User.prototype.findStalked = function(cb){
  async.map(this.stalk, iteratorId, cb);
};

User.prototype.findHookedUp = function(cb){
  async.map(this.stalk, iteratorId, cb);
};

// Sample Passport Strategy Authentication
/*User.facebookAuthenticate = function(token, secret, facebook, cb){
  console.log('TOKEN', token);
  console.log('SECRET', secret);
  console.log('FACEBOOK', facebook);
  console.log('CB', cb);

  User.collection.findOne({facebookID:facebook.id}, function(err, user){
    if(user){return cb(null, user);}
    user = {facebookId:facebook.id, username:facebook.displayName, displayName:facebook.displayName, type:'facebook'};
    User.collection.save(user, cb);
  });
};*/

module.exports = User;

//private helper functions

//function uploadPhoto(files){
//}

function iteratorId(id, cb){
  User.findById(id, function(err, client){
    id = client;
    cb(null, id);
  });
}
