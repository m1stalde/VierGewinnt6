/// <reference path="../_all.ts"/>
'use strict';

import express = require('express');
import session = require('express-session');
import cookie = require('cookie-parser');
import WebSocket = require('ws');
import sessionService = require('../services/sessionService');
import utils = require('../utils/helperFunctions');
import oAuthTwitter = require('../utils/oAuthTwitterStrategy');


const COOKIE_NAME = 'game.sid';
const COOKIE_SECRET = 'casduichasidbnuwezrfinasdcvjkadfhsuilfuzihfioda';

var cookieParser: express.RequestHandler;
var sessionStore: session.Store;


export function init(app: express.Application): void {
    // create and register cookie parser
    cookieParser = cookie(COOKIE_SECRET);
    app.use(cookieParser);

    // create and register session with provided session store
    sessionStore = new session.MemoryStore();
    var sessionHandler: express.RequestHandler = session({ name: COOKIE_NAME, store: sessionStore, secret: COOKIE_SECRET, resave: false, saveUninitialized: true});
    app.use(sessionHandler);

    oAuthTwitter.init(app);
}

export function getServerSession(req: Express.Request): IServerSession {
    return new ServerSession(req.session);
}

export function getServerSessionFromWebSocket(conn: WebSocket, callback: (err: Error, serverSession: IServerSession) => void): void {
    cookieParser(<express.Request> conn.upgradeReq, null, function () {
        var req = <express.Request>conn.upgradeReq;
        var sessionID = req.signedCookies[COOKIE_NAME];

        sessionStore.get(sessionID, function (err, session: Express.Session) {
            if (err) {
                callback(err, null);
                return;
            }

            if (!session) {
                callback(new Error('session missing'), null);
                return;
            }

            callback(err, new ServerSession(session));
        });
    });
}

export function login(req : express.Request, callback: (err: Error, session: sessionService.Session) => void) {
    var serverSession = getServerSession(req);
    var playerId = serverSession.getPlayerId();

    sessionService.authenticateUser(playerId, req.body.username, req.body.password, function(err, result, session, userId) {
        if (result) {
            serverSession.setUserId(userId);
            serverSession.setUserName(session.username);
            console.log('login: sessionId=' + serverSession.getSessionId() + ', userId=' + userId + ', userName=' + req.body.username + ', playerId=' + playerId);
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
    serverSession.setUserName(null);

    sessionService.getCurrentSession(serverSession.getPlayerId(), serverSession.getUserId(), function(err, session) {
        callback(err, session);
    });
}

export interface IServerSession {
    getSessionId(): string;

    /**
     * Gets or creates new player id.
     * @returns {*}
     */
    getPlayerId(): string;
    setPlayerId(playerId: string): void;

    getUserId(): string;
    setUserId(userId: string): void;

    getUserName(): string;
    setUserName(userName: string): void;
}

export class ServerSession implements IServerSession {

    private static SESSION_USER_ID = 'userId';
    private static SESSION_USER_NAME = 'userName';
    private static SESSION_PLAYER_ID = 'playerId';

    private session: Express.Session;

    constructor(session: Express.Session) {
        this.session = session;
    }

    getSessionId(): string {
        return this.session['id'];
    }

    /**
     * Gets or creates new player id.
     * @returns {*}
     */
    getPlayerId(): string {
        var playerId = this.session[ServerSession.SESSION_PLAYER_ID];
        if (!playerId) {
            playerId = utils.createGuid();
            this.setPlayerId(playerId);
            console.log('playerId ' + playerId + ' generated for session ' + this.getSessionId());
        }
        return playerId;
    }

    setPlayerId(playerId: string): void {
        this.session[ServerSession.SESSION_PLAYER_ID] = playerId;
    }

    getUserId(): string {
        return this.session[ServerSession.SESSION_USER_ID];
    }

    setUserId(userId: string): void {
        this.session[ServerSession.SESSION_USER_ID] = userId;
    }

    getUserName(): string {
        return this.session[ServerSession.SESSION_USER_NAME];
    }

    setUserName(userName: string): void {
        this.session[ServerSession.SESSION_USER_NAME] = userName;
    }
}
