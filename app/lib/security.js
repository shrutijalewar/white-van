'use strict';

exports.authenticate = function(req, res, next){
  res.locals.user  = req.user;
  res.locals.flash = {};

  var keys = Object.keys(req.session.flash || {});
  keys.forEach(function(key){
    res.locals.flash[key] = req.flash(key);
  });

  next();
};

exports.bounce = function(req, res, next){
  if(res.locals.user){
    next();
  }else{
    req.flash('error', 'This page is protected. Please log in.');
    res.redirect('/login');
  }
};

