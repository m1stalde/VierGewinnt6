/// <reference path="../_all.ts"/>

import express = require('express');
import session = require('express-session');
import sessionService = require('../services/sessionService');

const SESSION_USER_KEY = 'userId';
const SESSION_CLIENT_KEY = 'clientId';

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

export function getUserId(session: Express.Session): string {
    return session['SESSION_USER_KEY'];
}

export function setUserId(session: Express.Session, userId: string): void {
    session['SESSION_USER_KEY'] = userId;
}

export function getClientId(session: Express.Session): string {
    return session['SESSION_CLIENT_KEY'];
}

export function setClientId(session: Express.Session, clientId: string): void {
    session['SESSION_CLIENT_KEY'] = clientId;
}

function getSessionUserId(req: Express.Request): string {
    return getUserId(req.session);
}

function setSessionUserId(req: Express.Request, userId: string) {
    return setUserId(req.session, userId);
}
