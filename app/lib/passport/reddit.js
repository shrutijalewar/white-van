'use strict';

var RedditStrategy = require('passport-reddit').Strategy,
    User           = require('../../models/user'),
    config         = require('../../../config'),
    reddit         = new RedditStrategy(
                    {
                      clientID : config.reddit.clientID,
                      clientSecret : config.reddit.clientSecret,
                      callbackURL : config.reddit.callbackURL
                    },
                    User.redditAuthenticate);

module.exports = reddit;
