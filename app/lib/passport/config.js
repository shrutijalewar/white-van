'use strict';

var local       = require('./local'),
    reddit      = require('./reddit'),
    tumblr      = require('./tumblr'),
    serialize   = require('./serialize'),
    deserialize = require('./deserialize');

module.exports = function(passport, app){
  passport.use(local);
  passport.use(reddit);
  passport.use(tumblr);
  passport.serializeUser(serialize);
  passport.deserializeUser(deserialize);

  app.use(passport.initialize());
  app.use(passport.session());
};
