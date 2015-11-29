/**
 * User Service module.
 *
 * Provides a persistent user datastore with functions to read, register, authenticate and update users.
 * The user passwords are stored encrypted and salted in datastore to secure stored password.
 */

/// <reference path="../_all.ts"/>
'use strict';

import Datastore = require('nedb');
import crypto = require('crypto');

var db = new Datastore({ filename: './data/user.db', autoload: true });

/**
 * Reads user from datastore.
 * @param id
 * @param callback
 */
export function getUser(id, callback: (err: Error, user: IUser) => void) {
    db.findOne<User>({_id: id}, function (err, doc) {
        if (err) {
            callback(err, null);
            return;
        }

        callback(err, createReturn(doc));
    });
}

/**
 * Updates user's name and password.
 * @param id
 * @param name
 * @param password
 * @param callback
 */
export function updateUser(id, name, password, callback: (err: Error, user: IUser) => void) {
    if(!(id && name && password)) {
        callback(new Error('id, username and password required'), null);
        return;
    }

    db.findOne<User>({ _id: id }, function (err, user) {
        if (err) {
            callback(err, null);
            return;
        }

        initPassword(password, function(err, passwordHash, salt) {
            if (err) {
                callback(err, null);
                return;
            }

            user.name = name;
            user.passwordHash = passwordHash;
            user.salt = salt;

            db.update({_id: id}, user, function(err, doc) {
                if (err) {
                    callback(err, null);
                    return;
                }

                callback(err, createReturn(doc));
            });
        });
    });
}

/**
 * Registers a new user.
 * @param name
 * @param password
 * @param callback
 */
export function registerUser(name, password, callback: (err: Error, user: IUser, userId: string) => void) {
    if(!(name && password)) {
        callback(new Error('username and password required'), null, null);
        return;
    }

    initPassword(password, function(err, passwordHash, salt) {
        if (err) {
            callback(err, null, null);
            return;
        }

        var user = new User(name, passwordHash, salt);

        db.insert(user, function(err, doc) {
            if (err) {
                callback(err, null, null);
                return;
            }

            callback(err, createReturn(doc), doc._id);
        });
    });
}

/**
 * Authenticates an existing user or registers a new user.
 * @param name
 * @param password
 * @param callback
 */
export function authenticateUser(name, password, callback: (err: Error, success: boolean, user: IUser, userId: string) => void) {
    if(!(name && password)) {
        callback(new Error('username and password required'), false, null, null);
        return;
    }

    db.findOne<User>({ name: name }, function (err, user) {
        if (err) {
            callback(err, false, null, null);
            return;
        }

        // register new user if user not found
        if(!user){
            registerUser(name, password, function (err, user, userId) {
                if (err) {
                    callback(err, false, null, null);
                    return;
                }

                callback(err, true, user, userId);
            });
            return;
        }

        hashPassword(password, user.salt, function (err, passwordHash) {
            var success = user.passwordHash === passwordHash;
            callback(err, success, user, user._id);
        });
    });
}

/**
 * Returns just the user's name without id, password and salt for security reasons.
 * @param user
 * @returns {{name: string}}
 */
function createReturn(user: User): IUser {
    return {
        name: user.name
    }
}

/**
 * Creates random salt value for password hash.
 * @param callback
 */
function createSalt(callback: (err: Error, salt: string) => void): void {
    crypto.randomBytes(64, function (err, salt) {
        if (err) {
           callback(err, null);
           return;
        }

        var result = salt.toString('hex');
        callback(err, result);
    });
}

/**
 * Creates hash value for password with given salt.
 * @param password
 * @param salt
 * @param callback
 */
function hashPassword(password: string, salt: string, callback: (err: Error, passwordHash: string) => void): void {
    crypto.pbkdf2(password, salt, 4096, 64, function (err, key: Buffer) {
        if (err) {
            callback(err, null);
            return;
        }

        var hash = key.toString('hex');
        callback(err, hash);
    });
}

/**
 * Creates salt and hash value for given password.
 * @param password
 * @param callback
 */
function initPassword(password: string, callback: (err: Error, passwordHash: string, salt: string) => void): void {
    createSalt(function(err, salt) {
        if (err) {
            callback(err, null, null);
            return;
        }

        hashPassword(password, salt, function(err, passwordHash) {
            if (err) {
                callback(err, null, null);
                return;
            }

            callback(err, passwordHash, salt);
        });
    });
}

/**
 * Interface for return values without user secrets.
 */
export interface IUser {
    name: string;
    twitterAccNr? : string;
}

/**
 * Private implementation for stored users.
 */
class User implements IUser {
    _id : string;
    name: string;
    passwordHash: string;
    salt: string;

    constructor(name: string, passwordHash: string, salt: string) {
        this.name = name;
        this.passwordHash = passwordHash;
        this.salt = salt;
    }
}
