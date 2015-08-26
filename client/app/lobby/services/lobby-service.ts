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

    public joinLobbyRoomCb(lobbyData : Array<lobby.interfaces.IRoom>, res : lobby.interfaces.IRoom){

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
    public createLobbyRoomCb(lobbyData : Array<lobby.interfaces.IRoom>, res : lobby.interfaces.IRoom) {
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
      var newRoom = this.lobbyStorage.LobbyRoom();
      newRoom.get({id: id},function(room : lobby.interfaces.IRoom){
          var k = 5;
      });
    }



    /*public getLobbyDataCb(lobbyData : Array<lobby.interfaces.IRoom>, res : Array<lobby.interfaces.IRoom>, err : string) {
      if(err)  {
        this.$log.error(err)
        this.deferred.reject(lobbyData);
      } else if(!res){
        this.$log.log("There is no existing lobby data on the server.")
        this.deferred.reject(lobbyData);
      } else{
        lobbyData = res;
        this.deferred.resolve(lobbyData);
      }

      return this.deferred.promise;
    }*/
  }
}

angular
  .module('lobby')
  .service('lobbyService', lobby.services.LobbyService)
