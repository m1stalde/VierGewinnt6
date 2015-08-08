/// <reference path="../_all.ts"/>

import express = require('express');
var userService = require('../services/userService');
var security = require('../utils/security');

export function registerUser (req : express.Request, res : express.Response) {
    userService.registerUser(req.body.username, req.body.password, function(err, user) {
        res.format({
            'application/json': function(){
                res.json(user);
            },
        });
    });
}

export function login (req : express.Request, res : express.Response) {
    security.login(req, function (error, session) {
        res.format({
            'application/json': function(){
                res.json(session);
            },
        });
    });
}

export function isLoggedIn (req : express.Request, res : express.Response) {
    var loggedIn = security.isLoggedIn(req);
    res.format({
        'application/json': function(){
            res.json(loggedIn);
        },
    });
}

export function logout (req : express.Request, res : express.Response) {
    security.logout(req);
}
