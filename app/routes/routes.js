'use strict';

var morgan         = require('morgan'),
    bodyParser     = require('body-parser'),
    methodOverride = require('express-method-override'),
    less           = require('less-middleware'),
    session        = require('express-session'),
    RedisStore     = require('connect-redis')(session),
    passport       = require('passport'),
    passportConfig = require('../lib/passport/config.js'),
    crypto         = require('crypto'),
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

  app.get('/auth/reddit', function(req, res, next){
    req.session.state = crypto.randomBytes(32).toString('hex');
      passport.authenticate('reddit', {
        state: req.session.state,
      })(req, res, next);
  });
  app.get('/auth/reddit/callback', passport.authenticate('reddit', {successRedirect:'/', failureRedirect:'/login', successFlash:'You are logged with Reddit!', failureFlash:'Failed to login through Reddit'}));

  app.use(security.bounce);
  app.get('/profile', users.profile);
  app.put('/profile', users.update);
  app.get('/users', users.index);
  app.post('/users/:userId/stalk', users.favorite);
  app.post('/users/:userId/shank', users.poke);
  app.post('/users/:userId/request', users.request);
  app.post('/users/:userId/hookup', users.hookup);
  app.post('/users/:userId/reject', users.reject);
  app.get('/users/:userId', users.show);
  app.get('/gifts', gifts.index);
  app.get('/cart', cart.index);
  app.post('/cart', cart.add);
  app.delete('/cart', cart.destroy);
  app.post('/charge', cart.purchase);
  app.delete('/logout', users.logout);

  console.log('Express: Routes Loaded');
};

