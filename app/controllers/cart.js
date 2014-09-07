'use strict';

var Gift   = require('../models/gift'),
    config = require('../../config');

exports.add = function(req, res){
  Gift.findById(req.body.giftId, function(err, gift){
    req.session.cart = req.session.cart || [];
    req.session.cart.push(gift);
    req.session.save(function(){
      res.redirect('/cart');
    });
  });
};

exports.index = function(req, res){
  var gifts    = {},
      subtotal = 0,
      tax      = 0,
      total    = 0;

  (req.session.cart || []).forEach(function(g){
    subtotal += g.price;
    var id = g._id.toString();
    gifts[id] = gifts[id] || {g:g, c:0};
    gifts[id].c++;
  });

  tax = subtotal * 0.075;
  total = subtotal + tax;

  req.session.totalCents = Math.round(total * 100);
  req.session.save(function(){
    res.render('cart/index', {key: config.stripe.publishKey, ids:Object.keys(gifts), gifts:gifts, subtotal:subtotal, tax:tax, total:total});
  });
};

exports.destroy = function(req, res){
  req.session.cart     = [];
  req.session.save(function(){
    res.redirect('/cart');
  });
};

exports.purchase = function(req, res){

  var stripe = require('stripe')(config.stripe.secretKey),
      stripeToken = req.body.stripeToken;

  stripe.charges.create({
    amount: req.session.totalCents,
    currency: 'usd',
    card: stripeToken,
    description: req.user.email || 'anonymous'
  }, function(err, charge){
    req.session.cart       = [];
    req.flash('success', 'You successfully bribed', req.session.receiver.username + '!');
    req.session.receiver   = null;
    req.session.totalCents = null;
    req.session.save(function(){
      res.redirect('/profile');
    });
  });
};
