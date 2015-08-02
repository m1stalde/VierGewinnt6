/// <reference path="../../typings/nedb/nedb.d.ts" />

import Datastore = require('nedb');

var db = new Datastore({ filename: './data/user.db', autoload: true });

export function getUsers(callback) {
    db.find({}, function (err, docs) {
        if (callback) {
            callback(err, docs);
        }
    });
}

export function getUser(id, callback) {
    db.findOne({_id: id}, function (err, doc) {
        if (callback) {
            callback(err, doc);
        }
    });
}

export function registerUser(name, password, callback) {
    var user = new User(name, password);
    db.insert(user, function(err, newUser) {
        if(callback) {
            callback(err, newUser);
        }
    })
}

class User {
    name: string;
    password: string;

    constructor(name: string, password: string) {
        this.name = name;
        this.password = password;
    }
}
