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
      this.lobbyData = [];
      this.initializeLobbyData();
      this.currentItem.name = "test1";
    }

    public toggleNewGame() : void{
      this.gameCreation = this.gameCreation === false ? true: false;
    }

    public createRoom(name) : void{
      var newRoom = this.lobbyStorage.LobbyRoom();
      var jsonObj = {name : name, players : ["abcdefghij"]};
      newRoom.save(jsonObj,
        (data) => this.handleRes(data, this.createRoomFn),
        (err) => this.handleErr(err));
    }

    // still in progress => works with just this.handleRes(res) and no additional closure function this.lobbyInitFn()
    private initializeLobbyData(){
      var res = this.lobbyStorage.LobbyRoom().query(
        () => this.handleRes(res, this.lobbyInitFn(this.$log, this.lobbyData)),
        () => this.handleErr("Error while initializing the lobby data."));
    }

    private lobbyInitFn(logger, dataCol){
      return function(data){
        for (var i = 0; i < data.length; ++i) {
          logger.log(data[i]);
        }
        dataCol = data;
      }
    }

    private createRoomFn(newRoom){
      this.$log.log(newRoom);
      this.lobbyData.push(newRoom);
    }


    // Common functions => outsourcing
    private handleRes(res : any, resFn? : callbackFn) {
      if(typeof resFn != 'undefined') {
        resFn(res)
      } else{
        this.$log.log(res);
      }
    }

    private handleErr(err : string, errFn? : callbackFn) {
      if(typeof errFn != 'undefined') {
        errFn(err)
      } else{
        this.$log.error(err);
      }
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
