/// <reference path="../_all.ts"/>

import express = require('express');
import session = require('express-session');
import sessionService = require('../services/sessionService');

const SESSION_USER_KEY = 'userId';

export function login(req : express.Request, callback: (err: Error, session: sessionService.Session) => void)
{
    sessionService.authenticateUser(req.body.username, req.body.password, function(err, result, session, userId) {
        if (result) {
            setSessionUserId(req, userId);
        }

        if (callback) callback(err, session);
    });
}

export function currentUserId(req : express.Request): string {
    return getSessionUserId(req);
}

export function isLoggedIn(req : express.Request)
{
    return !!getSessionUserId(req);
}

export function handleAuthenticate(req : express.Request, res : express.Response, next){
    if(isLoggedIn(req))
    {
        next();
    }
    else
    {
        //res.send(401, { success : false, message : 'authentication failed' });
        res.sendStatus(401);
    }
}

export function logout(req : express.Request, callback: (err: Error, session: sessionService.Session) => void) {
    if(getSessionUserId(req)) {
        setSessionUserId(req, null);
    }

    sessionService.getCurrentSession(getSessionUserId(req), function(err, session) {
        callback(err, session);
    });
}

function getSessionUserId(req: express.Request): string {
    return req.session['SESSION_USER_KEY'];
}

function setSessionUserId(req: express.Request, userId: string) {
    return req.session['SESSION_USER_KEY'] = userId;
}
