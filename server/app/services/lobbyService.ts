/// <reference path="../utils/helperFunctions.ts" />

var utils = require('../utils/helperFunctions');

export class Lobby {

    static listOfRooms:Array<IRoom> = [
        {
            roomId: "1",
            title: "Title1",
            status: "Waiting for Opponent",
            creationDate: "01/01/2015",
            players: ["abcdefghi", "jklmnopqrst"]
        },
        {
            roomId: "2",
            title: "Title2",
            status: "Game is in progress",
            creationDate: "01/01/2015",
            players: ["abcdefghi", "jklmnopqrst"]
        },
        {
            roomId: "3",
            title: "Title3",
            status: "Game is in progress",
            creationDate: "01/01/2015",
            players: ["abcdefghi", "jklmnopqrst"]
        },
    ];

    static roomID:number;

    static create(room:IRoom) {
        return this.listOfRooms[this.roomID++] = room;
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
        }
        ;

        return false;
    }
}

export interface IRoom {
    roomId : string;
    title : string;
    status? : string;
    creationDate : string;
    players : string[];
}



