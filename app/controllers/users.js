'use strict';

var User   = require('../models/user'),
    moment = require('moment');

exports.new = function(req, res){
  res.render('users/new');
};

exports.login = function(req, res){
  res.render('users/login');
};

exports.logout = function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
};

exports.create = function(req, res){
  User.register(req.body, function(err, user){
    if(user){
      res.redirect('/');
    }else{
      res.redirect('/register');
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
      res.redirect('/login');
    }
  });
};

exports.profile = function(req, res){
  res.render('users/profile', {moment:moment});
};

exports.update = function(req, res){
  req.user.update(req.body, function(err, user){
    req.flash('success', 'Your killer profile is updated.');
    res.redirect('/profile');
  });
};

exports.index = function(req, res){
  //eventually add sort & filter params

  User.all(function(err, clients){
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
