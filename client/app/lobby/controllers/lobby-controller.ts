/// <reference path='../_lobby.ts' />

module lobby.controllers {
  'use strict';

  interface IActionMessage {
    isError? : boolean;
    message? : string;
  }

  class ActionMessage implements IActionMessage {
    constructor(private isError: boolean, private message: string) {}
  }

  class LobbyCtrl{

    private chatWindow:JQuery;

    public lobbyData : Array<lobby.interfaces.IRoom>;
    public gameCreation : boolean = true;
    public gameEditing : boolean = true;
    public currentItem : lobby.interfaces.IRoom = {};
    public chat = {};
    public displayUser: User.Services.IUser;
    public actionMessage : IActionMessage = new ActionMessage(true, "Message 1");

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
    constructor(private $scope, private $log : ng.ILogService, private $rootScope : ng.IScope,
                private lobbyStorage, private socketService, private userService : User.Services.IUserService,
                private lobbyService) {
      this.displayUser = userService.getCurrentUser();
      this.init();
    }

    // Initializer function
    private init(){
      this.lobbyData = [];
      this.initializeLobbyData();

      // DOM related initialisation
      this.chatWindow = $('.chat-output');

      var self = this;
      this.$scope.$watch(
        function () {
          return self.socketService.chatHistory
        },
        function (newValue, oldValue) {
          if(newValue !== oldValue){
            // Delete existing records
            self.chatWindow.empty();

            for (var i = 0; i < newValue.body.data.length; ++i) {
              self.chatWindow.append($('<span><strong>' +  newValue.body.data[i].body.userName + '</strong>&nbsp' +  newValue.body.data[i].body.message + '<br></span>'));
            }
          }
        }
      );

      this.socketService.setUpWebsocketService();

    }

    public toggleNewGame() : void{
      this.gameEditing = true;
      this.gameCreation = this.gameCreation === false ? true: false;
    }
    public toggleEditingGame() : void{
      this.gameCreation = true;
      this.gameEditing = this.gameEditing === false ? true: false;
    }

    public createRoom(roomName : string) : void{
      var self = this;
      var newRoom = this.lobbyStorage.LobbyRoom();
      var jsonObj = {name : roomName};
      newRoom.save(jsonObj,
        (data) => self.lobbyService.createLobbyRoom(self.lobbyData, data),
        (err) => self.handleErr("Couldn't create a room on the server."));

      this.toggleNewGame();
    }

    public joinRoom(room : lobby.interfaces.IRoom){
      var self = this;
      var newRoom = this.lobbyStorage.LobbyRoom();
      newRoom.save({id: room.roomId, userName : this.displayUser.name},
        (data) => self.lobbyService.joinLobbyRoom(self.lobbyData, data),
        (err) => self.handleErr("Couldn't create a room on the server."));
    }

    public editRoom(room : lobby.interfaces.IRoom){
      this.currentItem.name = room.name;
      this.currentItem.roomId = room.roomId;
      this.toggleEditingGame();
    }

    public deleteRoom(room : lobby.interfaces.IRoom){
      this.lobbyService.deleteRoom(this, room.roomId);
    }

    public changeRoomName(name : string, id : string){
      this.lobbyService.updateRoomName(this, name, id);
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
