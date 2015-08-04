/// <reference path="../_all.ts"/>

import express = require('express');
var userService = require('../services/userService');

export function getUsers(req : express.Request, res : express.Response) {
    userService.getUsers(function(err, users) {
        res.format({
            'application/json': function(){
                res.json(users);
            }
        });
    });
}

export function getCurrentUser(req : express.Request, res : express.Response) {

    var userId = "iFI4XdOSMeYsc1Jf"; // TODO get userId from current session

    userService.getUser(userId, function(err, user) {
        res.format({
            'application/json': function(){
                res.json(user);
            }
        });
    });
}

export function registerUser(req : express.Request, res : express.Response) {
    userService.createUser(req.body.name, req.body.password, function(err, user) {
        res.format({
            'application/json': function(){
                res.json(user);
            },
        });
    });
}

export function updateCurrentUser(req : express.Request, res : express.Response) {

    var userId = "iFI4XdOSMeYsc1Jf"; // TODO get userId from current session

    userService.updateUser(userId, req.body.name, req.body.password, function(err, user) {
        res.format({
            'application/json': function(){
                res.json(user);
            },
        });
    });
}
