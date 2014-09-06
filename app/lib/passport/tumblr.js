'use strict';

var TumblrStrategy    = require('passport-tumblr').Strategy,
    User           = require('../../models/user'),
    config         = require('../../../config'),
    tumblr            = new TumblrStrategy(
                    {
                      consumerKey : config.tumblr.consumerKey,
                      consumerSecret : config.tumblr.consumerSecret,
                      callbackURL : config.tumblr.callbackURL
                    },
                    User.tumblrAuthenticate);

module.exports = tumblr;
