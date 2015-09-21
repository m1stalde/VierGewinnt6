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
    var serverSession = security.getServerSession(req);
    var userId = serverSession.getUserId();
    var userName = serverSession.getUserName();
    var playerId = serverSession.getPlayerId();

    var sessionData = new lobbyService.LobbySessionData({
        userName : userName,
        playerId : playerId
    });

    if (!req.body.name) {
        // Development only => security issue in production => generic exception
        res.status(400).send("There was no room name passed to the function.");
        return;
    }

    var players : Array<lobbyService.IPlayer> = [];
    var isCreate : boolean = false;
    if(req.body.players && req.body.players.length === 0){ // CREATE
        players.push(new lobbyService.Player(
            {
                userName : sessionData.userName, // gets the username from the session object
                playerId}
        ));

        // Needed to avoid malicious requests
        isCreate = true;
    } else {
        players = req.body.players;
    }

    // Map the room object
    var roomObj : lobbyService.IRoom = new lobbyService.Room(
        {
            roomId: req.body.roomId || null,
            players: players,
            name: req.body.name,
            creationTime : req.body.creationTime || null,
            status : req.body.status || null,
            isDelete: req.body.isDelete || null,
            isJoin: req.body.isJoin || null
        }
    );

    lobbyService.saveRoom(roomObj, sessionData, isCreate, function (err, data) {
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
}

export function getRoom(req:express.Request, res:express.Response) {
    var roomId = req.params.id;

    if (!roomId) {
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

}





