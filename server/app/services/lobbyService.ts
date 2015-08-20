/// <reference path="../_all.ts"/>

import express = require('express');
var utils = require('../utils/helperFunctions');
var websocketService = require('../websocket/websocketService');

var listOfRooms:Array<IRoom> = [
    {
        roomId: 1,
        name: "Title1",
        status: "Waiting for Opponent",
        creationTime: "17:01:34",
        players: [
            {
                playerId: "12124234",
                clientObj: {},
                userName: "Hans"
            },
            {
                playerId: "23232323",
                clientObj: {},
                userName: "Ueli"
            }
        ]
    },
    {
        roomId: 2,
        name: "Title2",
        status: "Game is in progress",
        creationTime: "17:01:34",
        players: [
            {
                playerId: "23232323",
                clientObj: {},
                userName: "Ueli"
            }
        ]
    },
    {
        roomId: 3,
        name: "Title3",
        status: "Game is in progress",
        creationTime: "12:01:34",
        players: [
            {
                playerId: "23232323",
                clientObj: {},
                userName: "Ueli"
            }
        ]
    },
];

export function createRoom(req:express.Request, cb) {

    if (!utils.Utils.propertyValidator(req.body)) {
        cb("Couldn't create a new room, at least one of the properties was missing.", null);
        return;
    }

    var newRoom:IRoom = {
        roomId: ++listOfRooms.length,
        name: req.body.name,
        status: "Waiting for Opponent",
        creationTime: new Date().toLocaleTimeString().toString(),
        players: [req.body.playerId]
    };

    listOfRooms[newRoom.roomId - 1] = newRoom;
    cb(null, newRoom);
}

export function joinRoom(req:express.Request, cb) {

    if (!utils.Utils.propertyValidator(req.body)) {
        cb("Couldn't create a join room, at least one of the properties was missing.", null);
        return;
    }
    // Retrieve the room which the player wants to join
    var room = listOfRooms[req.body.id - 1;

    // Validation
    if (!room) {
        cb("Couldn't find a room with the id " + req.body.id, null)
        return;
    } else if (room.players.length === 0) {
        cb("Can't join an empty room.", null)
        return;
    } else if (room.players.length === 2) {
        cb("The selected room has already reached the maximum capacity of 2 players.", null)
        return;
    } else if (room.players[0].playerId === req.body.playerId) {
        cb("The player has already enrolled for this particular room.", null)
        return;
    }

    var userSessionObj:Array<app.interfaces.IClient> = [];
    for (var i = 0; i < websocketService.clients.length; i++) {
        if (websocketService.clients[i].playerId === req.body.playerId) {
            userSessionObj.push(websocketService.clients[i]);
        }
    }

    if (userSessionObj.length === 1) {
        room.players.push(userSessionObj[0].playerId);
    } else {
        cb("The player has more than one active session on the server.", null)
        return;
    }

    cb(null, room);
}

export function getAllRooms(callback) {
    if (callback && listOfRooms.length > 0) {
        callback(undefined, listOfRooms);
    } else {
        callback("There are no rooms at the current time");
    }
}

export function checkForRoom(room:IRoom) {
    // Check if this room already exists
    for (var i = listOfRooms.length - 1; i >= 0; i--) {
        if (listOfRooms[i].roomId === room.roomId) {
            return true;
        }
    }
    ;

    return false;
}


export interface IRoom {
    roomId? : number;
    name : string;
    status? : string;
    creationTime : string;
    players : Array<app.interfaces.IClient>;
}



