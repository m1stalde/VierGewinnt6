/// <reference path="../_all.ts"/>

import express = require('express');
import gameService = require('../services/gameService');
import gameLogic = require('../logic/gameLogic');

var path = require("path");
var utils = require(path.join(__dirname, '..', 'utils', 'helperFunctions.js'));
var websocketService = require(path.join(__dirname, '..', 'websocket', 'websocketService.js'));

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

export function createRoom(userId: string, name: string, cb) {

    var newRoom:IRoom = {
        roomId: ++listOfRooms.length,
        name: name,
        status: "Waiting for Opponent",
        creationTime: new Date().toLocaleTimeString().toString(),
        players: [userId]
    };

    listOfRooms[newRoom.roomId - 1] = newRoom;
    cb(null, newRoom);
}

export function joinRoom(userId: string, roomId: number, cb) {

    // Retrieve the room which the player wants to join
    var room = listOfRooms[roomId - 1];

    // Validation
    if (!room) {
        cb("Couldn't find a room with the id " + roomId, null)
        return;
    } else if (room.players.length === 0) {
        cb("Can't join an empty room.", null)
        return;
    } else if (room.players.length === 2) {
        cb("The selected room has already reached the maximum capacity of 2 players.", null)
        return;
    } else if (room.players[0] === userId) {
        cb("The player has already enrolled for this particular room.", null)
        return;
    }

    // start game
    var userId1 = <string>room.players[0];
    var userId2 = userId;
    gameService.newGame(userId1, userId2, gameLogic.Color.Yellow, function (err, gameData, gameId) {
        if (err) {
            cb(err, null);
            return;
        }

        // update room
        room.players[1] = userId;

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



