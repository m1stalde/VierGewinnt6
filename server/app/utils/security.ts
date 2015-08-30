/// <reference path="../_all.ts"/>

import express = require('express');
import session = require('express-session');
import cookie = require('cookie-parser');
import WebSocket = require('ws');
import sessionService = require('../services/sessionService');

const COOKIE_SECRET = 'casduichasidbnuwezrfinasdcvjkadfhsuilfuzihfioda';

var cookieParser: express.RequestHandler;
var sessionStore: session.Store;

export function init(app: express.Application): void {
    // create and register cookie parser
    cookieParser = cookie(COOKIE_SECRET);
    app.use(cookieParser);

    // create and register session with provided session store
    sessionStore = new session.MemoryStore();
    var sessionHandler: express.RequestHandler = session({ store: sessionStore, secret: COOKIE_SECRET, resave: false, saveUninitialized: true});
    app.use(sessionHandler);
}

function getServerSession(req: Express.Request): IServerSession {
    return new ServerSession(req.session);
}

export function getServerSessionFromWebSocket(conn: WebSocket, callback: (err: Error, serverSession: IServerSession) => void): void {
    cookieParser(<express.Request> conn.upgradeReq, null, function () {
        var req = <express.Request>conn.upgradeReq;
        var sessionID = req.signedCookies['connect.sid'];

        sessionStore.get(sessionID, function (err, session: Express.Session) {
            if (err) {
                callback (err, null);
                return;
            }

            callback(err, new ServerSession(session));
        });
    });
}

export function login(req : express.Request, callback: (err: Error, session: sessionService.Session) => void)
{
    sessionService.authenticateUser(req.body.username, req.body.password, function(err, result, session, userId) {
        if (result) {
            var serverSession = getServerSession(req);
            serverSession.setUserId(userId);
            console.log('login: sessionId=' + serverSession.getSessionId() + ', userId=' + userId + ', userName=' + req.body.username);
        }

        if (callback) callback(err, session);
    });
}

export function currentUserId(req : express.Request): string {
    return getServerSession(req).getUserId();
}

export function isLoggedIn(req : express.Request)
{
    return !!currentUserId(req);
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
    var serverSession = getServerSession(req);
    serverSession.setUserId(null);

    sessionService.getCurrentSession(serverSession.getUserId(), function(err, session) {
        callback(err, session);
    });
}

export interface IServerSession {
    getSessionId(): string;

    getClientId(): string;
    setClientId(clientId: string): void;

    getUserId(): string;
    setUserId(userId: string): void;
}

class ServerSession implements IServerSession {

    private static SESSION_USER_KEY = 'userId';
    private static SESSION_CLIENT_KEY = 'clientId';

    private session: Express.Session;

    constructor(session: Express.Session) {
        this.session = session;
    }

    getSessionId(): string {
        return this.session['id'];
    }

    getClientId(): string {
        return this.session[ServerSession.SESSION_CLIENT_KEY];
    }

    setClientId(clientId: string): void {
        this.session[ServerSession.SESSION_CLIENT_KEY] = clientId;
    }

    getUserId(): string {
        return this.session[ServerSession.SESSION_USER_KEY];
    }

    setUserId(userId: string): void {
        this.session[ServerSession.SESSION_USER_KEY] = userId;
    }
}
