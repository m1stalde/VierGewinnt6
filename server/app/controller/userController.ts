/// <reference path="../_all.ts"/>
'use strict';

import express = require('express');
import userService = require('../services/userService');
import security = require('../utils/security');
import logger = require('../utils/logger');
import validation = require('../utils/validation');

export function getCurrentUser(req : express.Request, res : express.Response) {
    var userId = security.currentUserId(req);
    userService.getUser(userId, function(err, user) {
        logger.info('getCurrentUser: userId=' + userId + ', userName=' + user.name);
        res.format({
            'application/json': function(){
                res.json(user);
            }
        });
    });
}

export function updateCurrentUser(req : express.Request, res : express.Response) {
    var userId = security.currentUserId(req);

    var name = req.body.name;
    if (name == undefined || !validation.isUserNameValid(name)) {
        res.status(400).send('Bad Request: name missing or not 3 to 15 alphanumeric chars');
        return;
    }

    var password = req.body.password;
    if (password == undefined || password.length < 3) {
        res.status(400).send('Bad Request: password missing or too short');
        return;
    }

    userService.updateUser(userId, name, password, function(err, user) {
        res.format({
            'application/json': function(){
                res.json(user);
            },
        });
    });
}
