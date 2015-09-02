/// <reference path="../_all.ts"/>

import express = require('express');
import gameService = require('../services/gameService');
import gameLogic = require('../logic/gameLogic');
import utils = require("../utils/helperFunctions");
import websocketService = require("../websocket/websocketService");

var listOfRooms:Array<IRoom> = [
    {
        roomId: 1,
        name: "Title1",
        status: "Waiting for Opponent",
        creationTime: "17:01:34",
        players: [
            {userName: "Hans", playerId: "1223"}]
    },
    {
        roomId: 2,
        name: "Title2",
        status: "Game is in progress",
        creationTime: "17:01:34",
        players: [
            {userName: "Hans", playerId: "1223"},
            {userName: "Moritz", playerId: "1225"}]
    },
    {
        roomId: 3,
        name: "Title3",
        status: "Game is in progress",
        creationTime: "12:01:34",
        players: [
            {userName: "Hans", playerId: "1223"},
            {userName: "Hugo", playerId: "1224"}]
    }
];

export function saveRoom(roomObj, cb) {
    var room : IRoom = {};

    // Update & Delete an existing room
    if(roomObj.roomId){
        var pos = utils.Utils.getPositionOfElement(listOfRooms, "roomId", roomObj.roomId);

        // Delete
        if(roomObj.isDelete){
            listOfRooms.splice(pos, 1);
        } else { // Update
            room = listOfRooms[pos];
            // Verification
            if(room.players[0].userName !== roomObj.userName){ // Only the creator of the room can also update it
                cb("Access denied - can't edit this room.", null);
                return;
            }

            room.name = roomObj.roomName;
        }
    } else { // Create
        room = {
            roomId: ++listOfRooms.length,
            name: roomObj.roomName,
            status: "Waiting for Opponent",
            creationTime: new Date().toLocaleTimeString().toString(),
            players: [{
                playerId : roomObj.playerId,
                userName : roomObj.userName
            }],
            gameId : null
        };

        listOfRooms[room.roomId - 1] = room;
    }

    cb(null, room);
}

export function joinRoom(roomId: number, playerId: string, userName : string, cb) {

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
    } else if (room.players[0].playerId === playerId) {
        cb("The player has already enrolled for this particular room.", null)
        return;
    }

    // start game
    var playerId1 = <string>room.players[0].playerId;
    var playerId2 = playerId;
    gameService.newGame(playerId, playerId2, gameLogic.Color.Yellow, function (err, gameData, gameId) {
        if (err) {
            cb(err, null);
            return;
        }

        // update room
        room.players[1] = {
            playerId : playerId2,
            userName : userName
        };

        room.gameId = gameId;

        cb(null, room);
    });
}

export function retrieveRoom(roomId, cb){

    var pos = utils.Utils.getPositionOfElement(listOfRooms, "roomId", roomId);
    var room = listOfRooms[pos];

    // Validation
    if (!room) {
        cb("Couldn't find a room with the id " + roomId, null)
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
    };

    return false;
}




export interface IRoom {
    roomId? : number;
    name : string;
    status? : string;
    creationTime : string;
    players : Array<any>;
    gameId : string;
}



