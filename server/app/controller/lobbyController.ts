/// <reference path="../_all.ts"/>

import http = require('http');
import express = require('express');
import security = require('../utils/security');
import lobbyService = require("../services/lobbyService");
import sessionService = require("../services/sessionService");

export function retrieveLobbyData(req:express.Request, res:express.Response) {
    lobbyService.getAllRooms(function (err, data) {
        res.format({
            'application/json': function () {
                res.json(err || data);
            }
        });
    });
}

export function saveRoom(req:express.Request, res:express.Response) {
    var userId = security.currentUserId(req);

    var roomObj = {
        roomId: req.body.roomId || null,
        playerId: "123456",  // temporary fix, retrieve the playerId in the future from the session object
        roomName: req.body.name,
        isDelete: req.body.delete || null
    }

    sessionService.getCurrentSession(userId, function (err, sessionObj) {
        if (err) {
            // Development only => security issue in production => generic exception
            res.status(400).send("Couldn't find a session with the delivered sessionId");
            return;
        } else if (!sessionObj.username) {
            // Development only => security issue in production => generic exception
            res.status(400).send("The is no username associated with the session.");
            return;
        } else if (!roomObj.roomName) {
            // Development only => security issue in production => generic exception
            res.status(400).send("There was no room name passed to the function.");
            return;
        }

        roomObj.userName = sessionObj.username;

        lobbyService.saveRoom(roomObj, function (err, data) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.format({
                    'application/json': function () {
                        res.json(data);
                    }
                });
            }
        });
    });
}

export function joinRoom(req:express.Request, res:express.Response) {
    var userId = security.currentUserId(req);
    // temporary fix, retrieve the playerId in the future from the session object
    var playerId = "123456";
    var roomId = req.body.id;

    sessionService.getCurrentSession(userId, function (err, sessionObj) { // retrieve the userName from the sessionObj
        if (err) {
            // Development only => security issue in production => generic exception
            res.status(400).send("Couldn't find a session with the delivered sessionId");
            return;
        }
        else if (!sessionObj.username) {
            // Development only => security issue in production => generic exception
            res.status(400).send("The is no username associated with the session.");
            return;
        }
        else if (!roomId) {
            // Development only => security issue in production => generic exception
            res.status(400).send("There was no room id passed to the function.");
            return;
        }
        lobbyService.joinRoom(roomId, playerId, sessionObj.username, function (err, data) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.format({
                    'application/json': function () {
                        res.json(data);
                    }
                });
            }
        });
    });
}

export function retrieveRoom(req:express.Request, res:express.Response) {
    var userId = security.currentUserId(req);
    var roomId = req.params.id;

    sessionService.getCurrentSession(userId, function (err, sessionObj) { // retrieve the userName from the sessionObj
        if (err) {
            // Development only => security issue in production => generic exception
            res.status(400).send("Couldn't find a session with the delivered sessionId");
            return;
        }
        else if (!sessionObj.username) {
            // Development only => security issue in production => generic exception
            res.status(400).send("The is no username associated with the session.");
            return;
        }
        else if (!roomId) {
            // Development only => security issue in production => generic exception
            res.status(400).send("There was no room id passed to the function.");
            return;
        }
        lobbyService.retrieveRoom(roomId, function (err, data) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.format({
                    'application/json': function () {
                        res.json(data);
                    }
                });
            }
        });
    });


}

export function deleteRoom() {
    lobbyService.LobbyService.getAllRooms();
}




