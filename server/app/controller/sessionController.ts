/// <reference path="../_all.ts"/>

import express = require('express');
import sessionService = require('../services/sessionService');
import security = require('../utils/security');

export function registerUser(req : express.Request, res : express.Response, next: Function) {
    sessionService.registerUser(req.body.username, req.body.password, function(err, user) {
        if (err) {
            next(err);
            return;
        }

        res.format({
            'application/json': function(){
                res.json(user);
            },
        });
    });
}

export function getCurrentSession(req : express.Request, res : express.Response, next: Function) {
    var userId = security.currentUserId(req);

    sessionService.getCurrentSession(userId, function (err, user) {
        if (err) {
            next(err);
            return;
        }

        res.format({
            'application/json': function () {
                res.json(user);
            }
        });
    });
}

export function login (req : express.Request, res : express.Response, next: Function) {
    security.login(req, function (err, session) {
        if (err) {
            next(err);
            return;
        }

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
    security.logout(req, function (err, session) {
        res.format({
            'application/json': function(){
                res.json(session);
            },
        });
    });
}
