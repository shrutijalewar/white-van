'use strict';

var bcrypt = require('bcrypt'),
    Mongo  = require('mongodb');

function User(){
}

Object.defineProperty(User, 'collection', {
  get: function(){return global.mongodb.collection('users');}
});

User.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  User.collection.findOne({_id:_id}, cb);
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

User.prototype.update = function(o, cb){
  //o is req.body
  //this.a = o.a, etc.

  User.collection.save(this, cb);
};

module.exports = User;
