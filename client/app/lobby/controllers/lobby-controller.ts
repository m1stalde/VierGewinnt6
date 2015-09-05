/// <reference path='../_lobby.ts' />

module lobby.controllers {
  'use strict';

  class LobbyCtrl {

    private chatWindow:JQuery;

    public lobbyData:Array<lobby.interfaces.IRoom>;
    public gameCreation:boolean = true;
    public gameEditing:boolean = true;
    public currentItem:lobby.interfaces.IRoom = {};
    public chat = {};
    public displayUser:User.Services.IUser;
    public actionMessage:IActionMessage;

    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
      '$scope',
      '$log',
      '$rootScope',
      'lobbyStorage',
      'socketService',
      'UserService',
      'lobbyService'
    ];

    // dependencies are injected via AngularJS $injector
    constructor(private $scope, private $log:ng.ILogService, private $rootScope:ng.IScope,
                private lobbyStorage, private socketService, private userService:User.Services.IUserService,
                private lobbyService) {
      this.displayUser = userService.getCurrentUser();
      this.init();
    }

    // Initializer function
    private init() {
      this.lobbyData = [];
      this.getRooms();

      // DOM related initialisation
      this.chatWindow = $('.chat-output');

      var self = this;
      this.$scope.$watch(
        function () {
          return self.socketService.chatHistory
        },
        function (newValue, oldValue) {
          if (newValue !== oldValue) {
            // Delete existing records
            self.chatWindow.empty();

            for (var i = 0; i < newValue.body.data.length; ++i) {
              self.chatWindow.append($('<span><strong>' + newValue.body.data[i].body.userName + '</strong>&nbsp' + newValue.body.data[i].body.message + '<br></span>'));
            }
          }
        }
      );

      this.socketService.setUpWebsocketService();

    }

    public toggleNewGame():void {
      this.gameEditing = true;
      this.gameCreation = this.gameCreation === false ? true : false;
    }

    public toggleEditingGame():void {
      this.gameCreation = true;
      this.gameEditing = this.gameEditing === false ? true : false;
    }

    public editRoom(room:lobby.interfaces.IRoom) : void {
      this.currentItem.name = room.name;
      this.currentItem.roomId = room.roomId;
      this.toggleEditingGame();
    }

    // CRUD Operations with $resources

    // CREATE => (GET /:id + POST /:id)
    public createRoom(room:lobby.interfaces.IRoom):void {
      var self = this;
      var nextRoomId = this.getHighestValue<number>(this.lobbyData, "roomId") + 1;
      var roomRes = this.lobbyStorage.LobbyRoom();
      roomRes.get({id: nextRoomId}, function (newRoom:lobby.interfaces.IRoom) { // success callback
        newRoom.name = room.name;
        newRoom.$save(function (room) { // success callback
          self.lobbyData.push(room);
          self.actionMessage = new lobby.controllers.ActionMessageSuccess({
            data: "The room has been created!"
          })
        }, function (err) { // error callback
          self.actionMessage = new lobby.controllers.ActionMessageError({
            status: err.status,
            statusText: err.statusText,
            data: err.data
          });
        });
      });

      this.toggleNewGame();
    }

    // DELETE => (GET /:id + POST /id)
    public deleteRoom(room:lobby.interfaces.IRoom):void {
      var self = this;
      var pos = this.getPositionOfElement(self.lobbyData, "roomId", room.roomId);
      var roomRes = this.lobbyStorage.LobbyRoom();
      roomRes.get({id: room.roomId}, function (room:lobby.interfaces.IRoom) {
        room.isDelete = true;
        room.$save(function (room) { // success callback
          self.lobbyData.splice(pos, 1);
          self.actionMessage = new lobby.controllers.ActionMessageSuccess({
            data: "The room has been deleted!"
          })
        }, function (err) { // error callback
          self.actionMessage = new lobby.controllers.ActionMessageError({
            status: err.status,
            statusText: err.statusText,
            data: err.data
          });
        });
      });
    }

    // GET => GET /
    private getRooms():void {
      var self = this;
      var res = this.lobbyStorage.LobbyRoom().query(function () { // success callback
        self.lobbyData = res;
      }, function (err) { // error callback
        self.actionMessage = new lobby.controllers.ActionMessageError({
          status: err.status,
          statusText: err.statusText,
          data: err.data
        });
      });
    }

    // UPDATE => (POST /:id)
    public updateRoom(newRoom:lobby.interfaces.IRoom):void {
      var self = this;
      var pos = this.getPositionOfElement(self.lobbyData, "roomId", newRoom.roomId);
      var roomRes = this.lobbyStorage.LobbyRoom();
      roomRes.get({id: newRoom.roomId}, function (room:lobby.interfaces.IRoom) {
        room.name = newRoom.name; // Update the name of the room
        room.isJoin = room.isJoin || null;
        room.$save(function (room) { // success callback
          self.lobbyData[pos] = room;
          self.actionMessage = new lobby.controllers.ActionMessageSuccess({
            data: "Your room has been updated!"
          })
        }, function (err) { // error callback
          self.actionMessage = new lobby.controllers.ActionMessageError({
            status: err.status,
            statusText: err.statusText,
            data: err.data
          });
        });
      });
    }



    private getPositionOfElement(array:Array, element, value) {
      var pos:number = -1;
      for (var i = 0, len = array.length; i < len; i++) {
        if (array[i][element] == value) pos = i;
      }
      return pos;
    }

    private getHighestValue<T>(array:Array, element):T {
      var value:T = -1;
      for (var i = 0, len = array.length; i < len; i++) {
        if (array[i][element] > value) {
          value = array[i][element];
        }
      }
      return value;
    }

    public wsSendChatMessage(message:string, sentTo:Array<string>) {
      var chatObj:lobby.services.IChatMessage = {
        header: {
          type: "chat",
          subType: "sendMessage"
        },
        body: {
          userName: this.socketService.currentUser,
          message: message,
          sendTo: sentTo
        }
      };
      this.socketService.sendMessage(chatObj);
    }
  }

  interface callbackFn {(resOrErr:string) : void
  }

  // Action Message Interfaces
  interface IActionMessage {
    data : string
  }

  interface IActionMessageError extends IActionMessage {
    statusText? : string;
    status? : string;
  }

  interface IActionMessageSuccess extends IActionMessage {
  }

  // Action Message Classes (share the common data property which is either the error or a normal message towards the user)
  export class ActionMessage implements IActionMessage {
    public data:string;

    constructor(data:string) {
      this.data = data;
    }
  }

  export class ActionMessageError extends ActionMessage implements IActionMessageError {
    public status:string;
    public statusText:string;

    constructor(messageObj:IActionMessageError) {
      this.status = messageObj.status;
      this.statusText = messageObj.statusText;
      super(messageObj.data);
    }
  }

  export class ActionMessageSuccess extends ActionMessage implements IActionMessageSuccess {
    constructor(messageObj:IActionMessageSuccess) {
      super(messageObj.data);
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
