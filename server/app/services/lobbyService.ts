/// <reference path="../_all.ts"/>

import express = require('express');
import gameService = require('../services/gameService');
import gameLogic = require('../logic/gameLogic');
import utils = require("../utils/helperFunctions");
import chatService = require("../services/chatService");
import messageService = require('../services/messageService');

var listOfRooms:Array<IRoom> = [];

export function saveRoom(roomObj, sessionData, isCreate, cb) {
    var room:IRoom;
    var pos : number = utils.getPositionOfElement(listOfRooms, "roomId", roomObj.roomId);

    // Update & Delete an existing room
    // isCreate avoids malicious requests => DELETE => {roomId = 3, players[]}
    if (!isCreate && roomObj.roomId && (pos > -1)) { // -1 indicates that a new room should be created

        if(roomObj.isDelete & roomObj.isJoin)
        {
            cb("Error while processing the request", null)
            return;
        }

        // Retrieve the room
        room = listOfRooms[pos];

        // Join
        if(roomObj.isJoin){
            // Validation
            if (!room) {
                cb("Couldn't find a room with the id " + room.roomId, null)
                return;
            } else if (room.players.length === 0) {
                cb("Can't join an empty room.", null)
                return;
            } else if (room.players.length === 2) {
                cb("The selected room has already reached the maximum capacity of 2 players.", null)
                return;
            } else if (room.players[0].playerId === sessionData.playerId) {
                cb("The player has already enrolled for this particular room.", null)
                return;
            }

            // start game
            var playerId1 = <string>room.players[0].playerId;
            var playerId2 = sessionData.playerId;

            gameService.newGame(playerId1, playerId2, gameLogic.Color.Yellow, function (err, gameData : gameLogic.IGameData, gameId) {
                if (err) {
                    cb(err, null);
                    return;
                }

                // update room
                room.players.push(new Player({
                    playerId: playerId2,
                    userName: sessionData.userName
                }));

                room.gameId = gameId
                room.status = "Game is in progress";

                // Send the Game data to the players
                var message = new RoomUpdateMessage(room);
                message.playerIds = [playerId1, playerId2];
                messageService.sendMessage(message);

                cb(null, room);
            });

        } else { // Update & Delete
            // Only the creator of the room can trigger update & delete actions
            // Compares the storage with the user who tries to do a modification
            if (room.players[0].userName !== sessionData.userName) {
                cb("Access denied - can't edit this room.", null);
                return;
            }

            // Delete
            if (roomObj.isDelete) {
                listOfRooms.splice(pos, 1);
            } else { // Update
                room.name = roomObj.name;
            }

            cb(null, room);
        }
    } else { // Create
        var nextId = utils.getHighestValue<number>(listOfRooms, "roomId", -1) + 1;
        room = new Room({
            roomId: nextId,
            name: roomObj.name,
            status: "Waiting for Opponent",
            creationTime: new Date().toLocaleTimeString().toString(),
            players: [{
                playerId: roomObj.players[0].playerId,
                userName: roomObj.players[0].userName
            }],
            gameId: null
        });

        listOfRooms.push(room);
        cb(null, room);
    }
}

export function getRoom(roomId, cb) {
    var room:IRoom;
    var pos: number = utils.getPositionOfElement(listOfRooms, "roomId", roomId);
    if (pos < 0) { // Room doesn't exist yet => user tries to create a new room
        var nextRoomId = utils.getHighestValue<number>(listOfRooms, "roomId", -1) + 1;
        room = new Room({roomId: nextRoomId});
    } else { // Room already exists and can be send back to the user
        room = listOfRooms[pos];
        // Validation
        if (!room) {
            cb("Couldn't find a room with the id " + roomId, null)
            return;
        }
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

export interface IPlayer {
    userName : string,
    playerId : string,
}

export class Player implements IPlayer {
    public userName : string;
    public playerId : string;
    constructor(player : IPlayer){
        this.userName = player.userName;
        this.playerId = player.playerId;
    }
}

export class Room implements IRoom {
    public roomId:number;
    public name:string;
    public status:string;
    public creationTime:string;

    public gameId:string;
    public players:Array<IPlayer>;

    public isDelete : boolean;
    public isJoin : boolean;

    constructor(room:IRoom) {
        this.roomId = room.roomId;
        this.name = room.name || "";
        this.status = room.status || "";
        this.creationTime = room.creationTime || "";
        this.players = room.players || [];
        this.gameId = room.gameId || "";
        this.isDelete = room.isDelete || false;
        this.isJoin = room.isJoin || false;
    }
}

export interface IRoom {
    roomId : number;
    name? : string;
    status? : string;
    creationTime? : string;
    players? : Array<any>;
    gameId? : string;
    isDelete? : boolean;
    isJoin? : boolean;
}

// Lobby Session Data
export interface ILobbySessionData{
    userName : string;
    playerId : string;
}

export class LobbySessionData{
    public userName:string;
    public playerId:string;

    constructor(sessionData : ILobbySessionData){
        this.userName = sessionData.userName;
        this.playerId = sessionData.playerId;
    }
}

// Websocket related classes & interfaces

export class RoomUpdateMessage extends messageService.ServerMessage<IRoom> {
    static NAME = "RoomUpdateMessage";

    constructor (data: IRoom) {
        super(RoomUpdateMessage.NAME, data);
    }
}



