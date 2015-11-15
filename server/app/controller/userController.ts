/// <reference path="../_all.ts"/>
'use strict';

import express = require('express');
import userService = require('../services/userService');
import security = require('../utils/security');
import logger = require('../utils/logger');

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
    userService.updateUser(userId, req.body.name, req.body.password, function(err, user) {
        res.format({
            'application/json': function(){
                res.json(user);
            },
        });
    });
}
