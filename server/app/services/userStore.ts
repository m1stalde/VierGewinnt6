/// <reference path="../../typings/nedb/nedb.d.ts" />

import Datastore = require('nedb');

//module UserStore {

    var db = new Datastore({ filename: './data/user.db', autoload: true });

    export function getUsers(callback) {
        db.find({}, function (err, docs) {
            if (callback) {
                callback(err, docs);
            }
        });
    }

    export function registerUser(email, password, callback) {
        var user = new User(email, password);
        db.insert(user, function(err, newUser) {
            if(callback) {
                callback(err, newUser);
            }
        })
    }

    class User {
        email: string;
        password: string;

        constructor(email: string, password: string) {
            this.email = email;
            this.password = password;
        }
    }
//}