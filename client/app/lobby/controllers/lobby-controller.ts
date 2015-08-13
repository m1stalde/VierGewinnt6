/// <reference path='../_lobby.ts' />

module lobby.controllers {
  'use strict';

  class LobbyCtrl{

    public lobbyData : Array<string>;
    public gameCreation : boolean = true;
    public currentItem = {};
    public chat = {};

    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
      '$scope',
      '$log',
      'lobbyStorage',
      'socketService'
    ];

    // dependencies are injected via AngularJS $injector
    constructor(private $scope, private $log : ng.ILogService, private lobbyStorage, private socketService) {
      this.init();
    }

    // Initializer function
    private init(){
      this.lobbyData = [];
      this.initializeLobbyData();
      this.currentItem.name = "test1";
    }

    public toggleNewGame() : void{
      this.gameCreation = this.gameCreation === false ? true: false;
    }

    public createRoom(name) : void{
      var self = this;
      var newRoom = this.lobbyStorage.LobbyRoom();
      var jsonObj = {name : name, players : ["abcdefghij"]};
      newRoom.save(jsonObj,
        (data) => self.postLobbyDataCb(data, null),
        (err) => self.handleErr("Couldn't create a room on the server."));
    }

    // Common functions => outsourcing
    private postLobbyDataCb(res : any, err) {
      if(err)  {
        this.$log.error(err)
      } else if(!res){
        this.$log.log("There are is existing lobby data available on the server.")
      } else{
        this.lobbyData.push(res);
      }
    }

    private initializeLobbyData(){
      var res = this.lobbyStorage.LobbyRoom().query(
        () => this.getLobbyDataCb(null, res),
        () => this.getLobbyDataCb("Error while retrieving the lobby data from the server.", null)
      );
    }

    private getLobbyDataCb(err,res) {
      if(err)  {
        this.$log.error(err)
      } else if(!res){
        this.$log.log("There are is existing lobby data available on the server.")
      } else{
        this.lobbyData = res;
      }
    }

    private createRoomFn(newRoom){
      this.$log.log(newRoom);
      this.lobbyData.push(newRoom);
    }

    private handleErr(err : string) {
        this.$log.error(err);
    }

    public wsSendChatMessage(message : string, sentTo : Array<string>){
      var chatObj : lobby.services.IChatMessage = {
        header : {
          type: "chat",
          subType: "sendMessage"
        },
        body : {
          userName : this.socketService.currentUser,
          message : message,
          sendTo : sentTo
        }
      };
      this.socketService.sendMessage(chatObj);
    }
  }

  interface callbackFn{(resOrErr : string) : void}

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
