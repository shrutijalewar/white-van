'use strict';

var Gift = require('../models/gift'),
    User = require('../models/user');

exports.index = function(req, res){
  Gift.all(function(err, gifts){
    User.findById(req.params.userId, function(err, receiver){
      req.session.receiver = receiver;
      res.render('gifts/index', {gifts:gifts});
    });
  });
};
