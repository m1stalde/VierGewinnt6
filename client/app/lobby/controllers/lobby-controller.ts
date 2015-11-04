/// <reference path='../_lobby.ts'/>

module lobby.controllers {
  'use strict';

  class LobbyCtrl implements ILobbyScope {

    private lobbyInterval : ng.IIntervalService
    public lobbyData : Array<lobby.interfaces.IRoomRessource> = [];
    public gameCreation:boolean = true;
    public gameEditing:boolean = true;
    public currentItem:lobby.interfaces.IRoomRessource = new lobby.interfaces.Room(null);
    public displayUser:User.Services.IUser;
    public actionMessage:IActionMessage = new ActionMessage(null, null);

    // Sorting the lobby list
    public orderBy : string = "roomId";
    public isDesc : boolean = false;

    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
      '$scope',
      '$log',
      '$window',
      '$rootScope',
      'lobbyStorage',
      'UserService',
      '$interval'
    ];

    // dependencies are injected via AngularJS $injector
    constructor(private $scope, private $log:ng.ILogService, private $window : ng.IWindowService, private $rootScope:ng.IScope,
                private lobbyStorage, private userService:User.Services.IUserService, private $interval) {
      var self = this;
      this.displayUser = userService.getCurrentUser();
      this.getRooms(this)();
      this.lobbyInterval = $interval(this.getRooms(this), 3000);

      $scope.$on('$destroy', () => {
        self.stopInterval(self)();
      });
    }

    // Helper functions

    public toggleNewGame():void {
      this.gameEditing = true;
      this.gameCreation = this.gameCreation === false ? true : false;
    }

    public toggleEditingGame():void {
      this.gameCreation = true;
      this.gameEditing = this.gameEditing === false ? true : false;
    }

    public editRoom(room:lobby.interfaces.IRoomRessource):void {
      this.currentItem.name = room.name;
      this.currentItem.roomId = room.roomId;
      this.toggleEditingGame();
    }

    public joinRoom(room:lobby.interfaces.IRoomRessource) {
      room.isJoin = true;
      this.updateRoom(room);
    }

    private getPositionOfElement(array:Array<any>, element, value) {
      var pos:number = -1;
      for (var i = 0, len = array.length; i < len; i++) {
        if (array[i][element] == value) pos = i;
      }
      return pos;
    }

    private getHighestValue<T>(array:Array<any>, element:string, seed:T):T {
      var value:T = seed;
      for (var i = 0, len = array.length; i < len; i++) {
        if (array[i][element] > value) {
          value = array[i][element];
        }
      }
      return value;
    }

    public reorderList(orderBy : string){
      // Double clicking the arrow => swap from ASC to DESC
      if(this.orderBy === orderBy){
        this.isDesc = this.isDesc ? false : true;
      } else { // order by a new column => swap back to ASC
        this.orderBy = orderBy;
        this.isDesc = false;
      }
    }

    private stopInterval(self) {
      return function () {
        if (angular.isDefined(self.lobbyInterval)) {
          self.$interval.cancel(self.lobbyInterval);
          self.lobbyInterval = undefined;
        }
      }
    }

    // CRUD Operations with $resources

    // CREATE
    public createRoom(room:lobby.interfaces.IRoomRessource):void {
      var self = this;
      var nextRoomId = this.getHighestValue<number>(this.lobbyData, "roomId", -1) + 1;
      var roomRes = this.lobbyStorage.LobbyRoom();
      roomRes.get({id: nextRoomId}, (newRoom:lobby.interfaces.IRoomRessource) => {
        newRoom.name = room.name;
        newRoom.$save(function (room) { // success callback
          self.lobbyData.push(room);
          self.actionMessage = new lobby.controllers.ActionMessageSuccess({
            isError: false,
            data: "The room has been created!"
          })
        }, (err) => { // error callback
          self.actionMessage = new lobby.controllers.ActionMessageError({
            isError: true,
            status: err.status,
            statusText: err.statusText,
            data: err.data
          });
        });
      });

      this.toggleNewGame();
    }

    // DELETE
    public deleteRoom(room:lobby.interfaces.IRoomRessource):void {
      var self = this;
      var pos = this.getPositionOfElement(self.lobbyData, "roomId", room.roomId);
      var roomRes = this.lobbyStorage.LobbyRoom();
      roomRes.get({id: room.roomId}, (room:lobby.interfaces.IRoomRessource) => {
        room.isDelete = true;
        room.$save(function (room) { // success callback
          self.lobbyData.splice(pos, 1);
          self.actionMessage = new lobby.controllers.ActionMessageSuccess({
            isError: false,
            data: "The room has been deleted!"
          })
        }, (err) => { // error callback
          self.actionMessage = new lobby.controllers.ActionMessageError({
            isError: true,
            status: err.status,
            statusText: err.statusText,
            data: err.data
          });
        });
      });
    }

    // GET
    private getRooms(self) {
      return function() {
        var res = self.lobbyStorage.LobbyRoom().query(function () { // success callback
          self.lobbyData = res;
        }, function (err) { // error callback
          //   self.actionMessage = new lobby.controllers.ActionMessageError({
          //  isError: true,
          //  status: err.status,
          //  statusText: err.statusText,
          //  data: err.data
          //});
        });
      }
    }

    // UPDATE
    public updateRoom(newRoom:lobby.interfaces.IRoomRessource):void {
      var self = this;
      var pos = this.getPositionOfElement(self.lobbyData, "roomId", newRoom.roomId);
      var roomRes = this.lobbyStorage.LobbyRoom();
      roomRes.get({id: newRoom.roomId}, (room:lobby.interfaces.IRoomRessource) => {
        room.name = newRoom.name; // Update the name of the room
        room.isJoin = newRoom.isJoin || null;
        room.$save(function (room) { // success callback
          self.lobbyData[pos] = room;
          self.actionMessage = new lobby.controllers.ActionMessageSuccess({
            isError: false,
            data: "Your room has been updated!"
          })
        }, (err) => { // error callback
          self.actionMessage = new lobby.controllers.ActionMessageError({
            isError: true,
            status: err.status,
            statusText: err.statusText,
            data: err.data
          });
        });
      });
    }
  }

  // Action Message Interfaces
  export interface IActionMessage {
    isError : boolean;
    data : string // Contains the server side generated error message which gets displayed to the user
  }

  export interface IActionMessageError extends IActionMessage {
    statusText? : string;
    status? : string;
  }

  export interface IActionMessageSuccess extends IActionMessage {
  }

  // Action Message Classes (share the common data property which is either the error or a normal message towards the user)
  export class ActionMessage implements IActionMessage {
    public isError : boolean;
    public data:string;

    constructor(data:string, isError : boolean) {
      this.data = data;
      this.isError = isError;
    }
  }

  export class ActionMessageError extends ActionMessage implements IActionMessageError {
    public status:string;
    public statusText:string;

    constructor(messageObj:IActionMessageError) {
      this.status = messageObj.status;
      this.statusText = messageObj.statusText;
      super(messageObj.data, messageObj.isError);
    }
  }

  export class ActionMessageSuccess extends ActionMessage implements IActionMessageSuccess {
    constructor(messageObj:IActionMessageSuccess) {
      super(messageObj.data, messageObj.isError);
    }
  }

  export interface ILobby extends ng.IScope {
    lobby: ILobbyScope;
  }

  export interface ILobbyScope {
      gameCreation: boolean;
      gameEditing: boolean;
      currentItem: lobby.interfaces.IRoomRessource;
      displayUser: User.Services.IUser;
      actionMessage: IActionMessage;
  }

  // Websocket Message classes & interfaces

  // Receive the start signal from the server
  export interface IMessage {

    /**
     * Type of the message.
     */
      type: string;

    /**
     * Further granularity for a given "type"
     */
    id? : string;

    /**
     * The message content.
     */
    data: any;
  }

  export class ClientMessage<T> implements IMessage {

    type:string;
    id:string;
    data:T;

    constructor(type:string, data:T, id?:string) {
      this.type = type;
      this.data = data;
      this.id = id;
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
