/// <reference path="../_all.ts"/>

import express = require('express');
import session = require('express-session');
var userService = require('../services/userService');

export function login(req : express.Request, callback)
{
    userService.authenticateUser(req.body.username, req.body.password, function(err, result, user) {
        if (result) {
            req.session.name = user.name;
        }

        var session = null;
        if (user) {
            session = new Session(user.name);
        }

        if (callback) callback(err, session);
    });
}

export function isLoggedIn(req : express.Request)
{
    return !!req.session.name;
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

export function currentUser(req : express.Request)
{
    return req.session.name;
}

export function logout(req : express.Request) {
    if(req.session.name) {
        req.session.name = null;
    }
}

export class Session {
    username: string;

    constructor(username: string) {
        this.username = username;
    }
}
