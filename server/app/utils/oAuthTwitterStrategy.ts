import express = require('express');
import everyauth = require('everyauth');
import security = require('../utils/security');
import sessionService = require('../services/sessionService');

// Should key & secret should never be stored in your application but is used for the sake of simplicity
var twitter_key = "PXe9zaJA3qJhSSpQja8P4thp8";
var twitter_secret = "uO5bDB9jD1GwTlrsv2P15SJh27adMpyEo5iPrqpP8KPqTVrAD8";

export function init(app : express.Application){
    // Everyauth setup
    //everyauth.debug = true;
    everyauth.twitter
        .consumerKey(twitter_key)
        .consumerSecret(twitter_secret)
        .findOrCreateUser(function(session, token, tokenSecret, twitterUserMetadata) {
            var promise  = this.Promise();
            var serverSession : security.IServerSession = security.getServerSession(session.req);
            var playerId = serverSession.getPlayerId();

            sessionService.authenticateTwitterUser(playerId, twitterUserMetadata.name, twitterUserMetadata.id, function(err: Error, result: boolean, session: sessionService.Session, userId: string){
                serverSession.setUserId(userId);
                serverSession.setUserName(twitterUserMetadata.name);
                console.log('login: sessionId=' + serverSession.getSessionId() + ', userId=' + userId + ', userName=' + twitterUserMetadata.name + ', playerId=' + playerId);
                promise.fulfill(session);
            });

            return promise;
        })
        .redirectPath('http://10.3.10.51:3000/#/lobby');

    everyauth.everymodule.handleLogout(function(req, res){
        req.logout(); // The logout method is added for you by everyauth
    });
    everyauth.everymodule.findUserById(function(user, callback) {
        callback(user);
    });

    app.use(everyauth.middleware());
}

