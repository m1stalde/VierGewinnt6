/// <reference path="../_all.ts"/>

var utils = require('../utils/helperFunctions');
var websocket = require('../websocket/WebsocketService');
import express = require('express');

export class LobbyService {

    private static _instance: LobbyService = new LobbyService();

    public static listOfRooms:Array<IRoom> = [
        {
            roomId: 1,
            name: "Title1",
            status: "Waiting for Opponent",
            creationTime: "17:01:34",
            players: ["abcdefghi", "jklmnopqrst"]
        },
        {
            roomId: 2,
            name: "Title2",
            status: "Game is in progress",
            creationTime: "17:01:34",
            players: ["abcdefghi", "jklmnopqrst"]
        },
        {
            roomId: 3,
            name: "Title3",
            status: "Game is in progress",
            creationTime: "12:01:34",
            players: ["abcdefghi", "jklmnopqrst"]
        },
    ];

    static create(req : express.Request, cb) {

        if(!utils.Utils.propertyValidator(req.body))
        {
            cb("Couldn't create a new room, at least one of the properties was missing.", null);
            return;
        }

        var newRoom : IRoom = {
            roomId : ++this.listOfRooms.length,
            name : req.body.name,
            status : "Waiting for Opponent",
            creationTime :  new Date().toLocaleTimeString().toString(),
            players : [req.body.playerId]
        };

        this.listOfRooms[newRoom.roomId] = newRoom;
        cb(null, newRoom);
    }

    static delete(roomId) {
        return this.checkForRoom && this.listOfRooms.splice(this.listOfRooms.indexOf(roomId), 1);
    }

    static join(req : express.Request, cb){
        if(!utils.Utils.propertyValidator(req.body))
        {
            cb("Couldn't create a join room, at least one of the properties was missing.", null);
            return;
        }
        var room = this.listOfRooms[req.body.id];
        room.players
    }

    static getAllRooms(callback) {
        if (callback && this.listOfRooms.length > 0) {
            callback(undefined, this.listOfRooms);
        } else {
            callback("There are no rooms at the current time");
        }
    }

    private static checkForRoom(room:IRoom) {
        // Check if this room already exists
        for (var i = this.listOfRooms.length - 1; i >= 0; i--) {
            if (this.listOfRooms[i].roomId === room.roomId) {
                return true;
            }
        };

        return false;
    }
}

export interface IRoom {
    roomId? : number;
    name : string;
    status? : string;
    creationTime : string;
    players : Array<any>;
}



