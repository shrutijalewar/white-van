'use strict';

var config = {};

config.tumblr = {
  consumerKey : process.env.TUMBLR_CONSUMER_KEY,
  consumerSecret : process.env.TUMBLR_CONSUMER_SECRET,
  callbackUrl : process.env.TUMBLR_CALLBACKURL
};

config.reddit = {
  clientID : process.env.REDDIT_CLIENTID,
  clientSecret : process.env.REDDIT_CLIENT_SECRET,
  callbackURL : process.env.REDDIT_CALLBACKURL
};


config.stripe = {
  publishKey : process.env.STRIPE_PUBLISH_KEY,
  secretKey : process.env.STRIPE_SECRET_KEY
};

config.twilio = {
  accountSid : process.env.TWSID,
  authToken  : process.env.TWTOK,
  from       : process.env.FROM,
};

config.mailgun = {
  ApiKey : process.env.MAILAPIKEY,
  domain : process.env.MAILDOMAIN,
};
module.exports = config;
