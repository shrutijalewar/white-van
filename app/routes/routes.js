'use strict';

var morgan         = require('morgan'),
    bodyParser     = require('body-parser'),
    methodOverride = require('express-method-override'),
    less           = require('less-middleware'),
    session        = require('express-session'),
    RedisStore     = require('connect-redis')(session),
    passport       = require('passport'),
    passportConfig = require('../lib/passport/config.js'),
    flash          = require('connect-flash'),
    security       = require('../lib/security'),
    debug          = require('../lib/debug'),
    cart           = require('../controllers/cart'),
    gifts          = require('../controllers/gifts'),
    home           = require('../controllers/home'),
    users          = require('../controllers/users');

module.exports = function(app, express){
  app.use(morgan('dev'));
  app.use(less(__dirname + '/../static'));
  app.use(express.static(__dirname + '/../static'));
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(methodOverride());
  app.use(session({store:new RedisStore(), secret:'my super secret key', resave:true, saveUninitialized:true, cookie:{maxAge:null}}));
  app.use(flash());
  passportConfig(passport, app);

  app.use(security.authenticate);
  app.use(debug.info);

  app.get('/', home.index);
  app.post('/register', users.create);
  app.post('/login',                   passport.authenticate('local', {successRedirect:'/profile', failureRedirect:'/', successFlash:'You\'re logged in. Knock \'em dead!', failureFlash:'Did you feed someone YOUR brains? Try logging in again.'}));
  app.post('/login', users.authenticate);

  app.use(security.bounce);
  app.get('/profile', users.profile);
  app.put('/profile', users.update);
  app.post('/photos', users.photos);
  app.put('/photos', users.photo);
  app.get('/users', users.index);
  app.post('/messages', users.send);
  app.post('/users/:userId/stalk', users.favorite);
  app.put('/users/:userId/stalk', users.unfavorite);
  app.post('/users/:userId/shank', users.shank);
  app.post('/users/:userId/request', users.request);
  app.delete('/users/:userId/request', users.reject);
  app.post('/users/:userId/hookup', users.hookup);
  app.delete('/users/:userId/hookup', users.breakup);
  app.post('/users/:userId/bribe', users.bribe);
  app.get('/users/:userId', users.show);
  app.get('/gifts', gifts.index);
  app.get('/cart', cart.index);
  app.post('/cart', cart.add);
  app.delete('/cart', cart.destroy);
  app.post('/charge', cart.purchase);
  app.delete('/logout', users.logout);

  console.log('Express: Routes Loaded');
};

