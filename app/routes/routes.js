'use strict';

var morgan         = require('morgan'),
    bodyParser     = require('body-parser'),
    methodOverride = require('express-method-override'),
    less           = require('less-middleware'),
    session        = require('express-session'),
    RedisStore     = require('connect-redis')(session),
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

  app.use(security.authenticate);
  app.use(debug.info);

  app.get('/', home.index);
  app.get('/register', users.new);
  app.post('/register', users.create);
  app.get('/login', users.login);
  app.post('/login', users.authenticate);

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

