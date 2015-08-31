/// <reference path='../_lobby.ts' />

module lobby.services {
  "use strict";
  export class LobbyService {

    public deferred = this.$q.defer();

    public static $inject = [
      '$q',
      '$log',
      'lobbyStorage'
    ];

    constructor(private $q: ng.IQService, private $log : ng.ILogService, private lobbyStorage) {}

    public joinLobbyRoom(lobbyData : Array<lobby.interfaces.IRoom>, res : lobby.interfaces.IRoom){

      var isUpdated = false;

      for(var i = 0; i < lobbyData.length; i++){
        if(lobbyData[i].roomId === res.roomId){
          lobbyData[i] = res
          isUpdated = true;
          break;
        }
      }

      if(isUpdated){
        this.deferred.resolve(lobbyData);
      } else {
        this.deferred.reject(lobbyData);
      }

      return this.deferred.promise;
    }

    // Common functions => outsourcing
    public createLobbyRoom(lobbyData : Array<lobby.interfaces.IRoom>, res : lobby.interfaces.IRoom) {
      if(!res){
        this.$log.log("There is no existing lobby data on the server.")
        this.deferred.reject(lobbyData);
      } else{
        lobbyData.push(res);
        this.deferred.resolve(lobbyData);
      }

      return this.deferred.promise;
    }

    public updateRoomName(self, name : string, id : string){
      var pos = this.getPositionOfElement(self.lobbyData, "roomId", id);
      var newRoom = this.lobbyStorage.LobbyRoom();
      newRoom.get({id: id},function(room : lobby.interfaces.IRoom){
        room.name = name;
        room.$save(function(room) {
          self.lobbyData[pos] = room;
        });
      });
    }

    public deleteRoom(self, id : string){
      var pos = this.getPositionOfElement(self.lobbyData, "roomId", id);
      var newRoom = this.lobbyStorage.LobbyRoom();
      newRoom.get({id: id},function(room : lobby.interfaces.IRoom){
        room.delete = true;
        room.$save(function(room) {
          self.lobbyData.splice(pos, 1);
        });
      });
    }

    private getPositionOfElement(array, element, value){
      var pos : number = -1;
      for (var i = 0, len = array.length; i < len; i++) {
        if (array[i][element] == value) pos = i;
      }
      return pos;
    }
  }
}

angular
  .module('lobby')
  .service('lobbyService', lobby.services.LobbyService)
