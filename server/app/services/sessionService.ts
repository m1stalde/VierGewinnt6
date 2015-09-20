/// <reference path="../_all.ts"/>

import userService = require('../services/userService');

/**
 * Returns current session based on given userId. If userId is null, a guest user is returned.
 * @param playerId current player id
 * @param userId current user id or null
 * @param callback
 */
export function getCurrentSession(playerId: string, userId: string, callback: (err: Error, session: Session) => void) {
    if (!userId) {
        var session = new Session(playerId, 'Gast', false);
        callback(null, session);
        return;
    }

    userService.getUser(userId, function (err, user) {
        if (err) {
            callback(err, null);
            return;
        }

        var session = new Session(playerId, user.name, true);
        callback(err, session);
    });
}

export function registerUser(playerId: string, username: string, password: string, callback: (err: Error, session: Session, userId: string) => void) {
    userService.registerUser(username, password, function (err, user, userId) {
        if (err) {
            callback(err, null, null);
            return;
        }

        var session = new Session(playerId, user.name, true);
        callback(err, session, userId);
    });
}

export function authenticateUser(playerId: string, username: string, password: string, callback: (err: Error, result: boolean, session: Session, userId: string) => void) {
    userService.authenticateUser(username, password, function (err, result, user, userId) {
        if (err || !result) {
            callback(err, result, null, null);
            return;
        }

        var session = new Session(playerId, user.name, result);
        callback(err, result, session, userId);
    });
}

export class Session {
    playerId: string;
    username: string;
    loggedId: boolean;

    constructor(playerId: string, username: string, loggedId: boolean) {
        this.playerId = playerId;
        this.username = username;
        this.loggedId = loggedId;
    }
}
