/// <reference path="../_all.ts"/>

var utils = require('../utils/helperFunctions');
import express = require('express');

export class LobbyService {

    public static listOfRooms:Array<IRoom> = [
        {
            roomId: 1,
            name: "Title1",
            status: "Waiting for Opponent",
            creationDate: "01/01/2015",
            players: ["abcdefghi", "jklmnopqrst"]
        },
        {
            roomId: 2,
            name: "Title2",
            status: "Game is in progress",
            creationDate: "01/01/2015",
            players: ["abcdefghi", "jklmnopqrst"]
        },
        {
            roomId: 3,
            name: "Title3",
            status: "Game is in progress",
            creationDate: "01/01/2015",
            players: ["abcdefghi", "jklmnopqrst"]
        },
    ];

    static create(req : express.Request, cb) {

        var newGame : IRoom = {
            roomID : this.listOfRooms.length,
            name : req.body.name,
            status : "Waiting for Opponent",
            creationDate :  new Date().toLocaleTimeString().toString(),
            players : req.body.players
        }

        this.listOfRooms[newGame.roomId] = newGame;
        cb(null, newGame)
    }

    static delete(roomId) {
        return this.checkForRoom && this.listOfRooms.splice(this.listOfRooms.indexOf(roomId), 1);
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
    creationDate : string;
    players : Array<any>;
}



