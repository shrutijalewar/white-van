'use strict';

var config = {};

config.twitter = {
  apiKey : 'QVUxQ1TGAaHNLUxi59uzr18qh',
  apiSecret : process.env.TWITTER_SECRET,
  callbackUrl : 'http://kayla-vm.com:3333/auth/twitter/callback'
};

config.github = {
  clientID : '04d8fa10fc0cb1d83c58',
  clientSecret : process.env.GITHUB_SECRET,
  callbackURL : 'http://kayla-vm.com:3333/auth/gihub/callback'
};

config.google = {
  clientID : '510224929319-ko0ro11i553b9me44dg6amgii8fa8b7h.apps.googleusercontent.com',
  clientSecret : process.env.GOOGLE_SECRET,
  callbackURL : 'http://kayla-vm.com:3333/auth/google/callback'
};

config.facebook = {
  clientID : '529615620517180',
  clientSecret : process.env.FB_SECRET,
  callbackURL : 'http://kayla-vm.com:3333/auth/facebook/callback'
};

config.instagram = {
  clientID : '356e30e4ff7e4406962c0fe994ba7a33',
  clientSecret : process.env.INSTA_SECRET,
  callbackURL : 'http://kayla-vm.com:3333/auth/instagram/callback'
};

config.stripe = {
  publishKey : 'pk_test_7FwAQbFq8Lc0FprSIJvFT5bc',
  secretKey : process.env.STRIPE_SECRET
};

module.exports = config;
