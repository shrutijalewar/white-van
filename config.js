'use strict';

var config = {},
    URL = 'http://liza-vm.com:3333/auth/' //This is what you change to customize your callback URL

config.stripe = {
  publishKey : 'pk_test_7FwAQbFq8Lc0FprSIJvFT5bc',
  secretKey : process.env.STRIPE_SECRET
};

config.box = {
  clientID    :'pjowyd9lwf19ll3zodeffbhrn64w1o3n',
  clientSecret: process.env.BOX_SECRET,
  callbackURL : URL+'box/callback'
};

config.reddit = {
  clientID    : 'hpMCAFV_PFlFSw',
  clientSecret: process.env.REDDIT_SECRET,
  callbackURL : URL+'reddit/callback'
};

module.exports = config;
