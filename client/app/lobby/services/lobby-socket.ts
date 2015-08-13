/// <reference path='../_lobby.ts' />

module lobby.services {
  "use strict";
  export class Socket {

    private ws:any;
    private chatWindow:JQuery;
    public currentUser: string;


    public static $inject = [];

    constructor() {

      // DOM related initialisation
      this.chatWindow = $('.chat-output');

      // Websocket configuration
      this.ws = new WebSocket('ws://localhost:2999');
      var self = this;

      this.ws.onmessage = (event) => {

        var messageObj : IMessage = JSON.parse(event.data);

        switch (messageObj.header.type) {
          case "chat":
            self.chatResponseHandler(messageObj);
            break;
          case "room":
            self.roomResponseHandler(messageObj);
            break;
        }
        // check for event type => if chat => set user field for the current user
      };

      this.ws.onopen = function () {

      };

      this.ws.onerror = function (error) {
        console.log('WebSocket Error ' + error);
      };
    }

    private chatResponseHandler(chatMsgObj: IChatMessage) {
      switch (chatMsgObj.header.subType) {
        case "loadHistory":
          for (var i = 0; i < chatMsgObj.body.data.length; ++i) {
            this.chatWindow.append($('<span><strong>' +  chatMsgObj.body.data[i].body.userName + '</strong>&nbsp' +  chatMsgObj.body.data[i].body.message + '<br></span>'));
          }
          break;
        case "loadSingleMessage":
          this.chatWindow.append($('<span><strong>' + chatMsgObj.body.data.body.userName + '</strong>&nbsp' +  chatMsgObj.body.data.body.message + '<br></span>'));
          break;
        case "sendAssignedUserName":
          this.currentUser = chatMsgObj.body.userName
          break;
      }
    }

    private roomResponseHandler(chatMsgObj: IRoomMessage){
      switch (chatMsgObj.header.subType) {
        case "loadLobbyData":
          this.currentUser = chatMsgObj.body.userName
          break;
      }
    }

    public sendMessage(msgObj:IMessage) {
      if (this.ws.readyState != WebSocket.OPEN) {
        throw new Error('Not connected');
      }
      switch (msgObj.header.type) {
        case "chat":
          this.messageObjHandler(msgObj, this.chatObjHandler(msgObj, this));
          break;
        case "room":
          this.messageObjHandler(msgObj, this.roomObjHandler);
          break;
      }
    }

    private messageObjHandler(msgObj:IMessage, callback) {
      // Do some generic stuff which is the same across all the websocket messages

      // Log the object to the console
      console.log(JSON.stringify(msgObj));

      callback();
    }

    private chatObjHandler(msgObj:IChatMessage, self) {
      return function () {
        self.ws.send(JSON.stringify(msgObj));
      }
    }

    private roomObjHandler(msgObj:IRoomMessage) {

    }
  }

  export interface IRoomMessage extends IMessage {
    body : {

    }
  }

  export interface IChatMessage extends IMessage {
    body : {
      message : string;
      sendTo? : string[];
    }
  }

  export interface IMessage {
    header : {
      type : string;
      subType : string;
    }
  }

  export interface IChatHistory extends IMessage {
    body : {
      data : Array<IChatMessage>;
    }
  }
}


angular
  .module('lobby')
  .service('socketService', lobby.services.Socket);


