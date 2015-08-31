/// <reference path='../_lobby.ts' />

module lobby.services {
  "use strict";
  export class Socket {

    private ws:any;
    private chatWindow:JQuery;

    public currentUser: string; // used as display e.g chat
    public playerId : string; // used in the REST-API to avoid identity fraud and to create an easy mapper attribute between REST => Websocket
    public chatHistory: IChatHistory;
    public singleChatMessage : IChatMessage;


    public static $inject = [
      'appConfig'
    ];

    constructor(private appConfig: vierGewinnt6.IAppConfig) {
      this.chatHistory = {};
      // DOM related initialisation
      this.chatWindow = $('.chat-output');
    }

    public setUpWebsocketService(){
      // Websocket configuration
      this.ws = new WebSocket(this.appConfig.baseWsUrl);
      var self = this;

      this.ws.onmessage = (event) => {

        var messageObj : IMessage = JSON.parse(event.data);

        // TODO remove check after message cleanup
        if (messageObj.header) {
          switch (messageObj.header.type) {
            case "chat":
              self.chatResponseHandler(messageObj);
              break;
            case "room":
              self.roomResponseHandler(messageObj);
              break;
          }
        }
        // check for event type => if chat => set user field for the current user
      };

      this.ws.onopen = function () {

      };

      this.ws.onerror = function (error) {
        console.log('WebSocket Error ' + error);
      };
    }

    private chatResponseHandler(chatMsgObj: IMessage) {
      switch (chatMsgObj.header.subType) {
        case "loadHistory":
          this.chatHistory = chatMsgObj;
          break;
        case "loadSingleMessage":
          this.singleChatMessage = chatMsgObj;
          this.chatWindow.append($('<span><strong>' + chatMsgObj.body.data.body.userName + '</strong>&nbsp' +  chatMsgObj.body.data.body.message + '<br></span>'));
          break;
        case "sendMetaDataToUser":
          this.currentUser = chatMsgObj.body.userName;
          this.playerId = chatMsgObj.body.playerId;
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


