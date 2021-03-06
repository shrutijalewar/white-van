'use strict';

var User    = require('../models/user'),
    Message = require('../models/message'),
    mp      = require('multiparty'),
    _       = require('underscore-contrib'),
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
  User.query(req.user, req.query, function(err, clients){
    res.render('users/index', {clients:clients, query:req.query});
  });
};

exports.show = function(req, res){
  User.findById(req.params.userId, function(err, client){
    var self    = res.locals.user,
        stalked = _.contains(self.stalk, String(client._id));

    self.hookUp   = self.hookUp || [];
    client.hookUp = client.hookUp || [];

    var hooked = _.contains(self.hookUp, String(client._id)) && _.contains(client.hookUp, String(self._id));

    res.render('users/show', {client:client, stalked:stalked, hooked:hooked});
  });
};

exports.send = function(req, res){
  User.findById(req.body.receiverId, function(err, client){
    res.locals.user.send(client, req.body, function(){
      req.flash('success', 'Message sent!');
      res.redirect('/profile');
    });
  });
};

exports.bribe = function(req, res){
  User.findById(req.params.userId, function(err, receiver){
    req.session.receiver = receiver;
    res.redirect('/gifts');
  });
};

exports.favorite = function(req, res){
  User.findById(req.params.userId, function(err, client){
    res.locals.user.stalkStart(req.params.userId, function(){
      req.flash('success', 'You are now stalking', client.username + '. Don\'t worry, we won\'t tell.');
      res.redirect('/users/' + req.params.userId);
    });
  });
};

exports.unfavorite = function(req, res){
  User.findById(req.params.userId, function(err, client){
    res.locals.user.stalkStop(req.params.userId, function(){
      req.flash('success', 'We\'ve made a note that you lost interest in', client.username + '.');
      res.redirect('/users/' + req.params.userId);
    });
  });
};

exports.shank = function(req, res){
  User.findById(req.params.userId, function(err, client){
    res.locals.user.shank(client, function(){
      req.flash('success', 'You just shanked', client.username + '!');
      res.redirect('/users/' + req.params.userId);
    });
  });
};

exports.request = function(req, res){
  res.locals.user.request(req.params.userId, function(){
    req.flash('success', 'Your request was sent!');
    res.redirect('/users/' + req.params.userId);
  });
};

exports.hookup = function(req, res){
  res.locals.user.hookup(req.params, function(){
    req.flash('success', 'Congrats! You are now hooked up!');
    res.redirect('/profile');
  });
};

exports.reject = function(req, res){
  res.locals.user.reject(req.params, function(){
    req.flash('success', 'Hey killer. We would have said no as well.');
    res.redirect('/profile');
  });
};

exports.breakup = function(req, res){
  res.locals.user.breakup(req.params.userId, function(){
    req.flash('success', 'Time to put that relationship in a box in the ground.');
    res.redirect('/users/' + req.params.userId);
  });
};
