/// <reference path="../_all.ts"/>

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

export function updateUser(id, name, password, callback) {
    var user = new User(name, password);
    db.update({_id: id}, user, function(err, newUser) {
        if(callback) {
            callback(err, newUser);
        }
    })
}

export function registerUser(name, password, callback) {
    var user = new User(name, password);
    db.insert(user, function(err, newUser) {
        if(callback) {
            callback(err, newUser);
        }
    })
}

export function authenticateUser(name, password, callback) {
    if(!(name && password)) {  callback(false); }

    db.findOne({ name: name }, function (err, doc) {
        if(doc == null && !err){
            callback(err, false);
        }
        else {
            callback(err, doc && doc.password == password, doc);
        }
    });
}

export class User {
    name: string;
    password: string;

    constructor(name: string, password: string) {
        this.name = name;
        this.password = password;
    }
}
