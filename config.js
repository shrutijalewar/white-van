'use strict';

var config = {},
    URL = 'http://liza-vm.com:3333/auth/' //This is what you change to customize your callback URL

config.stripe = {
  publishKey : 'pk_test_7FwAQbFq8Lc0FprSIJvFT5bc',
  secretKey : process.env.STRIPE_SECRET
};

config.tumblr = {
  consumerKey    :'GfHoULdthEKVp6Z6ZPdAsllbVcR0DR6AGeSUHgXCCqHhG1Dv0E',
  consumerSecret: process.env.TUMBLR_SECRET,
  callbackURL : URL+'tumblr/callback'
};

config.reddit = {
  clientID    : 'hpMCAFV_PFlFSw',
  clientSecret: process.env.REDDIT_SECRET,
  callbackURL : URL+'reddit/callback'
};

module.exports = config;
