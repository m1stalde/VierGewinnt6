/// <reference path="../_all.ts"/>

import http = require('http');
import express = require('express');
import security = require('../utils/security');
import lobbyService = require("../services/lobbyService");
import sessionService = require("../services/sessionService");

export function getAllRooms(req:express.Request, res:express.Response) {
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

    sessionService.getCurrentSession(userId, function (err, sessionObj) {
        if (err) {
            // Development only => security issue in production => generic exception
            res.status(400).send("Couldn't find a session with the delivered sessionId");
            return;
        } else if (!sessionObj.username) {
            // Development only => security issue in production => generic exception
            res.status(400).send("The is no username associated with the session.");
            return;
        } else if (!req.body.name) {
            // Development only => security issue in production => generic exception
            res.status(400).send("There was no room name passed to the function.");
            return;
        }

        var players : Array<lobbyService.IPlayer> = [];
        var isCreate : boolean = false;
        if(req.body.players && req.body.players.length === 0){ // CREATE
            players.push(new lobbyService.Player(
                {
                    userName : sessionObj.username, // gets the username from the session object
                    playerId : "12334456"} // gets the playerID from the session data
            ));

            // Needed to avoid malicious requests
            isCreate = true;
        }

        // Map the room object
        var roomObj : lobbyService.IRoom = new lobbyService.Room(
            {
                roomId: req.body.roomId || null,
                players: players,
                name: req.body.name,
                creationTime : req.body.creationTime || null,
                status : req.body.status || null,
                isDelete: req.body.isDelete || null
            }
        );

        lobbyService.saveRoom(roomObj, sessionObj.username, isCreate, function (err, data) {
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

export function updateRoom(req:express.Request, res:express.Response) {
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

export function getRoom(req:express.Request, res:express.Response) {
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
        lobbyService.getRoom(roomId, function (err, data) {
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




