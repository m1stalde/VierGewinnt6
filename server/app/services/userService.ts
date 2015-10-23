/// <reference path="../_all.ts"/>

import Datastore = require('nedb');

var db = new Datastore({ filename: './data/user.db', autoload: true });

export function getUser(id, callback: (err: Error, user: IUser) => void) {
    db.findOne<User>({_id: id}, function (err, doc) {
        if (err) {
            callback(err, null);
            return;
        }

        callback(err, createReturn(doc));
    });
}

export function updateUser(id, name, password, callback: (err: Error, user: IUser) => void) {
    if(!(id && name && password)) {
        callback(new Error('id, username and password required'), null);
        return;
    }

    var user = new User(name, password);

    db.update({_id: id}, user, function(err, doc) {
        if (err) {
            callback(err, null);
            return;
        }

        callback(err, createReturn(doc));
    });
}

export function registerUser(name, password, callback: (err: Error, user: IUser, userId: string) => void) {
    if(!(name && password)) {
        callback(new Error('username and password required'), null, null);
        return;
    }

    var user = new User(name, password);

    db.insert(user, function(err, doc) {
        if (err) {
            callback(err, null, null);
            return;
        }

        callback(err, createReturn(doc), doc._id);
    });
}

export function authenticateUser(name, password, callback: (err: Error, success: boolean, user: IUser, userId: string) => void) {
    if(!(name && password)) {
        callback(new Error('username and password required'), false, null, null);
        return;
    }

    db.findOne<User>({ name: name }, function (err, doc) {
        if (err) {
            callback(err, false, null, null);
            return;
        }

        // register new user if user not found
        if(!doc){
            registerUser(name, password, function (err, user, userId) {
                if (err) {
                    callback(err, false, null, null);
                    return;
                }

                callback(err, true, user, userId);
            });
            return;
        }

        var success = doc.password === password;
        callback(err, success, doc, doc._id);
    });
}
//////////////////////////////////
// OAuth specific methods
//////////////////////////////////

export function authenticateTwitterUser(name : string, twitterAccNumber : string, callback : (err: Error, success: boolean, user: IUser, userId: string) => void){
    if(!(name && twitterAccNumber)) {
        callback(new Error('Data missing'), false, null, null);
        return;
    }
    db.findOne<User>({ name: name, twitterAccNr : twitterAccNumber}, function (err, doc) {
        if (err) {
            callback(err, false, null, null);
            return;
        }

        // register new user if user not found
        if(!doc){
            registerTwitterUser(name, twitterAccNumber, function (err, user, userId) {
                if (err) {
                    callback(err, false, null, null);
                    return;
                }

                callback(err, true, user, userId);
            });
            return;
        }
        var success = doc.twitterAccNr === twitterAccNumber;
        callback(err, success, doc, doc._id);
    });
}

function registerTwitterUser(name, twitterAccNumber, callback: (err: Error, user: IUser, userId: string) => void) {
    if(!(name && twitterAccNumber)) {
        callback(new Error('username and password required'), null, null);
        return;
    }

    var user = new User(name, null, twitterAccNumber);

    db.insert(user, function(err, doc) {
        if (err) {
            callback(err, null, null);
            return;
        }

        callback(err, createReturn(doc), doc._id);
    });
}

function createReturn(user: User): IUser {
    return {
        name: user.name
    }
}

export interface IUser {
    name: string;
    twitterAccNr? : string;
}

class User implements IUser {
    _id : string;
    name: string;
    password: string;
    twitterAccNr : string;

    constructor(name: string, password?: string, twitterAccNr? : string) {
        this.name = name;
        this.password = password;
        this.twitterAccNr = twitterAccNr;
    }
}
