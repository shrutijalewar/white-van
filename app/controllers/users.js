'use strict';

var User    = require('../models/user'),
    Message = require('../models/message'),
    mp      = require('multiparty'),
    moment  = require('moment');

exports.logout = function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
};

exports.create = function(req, res){
  User.register(req.body, function(err, user){
    if(user){
      req.flash('success', 'Congrats! You are registered. Climb in the van for free candy');
      res.redirect('/');
    }else{
      req.flash('error', 'Are you cop? Try again. Serial killers only.');
      res.redirect('/');
    }
  });
};

exports.authenticate = function(req, res){
  User.authenticate(req.body, function(user){
    if(user){
      req.session.regenerate(function(){
        req.session.userId = user._id;
        req.session.save(function(){
          res.redirect('/');
        });
      });
    }else{
      res.redirect('/');
    }
  });
};

exports.profile = function(req, res){
  Message.messages(res.locals.user._id, function(err, messages){
    res.locals.user.findStalked(function(err, stalked){
      res.locals.user.findHookedUp(function(err, hookedUp){
        res.render('users/profile', {messages:messages, stalked:stalked, hookedUp:hookedUp, moment:moment});
      });
    });
  });
};

exports.update = function(req, res){
  res.locals.user.update(req.body, function(){
    req.flash('success', 'Your killer profile is updated.');
    res.redirect('/profile');
  });
};

exports.photos = function(req, res){
  var form = new mp.Form();
  form.parse(req, function(err, fields, files){
    res.locals.user.uploadPhotos(files, function(){
      res.redirect('/profile');
    });
  });
};

exports.photo = function(req, res){
  res.locals.user.changePhoto(req.body.photo, function(){
    res.redirect('/profile');
  });
};

exports.index = function(req, res){
  //eventually add sort & filter params
  console.log(req.query);
  User.query(req.user, function(err, clients){
    res.render('users/index', {clients:clients});
  });
};

exports.show = function(req, res){
  User.findById(req.params.userId, function(err, client){
    res.render('users/show', {client:client});
  });
};

exports.favorite = function(req, res){
  res.redirect('/users/' + req.params.userId);
};

exports.poke = function(req, res){
  res.redirect('/users/' + req.params.userId);
};

exports.request = function(req, res){
  res.redirect('/users/' + req.params.userId);
};

exports.hookup = function(req, res){
  res.redirect('/users/' + req.params.userId);
};

exports.reject = function(req, res){
  res.redirect('/users/' + req.params.userId);
};
