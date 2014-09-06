'use strict';

var User    = require('../models/user'),
    Message = require('../models/message'),
    //mp      = require('multiparty'),
    moment  = require('moment');

exports.logout = function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
};

exports.create = function(req, res){
  User.register(req.body, function(err, user){
    if(user){
      req.flash('error', 'Congrats! You are registered. Climb in the van for free candy');
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
    console.log('messages array >>>>>>>>>>>>>>>', messages);
    res.locals.user.findStalked(function(err, stalked){
      console.log('stalked array >>>>>>>>>>>>>>>>>>', stalked);
      res.locals.user.findHookedUp(function(err, hookedUp){
        console.log('hookedUp array >>>>>>>>>>>>>>>>>', hookedUp);
        res.render('users/profile', {messages:messages, stalked:stalked, hookedUp:hookedUp, moment:moment});
      });
    });
  });
};

exports.update = function(req, res){
  console.log(req.body);
  res.locals.user.update(req.body, function(){
    req.flash('success', 'Your killer profile is updated.');
    res.redirect('/profile');
  });
};

exports.index = function(req, res){
  //eventually add sort & filter params

  User.query(function(err, clients){
    console.log('clients >>>>>>>>>>>>>>>>>>>>>>>', clients);
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
