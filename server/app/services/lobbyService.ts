/// <reference path="../_all.ts"/>

import express = require('express');
var path = require("path");

var utils = require(path.join(__dirname, '..', 'utils', 'helperFunctions.js'));
var websocketService = require(path.join(__dirname, '..', 'websocket', 'websocketService.js'));
var security = require(path.join(__dirname, '..', 'utils', 'security.js'));
var sessionService = require(path.join(__dirname, '..', 'services', 'sessionService.js'));


var listOfRooms:Array<IRoom> = [
    {
        roomId: 1,
        name: "Title1",
        status: "Waiting for Opponent",
        creationTime: "17:01:34",
        players: [
            {userName: "Hans", sessionId: "1223"}]
    },
    {
        roomId: 2,
        name: "Title2",
        status: "Game is in progress",
        creationTime: "17:01:34",
        players: [
            {userName: "Hans", sessionId: "1223"},
            {userName: "Moritz", sessionId: "1225"}]
    },
    {
        roomId: 3,
        name: "Title3",
        status: "Game is in progress",
        creationTime: "12:01:34",
        players: [
            {userName: "Hans", sessionId: "1223"},
            {userName: "Hugo", sessionId: "1224"}]
    }
];

export function createRoom(req:express.Request, cb) {

    var self = this;

    if (!utils.Utils.propertyValidator(req.body)) {
        // Development only => security issue in production => generic exception
        cb("Couldn't create a new room, at least one of the properties was missing.", null);
        return;
    }

    var sessionUserId = security.getSessionUserId(req);

    sessionService.getCurrentSession(sessionUserId, function (err, sessionObj) {

        if (err) {
            // Development only => security issue in production => generic exception
            cb("Couldn't find a session with the sessionId:" + sessionUserId, null);
            return;
        } else if (sessionObj.username != req.body.userName) {
            // Development only => security issue in production => generic exception
            cb("The delivered userName doesn't match with the one from the session:" + req.body.userName, null);
            return;
        }

        var newRoom:IRoom = {
            roomId: ++listOfRooms.length,
            name: req.body.name,
            status: "Waiting for Opponent",
            creationTime: new Date().toLocaleTimeString().toString(),
            players: [{
                sessionId: sessionUserId,
                userName: req.body.userName
            }]
        };

        // Security issue => sending back the sessionUserId? => key to the user file => can this be leveraged from malicious users?
        listOfRooms[newRoom.roomId - 1] = newRoom;
        cb(null, newRoom);
    });


}

export function joinRoom(req:express.Request, cb) {

    if (!utils.Utils.propertyValidator(req.body)) {
        cb("Couldn't create a join room, at least one of the properties was missing.", null);
        return;
    }
    // Retrieve the room which the player wants to join
    var room = listOfRooms[req.body.id - 1];
    var sessionUserId = security.getSessionUserId(req);

    // Validation
    if (!room) {
        // Development only => security issue in production => generic exception
        cb("Couldn't find a room with the id " + req.body.id, null)
        return;
    } else if (room.players.length === 0) {
        cb("Can't join an empty room.", null)
        return;
    } else if (room.players.length === 2) {
        cb("The selected room has already reached the maximum capacity of 2 players.", null)
        return;
    }

    sessionService.getCurrentSession(sessionUserId, function (err, sessionObj) {
        if (room.players[0].userName === sessionObj.username) {
            cb("The player has already enrolled for this particular room.", null)
            return;
        }


        // Set the properties on the room object for player 2
        var playerObj : app.interfaces.IClient = {sessionId: sessionUserId, userName: sessionObj.username}
        room.players[1] = playerObj;

        // Security issue => sending back the sessionUserId? => key to the user file => can this be leveraged from malicious users?
        cb(null, room);
    });
}

export function retrieveRoom(req : express.Request, cb){
    if (!utils.Utils.propertyValidator(req.params.id)){
        // Development only => security issue in production => generic exception
        cb("Couldn't retrieve the specified room, at least one of the properties was missing.", null);
        return;
    }
    var room = listOfRooms[req.params.id - 1];
    var sessionUserId = security.getSessionUserId(req);

    sessionService.getCurrentSession(sessionUserId, function (err, sessionObj) {

        // Check if the editor is also the creator of the specified room
        if(!room.players[0].userName === sessionObj.username){
            // Development only => security issue in production => generic exception
            cb("The user is only allowed to retrieve a room, which has been created by him.", null);
            return;
        }

        // Security issue => sending back the sessionUserId? => key to the user file => can this be leveraged from malicious users?
        cb(null, room);
    });
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
    };

    return false;
}


export interface IRoom {
    roomId? : number;
    name : string;
    status? : string;
    creationTime : string;
    players : Array<app.interfaces.IClient>;
}



