/// <reference path="../utils/helperFunctions.ts" />

var utils = require('../utils/helperFunctions');


export class Lobby {

    listOfRooms : Array<Room>;
    roomID : number;

    create(room : Room){
        return this.listOfRooms[this.roomID++] = room;
    }

    delete(roomId){
        return this.checkForRoom && this.listOfRooms.splice(this.listOfRooms.indexOf(roomId), 1);
    }

    getAll(){
        return this.listOfRooms.length > 0 && this.listOfRooms;
    }

    private checkForRoom(room : Room){
        // Check if this room already exists
        for (var i = this.listOfRooms.length - 1; i >= 0; i--) {
            if(this.listOfRooms[i].roomId === room.roomId){
                return true;
            }
        };

        return false;
    }

}

interface Room {
    roomId : string;
    title : string;
    status? : string;
    creationDate : string;
    players : string[];
}
