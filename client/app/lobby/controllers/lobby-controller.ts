/// <reference path='../_lobby.ts' />

module lobby.controllers {
  'use strict';

  class LobbyCtrl{

    public lobbyData : Array<string>;
    public gameCreation : boolean = true;
    public currentItem : any = {};

    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
      '$scope',
      '$log',
      'lobbyStorage'
    ];

    // dependencies are injected via AngularJS $injector
    constructor(private $scope, private $log : ng.ILogService, private lobbyStorage) {
      this.init();
    }

    // Initializer function
    private init(){
      this.initializeLobbyData();
      this.currentItem.name = "test1";
    }

    public toggleNewGame() : void{
      this.gameCreation = this.gameCreation === false ? true: false;
    }

    public createRoom() : void{
      var newRoom = this.lobbyStorage.LobbyRoom();
      newRoom.roomId = "12";
      newRoom.save();
    }

    public editRoom(room) : void{

    }

    private initializeLobbyData(){
      var res = this.lobbyStorage.LobbyRoom().query(
        () => this.callback(null, res),
        () => this.callback("Error while retrieving the lobby data from the server.", null)
      );
    }

    private callback(err,res) {
      if(err)  {
        this.$log.error(err)
      } else if(!res){
        this.$log.log("There are is existing lobby data available on the server.")
      } else{
        this.lobbyData = res;
      }
    }
  }

  /**
  * @ngdoc object
  * @name lobby.controller:LobbyCtrl
  *
  * @description
  *
  */
  angular
    .module('lobby')
    .controller('LobbyCtrl', LobbyCtrl);
}
