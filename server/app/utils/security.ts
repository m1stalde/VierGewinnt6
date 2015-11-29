/**
 * Security module.
 *
 * Initializes security components like Cookie Parser and Session Handler in Express Application.
 * Provides IServerSession object with PlayerId, UserId and UserName for Express Request and WebSocket Request.
 * PlayerId is a random generated Id for each client connected to the server to identify user if logged in or not.
 * UserId and UserName are provided if a user is logged in.
 */

/// <reference path="../_all.ts"/>
'use strict';

import express = require('express');
import session = require('express-session');
import cookie = require('cookie-parser');
import WebSocket = require('ws');
import sessionService = require('../services/sessionService');
import utils = require('../utils/helperFunctions');
import logger = require('../utils/logger');

const COOKIE_NAME = 'game.sid';
const COOKIE_SECRET = 'casduichasidbnuwezrfinasdcvjkadfhsuilfuzihfioda';

var cookieParser: express.RequestHandler;
var sessionStore: session.Store;

/**
 * Inits security system of Express Application.
 * @param app
 */
export function init(app: express.Application): void {
    // create and register cookie parser
    cookieParser = cookie(COOKIE_SECRET);
    app.use(cookieParser);

    // create and register session with provided session store
    sessionStore = new session.MemoryStore();
    var sessionHandler: express.RequestHandler = session({ name: COOKIE_NAME, store: sessionStore, secret: COOKIE_SECRET, resave: false, saveUninitialized: true});
    app.use(sessionHandler);

    // disable x-powered-by for security reasons
    app.disable('x-powered-by');
}

/**
 * Returns typed server session object for given Express Request.
 * @param req
 * @returns {ServerSession}
 */
export function getServerSession(req: Express.Request): IServerSession {
    return new ServerSession(req.session);
}

/**
 * Returns typed server session object for given WebSocket Connection.
 * @param conn
 * @param callback
 */
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

/**
 * Authenticates given user and updates Server Session object with user info.
 * @param req
 * @param username
 * @param password
 * @param callback
 */
export function login(req: express.Request, username: string, password: string, callback: (err: Error, session: sessionService.Session) => void) {
    var serverSession = getServerSession(req);
    var playerId = serverSession.getPlayerId();

    sessionService.authenticateUser(playerId, username, password, function(err, result, session, userId) {
        if (result) {
            serverSession.setUserId(userId);
            serverSession.setUserName(session.username);
            logger.info('login: sessionId=' + serverSession.getSessionId() + ', userId=' + userId + ', userName=' + username + ', playerId=' + playerId);
        }

        if (callback) callback(err, session);
    });
}

/**
 * Returns current user id.
 * @param req
 * @returns {string}
 */
export function currentUserId(req: express.Request): string {
    return getServerSession(req).getUserId();
}

/**
 * Returns true if a user is logged in.
 * @param req
 * @returns {boolean}
 */
export function isLoggedIn(req: express.Request) {
    return !!currentUserId(req);
}

/**
 * Checks if a user is logged in given request.
 * If user is authenticated, the next middleware is called.
 * If no user is authenticated, a HTTP code 401 is sent back to client.
 * @param req
 * @param res
 * @param next
 */
export function handleAuthenticate(req: express.Request, res: express.Response, next) {
    if(isLoggedIn(req)) {
        next();
    } else {
        res.sendStatus(401);
    }
}

/**
 * Clears user info in current session.
 * @param req
 * @param callback
 */
export function logout(req : express.Request, callback: (err: Error, session: sessionService.Session) => void) {
    var serverSession = getServerSession(req);
    serverSession.setUserId(null);
    serverSession.setUserName(null);

    sessionService.getCurrentSession(serverSession.getPlayerId(), serverSession.getUserId(), function(err, session) {
        callback(err, session);
    });
}

/**
 * Interface for Server Sessions.
 */
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

/**
 * Server Session interface implementation.
 */
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
            logger.info('playerId ' + playerId + ' generated for session ' + this.getSessionId());
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
